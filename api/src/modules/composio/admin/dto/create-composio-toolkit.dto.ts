import { IsString } from 'class-validator';

export class CreateComposioToolkitDto {
  @IsString()
  slug: string;
}
