import React from 'react';
import { Button } from '../components/Button';

export const ErrorPage: React.FC<{ error?: string }> = ({ error = 'An unexpected error occurred.' }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl mb-4 text-rose-300 max-w-md">
        <h2 className="text-lg font-bold mb-1">Application Error</h2>
        <p className="text-xs font-mono">{error}</p>
      </div>
      <Button onClick={() => window.location.reload()}>Reload Application</Button>
    </div>
  );
};
