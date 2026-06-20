import { IsOptional, IsString } from 'class-validator';

export class ComposioCallbackDto {
  @IsString()
  toolkit_slug: string;

  @IsOptional()
  @IsString()
  connection_request_id?: string;
}
