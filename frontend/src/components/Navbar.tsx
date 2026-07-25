import React from 'react';
import { Bot, Sparkles, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
            FlyScout <span className="text-indigo-400 font-mono text-sm font-bold">AI</span>
          </span>
          <span className="text-[10px] text-slate-400 block -mt-1 font-mono uppercase tracking-wider">
            Outbound BDR Agent Platform
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-800/40 text-xs text-indigo-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Multi-Agent Mesh Active</span>
        </div>
        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Gemini 1.5 Pro</span>
        </div>
      </div>
    </nav>
  );
};
