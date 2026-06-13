import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { SmtpIntegration } from './smtp.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(SmtpIntegration)] })
export class SmtpIntegrationModule {}
