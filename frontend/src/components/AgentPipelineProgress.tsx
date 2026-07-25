import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { PipelineProgressEvent } from '../types';
import { Cpu, CheckCircle2, Loader2, Terminal, Copy, Check, Activity } from 'lucide-react';

interface AgentPipelineProgressProps {
  events: PipelineProgressEvent[];
  isExecuting?: boolean;
}

export const AgentPipelineProgress: React.FC<AgentPipelineProgressProps> = ({
  events,
  isExecuting = false,
}) => {
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const steps = [
    { id: 'planner', label: '1. Planner Agent', desc: 'Validates brief & creates execution plan' },
    { id: 'icp_matching', label: '2. ICP Matching', desc: 'Refines target ICP criteria' },
    { id: 'company_discovery', label: '3. Company Discovery', desc: 'Discovers & ranks matching enterprise accounts' },
    { id: 'contact_discovery', label: '4. Contact Discovery', desc: 'Identifies key decision-maker contacts' },
    { id: 'research', label: '5. Deep AI Research', desc: 'Researches live public signals via Tavily' },
    { id: 'personalization', label: '6. Personalization Hooks', desc: 'Generates signal-grounded outreach hooks' },
    { id: 'email_generation', label: '7. Email Generation', desc: 'Drafts 3-touch personalized email sequence' },
  ];

  // Auto-scroll terminal on new events
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  const handleCopyLogs = () => {
    const logText = events
      .map((e) => `[${e.step.toUpperCase()}] status=${e.status} progress=${e.progress_pct}%: ${e.message}`)
      .join('\n');
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Agent Vertical Timeline Pane */}
      <div className="lg:col-span-5">
        <Card
          title={
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span className="text-base font-bold text-slate-100">Agent Pipeline Timeline</span>
            </div>
          }
          subtitle="Real-time execution state of 7 autonomous agents"
          headerAction={
            isExecuting ? (
              <Badge variant="info">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" /> Executing
                </span>
              </Badge>
            ) : (
              <Badge variant={events.length > 0 ? 'success' : 'default'}>
                {events.length > 0 ? 'Completed' : 'Standby'}
              </Badge>
            )
          }
          className="h-full"
        >
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800/80">
            {steps.map((s, idx) => {
              const stepEvent = events.find((e) => e.step === s.id);
              const isDone = stepEvent?.status === 'completed';
              const isRunning = stepEvent?.status === 'executing';
              const isFailed = stepEvent?.status === 'failed';

              return (
                <div key={s.id} className="relative group">
                  {/* Vertical Node Indicator */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-4 ring-emerald-500/10'
                        : isRunning
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40 ring-4 ring-indigo-500/20 animate-pulse'
                        : isFailed
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                        : 'bg-slate-900 border border-slate-700 text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isRunning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Card Content */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                        : isRunning
                        ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30 text-indigo-100 shadow-lg'
                        : isFailed
                        ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{s.label}</h4>
                      {isDone && <span className="text-[10px] text-emerald-400 font-medium">100%</span>}
                      {isRunning && <span className="text-[10px] text-indigo-400 font-mono animate-pulse">Running...</span>}
                      {!isDone && !isRunning && <span className="text-[10px] text-slate-500">Pending</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</p>

                    {/* Progress Bar when running */}
                    {isRunning && (
                      <div className="mt-2.5 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full animate-pulse w-3/4"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 2. Live Telemetry Stream Terminal Pane */}
      <div className="lg:col-span-7">
        <Card
          title={
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span className="text-base font-bold text-slate-100">Live Telemetry Stream</span>
            </div>
          }
          subtitle="Server-Sent Events (SSE) reasoning log & payload stream"
          headerAction={
            <div className="flex items-center space-x-2">
              {events.length > 0 && (
                <button
                  onClick={handleCopyLogs}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition"
                  title="Copy telemetry log"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-xs text-indigo-300 font-mono">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>SSE Stream</span>
              </div>
            </div>
          }
          className="h-full flex flex-col"
        >
          {/* Terminal Window Box */}
          <div className="terminal-window rounded-xl p-4 font-mono text-xs text-slate-300 flex-1 min-h-[380px] max-h-[520px] overflow-y-auto space-y-2.5">
            {events.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                <Terminal className="w-8 h-8 text-slate-700 animate-pulse" />
                <p className="text-xs font-mono">No active telemetry events logged.</p>
                <p className="text-[11px] text-slate-600 max-w-sm">
                  Click <span className="text-indigo-400">Launch AI Prospecting Pipeline</span> above to initiate the 7-agent mesh and view real-time streaming telemetry.
                </p>
              </div>
            ) : (
              events.map((e, idx) => {
                const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
                const isComp = e.status === 'completed';
                const isExec = e.status === 'executing';

                return (
                  <div key={idx} className="flex items-start space-x-2 leading-relaxed border-b border-slate-900/60 pb-2">
                    <span className="text-slate-500 font-mono text-[10px] select-none">[{timeStr}]</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase select-none ${
                        isComp
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : isExec
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {e.step.replace('_', ' ')}
                    </span>
                    <span className="text-slate-200 flex-1">{e.message}</span>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
        </Card>
      </div>
    </div>
  );
};
