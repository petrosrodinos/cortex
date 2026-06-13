import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { SlackIntegration } from './slack.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(SlackIntegration)] })
export class SlackIntegrationModule {}
