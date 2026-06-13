import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { PostHogIntegration } from './posthog.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(PostHogIntegration)] })
export class PostHogIntegrationModule {}
