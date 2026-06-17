import { ForbiddenException } from '@nestjs/common';
import { BaseIntegration } from './base-integration';
import { IntegrationProvider } from 'generated/prisma';

class TestIntegration extends BaseIntegration {
  provider = IntegrationProvider.OPENAPI;

  constructor(prisma: any, encryption: any) {
    super(prisma, encryption);
  }

  buildToolDefinitions() {
    return [];
  }

  getTools() {
    return [];
  }

  async testConnection() {
    return true;
  }

  async executeTool() {
    return true;
  }
}

describe('BaseIntegration', () => {
  const prisma: any = {
    integrationAction: {
      findFirst: jest.fn(),
    },
  };
  const encryption: any = {
    decrypt: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('decrypts encrypted integration config JSON', () => {
    encryption.decrypt.mockReturnValue('{"apiKey":"secret"}');
    const integration = new TestIntegration(prisma, encryption);

    expect(integration.decryptConfig({ config: 'ciphertext' } as any)).toEqual({ apiKey: 'secret' });
    expect(encryption.decrypt).toHaveBeenCalledWith('ciphertext');
  });

  it('rejects disabled actions before execution', async () => {
    prisma.integrationAction.findFirst.mockResolvedValue(null);
    const integration = new TestIntegration(prisma, encryption);

    await expect(integration.validateAction({ uuid: 'integration-uuid' } as any, 'openapi__call')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
