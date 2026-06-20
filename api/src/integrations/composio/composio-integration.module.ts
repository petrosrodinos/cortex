import { Global, Module } from '@nestjs/common';
import { ComposioClientService } from './composio-client.service';

@Global()
@Module({
  providers: [ComposioClientService],
  exports: [ComposioClientService],
})
export class ComposioIntegrationModule {}
