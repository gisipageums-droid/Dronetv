import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface DarkModeToggleProps {
  onToggle: (isDark: boolean) => void;
}

export function DarkModeToggle({ onToggle }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    onToggle(shouldBeDark);
  }, []); // Remove onToggle from dependencies - run only once on mount

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    onToggle(newIsDark);
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative w-12 h-6 bg-muted rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-4 h-4 bg-background rounded-full shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-foreground" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </motion.div>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun
          className={`w-3 h-3 transition-opacity duration-300 text-yellow-500 ${
            isDark ? 'opacity-30' : 'opacity-60'
          }`}
        />
        <Moon
          className={`w-3 h-3 transition-opacity duration-300 text-foreground ${
            isDark ? 'opacity-60' : 'opacity-30'
          }`}
        />
      </div>
    </motion.button>
  );
}