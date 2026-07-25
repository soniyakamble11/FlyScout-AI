import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Building2, Mail, Cpu } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Campaigns & ICP', path: '/campaigns', icon: Target },
    { label: 'Target Companies', path: '/companies', icon: Building2 },
    { label: 'Email Sequences', path: '/emails', icon: Mail },
    { label: 'Agent Pipeline', path: '/agents', icon: Cpu },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/40 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Main Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-800 text-xs text-slate-400">
        <p className="font-semibold text-slate-200 mb-1">FlytBase Hackathon</p>
        <p className="text-[11px] leading-relaxed">Built for autonomous signal-based B2B outreach.</p>
      </div>
    </aside>
  );
};
