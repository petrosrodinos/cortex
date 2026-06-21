export function collectDocumentUuids(value: unknown, documentUuids: Set<string>) {
  if (!value || typeof value !== 'object') {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectDocumentUuids(item, documentUuids);
    }
    return;
  }

  const record = value as Record<string, unknown>;
  collectAttachmentUuid(record, documentUuids);
  collectUuidValue(record.document_uuid, documentUuids);
  collectUuidArray(record.documentUuids, documentUuids);
  collectUuidArray(record.attachment_document_uuids, documentUuids);

  for (const nested of Object.values(record)) {
    collectDocumentUuids(nested, documentUuids);
  }
}

function collectAttachmentUuid(record: Record<string, unknown>, documentUuids: Set<string>) {
  const hasAttachmentShape =
    typeof record.filename === 'string' ||
    typeof record.mimetype === 'string' ||
    typeof record.path === 'string';

  if (hasAttachmentShape) {
    collectUuidValue(record.uuid, documentUuids);
  }
}

function collectUuidValue(value: unknown, documentUuids: Set<string>) {
  if (typeof value === 'string') {
    documentUuids.add(value);
  }
}

function collectUuidArray(value: unknown, documentUuids: Set<string>) {
  if (!Array.isArray(value)) {
    return;
  }

  for (const item of value) {
    collectUuidValue(item, documentUuids);
  }
}
