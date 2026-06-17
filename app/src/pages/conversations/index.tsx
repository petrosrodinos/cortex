import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageSquarePlus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useOrganizationStore } from '@/stores/organization';
import { Routes } from '@/routes/routes';
import {
  useApproveExecution,
  useCreateConversation,
  useGetConversations,
  useGetMessages,
  useRejectExecution,
  useSendMessage,
} from '@/features/conversations/hooks/use-conversations';
import { useExecution } from '@/features/conversations/hooks/use-execution';
import { MessageRoles } from '@/features/conversations/interfaces/conversation.interfaces';
import { cn } from '@/lib/utils';

const ConversationsPage: FC = () => {
  const navigate = useNavigate();
  const { conversationUuid } = useParams<{ conversationUuid?: string }>();
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const [draft, setDraft] = useState('');
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);

  const { data: conversations = [], isLoading: conversationsLoading } = useGetConversations(organizationUuid);
  const { data: messages = [], refetch: refetchMessages } = useGetMessages(organizationUuid, conversationUuid);
  const createConversation = useCreateConversation(organizationUuid);
  const sendMessage = useSendMessage(organizationUuid, conversationUuid);
  const approveExecution = useApproveExecution(organizationUuid);
  const rejectExecution = useRejectExecution(organizationUuid);

  const execution = useExecution(organizationUuid, activeExecutionId);

  useEffect(() => {
    if (execution.assistantContent && conversationUuid) {
      void refetchMessages();
      setActiveExecutionId(null);
    }
  }, [execution.assistantContent, conversationUuid, refetchMessages]);

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [conversations],
  );

  const handleCreateConversation = async () => {
    const created = await createConversation.mutateAsync('New conversation');
    navigate(Routes.dashboard.conversation(created.uuid));
  };

  const handleSend = async () => {
    if (!draft.trim() || !conversationUuid) {
      return;
    }

    const content = draft.trim();
    setDraft('');
    const response = await sendMessage.mutateAsync(content);
    setActiveExecutionId(response.executionId);
  };

  const handleApprove = async () => {
    if (!activeExecutionId) {
      return;
    }

    await approveExecution.mutateAsync(activeExecutionId);
    setActiveExecutionId(activeExecutionId);
    execution.reset();
  };

  const handleReject = async () => {
    if (!activeExecutionId) {
      return;
    }

    await rejectExecution.mutateAsync(activeExecutionId);
    setActiveExecutionId(null);
  };

  if (!organizationUuid) {
    return (
      <div className="text-muted">
        Select an organization to start chatting.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <aside className="w-72 shrink-0 flex flex-col gap-3">
        <Button onClick={handleCreateConversation} disabled={createConversation.isPending} className="w-full">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-1">
          {conversationsLoading && <p className="text-sm text-muted">Loading...</p>}
          {sortedConversations.map((conversation) => (
            <button
              key={conversation.uuid}
              type="button"
              onClick={() => navigate(Routes.dashboard.conversation(conversation.uuid))}
              className={cn(
                'w-full rounded-xl px-3 py-2 text-left text-sm transition-colors',
                conversation.uuid === conversationUuid
                  ? 'bg-surface-secondary text-foreground'
                  : 'text-muted hover:bg-surface-secondary hover:text-foreground',
              )}
            >
              <p className="truncate font-medium">{conversation.title || 'Untitled chat'}</p>
              <p className="truncate text-xs opacity-70">
                {conversation.messages?.[0]?.content || 'No messages yet'}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-surface">
        {!conversationUuid ? (
          <div className="flex flex-1 items-center justify-center text-muted">
            Choose or create a conversation to begin.
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.uuid}
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap',
                    message.role === MessageRoles.USER
                      ? 'ml-auto bg-accent/15 text-foreground'
                      : 'mr-auto bg-surface-secondary text-foreground',
                  )}
                >
                  {message.content}
                </div>
              ))}

              {execution.isRunning && (
                <Card className="mr-auto max-w-[85%] border-dashed p-4">
                  <p className="mb-3 text-sm font-medium">Agent is working...</p>
                  <div className="space-y-2">
                    {execution.toolCalls.map((tool, index) => (
                      <div key={`${tool.toolName}-${index}`} className="rounded-lg border border-border px-3 py-2 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{tool.toolName}</span>
                          <span className="text-xs text-muted capitalize">{tool.status}</span>
                        </div>
                        {tool.durationMs != null && (
                          <p className="mt-1 text-xs text-muted">{tool.durationMs}ms</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {execution.approvalRequest && (
                <Card className="mr-auto max-w-[85%] border-amber-500/30 bg-amber-500/5 p-4">
                  <p className="font-medium">Approval required</p>
                  <p className="mt-1 text-sm text-muted">
                    Tool <span className="font-mono">{execution.approvalRequest.toolName}</span> wants to run with sensitive input.
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-surface-secondary p-3 text-xs">
                    {JSON.stringify(execution.approvalRequest.input, null, 2)}
                  </pre>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleApprove} disabled={approveExecution.isPending}>
                      Approve
                    </Button>
                    <Button variant="outline" onClick={handleReject} disabled={rejectExecution.isPending}>
                      Reject
                    </Button>
                  </div>
                </Card>
              )}

              {execution.error && (
                <Card className="mr-auto max-w-[85%] border-red-500/30 bg-red-500/5 p-4 text-sm text-red-500">
                  {execution.error}
                </Card>
              )}
            </div>

            <div className="border-t border-border p-4">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSend();
                }}
              >
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask Cortex anything..."
                  disabled={sendMessage.isPending || execution.isRunning}
                />
                <Button type="submit" disabled={!draft.trim() || sendMessage.isPending || execution.isRunning}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default ConversationsPage;
