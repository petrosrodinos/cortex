import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { GitHubIntegration } from './github.integration';

@Module({
  imports: [RegisterSaasProviderModule.forProvider(GitHubIntegration)],
})
export class GitHubIntegrationModule {}
