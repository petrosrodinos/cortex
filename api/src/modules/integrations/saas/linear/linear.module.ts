import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { LinearIntegration } from './linear.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(LinearIntegration)] })
export class LinearIntegrationModule {}
