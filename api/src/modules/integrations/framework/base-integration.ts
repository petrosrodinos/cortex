import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { Integration, IntegrationProvider } from 'generated/prisma';
import { AiTool } from './ai-tool.interface';
import { IIntegration } from './integration.interface';

export abstract class BaseIntegration implements IIntegration {
  abstract provider: IntegrationProvider;

  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly encryption_service: EncryptionService,
  ) {}

  decryptConfig(integration: Pick<Integration, 'config'>): Record<string, any> {
    const decrypted = this.encryption_service.decrypt(integration.config);

    try {
      return JSON.parse(decrypted);
    } catch {
      throw new BadRequestException('Integration config is not valid JSON');
    }
  }

  async validateAction(integration: Pick<Integration, 'uuid'>, toolName: string) {
    const key = this.resolveActionKey(toolName);
    const action = await this.prisma.integrationAction.findFirst({
      where: {
        integration_uuid: integration.uuid,
        key,
        enabled: true,
      },
    });

    if (!action) {
      throw new ForbiddenException('Integration action is disabled or unavailable');
    }

    return action;
  }

  private resolveActionKey(toolName: string) {
    const prefix = `${this.provider.toLowerCase()}__`;
    return toolName.startsWith(prefix) ? toolName.slice(prefix.length) : toolName;
  }

  abstract buildToolDefinitions(integration: Integration): AiTool[];
  abstract getTools(integration: Integration): AiTool[];
  abstract testConnection(config: Record<string, any>): Promise<boolean>;
  abstract executeTool(toolName: string, input: Record<string, any>, integration: Integration): Promise<any>;
}
