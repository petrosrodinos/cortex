import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import type { RedisOptions } from 'ioredis';
import { REDIS_OPTIONS } from '../databases/redis/redis.constants';
import { AGENT_RUN_QUEUE } from './queues.constants';

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [REDIS_OPTIONS],
            useFactory: (redisOptions: RedisOptions | null) => {
                if (!redisOptions) {
                    throw new Error('BULLMQ not initialized');
                }

                return {
                    connection: redisOptions,
                };
            },
        }),
        BullModule.registerQueue({ name: AGENT_RUN_QUEUE }),
    ],
    exports: [BullModule],
})
export class QueuesModule { }
