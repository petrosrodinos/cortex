import { IsEnum, IsObject, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { McpAuthType, McpTransportType } from 'generated/prisma';

export class CreateMcpIntegrationDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl({ require_tld: false })
  serverUrl: string;

  @IsOptional()
  @IsEnum(McpTransportType)
  transportType?: McpTransportType;

  @IsOptional()
  @IsEnum(McpAuthType)
  authType?: McpAuthType;

  @IsOptional()
  @IsObject()
  authConfig?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, unknown>;
}

export class TestMcpConnectionDto {
  @IsUrl({ require_tld: false })
  serverUrl: string;

  @IsOptional()
  @IsEnum(McpTransportType)
  transportType?: McpTransportType;

  @IsOptional()
  @IsEnum(McpAuthType)
  authType?: McpAuthType;

  @IsOptional()
  @IsObject()
  authConfig?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, unknown>;
}
