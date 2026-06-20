import { IsOptional, IsString } from 'class-validator';

export class ConnectComposioDto {
  @IsString()
  toolkit_slug: string;

  @IsOptional()
  @IsString()
  connected_account_id?: string;
}
