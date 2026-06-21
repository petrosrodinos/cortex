import {
  buildToolContextFromDbRecords,
  buildToolContextFromStepResults,
  messagesIncludeRecentToolContext,
  shouldSkipToolForContext,
} from './conversation-tool-context.utils';

describe('conversation-tool-context.utils', () => {
  it('skips meta and search tools', () => {
    expect(shouldSkipToolForContext('COMPOSIO_SEARCH_TOOLS')).toBe(true);
    expect(shouldSkipToolForContext('LINEAR_LIST_LINEAR_PROJECTS')).toBe(false);
  });

  it('builds context from agent step tool results', () => {
    const context = buildToolContextFromStepResults([
      {
        toolName: 'LINEAR_LIST_LINEAR_PROJECTS',
        output: {
          projects: [{ id: 'abc', name: 'Cortex' }],
        },
      },
      {
        toolName: 'COMPOSIO_SEARCH_TOOLS',
        output: { data: { huge: true } },
      },
    ]);

    expect(context).toContain('LINEAR_LIST_LINEAR_PROJECTS');
    expect(context).toContain('Cortex');
    expect(context).not.toContain('COMPOSIO_SEARCH_TOOLS');
  });

  it('builds context from persisted tool call records', () => {
    const context = buildToolContextFromDbRecords([
      {
        tool_name: 'database__query',
        status: 'SUCCESS',
        output: { rows: [{ id: 1, email: 'a@test.com' }] },
      },
      {
        tool_name: 'database__query',
        status: 'FAILED',
        output: { error: 'boom' },
      },
    ]);

    expect(context).toContain('database__query');
    expect(context).toContain('a@test.com');
  });

  it('detects when the latest assistant message already includes tool context', () => {
    expect(
      messagesIncludeRecentToolContext([
        { role: 'user', content: 'fetch users' },
        {
          role: 'assistant',
          content: 'Here are the users.\n\nTool results from this turn:\n[data]',
        },
        { role: 'user', content: 'email them to me' },
      ]),
    ).toBe(true);

    expect(
      messagesIncludeRecentToolContext([
        { role: 'user', content: 'fetch users' },
        { role: 'assistant', content: 'Here are the users.' },
        { role: 'user', content: 'email them to me' },
      ]),
    ).toBe(false);
  });
});
