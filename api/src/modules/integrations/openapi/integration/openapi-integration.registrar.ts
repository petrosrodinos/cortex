import { Injectable, OnModuleInit } from '@nestjs/common';
import { IntegrationRegistry } from '../../framework/registry/integration-registry.service';
import { OpenApiIntegration } from './openapi.integration';

@Injectable()
export class OpenApiIntegrationRegistrar implements OnModuleInit {
  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly openApiIntegration: OpenApiIntegration,
  ) {}

  onModuleInit() {
    this.registry.register(this.openApiIntegration);
  }
}
