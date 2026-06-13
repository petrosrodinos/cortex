import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { IntercomIntegration } from './intercom.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(IntercomIntegration)] })
export class IntercomIntegrationModule {}
