import { toJsonValue } from './json-value.utils';

describe('toJsonValue', () => {
  it('strips functions and underscore-prefixed keys', () => {
    const input = {
      success: true,
      data: {
        _request: () => undefined,
        pageInfo: {
          _request: () => undefined,
          endCursor: 'cursor',
          hasNextPage: false,
        },
        nodes: [
          {
            _request: () => undefined,
            _status: { id: 'status-id' },
            id: 'project-id',
            name: 'Cortex',
            createdAt: new Date('2026-06-18T16:37:14.293Z'),
          },
        ],
        _fetch: () => undefined,
      },
    };

    expect(toJsonValue(input)).toEqual({
      success: true,
      data: {
        pageInfo: {
          endCursor: 'cursor',
          hasNextPage: false,
        },
        nodes: [
          {
            id: 'project-id',
            name: 'Cortex',
            createdAt: '2026-06-18T16:37:14.293Z',
          },
        ],
      },
    });
  });
});
