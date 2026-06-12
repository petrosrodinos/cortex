import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrganizationMemberStatus } from 'generated/prisma';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  organization_role_uuid?: string;

  @IsOptional()
  @IsEnum(OrganizationMemberStatus)
  status?: OrganizationMemberStatus;
}
