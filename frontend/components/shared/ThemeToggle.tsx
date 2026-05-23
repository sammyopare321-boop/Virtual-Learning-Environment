'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const toggle = () => toggleTheme();

  return (
    <button
      aria-label="Toggle light/dark theme"
      onClick={toggle}
      suppressHydrationWarning
      className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
