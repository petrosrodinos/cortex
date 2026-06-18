import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { SendGridIntegration } from './sendgrid.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(SendGridIntegration)] })
export class SendGridIntegrationModule {}
