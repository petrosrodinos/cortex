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
import { ComposioConnectionTier } from '@/features/integration-apps/constants/composio-connection-tier';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import { getProviderBrandColor } from '@/features/integrations/constants/provider-metadata';
import { cn } from '@/lib/utils';
import { ConversationSlashPicker } from './conversation-slash-picker';
import { getIntegrationDisplayLabel } from './integration-tools-list';
import type { IntegrationAppsConnectionTier } from '@/features/integration-apps/interfaces/integrationApps.interface';
import { getConversationToolItemLabel, isConversationToolItemTierDisabled, type ConversationToolItem } from './conversation-tool-items.utils';

const SLASH_QUERY_PATTERN = /\/([a-z0-9_-]*)$/i;
const TOOLKIT_CHIP_BRAND = '#6366f1';

export type DraftPart =
  | { type: 'text'; value: string }
  | { type: 'integration'; uuid: string; label: string; provider: IntegrationProvider }
  | {
      type: 'toolkit';
      slug: string;
      label: string;
      connectionTier: IntegrationAppsConnectionTier;
    };

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

export function getDraftToolkitSlugs(parts: DraftPart[]): string[] {
  const slugs: string[] = [];

  for (const part of parts) {
    if (part.type === 'toolkit' && !slugs.includes(part.slug)) {
      slugs.push(part.slug);
    }
  }

  return slugs;
}

export function getDraftToolkitBindings(parts: DraftPart[]) {
  const bindings: Array<{ slug: string; connectionTier: IntegrationAppsConnectionTier }> = [];

  for (const part of parts) {
    if (part.type === 'toolkit') {
      bindings.push({ slug: part.slug, connectionTier: part.connectionTier });
    }
  }

  return bindings;
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

    if (node.dataset.toolkitSlug) {
      parts.push({
        type: 'toolkit',
        slug: node.dataset.toolkitSlug,
        label: node.dataset.toolkitLabel ?? '',
        connectionTier:
          (node.dataset.toolkitConnectionTier as IntegrationAppsConnectionTier | undefined) ??
          ComposioConnectionTier.ORG_SHARED,
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

function createIntegrationChipElement(
  uuid: string,
  label: string,
  provider: IntegrationProvider,
): HTMLSpanElement {
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

function createToolkitChipElement(
  slug: string,
  label: string,
  connectionTier: IntegrationAppsConnectionTier,
): HTMLSpanElement {
  const chip = document.createElement('span');
  chip.dataset.toolkitSlug = slug;
  chip.dataset.toolkitLabel = label;
  chip.dataset.toolkitConnectionTier = connectionTier;
  chip.contentEditable = 'false';
  chip.className =
    'integration-chip mx-0.5 inline-flex items-center rounded-full px-1.5 py-0.5 align-baseline text-[13px] font-medium leading-none';
  chip.style.setProperty('--chip-brand', TOOLKIT_CHIP_BRAND);
  chip.textContent = `/${label}`;
  return chip;
}

function removeToolkitChipsWithTier(root: HTMLElement, connectionTier: IntegrationAppsConnectionTier) {
  root.querySelectorAll('[data-toolkit-connection-tier]').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    if (node.dataset.toolkitConnectionTier === connectionTier) {
      node.remove();
    }
  });
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
  const slashMatch = beforeInNode.match(SLASH_QUERY_PATTERN);

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

function insertChipAtCursor(root: HTMLElement, chip: HTMLSpanElement): HTMLSpanElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer)) {
    return null;
  }

  if (range.startContainer.nodeType !== Node.TEXT_NODE) {
    root.appendChild(chip);
    return chip;
  }

  const textNode = range.startContainer as Text;
  const offset = range.startOffset;
  const nodeText = textNode.textContent ?? '';
  const beforeInNode = nodeText.slice(0, offset);
  const slashMatch = beforeInNode.match(SLASH_QUERY_PATTERN);

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

  const afterNode = document.createTextNode(afterCursor);

  if (beforeSlash) {
    textNode.textContent = beforeSlash;
    parent.insertBefore(chip, textNode.nextSibling);
  } else {
    parent.replaceChild(chip, textNode);
  }

  if (afterCursor) {
    parent.insertBefore(afterNode, chip.nextSibling);
  }

  return chip;
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
      root.appendChild(createIntegrationChipElement(part.uuid, part.label, part.provider));
      continue;
    }

    if (part.type === 'toolkit') {
      root.appendChild(
        createToolkitChipElement(part.slug, part.label, part.connectionTier),
      );
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
  if (!root.contains(range.startContainer)) {
    return null;
  }

  let textNode = range.startContainer;
  let offset = range.startOffset;

  if (textNode.nodeType === Node.ELEMENT_NODE) {
    const element = textNode as HTMLElement;
    const child = element.childNodes[offset - 1] ?? element.childNodes[offset];

    if (child?.nodeType === Node.TEXT_NODE) {
      textNode = child;
      offset = (child.textContent ?? '').length;
    } else {
      return null;
    }
  }

  if (textNode.nodeType !== Node.TEXT_NODE) {
    return null;
  }

  const text = textNode.textContent ?? '';
  const before = text.slice(0, offset);
  const match = before.match(SLASH_QUERY_PATTERN);

  if (!match) {
    return null;
  }

  const slashIndex = before.length - match[0].length;
  if (slashIndex > 0 && !/\s/.test(before[slashIndex - 1] ?? '')) {
    return null;
  }

  return match[1] ?? '';
}

function placeCursorAtEnd(root: HTMLElement) {
  root.focus();
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(root);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
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
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onPartsChange: (parts: DraftPart[]) => void;
  onSend?: () => void;
}

export interface ConversationDraftEditorHandle {
  focus: () => void;
  focusAtEnd: () => void;
}

export const ConversationDraftEditor = forwardRef<ConversationDraftEditorHandle, ConversationDraftEditorProps>(
  ({ parts, integrations, toolkits, disabled = false, placeholder, className, onPartsChange, onSend }, ref) => {
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
      focusAtEnd: () => {
        const root = editorRef.current;
        if (!root) {
          return;
        }
        placeCursorAtEnd(root);
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
        const insertedChip = insertChipAtCursor(
          root,
          createIntegrationChipElement(integration.uuid, label, integration.provider),
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

    const handleToolkitSelect = useCallback(
      (item: Extract<ConversationToolItem, { kind: 'toolkit' }>) => {
        const root = editorRef.current;
        if (!root) {
          return;
        }

        const existingBindings = getDraftToolkitBindings(serializeEditor(root));

        if (isConversationToolItemTierDisabled(item, existingBindings)) {
          return;
        }

        const alreadySelected = existingBindings.some(
          (binding) =>
            binding.slug === item.toolkit.slug &&
            binding.connectionTier === item.connectionTier,
        );

        if (alreadySelected) {
          removeSlashQueryAtCursor(root);
          const nextParts = serializeEditor(root);
          skipRenderRef.current = true;
          onPartsChange(nextParts);
          setSlashContext(null);
          return;
        }

        const oppositeTier =
          item.connectionTier === ComposioConnectionTier.ORG_SHARED
            ? ComposioConnectionTier.USER_PERSONAL
            : ComposioConnectionTier.ORG_SHARED;
        removeToolkitChipsWithTier(root, oppositeTier);

        const label = getConversationToolItemLabel(item);
        const insertedChip = insertChipAtCursor(
          root,
          createToolkitChipElement(item.toolkit.slug, label, item.connectionTier),
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
      [onPartsChange],
    );

    const handleToolSelect = useCallback(
      (item: ConversationToolItem) => {
        if (item.kind === 'toolkit') {
          handleToolkitSelect(item);
          return;
        }

        handleIntegrationSelect(item.integration.uuid);
      },
      [handleIntegrationSelect, handleToolkitSelect],
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
        if (draftPartsToPlainText(parts)) {
          onSend?.();
        }
      }
    };

    const draftIntegrationUuids = getDraftIntegrationUuids(parts);
    const draftToolkitBindings = getDraftToolkitBindings(parts);
    const draftToolkitItemIds = draftToolkitBindings.map(
      (binding) => `${binding.slug}:${binding.connectionTier}`,
    );
    const isEmpty =
      parts.length === 1 &&
      parts[0]?.type === 'text' &&
      parts[0].value.length === 0 &&
      draftIntegrationUuids.length === 0 &&
      draftToolkitItemIds.length === 0;

    return (
      <div className="relative min-w-0 flex-1">
        <ConversationSlashPicker
          integrations={integrations}
          toolkits={toolkits}
          query={slashContext?.query ?? ''}
          isOpen={Boolean(slashContext)}
          selectedToolkitBindings={draftToolkitBindings}
          excludedIntegrationUuids={draftIntegrationUuids}
          excludedToolkitItemIds={draftToolkitItemIds}
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
