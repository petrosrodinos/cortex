import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider, IntegrationStatus, Prisma } from 'generated/prisma';
import { CreateMcpIntegrationDto, TestMcpConnectionDto } from '../dto/create-mcp-integration.dto';
import { McpToolDiscoveryService } from '../discovery/mcp-tool-discovery.service';
import { McpIntegration } from '../integration/mcp.integration';
import { McpUrlValidatorService } from '../security/mcp-url-validator.service';
import { buildMcpToolName, McpAuthConfig, McpCredentials } from '../types/mcp.types';

@Injectable()
export class McpIntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly urlValidator: McpUrlValidatorService,
    private readonly discoveryService: McpToolDiscoveryService,
    private readonly mcpIntegration: McpIntegration,
  ) {}

  async create(organizationUuid: string, dto: CreateMcpIntegrationDto) {
    try {
      const serverUrl = this.urlValidator.validate(dto.serverUrl);
      const connectionConfig = this.buildConnectionConfig(dto, serverUrl);
      const discovery = await this.discoveryService.discoverTools(connectionConfig);

      const integration = await this.prisma.$transaction(async (tx) => {
        const created = await tx.integration.create({
          data: {
            org_uuid: organizationUuid,
            name: dto.name,
            description: dto.description,
            provider: IntegrationProvider.MCP,
            status: IntegrationStatus.ACTIVE,
            config: this.encryptionService.encrypt(JSON.stringify(dto.credentials ?? {})),
          },
        });

        const tools = discovery.tools.map((tool) => ({
          ...tool,
          name: buildMcpToolName(created.uuid, tool.serverToolName),
        }));

        await tx.mcpIntegration.create({
          data: {
            integration_uuid: created.uuid,
            server_url: serverUrl,
            transport_type: connectionConfig.transportType,
            auth_type: connectionConfig.authType,
            auth_config: this.encryptionService.encrypt(JSON.stringify(connectionConfig.authConfig)),
            server_name: discovery.serverName,
            discovered_tools: tools as unknown as Prisma.InputJsonValue,
            last_tool_sync: new Date(),
          },
        });

        await tx.integrationAction.createMany({
          data: tools.map((tool) => ({
            integration_uuid: created.uuid,
            key: tool.serverToolName,
            label: tool.serverToolName,
            description: tool.description,
            enabled: true,
          })),
          skipDuplicates: true,
        });

        return await tx.integration.findUniqueOrThrow({
          where: { uuid: created.uuid },
          include: { actions: true, mcp: true },
        });
      });

      return this.sanitize(integration);
    } catch (error) {
      this.handleError(error);
    }
  }

  async testConnectionDraft(dto: TestMcpConnectionDto) {
    try {
      const serverUrl = this.urlValidator.validate(dto.serverUrl);
      const connectionConfig = this.buildConnectionConfig(dto, serverUrl);
      const discovery = await this.discoveryService.discoverTools(connectionConfig);

      return {
        success: true,
        serverName: discovery.serverName,
        toolCount: discovery.tools.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'MCP connection test failed';
      return { success: false, error: message };
    }
  }

  async syncTools(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireMcpIntegration(organizationUuid, integrationUuid);
      const mcp = integration.mcp;

      if (!mcp) {
        throw new NotFoundException('MCP integration not found');
      }

      const connectionConfig = this.mcpIntegration.toConnectionConfig({
        serverUrl: mcp.server_url,
        transportType: mcp.transport_type,
        authType: mcp.auth_type,
        authConfig: JSON.parse(this.encryptionService.decrypt(mcp.auth_config)),
        credentials: JSON.parse(this.encryptionService.decrypt(integration.config)),
        integrationUuid: integration.uuid,
      });

      const discovery = await this.discoveryService.discoverTools(connectionConfig, integration.uuid);
      const tools = discovery.tools;
      const existingByKey = new Map(integration.actions.map((action) => [action.key, action]));
      const discoveredKeys = new Set(tools.map((tool) => tool.serverToolName));

      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.mcpIntegration.update({
          where: { integration_uuid: integrationUuid },
          data: {
            server_name: discovery.serverName ?? mcp.server_name,
            discovered_tools: tools as unknown as Prisma.InputJsonValue,
            last_tool_sync: new Date(),
          },
        });

        await tx.integration.update({
          where: { uuid: integrationUuid },
          data: {
            status: IntegrationStatus.ACTIVE,
            metadata: {
              ...(typeof integration.metadata === 'object' && integration.metadata ? integration.metadata : {}),
              lastError: null,
            },
          },
        });

        for (const tool of tools) {
          const existing = existingByKey.get(tool.serverToolName);

          await tx.integrationAction.upsert({
            where: {
              integration_uuid_key: {
                integration_uuid: integrationUuid,
                key: tool.serverToolName,
              },
            },
            update: {
              label: tool.serverToolName,
              description: tool.description,
              enabled: existing?.enabled ?? true,
            },
            create: {
              integration_uuid: integrationUuid,
              key: tool.serverToolName,
              label: tool.serverToolName,
              description: tool.description,
              enabled: true,
            },
          });
        }

        await tx.integrationAction.updateMany({
          where: {
            integration_uuid: integrationUuid,
            key: { notIn: Array.from(discoveredKeys) },
          },
          data: { enabled: false },
        });

        return await tx.integration.findUniqueOrThrow({
          where: { uuid: integrationUuid },
          include: { actions: true, mcp: true },
        });
      });

      return this.sanitize(updated);
    } catch (error) {
      this.handleError(error);
    }
  }

  async testConnection(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireMcpIntegration(organizationUuid, integrationUuid);
      const mcp = integration.mcp;

      if (!mcp) {
        throw new NotFoundException('MCP integration not found');
      }

      const connectionConfig = this.mcpIntegration.toConnectionConfig({
        serverUrl: mcp.server_url,
        transportType: mcp.transport_type,
        authType: mcp.auth_type,
        authConfig: JSON.parse(this.encryptionService.decrypt(mcp.auth_config)),
        credentials: JSON.parse(this.encryptionService.decrypt(integration.config)),
        integrationUuid: integration.uuid,
      });

      await this.mcpIntegration.testConnection(connectionConfig as unknown as Record<string, any>);

      await this.prisma.integration.update({
        where: { uuid: integrationUuid },
        data: {
          status: IntegrationStatus.ACTIVE,
          metadata: {
            ...(typeof integration.metadata === 'object' && integration.metadata ? integration.metadata : {}),
            lastError: null,
          },
        },
      });

      return {
        success: true,
        serverName: mcp.server_name,
        toolCount: Array.isArray(mcp.discovered_tools) ? mcp.discovered_tools.length : 0,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'MCP connection test failed';

      await this.prisma.integration.updateMany({
        where: { uuid: integrationUuid, org_uuid: organizationUuid },
        data: {
          status: IntegrationStatus.ERROR,
          metadata: { lastError: message },
        },
      });

      return { success: false, error: message };
    }
  }

  async getDetails(organizationUuid: string, integrationUuid: string) {
    try {
      return this.sanitize(await this.requireMcpIntegration(organizationUuid, integrationUuid));
    } catch (error) {
      this.handleError(error);
    }
  }

  private buildConnectionConfig(
    dto: CreateMcpIntegrationDto | TestMcpConnectionDto,
    serverUrl: string,
  ) {
    return {
      serverUrl,
      transportType: dto.transportType ?? 'HTTP',
      authType: dto.authType ?? 'NONE',
      authConfig: (dto.authConfig ?? {}) as McpAuthConfig,
      credentials: (dto.credentials ?? {}) as McpCredentials,
    };
  }

  private async requireMcpIntegration(organizationUuid: string, integrationUuid: string) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        uuid: integrationUuid,
        org_uuid: organizationUuid,
        provider: IntegrationProvider.MCP,
      },
      include: { actions: true, mcp: true },
    });

    if (!integration) {
      throw new NotFoundException('MCP integration not found');
    }

    return integration;
  }

  private sanitize(integration: any) {
    const { config: _config, mcp, ...safeIntegration } = integration;

    return {
      ...safeIntegration,
      mcp: mcp
        ? {
            uuid: mcp.uuid,
            integration_uuid: mcp.integration_uuid,
            server_url: mcp.server_url,
            transport_type: mcp.transport_type,
            auth_type: mcp.auth_type,
            server_name: mcp.server_name,
            discovered_tools: mcp.discovered_tools,
            last_tool_sync: mcp.last_tool_sync,
            created_at: mcp.created_at,
            updated_at: mcp.updated_at,
          }
        : null,
    };
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unexpected MCP integration error';
    throw new BadRequestException(message);
  }
}
