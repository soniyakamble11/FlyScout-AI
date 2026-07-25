import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'Run a campaign or configure your ICP to populate target accounts.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
    <div className="p-3 bg-slate-800/60 rounded-full mb-3 text-slate-400">
      <Inbox className="w-8 h-8" />
    </div>
    <h4 className="text-base font-semibold text-slate-200">{title}</h4>
    <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
