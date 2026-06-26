import { normalizeMcpInputSchema } from './normalize-mcp-input-schema.util';

describe('normalizeMcpInputSchema', () => {
  it('returns an empty object schema for missing input', () => {
    expect(normalizeMcpInputSchema(undefined)).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: false,
    });
  });

  it('normalizes schemas with invalid type values', () => {
    expect(normalizeMcpInputSchema({ type: 'None', properties: {} })).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: false,
    });
  });

  it('unwraps AI SDK jsonSchema wrappers', () => {
    expect(
      normalizeMcpInputSchema({
        jsonSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      }),
    ).toEqual({
      type: 'object',
      properties: {
        query: { type: 'string' },
      },
      required: ['query'],
      additionalProperties: false,
    });
  });

  it('preserves valid object schemas', () => {
    expect(
      normalizeMcpInputSchema({
        type: 'object',
        properties: {
          limit: { type: 'number' },
        },
        required: ['limit'],
      }),
    ).toEqual({
      type: 'object',
      properties: {
        limit: { type: 'number' },
      },
      required: ['limit'],
      additionalProperties: false,
    });
  });
});
