const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const yaml = require('js-yaml');

const docsDir = path.join(__dirname, '..', 'docs');
const openapiUrl = process.env.OPENAPI_URL || 'http://localhost:3001/api-json';

const PUBLIC_PATHS = new Set([
  'GET /',
  'POST /auth/email/register',
  'POST /auth/email/login',
  'POST /auth/email/waitlist',
  'GET /auth/email/invitation',
  'POST /auth/email/register-invitation',
  'POST /webhooks/composio',
]);

const ALIAS_PATH_REPLACEMENTS = [
  ['/integrations/composio/', '/integrations/apps/'],
  ['/admin/composio/', '/admin/integrations/apps/'],
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch OpenAPI: HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);
  });
}

function loadOpenApi() {
  const fileArg = process.argv.find((arg) => arg.startsWith('--file='));
  if (fileArg) {
    return JSON.parse(fs.readFileSync(fileArg.slice('--file='.length), 'utf8'));
  }
  const localFile = path.join(docsDir, 'openapi.json');
  if (process.argv.includes('--offline') && fs.existsSync(localFile)) {
    return JSON.parse(fs.readFileSync(localFile, 'utf8'));
  }
  return fetchJson(openapiUrl);
}

function canonicalizePath(routePath) {
  let canonical = routePath;
  for (const [from, to] of ALIAS_PATH_REPLACEMENTS) {
    canonical = canonical.replace(from, to);
  }
  return canonical;
}

function dedupeAliasPaths(paths) {
  const deduped = {};
  for (const [routePath, methods] of Object.entries(paths)) {
    const canonical = canonicalizePath(routePath);
    if (!deduped[canonical]) {
      deduped[canonical] = methods;
      continue;
    }
    for (const [method, operation] of Object.entries(methods)) {
      if (!deduped[canonical][method]) {
        deduped[canonical][method] = operation;
      }
    }
  }
  return deduped;
}

function operationKey(method, routePath) {
  return `${method.toUpperCase()} ${routePath}`;
}

function applySecurity(paths) {
  for (const [routePath, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (PUBLIC_PATHS.has(operationKey(method, routePath))) {
        operation.security = [];
        continue;
      }
      if (routePath === '/webhooks/composio') {
        operation.security = [];
        continue;
      }
      if (!operation.security) {
        operation.security = [{ bearer: [] }];
      }
    }
  }
}

function fixOptionalQueryParams(paths) {
  for (const methods of Object.values(paths)) {
    for (const operation of Object.values(methods)) {
      if (!operation.parameters) continue;
      for (const param of operation.parameters) {
        if (param.in === 'query') {
          param.required = false;
        }
      }
    }
  }
}

function patchKnownOperations(paths) {
  const upload = paths['/organizations/{organization_uuid}/documents']?.post;
  if (upload) {
    upload.summary = 'Upload a document';
    upload.requestBody = {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ['file'],
            properties: {
              file: { type: 'string', format: 'binary' },
            },
          },
        },
      },
    };
  }
}

function enrichSchemas(schemas) {
  if (schemas.CreateOrganizationDto?.properties && Object.keys(schemas.CreateOrganizationDto.properties).length === 0) {
    schemas.CreateOrganizationDto = {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', minLength: 2, example: 'Acme Corp' },
        logo_url: { type: 'string', nullable: true, example: 'https://example.com/logo.png' },
      },
    };
  }
  if (schemas.UpdateOrganizationDto?.properties && Object.keys(schemas.UpdateOrganizationDto.properties).length === 0) {
    schemas.UpdateOrganizationDto = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2 },
        slug: { type: 'string' },
        logo_url: { type: 'string', nullable: true },
      },
    };
  }
  if (schemas.SwitchOrganizationDto?.properties && Object.keys(schemas.SwitchOrganizationDto.properties).length === 0) {
    schemas.SwitchOrganizationDto = {
      type: 'object',
      required: ['organization_uuid'],
      properties: {
        organization_uuid: { type: 'string', format: 'uuid' },
      },
    };
  }
  if (schemas.InviteMemberDto?.properties && Object.keys(schemas.InviteMemberDto.properties).length === 0) {
    schemas.InviteMemberDto = {
      type: 'object',
      required: ['email', 'organization_role_uuid'],
      properties: {
        email: { type: 'string', format: 'email' },
        organization_role_uuid: { type: 'string', format: 'uuid' },
      },
    };
  }
  if (schemas.UpdateMemberDto?.properties && Object.keys(schemas.UpdateMemberDto.properties).length === 0) {
    schemas.UpdateMemberDto = {
      type: 'object',
      properties: {
        organization_role_uuid: { type: 'string', format: 'uuid' },
        status: { type: 'string', enum: ['ACTIVE', 'INVITED', 'SUSPENDED'] },
      },
    };
  }
  if (schemas.CreateRoleDto?.properties && Object.keys(schemas.CreateRoleDto.properties).length === 0) {
    schemas.CreateRoleDto = {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
        permission_keys: { type: 'array', items: { type: 'string' } },
      },
    };
  }
  if (schemas.UpdateRoleDto?.properties && Object.keys(schemas.UpdateRoleDto.properties).length === 0) {
    schemas.UpdateRoleDto = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
  }
  if (schemas.SetRolePermissionsDto?.properties && Object.keys(schemas.SetRolePermissionsDto.properties).length === 0) {
    schemas.SetRolePermissionsDto = {
      type: 'object',
      required: ['permission_keys'],
      properties: {
        permission_keys: { type: 'array', items: { type: 'string' } },
      },
    };
  }
  if (schemas.ConnectComposioDto?.properties && Object.keys(schemas.ConnectComposioDto.properties).length === 0) {
    schemas.ConnectComposioDto = {
      type: 'object',
      required: ['toolkit_slug'],
      properties: {
        toolkit_slug: { type: 'string' },
        connected_account_id: { type: 'string' },
        connection_tier: { type: 'string', enum: ['ORG_SHARED', 'USER_PERSONAL'] },
      },
    };
  }
  if (schemas.ComposioCallbackDto?.properties && Object.keys(schemas.ComposioCallbackDto.properties).length === 0) {
    schemas.ComposioCallbackDto = {
      type: 'object',
      required: ['toolkit_slug'],
      properties: {
        toolkit_slug: { type: 'string' },
        connection_request_id: { type: 'string' },
        connected_account_id: { type: 'string' },
        connection_tier: { type: 'string', enum: ['ORG_SHARED', 'USER_PERSONAL'] },
      },
    };
  }
}

function enhanceOpenApi(document) {
  document.openapi = '3.0.3';
  document.info = {
    title: 'Cortex API',
    description:
      'REST API for Cortex — organizations, conversations, agents, integrations (Composio, MCP, OpenAPI, databases), documents, roles, and members. Authenticate via JWT Bearer token from POST /auth/email/login.',
    version: '1.0.0',
    contact: {},
  };
  document.servers = [
    { url: 'http://localhost:3001', description: 'Local' },
    { url: '{{baseUrl}}', description: 'Environment variable' },
  ];
  document.tags = [
    { name: 'App', description: 'Health check' },
    { name: 'Email Authentication', description: 'Public auth endpoints' },
    { name: 'Auth', description: 'Authenticated session management' },
    { name: 'Users', description: 'Current user profile' },
    { name: 'Organizations', description: 'Organization CRUD' },
    { name: 'Members', description: 'Organization membership' },
    { name: 'Roles', description: 'Organization roles and permissions' },
    { name: 'Agents', description: 'Scheduled AI agents' },
    { name: 'Conversations', description: 'Chat conversations and messages' },
    { name: 'Executions', description: 'Tool execution approvals and usage' },
    { name: 'Conversation Personalization', description: 'User chat preferences' },
    { name: 'Documents', description: 'File uploads and widgets' },
    { name: 'DocumentBoards', description: 'Document board collections' },
    { name: 'AiProviders', description: 'Organization AI provider keys' },
    { name: 'Integrations', description: 'Integration registry' },
    { name: 'DatabaseIntegrations', description: 'Database integrations' },
    { name: 'OpenApiIntegrations', description: 'OpenAPI spec integrations' },
    { name: 'McpIntegrations', description: 'MCP server integrations' },
    { name: 'ComposioConnections', description: 'Composio OAuth connections' },
    { name: 'OrgToolkits', description: 'Organization Composio toolkits' },
    { name: 'ComposioTriggers', description: 'Composio event triggers' },
    { name: 'ComposioToolkits', description: 'Admin Composio toolkit management' },
    { name: 'ComposioWebhook', description: 'Inbound Composio webhooks' },
    { name: 'AuditLogs', description: 'Organization audit logs' },
    { name: 'ConversationSuperAdmin', description: 'Super-admin conversation operations' },
    { name: 'Mail', description: 'Internal admin mail' },
    { name: 'Sms', description: 'Internal admin SMS' },
    { name: 'Ai', description: 'Internal admin AI' },
    { name: 'RedisCache', description: 'Internal admin Redis cache' },
  ];
  document.paths = dedupeAliasPaths(document.paths);
  applySecurity(document.paths);
  fixOptionalQueryParams(document.paths);
  patchKnownOperations(document.paths);
  document.components = document.components || {};
  document.components.securitySchemes = {
    bearer: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT from POST /auth/email/login',
    },
  };
  if (document.components.schemas) {
    enrichSchemas(document.components.schemas);
  }
  document.security = [{ bearer: [] }];
  return document;
}

function toYaml(document) {
  return yaml.dump(document, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
  });
}

async function convertToPostman(openapi) {
  const converter = require('openapi-to-postmanv2');
  return new Promise((resolve, reject) => {
    converter.convert(
      { type: 'json', data: openapi },
      {
        folderStrategy: 'Tags',
        requestParametersResolution: 'Example',
        exampleParametersResolution: 'Example',
        optimizeConversion: true,
        stackLimit: 50,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result.result) {
          reject(new Error(result.reason || 'Postman conversion failed'));
          return;
        }
        resolve(result.output[0].data);
      },
    );
  });
}

function buildPostmanEnvironment() {
  return {
    id: 'cortex-api-env',
    name: 'Cortex API',
    values: [
      { key: 'baseUrl', value: 'http://localhost:3001', type: 'default', enabled: true },
      { key: 'accessToken', value: '', type: 'secret', enabled: true },
      { key: 'organization_uuid', value: '', type: 'default', enabled: true },
      { key: 'conversation_uuid', value: '', type: 'default', enabled: true },
      { key: 'integration_uuid', value: '', type: 'default', enabled: true },
      { key: 'agent_uuid', value: '', type: 'default', enabled: true },
    ],
    _postman_variable_scope: 'environment',
  };
}

function patchPostmanCollection(collection) {
  collection.info = {
    ...collection.info,
    name: 'Cortex API',
    description: 'Postman collection for the Cortex REST API. Import cortex-api.postman_environment.json and set baseUrl, then login via Email Authentication > Login to capture accessToken.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  };
  collection.auth = {
    type: 'bearer',
    bearer: [{ key: 'token', value: '{{accessToken}}', type: 'string' }],
  };

  const loginTestScript = {
    listen: 'test',
    script: {
      type: 'text/javascript',
      exec: [
        "const json = pm.response.json();",
        "if (json.access_token) {",
        "  pm.environment.set('accessToken', json.access_token);",
        "}",
      ],
    },
  };

  const walk = (items) => {
    for (const item of items || []) {
      if (item.item) {
        walk(item.item);
        continue;
      }
      const url = item.request?.url;
      const path = Array.isArray(url?.path) ? url.path.join('/') : '';
      if (item.request?.method === 'POST' && path.includes('auth/email/login')) {
        item.event = [...(item.event || []), loginTestScript];
      }
    }
  };

  walk(collection.item);
  return collection;
}

async function main() {
  fs.mkdirSync(docsDir, { recursive: true });
  const raw = await loadOpenApi();
  const openapi = enhanceOpenApi(raw);
  const openapiJsonPath = path.join(docsDir, 'openapi.json');
  const openapiYamlPath = path.join(docsDir, 'openapi.yaml');
  const postmanPath = path.join(docsDir, 'cortex-api.postman_collection.json');
  const envPath = path.join(docsDir, 'cortex-api.postman_environment.json');

  fs.writeFileSync(openapiJsonPath, `${JSON.stringify(openapi, null, 2)}\n`);
  fs.writeFileSync(openapiYamlPath, toYaml(openapi));

  const postman = patchPostmanCollection(await convertToPostman(openapi));
  fs.writeFileSync(postmanPath, `${JSON.stringify(postman, null, 2)}\n`);
  fs.writeFileSync(envPath, `${JSON.stringify(buildPostmanEnvironment(), null, 2)}\n`);

  console.log(`OpenAPI paths: ${Object.keys(openapi.paths).length}`);
  console.log(`Wrote ${openapiJsonPath}`);
  console.log(`Wrote ${openapiYamlPath}`);
  console.log(`Wrote ${postmanPath}`);
  console.log(`Wrote ${envPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
