import { Module } from '@nestjs/common';
import { ComposioIntegrationModule } from '@/integrations/composio/composio-integration.module';
import { PrismaModule } from '../../core/databases/prisma/prisma.module';
import { ComposioConnectionsController } from './connections/composio-connections.controller';
import { ComposioConnectionsService } from './connections/composio-connections.service';
import { ComposioSessionService } from './sessions/composio-session.service';
import { ComposioSyncService } from './sync/composio-sync.service';
import { ComposioToolkitsController } from './toolkits/composio-toolkits.controller';
import { ComposioToolkitsService } from './toolkits/composio-toolkits.service';

@Module({
  imports: [PrismaModule, ComposioIntegrationModule],
  controllers: [ComposioToolkitsController, ComposioConnectionsController],
  providers: [
    ComposioSyncService,
    ComposioToolkitsService,
    ComposioConnectionsService,
    ComposioSessionService,
  ],
  exports: [
    ComposioSyncService,
    ComposioToolkitsService,
    ComposioConnectionsService,
    ComposioSessionService,
  ],
})
export class ComposioModule {}
