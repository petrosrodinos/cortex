import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { HubSpotIntegration } from './hubspot.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(HubSpotIntegration)] })
export class HubSpotIntegrationModule {}
