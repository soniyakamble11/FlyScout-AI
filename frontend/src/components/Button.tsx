import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variantStyles = {
    primary: 'glow-button text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/30 hover:border-indigo-400',
    secondary: 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-sm hover:border-slate-600',
    outline: 'bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 hover:border-indigo-400/50',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
    </button>
  );
};
