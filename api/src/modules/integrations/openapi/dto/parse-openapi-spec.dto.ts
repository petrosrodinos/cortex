import { IsString, ValidateIf } from 'class-validator';

export class ParseOpenApiSpecDto {
  @ValidateIf((dto) => !dto.rawJson)
  @IsString()
  specUrl?: string;

  @ValidateIf((dto) => !dto.specUrl)
  rawJson?: Record<string, any> | string;
}
