import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Drawer, useOverlayState } from '@heroui/react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useOrganizationStore } from '@/stores/organization';
import { Routes } from '@/routes/routes';
import { useGetIntegrations } from '@/features/integrations/common/hooks/use-integrations';
import { useGetAiProviders } from '@/features/ai-providers/hooks/use-ai-providers';
import {
  aiProviderDefaultModels,
  AiResearchModes,
  type AiResearchMode,
} from '@/features/integrations/constants/provider-metadata';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
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
  useResolveConnectionTiers,
  useResolveUserChoice,
  useCancelUserChoice,
  useSendMessage,
  useUpdateConversation,
  conversationsQueryKey,
} from '@/features/conversations/hooks/use-conversations';
import { useExecution } from '@/features/conversations/hooks/use-execution';
import { useCreateAgent } from '@/features/agents/hooks/use-agents';
import type { AgentFormValues } from '@/features/agents/validation-schemas/agent.schema';
import {
  useCreateSavedPrompt,
  useUpdateSavedPrompt,
} from '@/features/saved-prompts/hooks/use-saved-prompts';
import type { SavedPrompt } from '@/features/saved-prompts/interfaces/saved-prompts.interfaces';
import type { SavedPromptFormValues } from '@/features/saved-prompts/validation-schemas/saved-prompt.schema';
import { MessageRoles, ConversationKinds, type Message, type MessageAttachment } from '@/features/conversations/interfaces/conversation.interfaces';
import { useUploadDocument } from '@/features/files/hooks/use-files';
import { cn } from '@/lib/utils';
import { ConversationEmptyState } from './components/shared/conversation-empty-state';
import { ConversationAiProviderRequired } from './components/shared/conversation-ai-provider-required';
import { ConversationDocumentsModal, libraryTabs, type LibraryTabKey } from './components/shared/conversation-documents-modal';
import { SavedPromptFormModal } from './components/shared/saved-prompt-form-modal';
import { ConversationHeader } from './components/shared/conversation-header';
import { ConversationInput, type AttachedFile } from './components/input/conversation-input';
import { getToolEligibleIntegrations } from './components/input/integration-tools-list';
import {
  createEmptyDraft,
  draftPartsToPlainText,
  getDraftIntegrationUuids,
  getDraftToolkitBindings,
  plainTextToDraftParts,
  type ConversationDraftEditorHandle,
  type DraftPart,
} from './components/input/conversation-draft-editor';
import {
  getAutoSelectableToolkitBindings,
  mapConversationAgentToolkitToIntegrationAppsToolkit,
} from './components/input/conversation-tool-items.utils';
import {
  type ToolkitBinding,
} from './utils/conversation-toolkit-bindings.utils';
import { ConversationMessages } from './components/messages/conversation-messages';
import { getMessageAttachments } from './components/messages/message-attachments';
import { ConversationSidebar } from './components/sidebar/conversation-sidebar';
import { ConversationSidebarSkeleton } from './components/sidebar/conversation-sidebar-skeleton';
import {
  CONVERSATIONS_SIDEBAR_STORAGE_KEY,
  getInitialConversationsSidebarCollapsed,
} from './utils/conversations-sidebar.utils';
import {
  buildMessageWithReply,
  createReplyTargetFromMessage,
  type ConversationReplyTarget,
} from './utils/conversation-reply.utils';
import { AgentModal } from '@/pages/agents/components/agent-modal';
import { toast } from '@/hooks/use-toast';

const ConversationsPage: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { conversationUuid } = useParams<{ conversationUuid?: string }>();
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const [draftParts, setDraftParts] = useState<DraftPart[]>(() => createEmptyDraft());
  const [replyTarget, setReplyTarget] = useState<ConversationReplyTarget | null>(null);
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [selectedIntegrationUuids, setSelectedIntegrationUuids] = useState<string[]>([]);
  const [selectedToolkitBindings, setSelectedToolkitBindings] = useState<ToolkitBinding[]>([]);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [pendingUserAttachments, setPendingUserAttachments] = useState<MessageAttachment[]>([]);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [deleteMessageTarget, setDeleteMessageTarget] = useState<Message | null>(null);
  const [createAgentMessage, setCreateAgentMessage] = useState<Message | null>(null);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [libraryInitialTab, setLibraryInitialTab] = useState<LibraryTabKey>(libraryTabs.documents);
  const [promptFormState, setPromptFormState] = useState<{
    mode: 'create' | 'edit';
    initialValues?: Partial<SavedPromptFormValues>;
    formKey?: string;
    editingPromptUuid?: string;
  } | null>(null);
  const [chatsPanelCollapsed, setChatsPanelCollapsed] = useState(getInitialConversationsSidebarCollapsed);
  const autoCreateStarted = useRef(false);
  const draftEditorRef = useRef<ConversationDraftEditorHandle>(null);
  const chatListDrawer = useOverlayState();

  const { data: conversations = [], isLoading: conversationsLoading } = useGetConversations(organizationUuid);
  const { data: integrations = [] } = useGetIntegrations(organizationUuid);
  const { data: agentTools } = useGetConversationAgentTools(organizationUuid);
  const { data: aiProviders = [], isLoading: aiProvidersLoading } = useGetAiProviders(organizationUuid);
  const conversationToolkits = useMemo<IntegrationAppsToolkit[]>(
    () => (agentTools?.toolkits ?? []).map(mapConversationAgentToolkitToIntegrationAppsToolkit),
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
  const resolveConnectionTiers = useResolveConnectionTiers(organizationUuid);
  const resolveUserChoice = useResolveUserChoice(organizationUuid);
  const cancelUserChoice = useCancelUserChoice(organizationUuid);
  const uploadDocument = useUploadDocument(organizationUuid);
  const createAgent = useCreateAgent(organizationUuid);
  const createSavedPrompt = useCreateSavedPrompt(organizationUuid);
  const updateSavedPrompt = useUpdateSavedPrompt(organizationUuid);

  const execution = useExecution(organizationUuid, conversationUuid, activeExecutionId);
  const {
    isComplete,
    reset: resetExecution,
    assistantContent,
    isRunning,
    toolCalls,
    approvalRequest,
    connectionTierRequest,
    userChoiceRequest,
    error: executionError,
  } = execution;

  const activeConversation = useMemo(
    () => conversations.find((c) => c.uuid === conversationUuid),
    [conversations, conversationUuid],
  );

  const isAgentConversation =
    activeConversation?.kind === ConversationKinds.SCHEDULED_AGENT;

  const defaultConnectedProvider = useMemo(
    () =>
      aiProviders.find((provider) => provider.is_default && provider.has_api_key) ??
      aiProviders.find((provider) => provider.has_api_key),
    [aiProviders],
  );
  const selectedProvider = activeConversation?.ai_provider ?? defaultConnectedProvider?.provider ?? null;
  const selectedModel =
    activeConversation?.ai_model ??
    (defaultConnectedProvider
      ? defaultConnectedProvider.default_model ||
        aiProviderDefaultModels[defaultConnectedProvider.provider as AiProviderType]
      : null);
  const selectedResearchMode =
    (activeConversation?.ai_research_mode as AiResearchMode | null | undefined) ??
    AiResearchModes.DEFAULT;

  const handleModelSelect = (provider: AiProviderType, model: string) => {
    if (!conversationUuid) {
      return;
    }
    void updateConversation.mutateAsync({
      conversationUuid,
      ai_provider: provider,
      ai_model: model,
    });
  };

  const handleResearchModeChange = (mode: AiResearchMode) => {
    if (!conversationUuid) {
      return;
    }
    void updateConversation.mutateAsync({
      conversationUuid,
      ai_research_mode: mode,
    });
  };

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
  const autoSelectableToolkitBindings = useMemo(
    () => getAutoSelectableToolkitBindings(conversationToolkits),
    [conversationToolkits],
  );

  const toolEligibleIntegrationUuidsRef = useRef<string[]>([]);
  const autoSelectableToolkitBindingsRef = useRef<ToolkitBinding[]>([]);

  useEffect(() => {
    setReplyTarget(null);
    setDraftParts(createEmptyDraft());
    setAttachedFiles([]);
  }, [conversationUuid]);

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
    const previousEligible = autoSelectableToolkitBindingsRef.current;
    const currentEligible = autoSelectableToolkitBindings;

    setSelectedToolkitBindings((prev) => {
      const availableKeys = new Set(
        currentEligible.map((binding) => `${binding.slug}:${binding.connectionTier}`),
      );

      if (prev.length === 0) {
        return currentEligible;
      }

      const kept = prev.filter((binding) =>
        availableKeys.has(`${binding.slug}:${binding.connectionTier}`),
      );
      const previousKeys = new Set(
        previousEligible.map((binding) => `${binding.slug}:${binding.connectionTier}`),
      );
      const newlyEligible = currentEligible.filter(
        (binding) => !previousKeys.has(`${binding.slug}:${binding.connectionTier}`),
      );

      return [...kept, ...newlyEligible];
    });

    autoSelectableToolkitBindingsRef.current = currentEligible;
  }, [autoSelectableToolkitBindings]);

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
    if (!isComplete || !conversationUuid || !organizationUuid || approvalRequest || connectionTierRequest || userChoiceRequest) {
      return;
    }

    void queryClient.invalidateQueries({ queryKey: ['messages', organizationUuid, conversationUuid] });
    void queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
    resetExecution();
    setActiveExecutionId(null);
  }, [isComplete, approvalRequest, connectionTierRequest, userChoiceRequest, conversationUuid, organizationUuid, queryClient, resetExecution]);

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
    !connectionTierRequest &&
    !userChoiceRequest &&
    pendingAssistantContent == null &&
    (isPendingUserMessageVisible || (activeExecutionId != null && !sendMessage.isPending));

  const showExecutionProgress =
    (sendMessage.isPending || isRunning || approvalRequest != null || connectionTierRequest != null || userChoiceRequest != null) &&
    pendingAssistantContent == null;

  const hasAiProvider = aiProviders.length > 0;
  const isChatInputDisabled = sendMessage.isPending || isRunning || userChoiceRequest != null || !hasAiProvider;

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
    const userContent = draftPartsToPlainText(draftParts);
    const content = buildMessageWithReply(userContent, replyTarget);
    const draftIntegrationUuids = getDraftIntegrationUuids(draftParts);
    const draftToolkitBindings = getDraftToolkitBindings(draftParts);
    if (!content || !conversationUuid || !hasAiProvider) {
      return;
    }
    const integrationUuids = [
      ...new Set([...selectedIntegrationUuids, ...draftIntegrationUuids]),
    ];
    const toolkitBindingMap = new Map<string, ToolkitBinding>();
    const effectiveToolkitBindings =
      selectedToolkitBindings.length > 0 || draftToolkitBindings.length > 0
        ? [...selectedToolkitBindings, ...draftToolkitBindings]
        : autoSelectableToolkitBindings;
    for (const binding of effectiveToolkitBindings) {
      toolkitBindingMap.set(binding.slug, binding);
    }
    const toolkitBindings = [...toolkitBindingMap.values()];
    const toolkitSlugs = [...new Set(toolkitBindings.map((binding) => binding.slug))];
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

    const sent = await submitMessage({
      content,
      documentUuids,
      integrationUuids,
      toolkitSlugs,
      attachments: sentAttachments,
      isFirstMessage,
    });

    if (sent) {
      setDraftParts(createEmptyDraft());
      setAttachedFiles([]);
      setReplyTarget(null);
    }
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
  }): Promise<boolean> => {
    if (!conversationUuid) {
      return false;
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

      return true;
    } catch {
      setPendingUserMessage(null);
      setPendingUserAttachments([]);
      return false;
    }
  };

  const handleRetryMessage = (message: Message) => {
    const attachments = getMessageAttachments(message.metadata);
    void submitMessage({
      content: message.content,
      documentUuids: attachments.map((attachment) => attachment.uuid),
      integrationUuids: selectedIntegrationUuids,
      toolkitSlugs: selectedToolkitBindings.map((binding) => binding.slug),
      attachments,
    });
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyTarget(createReplyTargetFromMessage(message));

    window.requestAnimationFrame(() => {
      draftEditorRef.current?.focus();
    });
  };

  const handleCreateAgentFromMessage = (message: Message) => {
    setCreateAgentMessage(message);
  };

  const handleCreateAgentFromPrompt = (prompt: SavedPrompt) => {
    setDocumentsOpen(false);
    setCreateAgentMessage({
      uuid: prompt.uuid,
      content: prompt.content,
    } as Message);
  };

  const handleCreateAgentSubmit = (values: AgentFormValues) => {
    createAgent.mutate(values, {
      onSuccess: () => setCreateAgentMessage(null),
    });
  };

  const handleOpenDocuments = () => {
    setLibraryInitialTab(libraryTabs.documents);
    setDocumentsOpen(true);
  };

  const handleCreatePrompt = () => {
    setPromptFormState({ mode: 'create' });
  };

  const handleEditPrompt = (prompt: SavedPrompt) => {
    setPromptFormState({
      mode: 'edit',
      initialValues: { title: prompt.title, content: prompt.content },
      formKey: prompt.uuid,
      editingPromptUuid: prompt.uuid,
    });
  };

  const handleSavePromptFromMessage = (message: Message) => {
    setPromptFormState({
      mode: 'create',
      initialValues: { content: message.content ?? '' },
      formKey: message.uuid,
    });
  };

  const handleUsePrompt = (prompt: SavedPrompt) => {
    setDraftParts(plainTextToDraftParts(prompt.content));
    setDocumentsOpen(false);
    window.requestAnimationFrame(() => {
      draftEditorRef.current?.focus();
    });
    toast({
      title: 'Prompt inserted',
      description: 'The saved prompt was added to your message draft.',
      duration: 2000,
    });
  };

  const handlePromptFormSubmit = (values: SavedPromptFormValues) => {
    if (!promptFormState) return;

    if (promptFormState.mode === 'edit' && promptFormState.editingPromptUuid) {
      updateSavedPrompt.mutate(
        { promptUuid: promptFormState.editingPromptUuid, payload: values },
        { onSuccess: () => setPromptFormState(null) },
      );
      return;
    }

    createSavedPrompt.mutate(values, {
      onSuccess: () => {
        setPromptFormState(null);
        setLibraryInitialTab(libraryTabs.prompts);
        setDocumentsOpen(true);
      },
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

  const handleSubmitUserChoice = async (selectedIds: string[]) => {
    const executionId = userChoiceRequest?.executionId ?? activeExecutionId;
    if (!executionId) {
      return;
    }

    await resolveUserChoice.mutateAsync({ executionUuid: executionId, selectedIds });
  };

  const handleCancelUserChoice = async () => {
    const executionId = userChoiceRequest?.executionId ?? activeExecutionId;
    if (!executionId) {
      return;
    }

    await cancelUserChoice.mutateAsync(executionId);
  };

  const handleResolveConnectionTiers = async (
    choices: Record<string, IntegrationAppsToolkit['connection_tiers'][number]>,
  ) => {
    if (!activeExecutionId) {
      return;
    }

    const executionId = activeExecutionId;
    setActiveExecutionId(null);
    await resolveConnectionTiers.mutateAsync({ executionUuid: executionId, choices });
    setActiveExecutionId(executionId);
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
              title={activeConversation?.title ?? ''}
              isTitleLoading={conversationsLoading && !!conversationUuid && !activeConversation}
              readOnly={isAgentConversation}
              onRename={(title) => handleRename(conversationUuid, title)}
              onDelete={() => handleDeleteRequest(conversationUuid)}
              onOpenDocuments={handleOpenDocuments}
              onOpenChats={chatListDrawer.open}
              chatsPanelCollapsed={chatsPanelCollapsed}
              onToggleChatsPanel={() => setChatsPanelCollapsed((value) => !value)}
            />

            <ConversationDocumentsModal
              open={documentsOpen}
              orgUuid={organizationUuid ?? ''}
              conversationUuid={conversationUuid ?? ''}
              pendingAttachments={isPendingUserMessageVisible ? pendingUserAttachments : []}
              initialTab={libraryInitialTab}
              onOpenChange={setDocumentsOpen}
              onCreatePrompt={handleCreatePrompt}
              onEditPrompt={handleEditPrompt}
              onUsePrompt={handleUsePrompt}
              onCreateAgentFromPrompt={handleCreateAgentFromPrompt}
            />

            {isAgentConversation ? (
              <div className="border-b border-border bg-violet-500/5 px-3 py-2 text-xs text-muted md:px-4">
                Agent conversation — runs automatically on cron. You can view results and approve tool actions, but cannot send messages here.
              </div>
            ) : null}

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
              connectionTierRequest={connectionTierRequest}
              userChoiceRequest={userChoiceRequest}
              executionError={executionError}
              isApproving={approveExecution.isPending}
              isRejecting={rejectExecution.isPending}
              isResolvingConnectionTiers={resolveConnectionTiers.isPending}
              isSubmittingUserChoice={resolveUserChoice.isPending}
              isCancellingUserChoice={cancelUserChoice.isPending}
              onApprove={() => void handleApprove()}
              onReject={() => void handleReject()}
              onResolveConnectionTiers={(choices) => void handleResolveConnectionTiers(choices)}
              onSubmitUserChoice={(selectedIds) => void handleSubmitUserChoice(selectedIds)}
              onCancelUserChoice={() => void handleCancelUserChoice()}
              isSendDisabled={isChatInputDisabled}
              onRetryMessage={handleRetryMessage}
              onReplyToMessage={handleReplyToMessage}
              onCreateAgentFromMessage={handleCreateAgentFromMessage}
              onSavePromptFromMessage={handleSavePromptFromMessage}
              onDeleteMessage={handleDeleteMessageRequest}
              isDeletingMessage={deleteMessage.isPending}
              readOnly={isAgentConversation}
            />

            {!isAgentConversation && !aiProvidersLoading && !hasAiProvider ? (
              <ConversationAiProviderRequired />
            ) : !isAgentConversation ? (
              <ConversationInput
                draftParts={draftParts}
                attachedFiles={attachedFiles}
                replyTarget={replyTarget}
                integrations={toolEligibleIntegrations}
                toolkits={conversationToolkits}
                selectedIntegrationUuids={selectedIntegrationUuids}
                selectedToolkitBindings={selectedToolkitBindings}
                aiProviders={aiProviders}
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                selectedResearchMode={selectedResearchMode}
                disabled={isChatInputDisabled}
                isUploading={uploadDocument.isPending}
                draftEditorRef={draftEditorRef}
                onDraftPartsChange={setDraftParts}
                onDismissReply={() => setReplyTarget(null)}
                onSend={() => void handleSend()}
                onFileSelect={(event) => void handleFileSelect(event)}
                onRemoveFile={removeAttachedFile}
                onIntegrationSelectionChange={setSelectedIntegrationUuids}
                onToolkitSelectionChange={setSelectedToolkitBindings}
                onModelSelect={handleModelSelect}
                onResearchModeChange={handleResearchModeChange}
              />
            ) : null}
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

      {createAgentMessage ? (
        <AgentModal
          mode="create"
          formKey={createAgentMessage.uuid}
          initialValues={{ prompt: createAgentMessage.content ?? '' }}
          isSubmitting={createAgent.isPending}
          onClose={() => setCreateAgentMessage(null)}
          onSubmit={handleCreateAgentSubmit}
        />
      ) : null}

      {promptFormState ? (
        <SavedPromptFormModal
          mode={promptFormState.mode}
          formKey={promptFormState.formKey}
          initialValues={promptFormState.initialValues}
          isSubmitting={createSavedPrompt.isPending || updateSavedPrompt.isPending}
          onClose={() => setPromptFormState(null)}
          onSubmit={handlePromptFormSubmit}
        />
      ) : null}
    </div>
  );
};

export default ConversationsPage;
