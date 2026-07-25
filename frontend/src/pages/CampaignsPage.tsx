import React from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Target, Building2, Globe, Users, Sparkles } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Active ICP Configuration
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 font-heading">
          FlytBase Outbound BDR Campaign
        </h1>
        <p className="mt-1 text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
          AI-powered outbound prospecting workflow for discovering enterprise mining companies, researching decision makers, and generating personalized outreach.
        </p>
      </div>

      {/* Campaign Brief */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span className="text-base font-bold text-slate-100">Campaign Specifications</span>
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-6 text-xs">
          <div className="glass-card p-4 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Reference Company
            </div>
            <p className="font-bold text-slate-100 text-sm">
              Sociedad Química y Minera de Chile (SQM)
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <Target className="w-3.5 h-3.5 text-indigo-400" /> Target Vertical
            </div>
            <p className="font-bold text-slate-100 text-sm">
              Large-scale Lithium, Copper & Iron Ore Mining
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> Target Region
            </div>
            <p className="font-bold text-slate-100 text-sm">
              Latin America & North America
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Target Decision Makers
            </div>
            <p className="font-bold text-slate-100 text-sm">
              Head of Operations • VP HSE • Site Director • Mine Manager
            </p>
          </div>
        </div>
      </Card>

      {/* FlytBase Value Proposition */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-base font-bold text-slate-100">FlytBase Value Proposition</span>
          </div>
        }
      >
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          FlytBase enables autonomous drone operations for industrial inspections across hazardous mining environments.
          The platform helps enterprises reduce operational risk, improve worker safety, automate inspection workflows,
          and increase operational efficiency across 24/7 extraction sites.
        </p>
      </Card>

      {/* Campaign Status */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span className="text-base font-bold text-slate-100">Campaign Execution Status</span>
          </div>
        }
      >
        <div className="flex justify-between items-center bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              Enterprise Mining Outreach Campaign
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ready to discover similar enterprise mining companies and generate personalized emails.
            </p>
          </div>
          <Badge variant="success">
            Ready for Launch
          </Badge>
        </div>
      </Card>
    </div>
  );
};