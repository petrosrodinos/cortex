import { ConversationsService } from './conversations.service';

describe('ConversationsService', () => {
  const prisma: any = {
    conversation: {
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
    },
    agentExecution: {
      findMany: jest.fn(),
    },
    document: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  const organizations: any = { requireActiveMember: jest.fn() };
  const memory: any = { invalidate: jest.fn() };
  const gcs: any = { deleteImage: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    organizations.requireActiveMember.mockResolvedValue(undefined);
    prisma.conversation.findFirst.mockResolvedValue({ uuid: 'conversation-uuid' });
    prisma.conversation.delete.mockResolvedValue({});
    prisma.message.findMany.mockResolvedValue([]);
    prisma.agentExecution.findMany.mockResolvedValue([]);
    prisma.document.findMany.mockResolvedValue([]);
    prisma.document.deleteMany.mockResolvedValue({ count: 0 });
    memory.invalidate.mockResolvedValue(undefined);
    gcs.deleteImage.mockResolvedValue({ success: true });
  });

  it('deletes attached and generated GCS files before deleting the conversation', async () => {
    prisma.message.findMany.mockResolvedValue([
      {
        metadata: {
          attachments: [
            { uuid: 'uploaded-document-uuid', filename: 'upload.pdf' },
          ],
        },
      },
    ]);
    prisma.agentExecution.findMany.mockResolvedValue([
      {
        input: {
          documentUuids: ['input-document-uuid'],
        },
        tool_calls: [
          {
            output: {
              document_uuid: 'generated-document-uuid',
              file_url: 'https://storage.googleapis.com/bucket/generated.pdf',
            },
          },
        ],
      },
    ]);
    prisma.document.findMany.mockResolvedValue([
      { uuid: 'uploaded-document-uuid', path: 'documents/upload.pdf' },
      { uuid: 'input-document-uuid', path: 'documents/input.pdf' },
      { uuid: 'generated-document-uuid', path: 'orgs/org-uuid/generated/generated.pdf' },
    ]);

    const service = new ConversationsService(prisma, organizations, memory, gcs);

    await expect(service.delete('user-uuid', 'org-uuid', 'conversation-uuid')).resolves.toEqual({ deleted: true });

    expect(gcs.deleteImage).toHaveBeenCalledTimes(3);
    expect(gcs.deleteImage).toHaveBeenCalledWith({ filename: 'documents/upload.pdf' });
    expect(gcs.deleteImage).toHaveBeenCalledWith({ filename: 'documents/input.pdf' });
    expect(gcs.deleteImage).toHaveBeenCalledWith({ filename: 'orgs/org-uuid/generated/generated.pdf' });
    expect(prisma.document.deleteMany).toHaveBeenCalledWith({
      where: {
        uuid: {
          in: ['uploaded-document-uuid', 'input-document-uuid', 'generated-document-uuid'],
        },
      },
    });
    expect(memory.invalidate).toHaveBeenCalledWith('org-uuid', 'conversation-uuid');
    expect(prisma.conversation.delete).toHaveBeenCalledWith({ where: { uuid: 'conversation-uuid' } });
  });
});
