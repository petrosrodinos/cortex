import type { AgentToolScope } from './agent-tool-scope.utils';

describe('AgentToolScope', () => {
  it('allows explicit empty scopes through consumers', () => {
    const scope: AgentToolScope = {
      integrationUuids: undefined,
      toolkitSlugs: undefined,
    };

    expect(scope.integrationUuids).toBeUndefined();
    expect(scope.toolkitSlugs).toBeUndefined();
  });
});
