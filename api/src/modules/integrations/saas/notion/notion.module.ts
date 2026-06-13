import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { NotionIntegration } from './notion.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(NotionIntegration)] })
export class NotionIntegrationModule {}
