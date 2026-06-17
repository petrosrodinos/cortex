import { OpenApiParserService } from './openapi-parser.service';

describe('OpenApiParserService', () => {
  it('parses raw OpenAPI JSON into base URL, operations, and security schemes', async () => {
    const parser = new OpenApiParserService();

    const parsed = await parser.parse({
      rawJson: {
        openapi: '3.0.3',
        servers: [{ url: 'https://api.example.com/v1' }],
        components: {
          securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer' },
          },
        },
        paths: {
          '/users/{id}': {
            get: {
              operationId: 'getUser',
              summary: 'Get a user',
              parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                { name: 'include', in: 'query', schema: { type: 'string' } },
              ],
            },
          },
        },
      },
    });

    expect(parsed.baseUrl).toBe('https://api.example.com/v1');
    expect(parsed.operations).toHaveLength(1);
    expect(parsed.operations[0]).toMatchObject({
      operationId: 'getUser',
      method: 'GET',
      path: '/users/{id}',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'include', in: 'query', required: false, schema: { type: 'string' } },
      ],
    });
    expect(parsed.securitySchemes.bearerAuth).toEqual({ type: 'http', scheme: 'bearer' });
  });

  it('generates stable operation IDs when a spec omits operationId', async () => {
    const parser = new OpenApiParserService();

    const parsed = await parser.parse({
      rawJson: {
        openapi: '3.0.3',
        servers: [{ url: 'https://api.example.com' }],
        paths: {
          '/orders/{order_id}/items': {
            post: {
              summary: 'Create item',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: { sku: { type: 'string' } },
                      required: ['sku'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(parsed.operations[0].operationId).toBe('post_orders_order_id_items');
    expect(parsed.operations[0].requestBody).toMatchObject({
      type: 'object',
      properties: { sku: { type: 'string' } },
      required: ['sku'],
    });
  });
});
