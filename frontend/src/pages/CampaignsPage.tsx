import React from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export const CampaignsPage: React.FC = () => {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">
          FlytBase Outbound BDR Campaign
        </h1>

        <p className="mt-2 text-slate-400">
          AI-powered outbound prospecting workflow for discovering enterprise
          mining companies, researching decision makers, and generating
          personalized outreach.
        </p>
      </div>

      {/* Campaign Brief */}
      <Card title="Campaign Brief">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <h3 className="text-sm text-slate-400">
              Reference Company
            </h3>

            <p className="font-semibold text-slate-100">
              Sociedad Química y Minera de Chile (SQM)
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Target Vertical
            </h3>

            <p className="font-semibold text-slate-100">
              Large-scale Lithium, Copper & Iron Ore Mining
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Target Region
            </h3>

            <p className="font-semibold text-slate-100">
              Latin America
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Target Decision Makers
            </h3>

            <p className="font-semibold text-slate-100">
              Head of Operations • VP HSE • Site Director
            </p>
          </div>

        </div>

      </Card>

      {/* FlytBase Value Proposition */}

      <Card title="FlytBase Value Proposition">

        <p className="text-slate-300 leading-7">

          FlytBase enables autonomous drone operations for industrial
          inspections across hazardous mining environments.

          The platform helps enterprises reduce operational risk,
          improve worker safety,
          automate inspection workflows,
          and increase operational efficiency across 24/7 extraction sites.

        </p>

      </Card>

      {/* Campaign Status */}

      <Card title="Campaign Status">

        <div className="flex justify-between items-center">

          <div>

            <h3 className="font-semibold text-slate-100">
              Mining Campaign
            </h3>

            <p className="text-sm text-slate-400">
              Ready to discover similar enterprise mining companies.
            </p>

          </div>

          <Badge variant="success">
            Ready
          </Badge>

        </div>

      </Card>

    </div>
  );
};