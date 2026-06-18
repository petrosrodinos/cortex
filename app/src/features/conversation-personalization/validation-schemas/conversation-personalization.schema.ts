import { z } from 'zod';
import {
  CharacteristicLevels,
  ResponseStyles,
} from '../interfaces/conversation-personalization.interfaces';

const characteristicLevelSchema = z.enum([
  CharacteristicLevels.LESS,
  CharacteristicLevels.DEFAULT,
  CharacteristicLevels.MORE,
]);

export const conversationPersonalizationSchema = z.object({
  response_style: z.enum([
    ResponseStyles.DEFAULT,
    ResponseStyles.PROFESSIONAL,
    ResponseStyles.FRIENDLY,
    ResponseStyles.CANDID,
    ResponseStyles.QUIRKY,
    ResponseStyles.EFFICIENT,
    ResponseStyles.CYNICAL,
  ]),
  warm: characteristicLevelSchema,
  enthusiastic: characteristicLevelSchema,
  headers_lists: characteristicLevelSchema,
  emoji: characteristicLevelSchema,
  custom_instructions: z.string().max(8000).optional().nullable(),
});

export type ConversationPersonalizationFormValues = z.infer<typeof conversationPersonalizationSchema>;
