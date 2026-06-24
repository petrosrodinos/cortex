import type { ElementType } from 'react';
import { Building2, CalendarClock, FolderOpen, LayoutDashboard, MessageSquare, PlugZap, Settings, Shield } from 'lucide-react';
import { Routes } from '@/routes/routes';
import { RoleTypes, type RoleType } from '@/features/user/interfaces/user.interface';
import { PermissionKeys, type PermissionKey } from '@/lib/organization-permissions';

export interface SidebarNavItem {
  label: string;
  icon: ElementType;
  href: string;
  end: boolean;
  roles?: RoleType[];
  permission?: PermissionKey;
}

export const navItems: SidebarNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: Routes.dashboard.root, end: true },
  { label: 'Conversations', icon: MessageSquare, href: Routes.dashboard.conversations, end: false, permission: PermissionKeys.CONVERSATIONS_READ },
  { label: 'Boards', icon: FolderOpen, href: Routes.dashboard.documentBoards, end: false, permission: PermissionKeys.DOCUMENTS_READ },
  { label: 'Agents', icon: CalendarClock, href: Routes.dashboard.agents, end: false, permission: PermissionKeys.AGENTS_READ },
  { label: 'Organisations', icon: Building2, href: Routes.dashboard.organizations, end: false, permission: PermissionKeys.ORG_READ },
  { label: 'Integrations', icon: PlugZap, href: Routes.dashboard.integrationsSection('integrationApps'), end: false, permission: PermissionKeys.INTEGRATIONS_READ },
  { label: 'Settings', icon: Settings, href: Routes.dashboard.settings, end: false },
  { label: 'Admin', icon: Shield, href: Routes.admin.integrationApps, end: false, roles: [RoleTypes.SUPER_ADMIN] },
];
