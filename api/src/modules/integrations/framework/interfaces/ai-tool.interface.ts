export interface AiTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

export interface IntegrationActionSeed {
  key: string;
  label: string;
  description: string;
  enabled?: boolean;
  requires_approval?: boolean;
  required_permission_key?: string | null;
}
