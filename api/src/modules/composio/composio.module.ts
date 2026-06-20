import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  AGENT_RUN_QUEUE,
  COMPOSIO_TRIGGER_QUEUE,
} from '@/core/queues/queues.constants';
import { ComposioTriggerProcessor } from '@/core/queues/processors/composio-trigger.processor';
import { ComposioIntegrationModule } from '@/integrations/composio/composio-integration.module';
import { PrismaModule } from '../../core/databases/prisma/prisma.module';
import { ComposioConnectionsController } from './connections/composio-connections.controller';
import { ComposioConnectionsService } from './connections/composio-connections.service';
import { ComposioConnectRateLimitGuard } from './connections/composio-connect-rate-limit.guard';
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
  imports: [
    PrismaModule,
    ComposioIntegrationModule,
    BullModule.registerQueue(
      { name: AGENT_RUN_QUEUE },
      { name: COMPOSIO_TRIGGER_QUEUE },
    ),
  ],
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
    ComposioConnectRateLimitGuard,
    OrgToolkitsService,
    ComposioTriggersService,
    ComposioSessionService,
    ComposioTriggerProcessor,
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
