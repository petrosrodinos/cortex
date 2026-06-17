import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AGENT_RUN_QUEUE } from './queues.constants';
import { AgentProcessor } from './processors/agent.processor';
import { AiModule } from '@/shared/services/ai/ai.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: AGENT_RUN_QUEUE }),
    AiModule,
  ],
  providers: [AgentProcessor],
  exports: [BullModule],
})
export class AgentQueueModule {}
