import React from 'react';

export const Loader: React.FC<{ label?: string }> = ({ label = 'Processing...' }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
    <p className="text-sm font-medium text-slate-400">{label}</p>
  </div>
);
