import type { IntegrationAppsConnectionTier } from '@/features/integration-apps/interfaces/integrationApps.interface';

export type ToolkitBinding = {
  slug: string;
  connectionTier: IntegrationAppsConnectionTier;
};

export function bindingsToTierMap(
  bindings: ToolkitBinding[],
): Record<string, IntegrationAppsConnectionTier> {
  return Object.fromEntries(
    bindings.map((binding) => [binding.slug, binding.connectionTier]),
  );
}

export function getToolkitBindingKey(binding: ToolkitBinding): string {
  return `${binding.slug}:${binding.connectionTier}`;
}

export function isSameToolkitBinding(
  left: ToolkitBinding,
  right: ToolkitBinding,
): boolean {
  return left.slug === right.slug && left.connectionTier === right.connectionTier;
}

export function toggleToolkitBinding(
  bindings: ToolkitBinding[],
  nextBinding: ToolkitBinding,
): ToolkitBinding[] {
  const exists = bindings.some((binding) => isSameToolkitBinding(binding, nextBinding));

  if (exists) {
    return bindings.filter((binding) => !isSameToolkitBinding(binding, nextBinding));
  }

  return [
    ...bindings.filter((binding) => binding.slug !== nextBinding.slug),
    nextBinding,
  ];
}

export function getActiveToolkitConnectionTierScope(
  bindings: ToolkitBinding[],
): IntegrationAppsConnectionTier | null {
  if (bindings.length === 0) {
    return null;
  }

  return bindings[0]?.connectionTier ?? null;
}

export function getToolkitTierScopeNotice(
  scope: IntegrationAppsConnectionTier | null,
): string | null {
  if (!scope) {
    return null;
  }

  if (scope === 'ORG_SHARED') {
    return 'Organization connections only. Personal apps are disabled for this message.';
  }

  return 'Personal connections only. Organization apps are disabled for this message.';
}

export function isToolkitBindingDisabledByTierScope(
  connectionTier: IntegrationAppsConnectionTier,
  activeScope: IntegrationAppsConnectionTier | null,
  isSelected: boolean,
): boolean {
  if (!activeScope || isSelected) {
    return false;
  }

  return connectionTier !== activeScope;
}

export function toggleToolkitBindingWithTierScope(
  bindings: ToolkitBinding[],
  nextBinding: ToolkitBinding,
): ToolkitBinding[] {
  const exists = bindings.some((binding) => isSameToolkitBinding(binding, nextBinding));

  if (exists) {
    return bindings.filter((binding) => !isSameToolkitBinding(binding, nextBinding));
  }

  const sameTierBindings = bindings.filter(
    (binding) => binding.connectionTier === nextBinding.connectionTier,
  );

  return toggleToolkitBinding(sameTierBindings, nextBinding);
}
