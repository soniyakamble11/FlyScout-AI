import React, { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { EmptyState } from './EmptyState';
import { Company, Contact, PersonalizationHook, EmailStep } from '../types';
import {
  Building2, UserCheck, Sparkles, Mail, CheckCircle2, TrendingUp,
  DollarSign, Target, ExternalLink, Cpu, AlertTriangle, Info
} from 'lucide-react';

interface ResultsViewProps {
  companies: Company[];
}

const SourceLink: React.FC<{ url?: string; label?: string }> = ({ url, label = 'Source' }) => {
  if (!url) return null;
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-indigo-400 underline hover:text-indigo-200 transition ml-2"
    >
      <ExternalLink className="w-2.5 h-2.5" /> {label}
    </a>
  );
};

const GroundedBadge: React.FC<{ grounded?: boolean }> = ({ grounded }) => (
  grounded
    ? <Badge variant="success"><span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live Signal</span></Badge>
    : <Badge variant="warning"><span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> No Signal Found</span></Badge>
);

export const ResultsView: React.FC<ResultsViewProps> = ({ companies }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [activeEmailStep, setActiveEmailStep] = useState<number>(0);

  if (!companies || companies.length === 0) {
    return (
      <EmptyState
        title="No Results Generated"
        description="The pipeline ran but found no matching companies. Try broadening your ICP criteria."
      />
    );
  }

  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];
  const contacts: Contact[] = activeCompany?.contacts || [];
  const research = activeCompany?.research_brief;
  const hooks: PersonalizationHook[] = activeCompany?.personalization_hooks || [];
  const emails: EmailStep[] = activeCompany?.emails || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" /> Pipeline Results
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          All data sourced from live Tavily web search. Source URLs shown for every signal.
        </p>
      </div>

      {/* 1. Company Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" /> 1. Target Company Cards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div
              key={c.id}
              onClick={() => { setSelectedCompanyId(c.id); setActiveEmailStep(0); }}
              className={`cursor-pointer glass-card p-4 rounded-xl transition-all border ${
                selectedCompanyId === c.id
                  ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm leading-tight">{c.name}</h4>
                  <p className="text-xs font-mono text-indigo-300">{c.domain}</p>
                </div>
                <Badge variant={c.icp_score >= 80 ? 'success' : c.icp_score >= 60 ? 'info' : 'warning'}>
                  {c.icp_score}%
                </Badge>
              </div>
              <div className="text-xs text-slate-400 space-y-0.5">
                <p><span className="text-slate-500">Industry:</span> {c.industry || 'Technology'}</p>
                {c.employee_count && <p><span className="text-slate-500">Employees:</span> {c.employee_count}</p>}
                {c.icp_confidence && <p><span className="text-slate-500">Search confidence:</span> {c.icp_confidence}%</p>}
              </div>
              {c.source_url && (
                <div className="mt-2">
                  <SourceLink url={c.source_url} label="Discovery Source" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. ICP Match Reasoning */}
      <Card title="2. Algorithmic ICP Match Reasoning" subtitle="Why this account matched your ICP criteria">
        <div className="bg-indigo-950/30 border border-indigo-800/40 p-4 rounded-xl flex items-start space-x-3 text-xs">
          <Target className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-slate-100">Vector Match Analysis — {activeCompany.name}</p>
              <Badge variant={activeCompany.icp_score >= 80 ? 'success' : 'info'}>{activeCompany.icp_score}% ICP Fit</Badge>
              {activeCompany.icp_confidence && (
                <Badge variant="default">Search Confidence: {activeCompany.icp_confidence}%</Badge>
              )}
            </div>
            <p className="leading-relaxed text-slate-300">{activeCompany.icp_rationale || 'ICP rationale not available.'}</p>
            <SourceLink url={activeCompany.source_url} label="Discovery Source URL" />
          </div>
        </div>
      </Card>

      {/* 3 & 4: Contacts + Research */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Contact Cards */}
        <Card title="3. Contact Discovery" subtitle="Decision-makers identified at company">
          {contacts.length === 0 ? (
            <EmptyState
              title="No Contacts Found"
              description="Hunter API returned no results. Try a different domain or check API key."
            />
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="glass-card p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                        {contact.name}
                        {contact.is_fallback && (
                          <span className="text-[10px] text-amber-400 font-normal border border-amber-800/50 px-1.5 rounded-full">Pattern Only</span>
                        )}
                      </h4>
                      <p className="text-xs text-indigo-300 font-medium">{contact.title}</p>
                      {contact.email && (
                        <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" /> {contact.email}
                        </p>
                      )}
                      {contact.linkedin_url && (
                        <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-indigo-400 underline flex items-center gap-1 mt-1">
                          <ExternalLink className="w-2.5 h-2.5" /> LinkedIn Profile
                        </a>
                      )}
                    </div>
                    <Badge variant={contact.email_verified ? 'success' : 'warning'}>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {contact.email_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 4. Research Brief — all 5 dimensions with source URLs */}
        <Card title="4. Company Research Brief" subtitle="Live signals with web source attributions">
          {!research ? (
            <EmptyState title="No Research Data" description="Research agent returned no data for this company." />
          ) : (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <p className="font-semibold text-slate-300 mb-1">Overview</p>
                <p className="text-slate-400 leading-relaxed">{research.company_summary}</p>
              </div>

              {/* Funding / News */}
              <div className={`p-3 rounded-lg border ${research.recent_news_grounded ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-semibold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Funding & News
                  </h5>
                  <div className="flex items-center gap-1">
                    <GroundedBadge grounded={research.recent_news_grounded} />
                    <SourceLink url={research.recent_funding_source_url} />
                  </div>
                </div>
                <p className="leading-relaxed">{research.recent_funding || 'No signal found.'}</p>
              </div>

              {/* Hiring */}
              <div className={`p-3 rounded-lg border ${research.hiring_grounded ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Hiring Signals
                  </h5>
                  <div className="flex items-center gap-1">
                    <GroundedBadge grounded={research.hiring_grounded} />
                    <SourceLink url={research.hiring_signals_source_url} />
                  </div>
                </div>
                <p className="leading-relaxed">{research.hiring_signals || 'No signal found.'}</p>
              </div>

              {/* Technology */}
              <div className={`p-3 rounded-lg border ${research.technology_grounded ? 'bg-indigo-950/20 border-indigo-800/40 text-indigo-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-semibold flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> Technology Investments
                  </h5>
                  <div className="flex items-center gap-1">
                    <GroundedBadge grounded={research.technology_grounded} />
                    <SourceLink url={research.technology_signals_source_url} />
                  </div>
                </div>
                <p className="leading-relaxed">{research.technology_signals || 'No signal found.'}</p>
              </div>

              {/* Expansion */}
              <div className={`p-3 rounded-lg border ${research.expansion_grounded ? 'bg-violet-950/20 border-violet-800/40 text-violet-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Expansion & Growth
                  </h5>
                  <div className="flex items-center gap-1">
                    <GroundedBadge grounded={research.expansion_grounded} />
                    <SourceLink url={research.expansion_signals_source_url} />
                  </div>
                </div>
                <p className="leading-relaxed">{research.expansion_signals || 'No signal found.'}</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 5. Personalization Notes — grounded with explicit reasoning */}
      <Card title="5. Personalization Hooks & Reasoning" subtitle="Strategic angles derived from research — each hook explains WHY it was chosen">
        {hooks.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No personalization hooks generated.</p>
        ) : (
          <div className="space-y-3">
            {hooks.map((hook, idx) => (
              <div key={idx} className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{hook.hook_type.replace('_', ' ').toUpperCase()}</Badge>
                  <SourceLink url={hook.source_url} label="Signal Source" />
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Why this hook:</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{hook.reasoning}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Outreach angle:</span>
                  <p className="text-indigo-300 mt-0.5 font-medium">{hook.outreach_angle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 6. Generated Email Sequence — with grounded signal citation */}
      <Card title="6. Generated Email Sequence" subtitle="3-touch cold email — Line 1 references research signal shown below">
        {emails.length === 0 ? (
          <EmptyState title="No Emails Generated" description="No contacts were available for email generation." />
        ) : (
          <>
            <div className="flex border-b border-slate-800 mb-4 space-x-1 overflow-x-auto">
              {emails.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveEmailStep(idx)}
                  className={`flex-shrink-0 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition ${
                    activeEmailStep === idx
                      ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Step {step.step_number}: {step.step_name}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {/* Grounded signal callout */}
              {emails[activeEmailStep]?.grounded_signal && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-3 flex items-start gap-2 text-xs text-emerald-200">
                  <Info className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-300">Line 1 grounded in: </span>
                    <span className="italic">&quot;{emails[activeEmailStep].grounded_signal}&quot;</span>
                    <SourceLink url={emails[activeEmailStep].signal_source_url} label="Verify signal" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Subject Line</label>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-indigo-200 font-medium">
                  {emails[activeEmailStep]?.subject}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Email Body</label>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {emails[activeEmailStep]?.body}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
