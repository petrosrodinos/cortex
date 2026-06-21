export interface AgentToolScope {
  integrationUuids?: string[];
  toolkitSlugs?: string[];
}

export function normalizeAgentToolScope(
  integrationUuids?: string[],
  toolkitSlugs?: string[],
): AgentToolScope {
  return {
    integrationUuids: integrationUuids?.length ? integrationUuids : undefined,
    toolkitSlugs: toolkitSlugs?.length ? toolkitSlugs : undefined,
  };
}
