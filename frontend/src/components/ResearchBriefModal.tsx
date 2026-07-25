import React from 'react';
import { Modal } from './Modal';
import { ResearchBrief } from '../types';
import { Sparkles, DollarSign, TrendingUp } from 'lucide-react';

interface ResearchBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief?: ResearchBrief;
  companyName?: string;
}

export const ResearchBriefModal: React.FC<ResearchBriefModalProps> = ({
  isOpen,
  onClose,
  brief,
  companyName = 'Company',
}) => {
  if (!brief) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`AI Research Brief: ${companyName}`}>
      <div className="space-y-4 text-sm text-slate-200">
        <div>
          <h4 className="font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Summary
          </h4>
          <p className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs leading-relaxed">
            {brief.company_summary}
          </p>
        </div>

        {brief.recent_funding && (
          <div>
            <h4 className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> Recent Funding & Financial Signal
            </h4>
            <p className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-800/40 text-xs text-emerald-200">
              {brief.recent_funding}
            </p>
          </div>
        )}

        {brief.hiring_signals && (
          <div>
            <h4 className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Hiring & Tech Stack Signals
            </h4>
            <p className="bg-amber-950/20 p-3 rounded-lg border border-amber-800/40 text-xs text-amber-200">
              {brief.hiring_signals}
            </p>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-violet-400 mb-1">Personalization Outreach Angles</h4>
          <ul className="space-y-1.5">
            {brief.buying_hooks.map((hook, idx) => (
              <li key={idx} className="bg-slate-900 p-2.5 rounded-md border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-violet-400 font-bold">•</span>
                <span>{hook}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};
