export interface AiProvider {
  uuid: string;
  org_uuid: string;
  provider: string;
  default_model: string;
  has_api_key: boolean;
  is_default: boolean;
  usage_limit_tokens?: number;
  usage_limit_cost_usd?: number;
  created_at: string;
}

export interface CreateAiProviderDto {
  provider: string;
  api_key: string;
  default_model: string;
  is_default?: boolean;
  usage_limit_tokens?: number;
  usage_limit_cost_usd?: number;
}

export type UpdateAiProviderDto = Partial<CreateAiProviderDto>;
