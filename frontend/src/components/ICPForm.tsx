import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Sparkles, Trophy, Cpu, Target, ArrowRight } from 'lucide-react';

interface ICPFormProps {
  onSubmitCampaign?: (data: any) => void;
  isLoading?: boolean;
}

export const ICPForm: React.FC<ICPFormProps> = ({
  onSubmitCampaign,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: 'FlytBase Mining Outreach Campaign',
    product_name: 'FlytBase Autonomous Drone Platform',
    value_proposition:
      'FlytBase enables autonomous drone operations for industrial inspections across large-scale mining environments. The platform improves worker safety, automates inspection workflows, reduces operational downtime, and enables autonomous BVLOS drone operations for industrial enterprises.',
    industries:
      'Mining, Lithium Mining, Copper Mining, Iron Ore Mining, Metals & Minerals',
    employee_count_min: 1000,
    employee_count_max: 100000,
    target_roles:
      'Head of Operations, VP HSE, Mine Manager, Site Director',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitCampaign) {
      onSubmitCampaign(formData);
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          <span className="text-lg font-bold text-slate-100">Campaign Brief & ICP Configuration</span>
        </div>
      }
      subtitle="Configure outbound campaign details to discover enterprise accounts, discover contacts, and generate signal-personalized emails."
    >
      {/* Hackathon Banner */}
      <div className="mb-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950/60 p-5 shadow-lg backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-slate-100 font-bold text-base flex items-center gap-2">
              FlytBase Outbound BDR Hiring Hackathon
            </h2>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              This autonomous multi-agent platform automatically:
            </p>
            <ul className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Identifies matching enterprise mining companies
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Finds target decision-maker contacts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Researches live public signals via Tavily
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Generates signal-grounded personalized emails
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Campaign Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product / Solution Name"
            value={formData.product_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                product_name: e.target.value,
              })
            }
          />

          <Input
            label="Target Decision Makers"
            value={formData.target_roles}
            onChange={(e) =>
              setFormData({
                ...formData,
                target_roles: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Value Proposition & Key Signals
          </label>
          <textarea
            rows={4}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/80 transition-all shadow-inner leading-relaxed"
            value={formData.value_proposition}
            onChange={(e) =>
              setFormData({
                ...formData,
                value_proposition: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Target Industries"
            value={formData.industries}
            onChange={(e) =>
              setFormData({
                ...formData,
                industries: e.target.value,
              })
            }
          />

          <Input
            type="number"
            label="Minimum Company Size"
            value={formData.employee_count_min}
            onChange={(e) =>
              setFormData({
                ...formData,
                employee_count_min: Number(e.target.value),
              })
            }
          />

          <Input
            type="number"
            label="Maximum Company Size"
            value={formData.employee_count_max}
            onChange={(e) =>
              setFormData({
                ...formData,
                employee_count_max: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Workflow Steps Preview */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Autonomous 7-Agent Sequence
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Sequential Orchestration</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">1. Planner</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">2. ICP Match</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">3. Companies</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">4. Contacts</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">5. Research</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300">6. Hooks</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">7. Emails</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="w-full md:w-auto"
          >
            Launch AI Prospecting Pipeline
          </Button>
        </div>
      </form>
    </Card>
  );
};