export const CONVERSATIONS_SIDEBAR_STORAGE_KEY = 'conversations_sidebar_collapsed';

export function getInitialConversationsSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(CONVERSATIONS_SIDEBAR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}
