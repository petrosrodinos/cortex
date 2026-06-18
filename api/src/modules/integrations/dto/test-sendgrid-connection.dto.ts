import { IsString } from 'class-validator';

export class TestSendGridConnectionDto {
  @IsString()
  apiKey: string;

  @IsString()
  from: string;
}
