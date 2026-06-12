import { IsString } from 'class-validator';

export class SwitchOrganizationDto {
  @IsString()
  organization_uuid: string;
}
