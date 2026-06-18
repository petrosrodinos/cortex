import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TestSmtpConnectionDto {
  @IsString()
  host: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  port: number;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  from: string;
}
