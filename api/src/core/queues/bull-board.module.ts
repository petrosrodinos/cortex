import { Module, Global } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { BullModule } from '@nestjs/bullmq';
import { BULL_BOARD_ADAPTER, AGENT_RUN_QUEUE } from './queues.constants';

@Global()
@Module({
    imports: [
        BullModule.registerQueue({ name: AGENT_RUN_QUEUE }),
    ],
    providers: [
        {
            provide: BULL_BOARD_ADAPTER,
            inject: [getQueueToken(AGENT_RUN_QUEUE)],
            useFactory: (agentQueue: Queue) => {
                const serverAdapter = new ExpressAdapter();
                serverAdapter.setBasePath('/admin/queues');

                createBullBoard({
                    queues: [new BullMQAdapter(agentQueue)],
                    serverAdapter,
                });

                return serverAdapter;
            },
        },
    ],
    exports: [BULL_BOARD_ADAPTER, BullModule],
})
export class BullBoardModule { }
