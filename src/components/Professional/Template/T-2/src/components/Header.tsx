import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { DarkModeToggle } from './DarkModeToggle';

interface HeaderProps {
  onDarkModeToggle: (isDark: boolean) => void;
}

export function Header({ onDarkModeToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Services', href: '#services' },
    { name: 'Clients', href: '#clients' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-[4rem] left-0 right-0 z-50 bg-background border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-foreground hover:scale-105 transition-transform duration-300">
            Portfolio
          </div>

          <div className="flex items-center space-x-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-yellow-500 hover:scale-110 transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Dark Mode Toggle */}
            <DarkModeToggle onToggle={onDarkModeToggle} />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-muted-foreground hover:text-yellow-500 hover:scale-110 transition-all duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border mt-4 pt-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-muted-foreground hover:text-yellow-500 transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
