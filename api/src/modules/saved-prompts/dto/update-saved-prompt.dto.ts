import { PartialType } from '@nestjs/swagger';
import { CreateSavedPromptDto } from './create-saved-prompt.dto';

export class UpdateSavedPromptDto extends PartialType(CreateSavedPromptDto) {}
