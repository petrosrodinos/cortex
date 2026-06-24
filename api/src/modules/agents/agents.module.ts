import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { ConversationsModule } from '@/modules/conversations/conversations.module';
import { AiModule } from '@/shared/services/ai/ai.module';
import {
  AGENT_CRON_QUEUE,
  AGENT_RUN_QUEUE,
} from '@/core/queues/queues.constants';
import { AgentsCronProcessor } from '@/core/queues/processors/agents-cron.processor';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AgentsSchedulerService } from './agents-scheduler.service';

@Module({
  imports: [
    PrismaModule,
    OrganizationsModule,
    ConversationsModule,
    AiModule,
    BullModule.registerQueue(
      { name: AGENT_RUN_QUEUE },
      { name: AGENT_CRON_QUEUE },
    ),
  ],
  controllers: [AgentsController],
  providers: [
    AgentsService,
    AgentsSchedulerService,
    AgentsCronProcessor,
  ],
  exports: [AgentsService],
})
export class AgentsModule {}
