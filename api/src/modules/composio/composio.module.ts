import { Module } from '@nestjs/common';
import { ComposioIntegrationModule } from '@/integrations/composio/composio-integration.module';
import { PrismaModule } from '../../core/databases/prisma/prisma.module';
import { ComposioConnectionsController } from './connections/composio-connections.controller';
import { ComposioConnectionsService } from './connections/composio-connections.service';
import { OrgToolkitsController } from './org-toolkits/org-toolkits.controller';
import { OrgToolkitsService } from './org-toolkits/org-toolkits.service';
import { ComposioSessionService } from './sessions/composio-session.service';
import { ComposioSyncService } from './sync/composio-sync.service';
import { ComposioToolkitsController } from './toolkits/composio-toolkits.controller';
import { ComposioToolkitsService } from './toolkits/composio-toolkits.service';
import { ComposioTriggersController } from './triggers/composio-triggers.controller';
import { ComposioTriggersService } from './triggers/composio-triggers.service';
import { ComposioWebhookController } from './triggers/composio-webhook.controller';

@Module({
  imports: [PrismaModule, ComposioIntegrationModule],
  controllers: [
    ComposioToolkitsController,
    ComposioConnectionsController,
    OrgToolkitsController,
    ComposioTriggersController,
    ComposioWebhookController,
  ],
  providers: [
    ComposioSyncService,
    ComposioToolkitsService,
    ComposioConnectionsService,
    OrgToolkitsService,
    ComposioTriggersService,
    ComposioSessionService,
  ],
  exports: [
    ComposioSyncService,
    ComposioToolkitsService,
    ComposioConnectionsService,
    OrgToolkitsService,
    ComposioTriggersService,
    ComposioSessionService,
  ],
})
export class ComposioModule {}
