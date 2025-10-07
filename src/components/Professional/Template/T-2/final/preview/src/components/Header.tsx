import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeaderData {
  logoUrl: string;
  portfolioText: string;
}

const defaultHeaderData: HeaderData = {
  logoUrl: "/images/logo.png",
  portfolioText: "Portfolio",
};

interface HeaderProps {
  headerData?: HeaderData;
  onDarkModeToggle: (isDark: boolean) => void;
}

export function Header({ headerData, onDarkModeToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use provided data or default
  const data = headerData || defaultHeaderData;

  // Static navigation items
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Clients', href: '#clients' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-[4rem] left-0 right-0 z-40 bg-background border-b border-border shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="text-2xl font-bold text-foreground">
            <div className='flex items-center gap-4'>
              <ImageWithFallback
                src={data.logoUrl}
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
              <span>{data.portfolioText}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Desktop Navigation */}
            <nav className="hidden space-x-8 md:flex">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="transition-all duration-300 text-muted-foreground hover:text-yellow-500 hover:scale-110"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className='flex items-center gap-2'>
              {/* Dark Mode Toggle */}
              <DarkModeToggle onToggle={onDarkModeToggle} />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-all duration-300 md:hidden text-muted-foreground hover:text-yellow-500 hover:scale-110"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="pt-4 pb-4 mt-4 border-t md:hidden border-border">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 transition-colors duration-300 text-muted-foreground hover:text-yellow-500"
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