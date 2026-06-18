import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import type { RedisOptions } from 'ioredis';
import { REDIS_OPTIONS } from './redis.constants';

@Injectable()
export class RedisConnectionService implements OnModuleInit {
    private readonly logger = new Logger(RedisConnectionService.name);

    constructor(@Inject(REDIS_OPTIONS) private readonly options: RedisOptions | null) {}

    async onModuleInit() {
        if (!this.options) {
            return;
        }

        const client = new Redis({ ...this.options, lazyConnect: true });

        try {
            await client.connect();
            const pong = await client.ping();
            this.logger.debug(
                `Redis connected at ${this.options.host}:${this.options.port} (PING → ${pong})`,
            );
        } finally {
            client.disconnect();
        }
    }
}
