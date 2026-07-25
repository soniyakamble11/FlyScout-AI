import React from 'react';
import { Bot, Sparkles, Activity, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Left Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-base text-slate-100 tracking-tight flex items-center gap-1.5 font-heading">
            FlyScout <span className="text-indigo-400 font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">AI</span>
          </span>
          <span className="text-[10px] text-slate-400 block -mt-0.5 font-mono uppercase tracking-wider">
            Outbound BDR Platform
          </span>
        </div>
      </div>

      {/* Right Stats & Badges */}
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 shadow-sm">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-medium text-[11px]">System Operational</span>
        </div>

        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-[11px]">Gemini 1.5 Pro</span>
        </div>

        <button className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition">
          <Moon className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-white shadow-md">
          S
        </div>
      </div>
    </header>
  );
};
