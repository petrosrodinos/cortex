import { normalizeAgentToolScope } from './agent-tool-scope.utils';

describe('normalizeAgentToolScope', () => {
  it('treats empty arrays as unscoped access to all enabled tools', () => {
    expect(normalizeAgentToolScope([], [])).toEqual({
      integrationUuids: undefined,
      toolkitSlugs: undefined,
    });
  });

  it('preserves explicit non-empty scopes', () => {
    expect(
      normalizeAgentToolScope(['integration-uuid'], ['gmail']),
    ).toEqual({
      integrationUuids: ['integration-uuid'],
      toolkitSlugs: ['gmail'],
    });
  });
});
