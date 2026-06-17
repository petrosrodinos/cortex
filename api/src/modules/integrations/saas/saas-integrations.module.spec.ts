import { Test } from '@nestjs/testing';
import { IntegrationProvider } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationRegistry } from '../framework/registry/integration-registry.service';
import { SaasIntegrationsModule } from './saas-integrations.module';

describe('SaasIntegrationsModule', () => {
  it('registers all SaaS providers on module init', async () => {
    const registry: any = { register: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      imports: [SaasIntegrationsModule],
    })
      .overrideProvider(IntegrationRegistry)
      .useValue(registry)
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(EncryptionService)
      .useValue({ decrypt: jest.fn(), encrypt: jest.fn() })
      .compile();

    await moduleRef.init();

    expect(registry.register).toHaveBeenCalledTimes(11);
    expect(registry.register.mock.calls.map(([integration]) => integration.provider)).toEqual(
      expect.arrayContaining([
        IntegrationProvider.GITHUB,
        IntegrationProvider.SLACK,
        IntegrationProvider.STRIPE,
        IntegrationProvider.HUBSPOT,
        IntegrationProvider.LINEAR,
        IntegrationProvider.NOTION,
        IntegrationProvider.GOOGLE_DRIVE,
        IntegrationProvider.SMTP,
        IntegrationProvider.GMAIL,
        IntegrationProvider.POSTHOG,
        IntegrationProvider.INTERCOM,
      ]),
    );
    await moduleRef.close();
  });
});
