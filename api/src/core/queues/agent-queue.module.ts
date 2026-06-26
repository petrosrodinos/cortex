import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AGENT_RUN_QUEUE } from './queues.constants';
import { AgentProcessor } from './processors/agent.processor';
import { AiModule } from '@/shared/services/ai/ai.module';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: AGENT_RUN_QUEUE }),
    AiModule,
    PrismaModule,
  ],
  providers: [AgentProcessor],
  exports: [BullModule],
})
export class AgentQueueModule {}
