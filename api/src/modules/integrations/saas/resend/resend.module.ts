import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { ResendIntegration } from './resend.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(ResendIntegration)] })
export class ResendIntegrationModule {}
