import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import type { Conversation } from '@/features/conversations/interfaces/conversation.interfaces';
import { useAddDocumentToBoard } from '@/features/document-boards/hooks/use-document-boards';
import { StepConversationPicker } from './step-conversation-picker';
import { StepDocumentPicker } from './step-document-picker';

type Step = 'pick-conversation' | 'pick-documents';

type AddFromConversationModalProps = {
  orgUuid: string;
  boardUuid: string;
  onClose: () => void;
};

export function AddFromConversationModal({
  orgUuid,
  boardUuid,
  onClose,
}: AddFromConversationModalProps) {
  const [step, setStep] = useState<Step>('pick-conversation');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const addDocument = useAddDocumentToBoard(orgUuid, boardUuid);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setStep('pick-documents');
  };

  const handleConfirm = (docs: { uuid: string; title?: string }[]) => {
    if (docs.length === 0) return;

    let remaining = docs.length;
    for (const doc of docs) {
      addDocument.mutate({ documentUuid: doc.uuid, title: doc.title }, {
        onSettled: () => {
          remaining -= 1;
          if (remaining === 0) onClose();
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[color-mix(in_oklch,black_42%,transparent)]"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[min(80dvh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
        style={{ boxShadow: '0 24px 60px -20px color-mix(in oklch, black 55%, transparent)' }}
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
          {step === 'pick-documents' ? (
            <button
              type="button"
              onClick={() => setStep('pick-conversation')}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">Add from conversation</h2>
            <p className="mt-0.5 text-xs text-muted">
              {step === 'pick-conversation'
                ? 'Select a conversation to browse its documents.'
                : `Documents from "${selectedConversation?.title ?? 'Untitled'}"`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {step === 'pick-conversation' ? (
            <StepConversationPicker orgUuid={orgUuid} onSelect={handleSelectConversation} />
          ) : selectedConversation ? (
            <StepDocumentPicker
              orgUuid={orgUuid}
              conversation={selectedConversation}
              isAdding={addDocument.isPending}
              onConfirm={handleConfirm}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
