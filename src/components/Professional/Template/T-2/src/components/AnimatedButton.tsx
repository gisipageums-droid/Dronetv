import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AnimatedButton({ 
  children, 
  onClick, 
  href, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: AnimatedButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg transition-all duration-300 font-medium hover:scale-105 hover:-translate-y-1";
  
  const variants = {
    primary: "bg-brand-yellow text-ink hover:bg-brand-gold shadow-lg hover:shadow-xl",
    secondary: "bg-surface-card text-brand-gold border-2 border-brand-yellow hover:bg-surface-main"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}