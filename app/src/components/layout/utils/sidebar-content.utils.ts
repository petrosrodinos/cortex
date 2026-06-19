import { Building2, LayoutDashboard, MessageSquare, PlugZap, Settings } from 'lucide-react';
import { Routes } from '@/routes/routes';

export const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: Routes.dashboard.root, end: true },
  { label: 'Conversations', icon: MessageSquare, href: Routes.dashboard.conversations, end: false },
  { label: 'Organisations', icon: Building2, href: Routes.dashboard.organizations, end: false },
  { label: 'Integrations', icon: PlugZap, href: Routes.dashboard.integrations, end: false },
  { label: 'Settings', icon: Settings, href: Routes.dashboard.settings, end: false },
];
