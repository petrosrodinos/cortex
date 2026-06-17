import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { AiModule } from '@/shared/services/ai/ai.module';
import { AGENT_RUN_QUEUE } from '@/core/queues/queues.constants';
import { ConversationsController, ExecutionsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
import { ExecutionsService } from './executions.service';

@Module({
  imports: [
    PrismaModule,
    OrganizationsModule,
    AiModule,
    BullModule.registerQueue({ name: AGENT_RUN_QUEUE }),
  ],
  controllers: [ConversationsController, ExecutionsController],
  providers: [ConversationsService, MessagesService, ExecutionsService],
  exports: [ConversationsService, MessagesService, ExecutionsService],
})
export class ConversationsModule {}
