import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Drawer, useOverlayState } from '@heroui/react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useOrganizationStore } from '@/stores/organization';
import { useAuthStore } from '@/stores/auth';
import { Routes } from '@/routes/routes';
import { RoleTypes } from '@/features/user/interfaces/user.interface';
import { useGetIntegrations } from '@/features/integrations/common/hooks/use-integrations';
import { useGetAiProviders } from '@/features/ai-providers/hooks/use-ai-providers';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import {
  useApproveExecution,
  useCreateConversation,
  useDeleteConversation,
  useDeleteMessage,
  useGetConversationAgentTools,
  useGetConversations,
  useGetMessages,
  useRejectExecution,
  useSendMessage,
  useUpdateConversation,
  conversationsQueryKey,
} from '@/features/conversations/hooks/use-conversations';
import { useExecution } from '@/features/conversations/hooks/use-execution';
import { MessageRoles, type Message, type MessageAttachment } from '@/features/conversations/interfaces/conversation.interfaces';
import { useUploadDocument } from '@/features/files/hooks/use-files';
import { cn } from '@/lib/utils';
import { ConversationEmptyState } from './components/shared/conversation-empty-state';
import { ConversationAiProviderRequired } from './components/shared/conversation-ai-provider-required';
import { ConversationDocumentsModal } from './components/shared/conversation-documents-modal';
import { ConversationHeader } from './components/shared/conversation-header';
import { ConversationInput, type AttachedFile } from './components/input/conversation-input';
import { getToolEligibleIntegrations } from './components/input/integration-tools-list';
import {
  createEmptyDraft,
  draftPartsToPlainText,
  getDraftIntegrationUuids,
  getDraftToolkitSlugs,
  type ConversationDraftEditorHandle,
  type DraftPart,
} from './components/input/conversation-draft-editor';
import { ConversationMessages } from './components/messages/conversation-messages';
import { getMessageAttachments } from './components/messages/message-attachments';
import { stripMarkdownForPreview } from '@/lib/message-markdown.utils';
import { ConversationSidebar } from './components/sidebar/conversation-sidebar';
import { ConversationSidebarSkeleton } from './components/sidebar/conversation-sidebar-skeleton';
import {
  CONVERSATIONS_SIDEBAR_STORAGE_KEY,
  getInitialConversationsSidebarCollapsed,
} from './utils/conversations-sidebar.utils';

const ConversationsPage: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { conversationUuid } = useParams<{ conversationUuid?: string }>();
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const role = useAuthStore((state) => state.role);
  const isSuperAdmin = role === RoleTypes.SUPER_ADMIN;
  const [draftParts, setDraftParts] = useState<DraftPart[]>(() => createEmptyDraft());
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [selectedIntegrationUuids, setSelectedIntegrationUuids] = useState<string[]>([]);
  const [selectedToolkitSlugs, setSelectedToolkitSlugs] = useState<string[]>([]);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [pendingUserAttachments, setPendingUserAttachments] = useState<MessageAttachment[]>([]);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [deleteMessageTarget, setDeleteMessageTarget] = useState<Message | null>(null);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [chatsPanelCollapsed, setChatsPanelCollapsed] = useState(getInitialConversationsSidebarCollapsed);
  const autoCreateStarted = useRef(false);
  const draftEditorRef = useRef<ConversationDraftEditorHandle>(null);
  const chatListDrawer = useOverlayState();

  const { data: conversations = [], isLoading: conversationsLoading } = useGetConversations(organizationUuid);
  const { data: integrations = [] } = useGetIntegrations(organizationUuid);
  const { data: agentTools } = useGetConversationAgentTools(organizationUuid);
  const { data: aiProviders = [], isLoading: aiProvidersLoading } = useGetAiProviders(organizationUuid);
  const conversationToolkits = useMemo<IntegrationAppsToolkit[]>(
    () =>
      (agentTools?.toolkits ?? []).map((toolkit) => ({
        uuid: toolkit.uuid,
        slug: toolkit.slug,
        name: toolkit.name,
        description: toolkit.description,
        logo_url: toolkit.logo_url,
        categories: [],
        connection_tiers: [],
        is_connected: toolkit.is_connected,
        connected_accounts: [],
        is_org_enabled: true,
        tool_count: toolkit.tool_count,
      })),
    [agentTools?.toolkits],
  );
  const { data: messages = [], isLoading: messagesLoading } = useGetMessages(organizationUuid, conversationUuid);
  const createConversation = useCreateConversation(organizationUuid);
  const deleteConversation = useDeleteConversation(organizationUuid);
  const deleteMessage = useDeleteMessage(organizationUuid, conversationUuid);
  const updateConversation = useUpdateConversation(organizationUuid);
  const sendMessage = useSendMessage(organizationUuid, conversationUuid);
  const approveExecution = useApproveExecution(organizationUuid);
  const rejectExecution = useRejectExecution(organizationUuid);
  const uploadDocument = useUploadDocument(organizationUuid);

  const execution = useExecution(organizationUuid, conversationUuid, activeExecutionId);
  const { isComplete, reset: resetExecution, assistantContent, isRunning, toolCalls, approvalRequest, error: executionError } = execution;

  const activeConversation = useMemo(
    () => conversations.find((c) => c.uuid === conversationUuid),
    [conversations, conversationUuid],
  );

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [conversations],
  );

  const enabledIntegrationUuids = useMemo(
    () => new Set((agentTools?.integrations ?? []).map((integration) => integration.uuid)),
    [agentTools?.integrations],
  );
  const toolEligibleIntegrations = useMemo(
    () =>
      getToolEligibleIntegrations(integrations).filter((integration) =>
        enabledIntegrationUuids.has(integration.uuid),
      ),
    [integrations, enabledIntegrationUuids],
  );
  const toolEligibleIntegrationUuids = useMemo(
    () => toolEligibleIntegrations.map((integration) => integration.uuid),
    [toolEligibleIntegrations],
  );
  const toolEligibleToolkitSlugs = useMemo(
    () => conversationToolkits.map((toolkit) => toolkit.slug),
    [conversationToolkits],
  );

  const toolEligibleIntegrationUuidsRef = useRef<string[]>([]);
  const toolEligibleToolkitSlugsRef = useRef<string[]>([]);

  useEffect(() => {
    const previousEligible = new Set(toolEligibleIntegrationUuidsRef.current);
    const currentEligible = toolEligibleIntegrationUuids;

    setSelectedIntegrationUuids((prev) => {
      const available = new Set(currentEligible);

      if (prev.length === 0) {
        return currentEligible;
      }

      const kept = prev.filter((uuid) => available.has(uuid));
      const newlyEligible = currentEligible.filter((uuid) => !previousEligible.has(uuid));

      return [...kept, ...newlyEligible];
    });

    toolEligibleIntegrationUuidsRef.current = currentEligible;
  }, [toolEligibleIntegrationUuids]);

  useEffect(() => {
    const previousEligible = new Set(toolEligibleToolkitSlugsRef.current);
    const currentEligible = toolEligibleToolkitSlugs;

    setSelectedToolkitSlugs((prev) => {
      const available = new Set(currentEligible);

      if (prev.length === 0) {
        return currentEligible;
      }

      const kept = prev.filter((slug) => available.has(slug));
      const newlyEligible = currentEligible.filter((slug) => !previousEligible.has(slug));

      return [...kept, ...newlyEligible];
    });

    toolEligibleToolkitSlugsRef.current = currentEligible;
  }, [toolEligibleToolkitSlugs]);

  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATIONS_SIDEBAR_STORAGE_KEY, String(chatsPanelCollapsed));
    } catch {
      return;
    }
  }, [chatsPanelCollapsed]);

  useEffect(() => {
    if (!organizationUuid || conversationsLoading) {
      return;
    }

    if (!conversationUuid) {
      if (sortedConversations.length > 0) {
        navigate(Routes.dashboard.conversation(sortedConversations[0].uuid), { replace: true });
        return;
      }

      if (!autoCreateStarted.current) {
        autoCreateStarted.current = true;
        void createConversation.mutateAsync('New conversation').then((created) => {
          navigate(Routes.dashboard.conversation(created.uuid), { replace: true });
        });
      }
    }
  }, [organizationUuid, conversationsLoading, conversationUuid, sortedConversations, createConversation, navigate]);

  useEffect(() => {
    if (!isComplete || !conversationUuid || !organizationUuid || approvalRequest) {
      return;
    }

    void queryClient.invalidateQueries({ queryKey: ['messages', organizationUuid, conversationUuid] });
    void queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
    resetExecution();
    setActiveExecutionId(null);
  }, [isComplete, approvalRequest, conversationUuid, organizationUuid, queryClient, resetExecution]);

  const pendingAssistantContent = useMemo(() => {
    if (isComplete || assistantContent == null) {
      return null;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === MessageRoles.ASSISTANT && lastMessage.content === assistantContent) {
      return null;
    }

    return assistantContent;
  }, [assistantContent, isComplete, messages]);

  const isPendingUserMessageVisible = useMemo(() => {
    if (!pendingUserMessage) {
      return false;
    }

    const lastMessage = messages[messages.length - 1];
    return !(lastMessage?.role === MessageRoles.USER && lastMessage.content === pendingUserMessage);
  }, [messages, pendingUserMessage]);

  const showTypingIndicator =
    (sendMessage.isPending || isRunning) &&
    !approvalRequest &&
    pendingAssistantContent == null &&
    (isPendingUserMessageVisible || (activeExecutionId != null && !sendMessage.isPending));

  const showExecutionProgress =
    (sendMessage.isPending || isRunning || approvalRequest != null) &&
    pendingAssistantContent == null;

  const hasAiProvider = aiProviders.length > 0;
  const isChatInputDisabled = sendMessage.isPending || isRunning || !hasAiProvider;

  useEffect(() => {
    if (!pendingUserMessage) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === MessageRoles.USER && lastMessage.content === pendingUserMessage) {
      setPendingUserMessage(null);
      setPendingUserAttachments([]);
    }
  }, [messages, pendingUserMessage]);

  const handleCreateConversation = async () => {
    const created = await createConversation.mutateAsync('New conversation');
    navigate(Routes.dashboard.conversation(created.uuid));
    chatListDrawer.close();
  };

  const handleSelectConversation = (uuid: string) => {
    navigate(Routes.dashboard.conversation(uuid));
    chatListDrawer.close();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !organizationUuid) return;

    const placeholder: AttachedFile = {
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      filename: file.name,
      mimetype: file.type,
    };
    setAttachedFiles((prev) => [...prev, placeholder]);

    try {
      const doc = await uploadDocument.mutateAsync(file);
      setAttachedFiles((prev) =>
        prev.map((attachment) =>
          attachment.file === file
            ? {
                ...attachment,
                uuid: doc.uuid,
                url: doc.url,
              }
            : attachment,
        ),
      );
    } catch {
      setAttachedFiles((prev) => prev.filter((attachment) => attachment.file !== file));
    }

    event.target.value = '';
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const handleSend = async () => {
    const content = draftPartsToPlainText(draftParts);
    const draftIntegrationUuids = getDraftIntegrationUuids(draftParts);
    const draftToolkitSlugs = getDraftToolkitSlugs(draftParts);
    if (!content || !conversationUuid || !hasAiProvider) {
      return;
    }
    const integrationUuids = [
      ...new Set([...selectedIntegrationUuids, ...draftIntegrationUuids]),
    ];
    const toolkitSlugs = [
      ...new Set([...selectedToolkitSlugs, ...draftToolkitSlugs]),
    ];
    const documentUuids = attachedFiles.filter((attachment) => attachment.uuid).map((attachment) => attachment.uuid as string);
    const sentAttachments: MessageAttachment[] = attachedFiles
      .filter((attachment) => attachment.uuid)
      .map((attachment) => ({
        uuid: attachment.uuid as string,
        filename: attachment.filename,
        mimetype: attachment.mimetype ?? attachment.file?.type,
        url: attachment.url,
      }));
    const isFirstMessage = messages.length === 0;
    setDraftParts(createEmptyDraft());
    setAttachedFiles([]);

    await submitMessage({
      content,
      documentUuids,
      integrationUuids,
      toolkitSlugs,
      attachments: sentAttachments,
      isFirstMessage,
    });
  };

  const submitMessage = async ({
    content,
    documentUuids,
    integrationUuids,
    toolkitSlugs,
    attachments,
    isFirstMessage = false,
  }: {
    content: string;
    documentUuids: string[];
    integrationUuids: string[];
    toolkitSlugs: string[];
    attachments: MessageAttachment[];
    isFirstMessage?: boolean;
  }) => {
    if (!conversationUuid) {
      return;
    }

    resetExecution();
    setPendingUserMessage(content);
    setPendingUserAttachments(attachments);

    try {
      const response = await sendMessage.mutateAsync({
        content,
        documentUuids,
        integrationUuids,
        toolkitSlugs,
      });
      setActiveExecutionId(response.executionId);

      if (isFirstMessage) {
        window.setTimeout(() => {
          void queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
        }, 2500);
      }
    } catch {
      setPendingUserMessage(null);
      setPendingUserAttachments([]);
    }
  };

  const handleRetryMessage = (message: Message) => {
    const attachments = getMessageAttachments(message.metadata);
    void submitMessage({
      content: message.content,
      documentUuids: attachments.map((attachment) => attachment.uuid),
      integrationUuids: selectedIntegrationUuids,
      toolkitSlugs: selectedToolkitSlugs,
      attachments,
    });
  };

  const handleAddMessageToInput = (message: Message) => {
    const content =
      message.role === MessageRoles.ASSISTANT
        ? stripMarkdownForPreview(message.content)
        : message.content.trim();

    setDraftParts(content ? [{ type: 'text', value: content }] : createEmptyDraft());

    if (message.role === MessageRoles.USER) {
      const attachments = getMessageAttachments(message.metadata);
      setAttachedFiles(
        attachments.map((attachment) => ({
          id: attachment.uuid,
          uuid: attachment.uuid,
          filename: attachment.filename,
          mimetype: attachment.mimetype,
          url: attachment.url,
        })),
      );
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        draftEditorRef.current?.focusAtEnd();
      });
    });
  };

  const handleApprove = async () => {
    if (!activeExecutionId) {
      return;
    }

    const executionId = activeExecutionId;
    setActiveExecutionId(null);
    await approveExecution.mutateAsync(executionId);
    setActiveExecutionId(executionId);
  };

  const handleReject = async () => {
    if (!activeExecutionId) {
      return;
    }

    await rejectExecution.mutateAsync(activeExecutionId);
    setActiveExecutionId(null);
  };

  const handleRename = (uuid: string, title: string) => {
    void updateConversation.mutateAsync({ conversationUuid: uuid, title });
  };

  const handleDeleteRequest = (uuid: string) => {
    setDeleteTargetUuid(uuid);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetUuid) return;

    const remaining = sortedConversations.filter((c) => c.uuid !== deleteTargetUuid);
    await deleteConversation.mutateAsync(deleteTargetUuid);

    if (deleteTargetUuid === conversationUuid) {
      if (remaining.length > 0) {
        navigate(Routes.dashboard.conversation(remaining[0].uuid));
      } else {
        autoCreateStarted.current = false;
        const created = await createConversation.mutateAsync('New conversation');
        navigate(Routes.dashboard.conversation(created.uuid), { replace: true });
      }
    }

    setDeleteTargetUuid(null);
  };

  const handleDeleteMessageRequest = (message: Message) => {
    setDeleteMessageTarget(message);
  };

  const handleDeleteMessageConfirm = async () => {
    if (!deleteMessageTarget) {
      return;
    }

    await deleteMessage.mutateAsync(deleteMessageTarget.uuid);
    setDeleteMessageTarget(null);
  };

  if (!organizationUuid) {
    return (
      <div className="text-muted">
        Select an organization to start chatting.
      </div>
    );
  }

  const showCreatingState = createConversation.isPending && !conversationUuid;

  const sidebarProps = {
    conversations: sortedConversations,
    activeConversationUuid: conversationUuid,
    isCreating: createConversation.isPending,
    onSelect: handleSelectConversation,
    onCreate: () => void handleCreateConversation(),
    onRename: handleRename,
    onDelete: handleDeleteRequest,
  };

  return (
    <div className="flex h-[calc(100dvh-5.75rem)] min-h-0 flex-col overflow-hidden sm:h-[calc(100dvh-6.75rem)] md:h-[calc(100vh-8rem)] md:flex-row md:gap-4">
      {conversationsLoading ? (
        <aside
          className={cn(
            'hidden shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 ease-in-out md:flex',
            chatsPanelCollapsed ? 'w-14' : 'w-72',
          )}
        >
          {chatsPanelCollapsed ? (
            <div className="flex flex-col items-center gap-2 border-b border-border px-2 py-3">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-surface-secondary" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-surface-secondary" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-12 animate-pulse rounded bg-surface-secondary" />
                  <div className="h-3 w-20 animate-pulse rounded bg-surface-secondary" />
                </div>
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-surface-secondary" />
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-surface-secondary" />
              </div>
              <div className="flex-1 p-2">
                <ConversationSidebarSkeleton />
              </div>
            </>
          )}
        </aside>
      ) : (
        <>
          <ConversationSidebar
            {...sidebarProps}
            className="hidden md:flex"
            collapsed={chatsPanelCollapsed}
            onToggleCollapse={() => setChatsPanelCollapsed((value) => !value)}
          />

          <Drawer state={chatListDrawer}>
            <Drawer.Backdrop
              isDismissable
              className="backdrop-blur-sm md:hidden"
              style={{ background: 'color-mix(in oklch, black 30%, transparent)' }}
            />
            <Drawer.Content placement="left" className="md:hidden">
              <Drawer.Dialog
                className="flex h-full max-w-[min(100vw,20rem)] flex-col bg-surface"
                style={{
                  boxShadow: `
                    0 0 0 1px color-mix(in oklch, var(--accent) 8%, transparent),
                    4px 0 32px -4px color-mix(in oklch, black 20%, transparent)
                  `,
                }}
              >
                <Drawer.Header className="flex h-[54px] shrink-0 items-center border-b border-border px-3">
                  <span className="text-sm font-medium text-foreground">Chats</span>
                  <Drawer.CloseTrigger className="ml-auto shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground" />
                </Drawer.Header>
                <Drawer.Body className="min-h-0 flex-1 overflow-hidden p-0">
                  <ConversationSidebar
                    {...sidebarProps}
                    showHeader={false}
                    className="h-full w-full rounded-none border-0"
                  />
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer>
        </>
      )}

      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface md:rounded-2xl">
        {showCreatingState ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted">Starting a new chat…</div>
        ) : !conversationUuid ? (
          <ConversationEmptyState />
        ) : (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <ConversationHeader
              title={activeConversation?.title || 'Untitled chat'}
              onRename={(title) => handleRename(conversationUuid, title)}
              onDelete={() => handleDeleteRequest(conversationUuid)}
              onOpenDocuments={() => setDocumentsOpen(true)}
              onOpenChats={chatListDrawer.open}
              chatsPanelCollapsed={chatsPanelCollapsed}
              onToggleChatsPanel={() => setChatsPanelCollapsed((value) => !value)}
            />

            <ConversationDocumentsModal
              open={documentsOpen}
              messages={messages}
              pendingAttachments={isPendingUserMessageVisible ? pendingUserAttachments : []}
              onOpenChange={setDocumentsOpen}
            />

            <ConversationMessages
              conversationUuid={conversationUuid}
              organizationUuid={organizationUuid}
              messages={messages}
              isLoading={messagesLoading}
              pendingUserMessage={isPendingUserMessageVisible ? pendingUserMessage : null}
              pendingUserAttachments={isPendingUserMessageVisible ? pendingUserAttachments : []}
              pendingAssistantContent={pendingAssistantContent}
              showTypingIndicator={showTypingIndicator}
              showExecutionProgress={showExecutionProgress}
              isRunning={isRunning}
              toolCalls={toolCalls}
              approvalRequest={approvalRequest}
              executionError={executionError}
              isApproving={approveExecution.isPending}
              isRejecting={rejectExecution.isPending}
              onApprove={() => void handleApprove()}
              onReject={() => void handleReject()}
              isSendDisabled={isChatInputDisabled}
              onRetryMessage={handleRetryMessage}
              onAddMessageToInput={handleAddMessageToInput}
              canDeleteMessages={isSuperAdmin}
              onDeleteMessage={handleDeleteMessageRequest}
              isDeletingMessage={deleteMessage.isPending}
            />

            {!aiProvidersLoading && !hasAiProvider ? (
              <ConversationAiProviderRequired />
            ) : (
              <ConversationInput
                draftParts={draftParts}
                attachedFiles={attachedFiles}
                integrations={toolEligibleIntegrations}
                toolkits={conversationToolkits}
                selectedIntegrationUuids={selectedIntegrationUuids}
                selectedToolkitSlugs={selectedToolkitSlugs}
                disabled={isChatInputDisabled}
                isUploading={uploadDocument.isPending}
                draftEditorRef={draftEditorRef}
                onDraftPartsChange={setDraftParts}
                onSend={() => void handleSend()}
                onFileSelect={(event) => void handleFileSelect(event)}
                onRemoveFile={removeAttachedFile}
                onIntegrationSelectionChange={setSelectedIntegrationUuids}
                onToolkitSelectionChange={setSelectedToolkitSlugs}
              />
            )}
          </div>
        )}
      </section>

      <ConfirmationDialog
        open={deleteTargetUuid != null}
        title="Delete conversation?"
        description="This will permanently delete the conversation and all its messages."
        confirmLabel="Delete"
        loading={deleteConversation.isPending}
        onConfirm={() => void handleDeleteConfirm()}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetUuid(null);
        }}
      />

      <ConfirmationDialog
        open={deleteMessageTarget != null}
        title="Delete message?"
        description="This will permanently delete the message and any attached files that are not used elsewhere in the conversation."
        confirmLabel="Delete"
        loading={deleteMessage.isPending}
        onConfirm={() => void handleDeleteMessageConfirm()}
        onOpenChange={(open) => {
          if (!open) setDeleteMessageTarget(null);
        }}
      />
    </div>
  );
};

export default ConversationsPage;
