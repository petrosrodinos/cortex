import { IsString } from 'class-validator';

export class TestResendConnectionDto {
  @IsString()
  apiKey: string;

  @IsString()
  from: string;
}
