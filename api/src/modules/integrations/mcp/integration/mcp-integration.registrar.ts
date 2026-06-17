import { Injectable, OnModuleInit } from '@nestjs/common';
import { IntegrationRegistry } from '../../framework/registry/integration-registry.service';
import { McpIntegration } from './mcp.integration';

@Injectable()
export class McpIntegrationRegistrar implements OnModuleInit {
  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly mcpIntegration: McpIntegration,
  ) {}

  onModuleInit() {
    this.registry.register(this.mcpIntegration);
  }
}
