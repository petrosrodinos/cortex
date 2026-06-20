import { IsOptional, IsString } from 'class-validator';

export class ListOrgToolkitsDto {
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

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
