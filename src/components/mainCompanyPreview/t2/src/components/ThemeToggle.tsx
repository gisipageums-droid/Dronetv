import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "motion/react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-background border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10"
        initial={false}
        animate={{
          scale: theme === 'dark' ? 1.1 : 0.9,
          opacity: theme === 'dark' ? 0.3 : 0.2
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {/* Icon container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {theme === 'light' ? (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeInOut",
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="absolute"
            >
              <Sun 
                className="w-5 h-5 text-primary drop-shadow-sm" 
                strokeWidth={2.5}
              />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: 180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: -180, opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeInOut",
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="absolute"
            >
              <Moon 
                className="w-5 h-5 text-primary drop-shadow-sm" 
                strokeWidth={2.5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pulse effect on theme change */}
      <motion.div
        className="absolute inset-0 border-2 border-primary rounded-full"
        initial={{ scale: 1, opacity: 0 }}
        animate={{ 
          scale: [1, 1.4, 1.8],
          opacity: [0.5, 0.2, 0]
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          times: [0, 0.5, 1]
        }}
        key={theme} // This ensures the animation triggers on theme change
      />
    </motion.button>
  );
}

export default ThemeToggle;
