import { useState, type FC } from 'react';
import { Check, ChevronRight, Loader2, X } from 'lucide-react';
import type { ToolCallProgress } from '@/features/conversations/interfaces/conversation.interfaces';
import { formatToolName } from '@/features/conversations/utils/agent-progress-labels';
import { cn } from '@/lib/utils';
import { AiTypingIndicator } from './ai-typing-indicator';

interface ExecutionProgressProps {
  toolCalls: ToolCallProgress[];
  isRunning: boolean;
  className?: string;
}

function ToolCallStatusIcon({ status }: { status: ToolCallProgress['status'] }) {
  if (status === 'running') {
    return <Loader2 className="size-3 shrink-0 animate-spin text-muted" aria-hidden />;
  }

  if (status === 'failed') {
    return <X className="size-3 shrink-0 text-red-500/80" aria-hidden />;
  }

  return <Check className="size-3 shrink-0 text-muted" aria-hidden />;
}

function getActivityHeaderLabel(toolCalls: ToolCallProgress[], isRunning: boolean): string {
  const runningTool = toolCalls.find((tool) => tool.status === 'running');

  if (runningTool) {
    return formatToolName(runningTool.toolName);
  }

  if (isRunning) {
    return 'Working';
  }

  if (toolCalls.length === 1) {
    return '1 step';
  }

  return `${toolCalls.length} steps`;
}

export const ExecutionProgress: FC<ExecutionProgressProps> = ({ toolCalls, isRunning, className }) => {
  const [expanded, setExpanded] = useState(true);
  const hasTools = toolCalls.length > 0;

  if (!isRunning && !hasTools) {
    return null;
  }

  return (
    <div className={cn('mr-auto flex w-fit max-w-[min(92%,22rem)] flex-col gap-2 sm:max-w-[min(85%,22rem)]', className)}>
      {isRunning && !hasTools && <AiTypingIndicator />}

      {hasTools && (
        <div className="w-full overflow-hidden rounded-xl border border-border/40 bg-muted/25">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/35"
            aria-expanded={expanded}
          >
            <ChevronRight
              className={cn('size-3.5 shrink-0 text-muted transition-transform duration-200', expanded && 'rotate-90')}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-xs text-muted">
              {getActivityHeaderLabel(toolCalls, isRunning)}
            </span>
            {isRunning && toolCalls.every((tool) => tool.status !== 'running') && (
              <Loader2 className="size-3 shrink-0 animate-spin text-muted" aria-hidden />
            )}
          </button>

          {expanded && (
            <div
              className="space-y-0.5 border-t border-border/30 px-3 py-2"
              role="log"
              aria-live="polite"
              aria-label="Tools used by the assistant"
            >
              {toolCalls.map((tool) => (
                <div
                  key={tool.callId}
                  className={cn(
                    'flex items-center gap-2 py-1 text-xs',
                    tool.status === 'running' ? 'text-foreground' : 'text-muted',
                  )}
                >
                  <ToolCallStatusIcon status={tool.status} />
                  <span className="min-w-0 flex-1 truncate">{formatToolName(tool.toolName)}</span>
                  {tool.status === 'failed' && <span className="shrink-0 text-[11px] text-red-500/80">failed</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
