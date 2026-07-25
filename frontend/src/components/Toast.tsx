import React from 'react';

export const Toast: React.FC<{ message: string; type?: 'info' | 'error' }> = ({ message, type = 'info' }) => (
  <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl text-sm font-medium border ${
    type === 'error' ? 'bg-rose-950 text-rose-200 border-rose-800' : 'bg-indigo-950 text-indigo-200 border-indigo-800'
  }`}>
    {message}
  </div>
);
