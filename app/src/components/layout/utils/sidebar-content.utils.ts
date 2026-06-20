import type { ElementType } from 'react';
import { Building2, LayoutDashboard, MessageSquare, PlugZap, Settings, Shield } from 'lucide-react';
import { Routes } from '@/routes/routes';
import { RoleTypes, type RoleType } from '@/features/user/interfaces/user.interface';

export interface SidebarNavItem {
  label: string;
  icon: ElementType;
  href: string;
  end: boolean;
  roles?: RoleType[];
}

export const navItems: SidebarNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: Routes.dashboard.root, end: true },
  { label: 'Conversations', icon: MessageSquare, href: Routes.dashboard.conversations, end: false },
  { label: 'Organisations', icon: Building2, href: Routes.dashboard.organizations, end: false },
  { label: 'Integrations', icon: PlugZap, href: Routes.dashboard.integrations, end: false },
  { label: 'Settings', icon: Settings, href: Routes.dashboard.settings, end: false },
  { label: 'Admin', icon: Shield, href: Routes.admin.composio, end: false, roles: [RoleTypes.SUPER_ADMIN] },
];
