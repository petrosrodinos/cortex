import { useEffect, useRef, type FC } from 'react';
import { Card } from '@/components/ui/card';
import type {
  ExecutionApprovalRequest,
  Message,
  MessageAttachment,
  ToolCallProgress,
} from '@/features/conversations/interfaces/conversation.interfaces';
import { MessageRoles } from '@/features/conversations/interfaces/conversation.interfaces';
import { formatDateTime } from '@/lib/date';
import { cn } from '@/lib/utils';
import { ConversationMessagesSkeleton } from './conversation-messages-skeleton';
import { ConversationNoMessagesState } from './conversation-no-messages-state';
import { getMessageAttachments, MessageAttachments } from './message-attachments';
import { ExecutionApprovalCard } from './execution-approval-card';
import { ExecutionProgress } from './execution-progress';
import { MessageCopyButton } from './message-copy-button';
import { MessageRetryButton } from './message-retry-button';
import { MessageMarkdown } from '@/components/markdown/message-markdown';
import { prepareAssistantMarkdown, getFilePreviewUrl } from '@/lib/message-markdown.utils';
import { WidgetPreview } from './widget-preview';

const messageBubbleClassName = 'min-w-0 max-w-[min(92%,100%)] rounded-2xl px-3 py-2.5 text-sm sm:max-w-[85%] sm:px-4 sm:py-3';

interface ConversationMessagesProps {
  conversationUuid: string;
  organizationUuid?: string;
  messages: Message[];
  isLoading: boolean;
  pendingUserMessage: string | null;
  pendingUserAttachments: MessageAttachment[];
  pendingAssistantContent: string | null;
  showTypingIndicator: boolean;
  showExecutionProgress: boolean;
  isRunning: boolean;
  toolCalls: ToolCallProgress[];
  approvalRequest: ExecutionApprovalRequest | null;
  executionError: string | null;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
  isSendDisabled: boolean;
  onRetryMessage: (message: Message) => void;
}

export const ConversationMessages: FC<ConversationMessagesProps> = ({
  conversationUuid,
  organizationUuid,
  messages,
  isLoading,
  pendingUserMessage,
  pendingUserAttachments,
  pendingAssistantContent,
  showTypingIndicator,
  showExecutionProgress,
  isRunning,
  toolCalls,
  approvalRequest,
  executionError,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  isSendDisabled,
  onRetryMessage,
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
  }, [messages, pendingUserMessage, pendingUserAttachments, pendingAssistantContent, showTypingIndicator, showExecutionProgress, toolCalls, approvalRequest, executionError]);

  if (isLoading) {
    return <ConversationMessagesSkeleton />;
  }

  const hasMessages =
    messages.length > 0 ||
    pendingUserMessage != null ||
    pendingAssistantContent != null ||
    showTypingIndicator ||
    showExecutionProgress ||
    approvalRequest != null ||
    executionError != null;

  if (!hasMessages) {
    return <ConversationNoMessagesState />;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
    >
      <div className="space-y-4 p-3 md:p-4">
      {messages.map((message) => (
        <div
          key={message.uuid}
          className={cn(
            'flex flex-col gap-1',
            message.role === MessageRoles.USER ? 'items-end' : 'items-start',
          )}
        >
          <div
            className={cn(
              messageBubbleClassName,
              message.role === MessageRoles.USER
                ? 'ml-auto overflow-hidden break-words bg-accent/15 text-foreground whitespace-pre-wrap [overflow-wrap:anywhere]'
                : 'mr-auto w-full overflow-x-auto bg-surface-secondary text-foreground',
            )}
          >
          <div className="flex items-start gap-1">
            <div className="min-w-0 flex-1">
              {message.role === MessageRoles.ASSISTANT ? (
                <MessageMarkdown
                  content={prepareAssistantMarkdown(
                    message.content,
                    (message.metadata as { files?: string[] } | null | undefined)?.files ?? [],
                  )}
                />
              ) : (
                <>
                  {message.content}
                  {message.role === MessageRoles.USER && (
                    <MessageAttachments attachments={getMessageAttachments(message.metadata)} />
                  )}
                </>
              )}
            </div>
            <div className="mt-0.5 flex shrink-0 items-start gap-0.5">
              {message.role === MessageRoles.USER && (
                <MessageRetryButton
                  disabled={isSendDisabled}
                  onRetry={() => onRetryMessage(message)}
                />
              )}
              <MessageCopyButton content={message.content} />
            </div>
          </div>

          {message.role === MessageRoles.ASSISTANT && message.metadata && (() => {
            const meta = message.metadata as {
              outputType?: string;
              files?: string[];
              generatedDocuments?: Array<{ document_uuid?: string; file_url?: string }>;
            };
            const outputType = meta.outputType;
            const files = meta.files ?? [];
            const widgetDocument =
              meta.generatedDocuments?.find((doc) => doc.file_url && files.includes(doc.file_url)) ??
              meta.generatedDocuments?.find((doc) => doc.document_uuid);
            const widgetDocumentUuid = widgetDocument?.document_uuid;

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
                        href={getFilePreviewUrl(fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
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
                    className="max-h-64 w-full max-w-full rounded-lg object-contain sm:max-w-[240px] sm:w-auto"
                  />
                </div>
              );
            }

            if (outputType === 'WIDGET' && files.length > 0) {
              return (
                <WidgetPreview
                  fileUrl={files[0]}
                  organizationUuid={organizationUuid}
                  documentUuid={widgetDocumentUuid}
                  title="Interactive widget"
                />
              );
            }

            return null;
          })()}
          </div>
          <time dateTime={message.created_at} className="px-1 text-xs text-muted">
            {formatDateTime(message.created_at)}
          </time>
        </div>
      ))}

      {pendingUserMessage && (
        <div className={cn(messageBubbleClassName, 'ml-auto overflow-hidden break-words bg-accent/15 text-foreground whitespace-pre-wrap [overflow-wrap:anywhere]')}>
          {pendingUserMessage}
          <MessageAttachments attachments={pendingUserAttachments} />
        </div>
      )}

      {pendingAssistantContent != null && (
        <div className={cn(messageBubbleClassName, 'mr-auto w-full overflow-x-auto bg-surface-secondary text-foreground')}>
          <MessageMarkdown content={prepareAssistantMarkdown(pendingAssistantContent)} />
        </div>
      )}

      {showExecutionProgress && <ExecutionProgress toolCalls={toolCalls} isRunning={isRunning} />}

      {approvalRequest && (
        <ExecutionApprovalCard
          approvalRequest={approvalRequest}
          isApproving={isApproving}
          isRejecting={isRejecting}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}

      {executionError && (
        <Card className={cn(messageBubbleClassName, 'mr-auto w-full border-red-500/30 bg-red-500/5 text-red-500 sm:p-4')}>
          {executionError}
        </Card>
      )}

      <div ref={bottomRef} />
      </div>
    </div>
  );
};
