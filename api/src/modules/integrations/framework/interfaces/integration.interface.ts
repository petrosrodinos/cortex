import { Integration, IntegrationProvider } from 'generated/prisma';
import { AiTool, IntegrationActionSeed } from './ai-tool.interface';

export interface IIntegration {
  provider: IntegrationProvider;
  getTools(integration: Integration): AiTool[];
  testConnection(config: Record<string, any>): Promise<boolean>;
  executeTool(toolName: string, input: Record<string, any>, integration: Integration): Promise<any>;
  defaultActions?(): IntegrationActionSeed[];
}
