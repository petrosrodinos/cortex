import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateOrgToolPermissionDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  requires_approval?: boolean;

  @IsOptional()
  @IsString()
  required_permission_key?: string;
}
