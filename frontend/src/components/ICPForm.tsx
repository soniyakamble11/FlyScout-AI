import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

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
      title="Campaign Brief"
      subtitle="Configure the outbound campaign for discovering enterprise mining companies and generating personalized outreach."
    >
      {/* Hackathon Banner */}
      <div className="mb-6 rounded-xl border border-indigo-700/40 bg-indigo-950/20 p-4">
        <h2 className="text-indigo-300 font-semibold text-lg">
          🏆 FlytBase Outbound BDR Hiring Hackathon
        </h2>

        <p className="mt-2 text-sm text-slate-300 leading-6">
          This AI platform automatically:
        </p>

        <ul className="mt-3 text-sm text-slate-300 space-y-2 list-disc list-inside">
          <li>Identifies similar enterprise mining companies</li>
          <li>Finds relevant decision makers</li>
          <li>Researches companies using live public information</li>
          <li>Generates highly personalized outbound emails</li>
          <li>Provides explainable AI reasoning with source attribution</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <Input
          label="Campaign Name (Example Campaign)"
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
            label="FlytBase Solution"
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
            FlytBase Value Proposition
          </label>

          <textarea
            rows={5}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
            label="Target Vertical"
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

        {/* Workflow Summary */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">

          <h3 className="text-sm font-semibold text-slate-200 mb-3">
            AI Pipeline
          </h3>

          <div className="flex flex-wrap gap-2 text-xs">

            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
              Planner
            </span>

            <span>→</span>

            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
              ICP Matching
            </span>

            <span>→</span>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
              Company Discovery
            </span>

            <span>→</span>

            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
              Contact Discovery
            </span>

            <span>→</span>

            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300">
              Research
            </span>

            <span>→</span>

            <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300">
              Personalization
            </span>

            <span>→</span>

            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300">
              Email Generation
            </span>

          </div>

        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Launch AI Prospecting Pipeline
        </Button>

      </form>
    </Card>
  );
};