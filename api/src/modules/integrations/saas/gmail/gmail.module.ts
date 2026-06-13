import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { GmailIntegration } from './gmail.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(GmailIntegration)] })
export class GmailIntegrationModule {}
