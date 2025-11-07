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
    primary: "bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-yellow-500 border-2 border-yellow-400 hover:bg-yellow-50"
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