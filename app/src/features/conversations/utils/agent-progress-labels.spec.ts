import { describe, expect, it } from 'vitest';
import { formatToolName, isDisplayableToolName } from './agent-progress-labels';

describe('agent-progress-labels', () => {
  it('formats built-in tools with friendly labels', () => {
    expect(formatToolName('code_interpreter')).toBe('Run Python code');
    expect(formatToolName('output__create_pdf')).toBe('Create PDF document');
    expect(formatToolName('document__read_excel')).toBe('Read Excel spreadsheet');
  });

  it('formats integration tools with provider and action labels', () => {
    expect(formatToolName('smtp__send_email')).toBe('Email: Send email');
    expect(formatToolName('github__list_repos')).toBe('GitHub: List repositories');
    expect(formatToolName('db__query')).toBe('Database: Run database query');
  });

  it('formats unknown actions with readable text', () => {
    expect(formatToolName('custom_provider__archive_ticket')).toBe('Custom provider: Archive ticket');
  });

  it('filters internal llm step tool names', () => {
    expect(isDisplayableToolName('agent-step:llm-step')).toBe(false);
    expect(isDisplayableToolName('output__create_widget')).toBe(true);
  });
});
