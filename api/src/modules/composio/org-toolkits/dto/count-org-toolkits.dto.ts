import { IsOptional, IsString } from 'class-validator';

export class CountOrgToolkitsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  connected?: string;

  @IsOptional()
  @IsString()
  tier?: string;
}
