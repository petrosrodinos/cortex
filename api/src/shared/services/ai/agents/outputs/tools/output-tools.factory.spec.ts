import { getRequestedOutputToolNames, isExportFollowUpRequest, OutputToolsFactory } from './output-tools.factory';

describe('OutputToolsFactory', () => {
  const factory = new OutputToolsFactory({} as any, {} as any, {} as any, {} as any, {} as any, {
    getCachedResult: jest.fn().mockResolvedValue(null),
  } as any);

  it('exposes only Excel generation when the user asks for Excel', () => {
    const tools = factory.buildTools({
      organizationUuid: 'org-uuid',
      userUuid: 'user-uuid',
      executionUuid: 'execution-uuid',
      userMessage: 'make it an excel',
    });

    expect(Object.keys(tools)).toEqual(['output__create_excel']);
  });

  it('exposes requested document formats when multiple are explicitly requested', () => {
    const tools = factory.buildTools({
      organizationUuid: 'org-uuid',
      userUuid: 'user-uuid',
      executionUuid: 'execution-uuid',
      userMessage: 'create a pdf and excel copy',
    });

    expect(Object.keys(tools).sort()).toEqual(['output__create_excel', 'output__create_pdf']);
  });

  it('exposes all output tools when no specific output format is requested', () => {
    const tools = factory.buildTools({
      organizationUuid: 'org-uuid',
      userUuid: 'user-uuid',
      executionUuid: 'execution-uuid',
      userMessage: 'list the members of my organisation',
    });

    expect(Object.keys(tools).sort()).toEqual([
      'output__create_excel',
      'output__create_image',
      'output__create_pdf',
      'output__create_word',
    ]);
  });
});

describe('getRequestedOutputToolNames', () => {
  it('returns null when there is no explicit output format', () => {
    expect(getRequestedOutputToolNames('show me the organization members')).toBeNull();
  });
});

describe('isExportFollowUpRequest', () => {
  it('detects follow-up export requests that refer to prior chat content', () => {
    expect(isExportFollowUpRequest('make it an excel')).toBe(true);
    expect(isExportFollowUpRequest('export the list above as pdf')).toBe(true);
  });

  it('does not treat fresh export requests as follow-ups', () => {
    expect(isExportFollowUpRequest('create an excel report of active members')).toBe(false);
  });
});
