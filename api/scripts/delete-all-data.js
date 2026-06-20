/* eslint-disable no-console */
const path = require('node:path');
const dotenv = require('dotenv');
const { Storage } = require('@google-cloud/storage');
const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

const TABLES = [
  'tool_calls',
  'agent_executions',
  'messages',
  'conversations',
  'conversation_personalizations',
  'documents',
  'ai_providers',
  'composio_triggers',
  'composio_connected_accounts',
  'organisation_tool_permissions',
  'organisation_enabled_toolkits',
  'composio_toolkit_tools',
  'composio_toolkits',
  'composio_sync_runs',
  'integration_actions',
  'database_integrations',
  'openapi_integrations',
  'mcp_integrations',
  'integrations',
  'audit_logs',
  'role_permissions',
  'organization_members',
  'organization_roles',
  'permissions',
  'organizations',
  'users',
];

function parseArgs(argv) {
  const args = {
    envFile: undefined,
    yes: false,
    allowProduction: false,
    skipGcs: false,
    skipPrefixSweep: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--env') {
      args.envFile = argv[i + 1];
      i += 1;
    } else if (arg === '--yes') {
      args.yes = true;
    } else if (arg === '--allow-production') {
      args.allowProduction = true;
    } else if (arg === '--skip-gcs') {
      args.skipGcs = true;
    } else if (arg === '--skip-prefix-sweep') {
      args.skipPrefixSweep = true;
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printUsage() {
  console.log(`Usage:
  scripts\\delete-all-data.cmd --env .env.local --yes
  node scripts/delete-all-data.js --env .env.local --yes

Options:
  --env <file>            Load an env file relative to api/ or an absolute path.
  --yes                   Required. Confirms destructive deletion.
  --allow-production      Required when NODE_ENV=production.
  --skip-gcs              Do not delete Google Cloud Storage objects.
  --skip-prefix-sweep     Only delete GCS paths referenced by documents rows.
  --help                  Show this help.
`);
}

function loadEnv(envFile) {
  if (!envFile) {
    dotenv.config();
    return;
  }

  const resolved = path.isAbsolute(envFile)
    ? envFile
    : path.resolve(process.cwd(), envFile);
  const result = dotenv.config({ path: resolved });
  if (result.error) {
    throw result.error;
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function createPrisma() {
  const adapter = new PrismaPg({
    connectionString: requireEnv('DATABASE_URL'),
  });
  return new PrismaClient({ adapter });
}

function createStorage() {
  const projectId = requireEnv('GCS_PROJECT_ID');
  const bucketName = requireEnv('GCS_BUCKET_NAME');
  const credentialsPath = process.env.GCS_CREDENTIALS_PATH;
  const credentialsBase64 = process.env.GCS_CREDENTIALS_BASE64;
  const credentialsJson = process.env.GCS_CREDENTIALS;

  const options = { projectId };
  if (credentialsPath) {
    options.keyFilename = credentialsPath;
  } else if (credentialsBase64) {
    options.credentials = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf8'));
  } else if (credentialsJson) {
    options.credentials = JSON.parse(credentialsJson);
  }

  return {
    bucket: new Storage(options).bucket(bucketName),
    bucketName,
  };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function deleteFileIfExists(bucket, objectPath) {
  try {
    await bucket.file(objectPath).delete({ ignoreNotFound: true });
    return { deleted: true };
  } catch (error) {
    return { deleted: false, error };
  }
}

async function deleteFilesWithPrefix(bucket, prefix) {
  let deleted = 0;
  let failed = 0;
  let pageToken;

  do {
    const [files, , response] = await bucket.getFiles({
      autoPaginate: false,
      maxResults: 500,
      pageToken,
      prefix,
    });

    for (const file of files) {
      const result = await deleteFileIfExists(bucket, file.name);
      if (result.deleted) {
        deleted += 1;
      } else {
        failed += 1;
        console.warn(`Failed to delete gs://${bucket.name}/${file.name}: ${result.error.message}`);
      }
    }

    pageToken = response?.nextPageToken;
  } while (pageToken);

  return { deleted, failed };
}

async function deleteGcsDocuments(prisma, args) {
  if (args.skipGcs) {
    console.log('Skipping GCS deletion.');
    return;
  }

  const documents = await prisma.document.findMany({
    select: { path: true },
  });
  const dbPaths = unique(documents.map((document) => document.path));
  const { bucket, bucketName } = createStorage();

  console.log(`Deleting ${dbPaths.length} GCS object(s) referenced by documents rows from gs://${bucketName}.`);

  let deleted = 0;
  let failed = 0;
  for (const objectPath of dbPaths) {
    const result = await deleteFileIfExists(bucket, objectPath);
    if (result.deleted) {
      deleted += 1;
    } else {
      failed += 1;
      console.warn(`Failed to delete gs://${bucketName}/${objectPath}: ${result.error.message}`);
    }
  }

  console.log(`GCS referenced objects: ${deleted} deleted, ${failed} failed.`);

  if (args.skipPrefixSweep) {
    return;
  }

  const folder = process.env.GCS_FOLDER_NAME || 'documents';
  const prefixes = unique([`${folder.replace(/\/+$/, '')}/`, 'documents/', 'orgs/']);
  for (const prefix of prefixes) {
    const result = await deleteFilesWithPrefix(bucket, prefix);
    console.log(`GCS prefix ${prefix}: ${result.deleted} deleted, ${result.failed} failed.`);
  }
}

async function countTables(prisma) {
  const rows = await Promise.all(
    TABLES.map(async (table) => {
      const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM "${table}"`);
      return [table, result[0]?.count ?? 0];
    }),
  );

  return Object.fromEntries(rows);
}

async function truncateTables(prisma) {
  const quoted = TABLES.map((table) => `"${table}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  loadEnv(args.envFile);

  if (!args.yes) {
    printUsage();
    throw new Error('Refusing to delete data without --yes.');
  }

  if (process.env.NODE_ENV === 'production' && !args.allowProduction) {
    throw new Error('Refusing to delete production data without --allow-production.');
  }

  const prisma = createPrisma();

  try {
    console.log(`Environment: ${process.env.NODE_ENV || '(unset)'}`);
    console.log(`Database: ${requireEnv('DATABASE_URL').replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@')}`);

    const before = await countTables(prisma);
    console.table(before);

    await deleteGcsDocuments(prisma, args);
    await truncateTables(prisma);

    console.log('Database tables truncated.');
    console.log('Done. Run the permission seed/migrations again if this environment needs bootstrap data.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
