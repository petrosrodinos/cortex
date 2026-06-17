import { Module } from '@nestjs/common';
import { IntegrationFrameworkModule } from '../framework/integration-framework.module';
import { McpAuthService } from './auth/mcp-auth.service';
import { McpClientFactory } from './client/mcp-client.factory';
import { McpConnectionManagerService } from './client/mcp-connection-manager.service';
import { McpIntegrationsController } from './controllers/mcp-integrations.controller';
import { McpToolDiscoveryService } from './discovery/mcp-tool-discovery.service';
import { McpIntegrationRegistrar } from './integration/mcp-integration.registrar';
import { McpIntegration } from './integration/mcp.integration';
import { McpIntegrationsService } from './services/mcp-integrations.service';
import { McpUrlValidatorService } from './security/mcp-url-validator.service';

@Module({
  imports: [IntegrationFrameworkModule],
  controllers: [McpIntegrationsController],
  providers: [
    McpUrlValidatorService,
    McpAuthService,
    McpClientFactory,
    McpToolDiscoveryService,
    McpConnectionManagerService,
    McpIntegration,
    McpIntegrationsService,
    McpIntegrationRegistrar,
  ],
  exports: [McpIntegrationsService, McpIntegration],
})
export class McpIntegrationsModule {}
