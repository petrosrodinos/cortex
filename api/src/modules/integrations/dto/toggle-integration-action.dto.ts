import { IsBoolean } from 'class-validator';

export class ToggleIntegrationActionDto {
  @IsBoolean()
  enabled: boolean;
}
