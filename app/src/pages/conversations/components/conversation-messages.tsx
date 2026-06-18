import { useEffect, useRef, type FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Message } from '@/features/conversations/interfaces/conversation.interfaces';
import { MessageRoles } from '@/features/conversations/interfaces/conversation.interfaces';
import { cn } from '@/lib/utils';
import { AiTypingIndicator } from './ai-typing-indicator';
import { ConversationMessagesSkeleton } from './conversation-messages-skeleton';
import { ConversationNoMessagesState } from './conversation-no-messages-state';

interface ConversationMessagesProps {
  conversationUuid: string;
  messages: Message[];
  isLoading: boolean;
  pendingUserMessage: string | null;
  pendingAssistantContent: string | null;
  showTypingIndicator: boolean;
  toolCalls: Array<{ toolName: string; status: string }>;
  approvalRequest: { toolName?: string; input?: unknown } | null;
  executionError: string | null;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export const ConversationMessages: FC<ConversationMessagesProps> = ({
  conversationUuid,
  messages,
  isLoading,
  pendingUserMessage,
  pendingAssistantContent,
  showTypingIndicator,
  toolCalls,
  approvalRequest,
  executionError,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom('auto');
    }
  }, [conversationUuid, isLoading]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, pendingUserMessage, pendingAssistantContent, showTypingIndicator, approvalRequest, executionError]);

  if (isLoading) {
    return <ConversationMessagesSkeleton />;
  }

  const hasMessages =
    messages.length > 0 ||
    pendingUserMessage != null ||
    pendingAssistantContent != null ||
    showTypingIndicator ||
    approvalRequest != null ||
    executionError != null;

  if (!hasMessages) {
    return <ConversationNoMessagesState />;
  }

  return (
    <div ref={scrollContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.uuid}
          className={cn(
            'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
            message.role === MessageRoles.USER
              ? 'ml-auto bg-accent/15 text-foreground whitespace-pre-wrap'
              : 'mr-auto bg-surface-secondary text-foreground',
          )}
        >
          {message.role === MessageRoles.ASSISTANT ? (
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{message.content}</ReactMarkdown>
            </div>
          ) : (
            message.content
          )}

          {message.role === MessageRoles.ASSISTANT && message.metadata && (() => {
            const meta = message.metadata as { outputType?: string; files?: string[] };
            const outputType = meta.outputType;
            const files = meta.files ?? [];

            if (
              (outputType === 'FILE_PDF' || outputType === 'FILE_EXCEL' || outputType === 'FILE_WORD') &&
              files.length > 0
            ) {
              return (
                <div className="mt-3 flex flex-col gap-2">
                  {files.map((fileUrl, i) => {
                    const filename = fileUrl.split('/').pop() ?? `file-${i + 1}`;
                    return (
                      <a
                        key={fileUrl}
                        href={fileUrl}
                        download={filename}
                        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-accent hover:underline"
                      >
                        <span>📄</span>
                        <span className="truncate">{filename}</span>
                      </a>
                    );
                  })}
                </div>
              );
            }

            if (outputType === 'CHART' && files.length > 0) {
              return (
                <div className="mt-3">
                  <img
                    src={files[0]}
                    alt="Generated visual"
                    className="max-h-64 max-w-[240px] w-auto rounded-lg object-contain"
                  />
                </div>
              );
            }

            if (outputType === 'WIDGET' && files.length > 0) {
              return (
                <div className="mt-3">
                  <iframe
                    src={files[0]}
                    sandbox="allow-scripts"
                    className="h-64 w-full rounded-lg border border-border"
                    title="widget"
                  />
                </div>
              );
            }

            return null;
          })()}
        </div>
      ))}

      {pendingUserMessage && (
        <div className="ml-auto max-w-[85%] rounded-2xl bg-accent/15 px-4 py-3 text-sm text-foreground whitespace-pre-wrap">
          {pendingUserMessage}
        </div>
      )}

      {pendingAssistantContent != null && (
        <div className="mr-auto max-w-[85%] rounded-2xl bg-surface-secondary px-4 py-3 text-sm text-foreground">
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{pendingAssistantContent}</ReactMarkdown>
          </div>
        </div>
      )}

      {showTypingIndicator && (
        <div className="mr-auto flex w-fit flex-col gap-2">
          <div className="rounded-2xl bg-surface-secondary px-3 py-2.5">
            <AiTypingIndicator />
          </div>
          {toolCalls.length > 0 && (
            <div className="max-w-[85%] space-y-1">
              {toolCalls.map((tool, index) => (
                <p key={`${tool.toolName}-${index}`} className="text-xs text-muted">
                  {tool.toolName}
                  <span className="ml-1.5 capitalize opacity-70">{tool.status}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {approvalRequest && (
        <Card className="mr-auto max-w-[85%] border-amber-500/30 bg-amber-500/5 p-4">
          <p className="font-medium">Approval required</p>
          <p className="mt-1 text-sm text-muted">
            Tool <span className="font-mono">{approvalRequest.toolName}</span> wants to run with sensitive input.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-surface-secondary p-3 text-xs">
            {JSON.stringify(approvalRequest.input, null, 2)}
          </pre>
          <div className="mt-4 flex gap-2">
            <Button onClick={onApprove} disabled={isApproving} className="w-auto">
              Approve
            </Button>
            <Button variant="outline" onClick={onReject} disabled={isRejecting} className="w-auto">
              Reject
            </Button>
          </div>
        </Card>
      )}

      {executionError && (
        <Card className="mr-auto max-w-[85%] border-red-500/30 bg-red-500/5 p-4 text-sm text-red-500">
          {executionError}
        </Card>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
