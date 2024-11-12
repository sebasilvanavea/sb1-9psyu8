import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/theme-store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
}