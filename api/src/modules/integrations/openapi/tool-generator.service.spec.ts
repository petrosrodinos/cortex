import { ToolGeneratorService } from './tool-generator.service';
import { ParsedSpec } from './openapi.types';

describe('ToolGeneratorService', () => {
  it('generates integration-scoped OpenAI function tools from operations', () => {
    const generator = new ToolGeneratorService();
    const parsedSpec: ParsedSpec = {
      baseUrl: 'https://api.example.com',
      specJson: {},
      securitySchemes: {},
      operations: [
        {
          operationId: 'getUser',
          method: 'GET',
          path: '/users/{id}',
          summary: 'Get a user',
          description: 'Returns one user.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'expand', in: 'query', required: false, schema: { type: 'string' } },
          ],
        },
      ],
    };

    const tools = generator.generateTools(parsedSpec, 'integration-uuid-123456');

    expect(tools).toHaveLength(1);
    expect(tools[0]).toMatchObject({
      key: 'getUser',
      name: 'openapi_integrat__getUser',
      description: 'Get a user\n\nReturns one user.',
      parameters: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'Path parameter: id' },
          expand: { type: 'string', description: 'Query parameter: expand' },
        },
      },
    });
  });

  it('merges request body schema under body and limits tool count', () => {
    const generator = new ToolGeneratorService();
    const parsedSpec: ParsedSpec = {
      baseUrl: 'https://api.example.com',
      specJson: {},
      securitySchemes: {},
      operations: Array.from({ length: 101 }, (_value, index) => ({
        operationId: `createThing${index}`,
        method: 'POST',
        path: `/things/${index}`,
        parameters: [],
        requestBody: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
        },
      })),
    };

    expect(() => generator.generateTools(parsedSpec, 'integration-uuid-123456')).toThrow('OpenAPI specs can generate at most 100 tools');
  });
});
