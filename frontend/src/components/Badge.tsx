import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: 'bg-slate-900/80 text-slate-300 border-slate-700/60 shadow-sm',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-950',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-sm shadow-amber-950',
    info: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-sm shadow-indigo-950',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm shadow-rose-950',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
