import { DynamicModule, Inject, Injectable, Module, OnModuleInit, Type } from '@nestjs/common';
import { IntegrationRegistry } from '../framework/integration-registry.service';
import { IntegrationFrameworkModule } from '../framework/integration-framework.module';
import { SaasIntegration } from './saas-integration.base';

@Module({})
export class RegisterSaasProviderModule {
  static forProvider<T extends SaasIntegration>(integrationClass: Type<T>): DynamicModule {
    @Injectable()
    class ProviderRegistration implements OnModuleInit {
      constructor(
        private readonly registry: IntegrationRegistry,
        @Inject(integrationClass)
        private readonly integration: T,
      ) {}

      onModuleInit() {
        this.registry.register(this.integration);
      }
    }

    return {
      module: RegisterSaasProviderModule,
      imports: [IntegrationFrameworkModule],
      providers: [integrationClass, ProviderRegistration],
      exports: [integrationClass],
    };
  }
}
