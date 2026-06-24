export const AgentCronPresets = {
  HOURLY: '0 * * * *',
  DAILY_9AM: '0 9 * * *',
  WEEKDAYS_9AM: '0 9 * * 1-5',
  WEEKLY_MON_9AM: '0 9 * * 1',
  MONTHLY_1ST_9AM: '0 9 1 * *',
  CUSTOM: 'custom',
} as const;

export type AgentCronPreset =
  (typeof AgentCronPresets)[keyof typeof AgentCronPresets];

export const AgentCronPresetLabels: Record<
  Exclude<AgentCronPreset, 'custom'>,
  string
> = {
  [AgentCronPresets.HOURLY]: 'Every hour',
  [AgentCronPresets.DAILY_9AM]: 'Daily at 9:00 AM',
  [AgentCronPresets.WEEKDAYS_9AM]: 'Weekdays at 9:00 AM',
  [AgentCronPresets.WEEKLY_MON_9AM]: 'Weekly (Mon 9:00 AM)',
  [AgentCronPresets.MONTHLY_1ST_9AM]: 'Monthly (1st, 9:00 AM)',
};

export interface Agent {
  uuid: string;
  org_uuid: string;
  user_uuid: string;
  title: string;
  prompt: string;
  cron_expression: string;
  is_enabled: boolean;
  conversation_uuid: string;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentDto {
  title: string;
  prompt: string;
  cron_expression: string;
  is_enabled?: boolean;
}

export type UpdateAgentDto = Partial<CreateAgentDto>;
