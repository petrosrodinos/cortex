import { CharacteristicLevel, ResponseStyle } from 'generated/prisma';

type PersonalizationInput = {
  response_style: ResponseStyle;
  warm: CharacteristicLevel;
  enthusiastic: CharacteristicLevel;
  headers_lists: CharacteristicLevel;
  emoji: CharacteristicLevel;
  custom_instructions: string | null;
};

const RESPONSE_STYLE_INSTRUCTIONS: Record<ResponseStyle, string | null> = {
  [ResponseStyle.DEFAULT]: null,
  [ResponseStyle.PROFESSIONAL]: 'Use a polished and precise communication style.',
  [ResponseStyle.FRIENDLY]: 'Use a warm and chatty communication style.',
  [ResponseStyle.CANDID]: 'Be direct and encouraging in your responses.',
  [ResponseStyle.QUIRKY]: 'Use a playful and imaginative communication style.',
  [ResponseStyle.EFFICIENT]: 'Be concise and plain. Prefer short, direct answers.',
  [ResponseStyle.CYNICAL]: 'Use a critical and sarcastic tone when appropriate.',
};

const WARM_INSTRUCTIONS: Record<CharacteristicLevel, string | null> = {
  [CharacteristicLevel.LESS]: 'Be less warm and more neutral in tone.',
  [CharacteristicLevel.DEFAULT]: null,
  [CharacteristicLevel.MORE]: 'Be warm and empathetic in your responses.',
};

const ENTHUSIASTIC_INSTRUCTIONS: Record<CharacteristicLevel, string | null> = {
  [CharacteristicLevel.LESS]: 'Keep a calm, measured tone without extra enthusiasm.',
  [CharacteristicLevel.DEFAULT]: null,
  [CharacteristicLevel.MORE]: 'Show enthusiasm and energy in your responses.',
};

const HEADERS_LISTS_INSTRUCTIONS: Record<CharacteristicLevel, string | null> = {
  [CharacteristicLevel.LESS]: 'Avoid headers and bullet lists unless absolutely necessary.',
  [CharacteristicLevel.DEFAULT]: null,
  [CharacteristicLevel.MORE]: 'Use headers and bullet lists when they improve clarity.',
};

const EMOJI_INSTRUCTIONS: Record<CharacteristicLevel, string | null> = {
  [CharacteristicLevel.LESS]: 'Do not use emoji.',
  [CharacteristicLevel.DEFAULT]: null,
  [CharacteristicLevel.MORE]: 'Use emoji sparingly when they add warmth or clarity.',
};

function pushCharacteristicInstruction(
  lines: string[],
  level: CharacteristicLevel,
  instructions: Record<CharacteristicLevel, string | null>,
) {
  const instruction = instructions[level];
  if (instruction) {
    lines.push(instruction);
  }
}

export function buildPersonalizationPromptBlock(personalization: PersonalizationInput): string | null {
  const lines: string[] = [];

  const styleInstruction = RESPONSE_STYLE_INSTRUCTIONS[personalization.response_style];
  if (styleInstruction) {
    lines.push(styleInstruction);
  }

  pushCharacteristicInstruction(lines, personalization.warm, WARM_INSTRUCTIONS);
  pushCharacteristicInstruction(lines, personalization.enthusiastic, ENTHUSIASTIC_INSTRUCTIONS);
  pushCharacteristicInstruction(lines, personalization.headers_lists, HEADERS_LISTS_INSTRUCTIONS);
  pushCharacteristicInstruction(lines, personalization.emoji, EMOJI_INSTRUCTIONS);

  if (personalization.custom_instructions) {
    lines.push(personalization.custom_instructions);
  }

  if (lines.length === 0) {
    return null;
  }

  return [
    'User personalization preferences:',
    'These instructions customize how you communicate. Follow them while respecting all Cortex capabilities, tool usage rules, and safety requirements above.',
    ...lines.map((line) => `- ${line}`),
  ].join('\n');
}
