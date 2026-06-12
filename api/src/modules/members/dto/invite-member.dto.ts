import { IsEmail, IsString } from 'class-validator';

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsString()
  organization_role_uuid: string;
}
