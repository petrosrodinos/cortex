export const ResponseStyles = {
  DEFAULT: 'DEFAULT',
  PROFESSIONAL: 'PROFESSIONAL',
  FRIENDLY: 'FRIENDLY',
  CANDID: 'CANDID',
  QUIRKY: 'QUIRKY',
  EFFICIENT: 'EFFICIENT',
  CYNICAL: 'CYNICAL',
} as const;

export type ResponseStyle = (typeof ResponseStyles)[keyof typeof ResponseStyles];

export const CharacteristicLevels = {
  LESS: 'LESS',
  DEFAULT: 'DEFAULT',
  MORE: 'MORE',
} as const;

export type CharacteristicLevel = (typeof CharacteristicLevels)[keyof typeof CharacteristicLevels];

export interface ConversationPersonalization {
  uuid: string | null;
  user_uuid: string;
  org_uuid: string;
  response_style: ResponseStyle;
  warm: CharacteristicLevel;
  enthusiastic: CharacteristicLevel;
  headers_lists: CharacteristicLevel;
  emoji: CharacteristicLevel;
  custom_instructions: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type UpdateConversationPersonalizationDto = {
  response_style?: ResponseStyle;
  warm?: CharacteristicLevel;
  enthusiastic?: CharacteristicLevel;
  headers_lists?: CharacteristicLevel;
  emoji?: CharacteristicLevel;
  custom_instructions?: string | null;
};

export const responseStyleOptions: Array<{
  value: ResponseStyle;
  label: string;
  description: string;
}> = [
  { value: ResponseStyles.DEFAULT, label: 'Default', description: 'Preset style and tone' },
  { value: ResponseStyles.PROFESSIONAL, label: 'Professional', description: 'Polished and precise' },
  { value: ResponseStyles.FRIENDLY, label: 'Friendly', description: 'Warm and chatty' },
  { value: ResponseStyles.CANDID, label: 'Candid', description: 'Direct and encouraging' },
  { value: ResponseStyles.QUIRKY, label: 'Quirky', description: 'Playful and imaginative' },
  { value: ResponseStyles.EFFICIENT, label: 'Efficient', description: 'Concise and plain' },
  { value: ResponseStyles.CYNICAL, label: 'Cynical', description: 'Critical and sarcastic' },
];

export const characteristicLevelOptions: Array<{
  value: CharacteristicLevel;
  label: string;
}> = [
  { value: CharacteristicLevels.LESS, label: 'Less' },
  { value: CharacteristicLevels.DEFAULT, label: 'Default' },
  { value: CharacteristicLevels.MORE, label: 'More' },
];

export const characteristicOptions: Array<{
  key: 'warm' | 'enthusiastic' | 'headers_lists' | 'emoji';
  label: string;
  description: string;
}> = [
  { key: 'warm', label: 'Warm', description: 'How empathetic and approachable responses feel' },
  { key: 'enthusiastic', label: 'Enthusiastic', description: 'How energetic and upbeat responses feel' },
  { key: 'headers_lists', label: 'Headers & Lists', description: 'How much structured formatting is used' },
  { key: 'emoji', label: 'Emoji', description: 'How often emoji appear in responses' },
];
