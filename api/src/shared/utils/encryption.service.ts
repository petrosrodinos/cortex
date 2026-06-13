import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly key: Buffer;

  constructor(private readonly config_service: ConfigService) {
    const encryption_key = this.config_service.get<string>('ENCRYPTION_KEY');

    if (!encryption_key || !/^[a-fA-F0-9]{64}$/.test(encryption_key)) {
      throw new BadRequestException('ENCRYPTION_KEY must be a 32-byte hex string');
    }

    this.key = Buffer.from(encryption_key, 'hex');
  }

  encrypt(plaintext: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return [iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join('.');
  }

  decrypt(ciphertext: string): string {
    const [iv_base64, tag_base64, encrypted_base64] = ciphertext.split('.');

    if (!iv_base64 || !tag_base64 || !encrypted_base64) {
      throw new BadRequestException('Invalid encrypted payload');
    }

    const decipher = createDecipheriv('aes-256-gcm', this.key, Buffer.from(iv_base64, 'base64'));
    decipher.setAuthTag(Buffer.from(tag_base64, 'base64'));

    return Buffer.concat([decipher.update(Buffer.from(encrypted_base64, 'base64')), decipher.final()]).toString('utf8');
  }
}
