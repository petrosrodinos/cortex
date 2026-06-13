import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { StripeIntegration } from './stripe.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(StripeIntegration)] })
export class StripeIntegrationModule {}
