import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full mb-3.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-slate-950/70 border ${
          error ? 'border-rose-500/80 focus:ring-rose-500/50' : 'border-slate-800 focus:border-indigo-500/80 focus:ring-indigo-500/30'
        } rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all shadow-inner ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
};
