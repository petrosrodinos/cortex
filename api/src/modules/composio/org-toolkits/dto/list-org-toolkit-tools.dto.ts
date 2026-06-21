import { IsOptional, IsString } from 'class-validator';

export class ListOrgToolkitToolsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
