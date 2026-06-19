import type { Theme } from '@/hooks/use-theme';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
