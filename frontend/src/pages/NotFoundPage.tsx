import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-extrabold text-indigo-500 mb-2 font-mono">404</h1>
      <h2 className="text-xl font-bold text-slate-100 mb-2">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-6">The page or resource you are looking for does not exist or has been relocated.</p>
      <Link to="/">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
};
