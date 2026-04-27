import { Menu, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { DarkModeToggle } from './DarkModeToggle';

// Custom Button component (consistent with other components)
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant || 'default']} ${sizes[size || 'default']
        } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface NavLink {
  href: string;
  label: string;
}

interface HeaderData {
  logoText: string;
  navLinks: NavLink[];
}

const defaultHeaderData: HeaderData = {
  logoText: "arijit",
  navLinks: [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#services', label: 'Services' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ]
};

interface HeaderProps {
  headerData?: HeaderData;
  onDarkModeToggle: (isDark: boolean) => void;
}

export function Header({ headerData, onDarkModeToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const data = headerData || defaultHeaderData;

  // Get first character in uppercase for avatar
  const getAvatarLetter = (text: string) => {
    return text.charAt(0).toUpperCase();
  };

  return (
    <header ref={headerRef} className="fixed top-[4rem] left-0 right-0 z-40 bg-background border-b border-border shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Avatar and Brand */}
          <div className="text-2xl font-bold transition-transform duration-300 text-foreground">
            <div className='flex items-center gap-4'>
              {/* Display Mode - Only Avatar (No Text) */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-yellow-300 flex items-center justify-center text-black font-bold text-lg border-2 border-yellow-300 shadow-lg">
                  {getAvatarLetter(data.logoText)}
                </div>
                {/* Logo Text displayed to the right of avatar */}
                <span className="text-xl font-semibold text-foreground">
                  {data.logoText}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Desktop Navigation - Static (Non-editable) */}
            <nav className="hidden space-x-8 md:flex">
              {data.navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="transition-all duration-300 text-muted-foreground hover:text-yellow-500 hover:scale-110"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Controls */}
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

        {/* Mobile Navigation - Static (Non-editable) */}
        {isMenuOpen && (
          <nav className="pt-4 pb-4 mt-4 border-t md:hidden border-border">
            {data.navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 transition-colors duration-300 text-muted-foreground hover:text-yellow-500"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}