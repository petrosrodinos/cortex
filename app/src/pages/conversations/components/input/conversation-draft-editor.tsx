import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  type KeyboardEvent,
} from 'react';
import type { Integration, IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import { getProviderBrandColor } from '@/features/integrations/constants/provider-metadata';
import { cn } from '@/lib/utils';
import { ConversationSlashPicker } from './conversation-slash-picker';
import { getIntegrationDisplayLabel } from './integration-tools-list';
import type { ConversationToolItem } from './conversation-tool-items.utils';

export type DraftPart =
  | { type: 'text'; value: string }
  | { type: 'integration'; uuid: string; label: string; provider: IntegrationProvider };

export function createEmptyDraft(): DraftPart[] {
  return [{ type: 'text', value: '' }];
}

export function draftPartsToPlainText(parts: DraftPart[]): string {
  return parts
    .filter((part): part is { type: 'text'; value: string } => part.type === 'text')
    .map((part) => part.value)
    .join('')
    .trim();
}

export function getDraftIntegrationUuids(parts: DraftPart[]): string[] {
  const uuids: string[] = [];

  for (const part of parts) {
    if (part.type === 'integration' && !uuids.includes(part.uuid)) {
      uuids.push(part.uuid);
    }
  }

  return uuids;
}

function mergeAdjacentTextParts(parts: DraftPart[]): DraftPart[] {
  const merged: DraftPart[] = [];

  for (const part of parts) {
    if (part.type === 'text' && !part.value) {
      continue;
    }

    const last = merged[merged.length - 1];
    if (part.type === 'text' && last?.type === 'text') {
      last.value += part.value;
      continue;
    }

    merged.push(part.type === 'text' ? { ...part } : { ...part });
  }

  if (merged.length === 0) {
    return [{ type: 'text', value: '' }];
  }

  return merged;
}

function serializeEditor(root: HTMLElement): DraftPart[] {
  const parts: DraftPart[] = [];

  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.textContent ?? '';
      if (value) {
        parts.push({ type: 'text', value });
      }
      return;
    }

    if (!(node instanceof HTMLElement)) {
      return;
    }

    if (node.dataset.integrationUuid) {
      parts.push({
        type: 'integration',
        uuid: node.dataset.integrationUuid,
        label: node.dataset.integrationLabel ?? '',
        provider: (node.dataset.integrationProvider ?? 'MCP') as IntegrationProvider,
      });
      return;
    }

    const value = node.textContent ?? '';
    if (value) {
      parts.push({ type: 'text', value });
    }
  });

  return mergeAdjacentTextParts(parts);
}

function createChipElement(uuid: string, label: string, provider: IntegrationProvider): HTMLSpanElement {
  const chip = document.createElement('span');
  chip.dataset.integrationUuid = uuid;
  chip.dataset.integrationLabel = label;
  chip.dataset.integrationProvider = provider;
  chip.contentEditable = 'false';
  chip.className =
    'integration-chip mx-0.5 inline-flex items-center rounded-full px-1.5 py-0.5 align-baseline text-[13px] font-medium leading-none';
  chip.style.setProperty('--chip-brand', getProviderBrandColor(provider));
  chip.textContent = `/${label}`;
  return chip;
}

function removeSlashQueryAtCursor(root: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || range.startContainer.nodeType !== Node.TEXT_NODE) {
    return false;
  }

  const textNode = range.startContainer as Text;
  const offset = range.startOffset;
  const nodeText = textNode.textContent ?? '';
  const beforeInNode = nodeText.slice(0, offset);
  const slashMatch = beforeInNode.match(/\/([a-z0-9-]*)$/i);

  if (!slashMatch) {
    return false;
  }

  const slashStart = offset - slashMatch[0].length;
  const beforeSlash = nodeText.slice(0, slashStart);
  const afterCursor = nodeText.slice(offset);
  textNode.textContent = beforeSlash + afterCursor;

  const newOffset = beforeSlash.length;
  const newRange = document.createRange();
  newRange.setStart(textNode, newOffset);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  normalizeEditorNodes(root);
  return true;
}

function insertIntegrationChipAtCursor(
  root: HTMLElement,
  uuid: string,
  label: string,
  provider: IntegrationProvider,
): HTMLSpanElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer)) {
    return null;
  }

  if (range.startContainer.nodeType !== Node.TEXT_NODE) {
    const chip = createChipElement(uuid, label, provider);
    root.appendChild(chip);
    return chip;
  }

  const textNode = range.startContainer as Text;
  const offset = range.startOffset;
  const nodeText = textNode.textContent ?? '';
  const beforeInNode = nodeText.slice(0, offset);
  const slashMatch = beforeInNode.match(/\/([a-z0-9-]*)$/i);

  if (!slashMatch) {
    return null;
  }

  const slashStart = offset - slashMatch[0].length;
  const beforeSlash = nodeText.slice(0, slashStart);
  const afterCursor = nodeText.slice(offset);
  const parent = textNode.parentNode;

  if (!parent) {
    return null;
  }

  const insertedChip = createChipElement(uuid, label, provider);
  const afterNode = document.createTextNode(afterCursor);

  if (beforeSlash) {
    textNode.textContent = beforeSlash;
    parent.insertBefore(insertedChip, textNode.nextSibling);
  } else {
    parent.replaceChild(insertedChip, textNode);
  }

  if (afterCursor) {
    parent.insertBefore(afterNode, insertedChip.nextSibling);
  }

  return insertedChip;
}

function normalizeEditorNodes(root: HTMLElement) {
  root.normalize();
  if (root.childNodes.length === 0) {
    root.appendChild(document.createTextNode(''));
  }
}

function renderPartsToEditor(root: HTMLElement, parts: DraftPart[]) {
  root.innerHTML = '';

  for (const part of parts) {
    if (part.type === 'integration') {
      root.appendChild(createChipElement(part.uuid, part.label, part.provider));
      continue;
    }

    if (part.value) {
      root.appendChild(document.createTextNode(part.value));
    }
  }

  normalizeEditorNodes(root);
}

function getSlashQueryAtCursor(root: HTMLElement): string | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || range.startContainer.nodeType !== Node.TEXT_NODE) {
    return null;
  }

  const text = range.startContainer.textContent ?? '';
  const before = text.slice(0, range.startOffset);
  const match = before.match(/\/([a-z0-9-]*)$/i);

  if (!match) {
    return null;
  }

  const slashIndex = before.length - match[0].length;
  if (slashIndex > 0 && !/\s/.test(before[slashIndex - 1] ?? '')) {
    return null;
  }

  return match[1] ?? '';
}

function placeCursorAfterNode(root: HTMLElement, node: Node) {
  root.focus();
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

interface SlashContext {
  query: string;
}

interface ConversationDraftEditorProps {
  parts: DraftPart[];
  integrations: Integration[];
  toolkits: IntegrationAppsToolkit[];
  selectedToolkitSlugs: string[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onPartsChange: (parts: DraftPart[]) => void;
  onToolkitSelectionChange: (toolkitSlugs: string[]) => void;
  onSend?: () => void;
}

export interface ConversationDraftEditorHandle {
  focus: () => void;
}

export const ConversationDraftEditor = forwardRef<ConversationDraftEditorHandle, ConversationDraftEditorProps>(
  ({ parts, integrations, toolkits, selectedToolkitSlugs, disabled = false, placeholder, className, onPartsChange, onToolkitSelectionChange, onSend }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const isComposingRef = useRef(false);
    const skipRenderRef = useRef(false);
    const [slashContext, setSlashContext] = useState<SlashContext | null>(null);

    const syncPartsFromEditor = useCallback(() => {
      const root = editorRef.current;
      if (!root) {
        return;
      }

      const nextParts = serializeEditor(root);
      skipRenderRef.current = true;
      onPartsChange(nextParts);

      const slashQuery = getSlashQueryAtCursor(root);
      if (slashQuery !== null) {
        setSlashContext({ query: slashQuery });
      } else {
        setSlashContext(null);
      }
    }, [onPartsChange]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        editorRef.current?.focus();
      },
    }));

    useEffect(() => {
      const root = editorRef.current;
      if (!root || skipRenderRef.current) {
        skipRenderRef.current = false;
        return;
      }

      renderPartsToEditor(root, parts);
    }, [parts]);

    const handleIntegrationSelect = useCallback(
      (uuid: string) => {
        const root = editorRef.current;
        if (!root) {
          return;
        }

        const integration = integrations.find((item) => item.uuid === uuid);
        if (!integration) {
          return;
        }

        const existingUuids = getDraftIntegrationUuids(serializeEditor(root));

        if (existingUuids.includes(uuid)) {
          removeSlashQueryAtCursor(root);
          const nextParts = serializeEditor(root);
          skipRenderRef.current = true;
          onPartsChange(nextParts);
          setSlashContext(null);
          return;
        }

        const label = getIntegrationDisplayLabel(integration);
        const insertedChip = insertIntegrationChipAtCursor(
          root,
          integration.uuid,
          label,
          integration.provider,
        );

        if (!insertedChip) {
          return;
        }

        normalizeEditorNodes(root);
        const nextParts = serializeEditor(root);
        skipRenderRef.current = true;
        onPartsChange(nextParts);
        setSlashContext(null);
        placeCursorAfterNode(root, insertedChip);
      },
      [integrations, onPartsChange],
    );

    const handleToolSelect = useCallback(
      (item: ConversationToolItem) => {
        if (item.kind === 'toolkit') {
          const slug = item.toolkit.slug;
          const isSelected = selectedToolkitSlugs.includes(slug);
          onToolkitSelectionChange(
            isSelected
              ? selectedToolkitSlugs.filter((value) => value !== slug)
              : [...selectedToolkitSlugs, slug],
          );

          const root = editorRef.current;
          if (root) {
            removeSlashQueryAtCursor(root);
            const nextParts = serializeEditor(root);
            skipRenderRef.current = true;
            onPartsChange(nextParts);
          }
          setSlashContext(null);
          root?.focus();
          return;
        }

        handleIntegrationSelect(item.integration.uuid);
      },
      [handleIntegrationSelect, onPartsChange, onToolkitSelectionChange, selectedToolkitSlugs],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (slashContext) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
          event.preventDefault();
          return;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          setSlashContext(null);
          return;
        }
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (draftPartsToPlainText(parts) || getDraftIntegrationUuids(parts).length > 0) {
          onSend?.();
        }
      }
    };

    const draftIntegrationUuids = getDraftIntegrationUuids(parts);
    const isEmpty =
      parts.length === 1 && parts[0]?.type === 'text' && parts[0].value.length === 0 && draftIntegrationUuids.length === 0;

    return (
      <div className="relative min-w-0 flex-1">
        <ConversationSlashPicker
          integrations={integrations}
          toolkits={toolkits}
          query={slashContext?.query ?? ''}
          isOpen={Boolean(slashContext)}
          excludedIntegrationUuids={draftIntegrationUuids}
          onSelect={handleToolSelect}
          onClose={() => setSlashContext(null)}
        />

        {isEmpty && placeholder ? (
          <div className="pointer-events-none absolute left-0 top-1.5 text-sm text-muted">{placeholder}</div>
        ) : null}

        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Message"
          data-placeholder={placeholder}
          className={cn(
            'max-h-40 min-h-[36px] w-full overflow-y-auto whitespace-pre-wrap break-words bg-transparent py-1.5 text-sm text-foreground outline-none',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          onInput={() => {
            if (isComposingRef.current) {
              return;
            }
            syncPartsFromEditor();
          }}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
            syncPartsFromEditor();
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  },
);

ConversationDraftEditor.displayName = 'ConversationDraftEditor';
