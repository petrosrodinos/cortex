import { Module } from '@nestjs/common';
import { RegisterSaasProviderModule } from '../register-saas-provider.module';
import { GoogleDriveIntegration } from './google-drive.integration';

@Module({ imports: [RegisterSaasProviderModule.forProvider(GoogleDriveIntegration)] })
export class GoogleDriveIntegrationModule {}
