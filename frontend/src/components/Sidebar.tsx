import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Building2, Mail, Cpu, ChevronRight } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Campaigns & ICP', path: '/campaigns', icon: Target },
    { label: 'Target Companies', path: '/companies', icon: Building2 },
    { label: 'Email Sequences', path: '/emails', icon: Mail },
    { label: 'Agent Pipeline', path: '/agents', icon: Cpu },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/40 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] backdrop-blur-md">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-950/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Campaign Summary Widget */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-lg text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-xs">Campaign Summary</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1">
            <p className="truncate font-medium text-slate-300">FlytBase Mining Outreach</p>
            <p className="text-[10px] text-slate-500">Created: 25 Jul 2026</p>
          </div>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Pipeline Status</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="px-3 py-2 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="font-mono">FlyScout AI v1.0</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      </div>
    </aside>
  );
};
