import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  icon,
}) => {
  return (
    <div className={`glass-panel p-6 shadow-xl relative overflow-hidden transition-all duration-300 ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                {icon}
              </div>
            )}
            <div>
              {title && typeof title === 'string' ? (
                <h3 className="text-base font-bold text-slate-100 tracking-tight">{title}</h3>
              ) : (
                title
              )}
              {subtitle && typeof subtitle === 'string' ? (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              ) : (
                subtitle
              )}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
