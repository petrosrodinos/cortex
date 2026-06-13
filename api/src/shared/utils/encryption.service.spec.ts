import { BadRequestException } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  const valid_key = 'a'.repeat(64);

  it('encrypts plaintext into a non-plaintext payload and decrypts it', () => {
    const config: any = { get: jest.fn().mockReturnValue(valid_key) };
    const service = new EncryptionService(config);

    const ciphertext = service.encrypt('{"token":"secret"}');

    expect(ciphertext).not.toContain('secret');
    expect(service.decrypt(ciphertext)).toBe('{"token":"secret"}');
  });

  it('requires a 32-byte hex encryption key', () => {
    const config: any = { get: jest.fn().mockReturnValue('short-key') };

    expect(() => new EncryptionService(config)).toThrow(BadRequestException);
  });
});
