import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/brand/logo';
import { useThemeContext } from '@/components/providers/theme-provider';

export default function Navbar() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Logo size={24} showWordmark wordmarkClassName="text-sm font-medium" />
      </Link>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground transition-colors duration-200"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </header>
  );
}
