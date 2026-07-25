import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { PipelineProgressEvent } from '../types';
import { Cpu, CheckCircle2, Loader2 } from 'lucide-react';

interface AgentPipelineProgressProps {
  events: PipelineProgressEvent[];
  isExecuting?: boolean;
}

export const AgentPipelineProgress: React.FC<AgentPipelineProgressProps> = ({
  events,
  isExecuting = false,
}) => {
  const steps = [
    { id: 'planner', label: '1. Planner Agent' },
    { id: 'icp_matching', label: '2. ICP Matching' },
    { id: 'company_discovery', label: '3. Company Discovery' },
    { id: 'contact_discovery', label: '4. Contact Discovery' },
    { id: 'research', label: '5. Deep AI Research' },
    { id: 'personalization', label: '6. Personalization Hooks' },
    { id: 'email_generation', label: '7. Email Generation' },
  ];

  return (
    <Card
      title="Live Multi-Agent Telemetry Stream"
      subtitle="Real-time execution status of 7 autonomous AI agents"
      headerAction={
        isExecuting ? (
          <Badge variant="info">
            <span className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Executing
            </span>
          </Badge>
        ) : (
          <Badge variant="success">Standby / Ready</Badge>
        )
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-6">
        {steps.map((s) => {
          const stepEvent = events.find((e) => e.step === s.id);
          const isDone = stepEvent?.status === 'completed';
          const isRunning = stepEvent?.status === 'executing';

          return (
            <div
              key={s.id}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : isRunning
                  ? 'bg-indigo-950/60 border-indigo-500/80 text-indigo-200 animate-pulse'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isRunning ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <Cpu className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <p className="text-[11px] font-semibold leading-tight">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950/90 rounded-lg border border-slate-800 p-3 max-h-48 overflow-y-auto font-mono text-xs text-slate-300 space-y-1">
        {events.length === 0 ? (
          <p className="text-slate-600 italic">No telemetry events logged. Trigger a campaign pipeline to view agent reasoning stream.</p>
        ) : (
          events.map((e, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-indigo-400 font-bold">[{e.step.toUpperCase()}]</span>
              <span className="text-slate-200">{e.message}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
