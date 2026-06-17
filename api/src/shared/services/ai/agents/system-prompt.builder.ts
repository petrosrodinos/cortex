import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationStatus } from 'generated/prisma';

@Injectable()
export class SystemPromptBuilder {
  constructor(private readonly prisma: PrismaService) {}

  async build(organizationUuid: string): Promise<string> {
    const organization = await this.prisma.organization.findUnique({
      where: { uuid: organizationUuid },
    });

    const integrations = await this.prisma.integration.findMany({
      where: { org_uuid: organizationUuid, status: IntegrationStatus.ACTIVE },
      include: { database: true, actions: { where: { enabled: true } } },
    });

    const integrationLines = integrations.map((integration) => {
      const actions = integration.actions.map((action) => action.key).join(', ');
      return `- ${integration.name} (${integration.provider}): ${actions || 'no enabled actions'}`;
    });

    const schemaBlocks = integrations
      .filter((integration) => integration.database?.schema_cache)
      .map((integration) => {
        return `### ${integration.name}\n${JSON.stringify(integration.database?.schema_cache, null, 2)}`;
      });

    const today = new Date().toISOString().split('T')[0];

    return [
      `You are Cortex, an AI business operations copilot for ${organization?.name ?? 'the organization'}.`,
      `Today's date: ${today}.`,
      'Use available tools to retrieve data and take actions. Never invent credentials or integration secrets.',
      'When destructive actions require approval, wait for explicit user approval before proceeding.',
      '',
      'Connected integrations:',
      integrationLines.length > 0 ? integrationLines.join('\n') : '- None',
      '',
      schemaBlocks.length > 0 ? 'Database schemas:\n' + schemaBlocks.join('\n\n') : '',
    ]
      .filter(Boolean)
      .join('\n');
  }
}
