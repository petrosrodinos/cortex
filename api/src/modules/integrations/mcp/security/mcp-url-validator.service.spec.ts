import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { McpUrlValidatorService } from './mcp-url-validator.service';

describe('McpUrlValidatorService', () => {
  function createValidator(nodeEnv: string) {
    const configService = {
      get: jest.fn().mockReturnValue(nodeEnv),
    } as unknown as ConfigService;

    return new McpUrlValidatorService(configService);
  }

  it('accepts https URLs in production', () => {
    const validator = createValidator('production');

    expect(validator.validate('https://mcp.example.com/mcp')).toBe('https://mcp.example.com/mcp');
  });

  it('rejects private IP addresses in production', () => {
    const validator = createValidator('production');

    expect(() => validator.validate('https://127.0.0.1/mcp')).toThrow(BadRequestException);
    expect(() => validator.validate('https://192.168.1.10/mcp')).toThrow(BadRequestException);
    expect(() => validator.validate('https://10.0.0.5/mcp')).toThrow(BadRequestException);
  });

  it('allows localhost in development', () => {
    const validator = createValidator('development');

    expect(validator.validate('http://127.0.0.1:3001/mcp')).toBe('http://127.0.0.1:3001/mcp');
  });
});
