import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import * as memoryStore from 'cache-manager-memory-store';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const ttlSeconds = configService.get<number>('CACHE_TTL_SECONDS') ?? 86400;

        if (redisUrl) {
          const url = new URL(redisUrl);
          return {
            store: await redisStore({
              socket: {
                host: url.hostname,
                port: parseInt(url.port, 10) || 6379,
              },
              password: url.password || undefined,
              username: url.username || undefined,
            }),
            ttl: ttlSeconds * 1000,
          };
        }

        return {
          store: memoryStore,
          max: 500,
          ttl: ttlSeconds * 1000,
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, CacheModule],
})
export class AppCacheModule {}
