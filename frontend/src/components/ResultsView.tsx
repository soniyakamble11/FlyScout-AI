import React, { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { EmptyState } from './EmptyState';
import { Company, Contact, PersonalizationHook, EmailStep } from '../types';
import {
  Building2, UserCheck, Sparkles, Mail, CheckCircle2, TrendingUp,
  DollarSign, Target, ExternalLink, Cpu, AlertTriangle, Info, Copy, Check,
  ChevronDown, ChevronUp, FileText
} from 'lucide-react';

interface ResultsViewProps {
  companies: Company[];
}

const SourceLink: React.FC<{ url?: string; label?: string }> = ({ url, label = 'Source' }) => {
  if (!url) return null;
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-indigo-400 underline hover:text-indigo-300 transition-colors ml-2"
    >
      <ExternalLink className="w-2.5 h-2.5" /> {label}
    </a>
  );
};

const GroundedBadge: React.FC<{ grounded?: boolean }> = ({ grounded }) => (
  grounded
    ? <Badge variant="success"><span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live Signal</span></Badge>
    : <Badge variant="warning"><span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> No Signal</span></Badge>
);

export const ResultsView: React.FC<ResultsViewProps> = ({ companies }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [activeEmailStep, setActiveEmailStep] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  // Accordion state for research brief dimensions
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    summary: true,
    funding: true,
    hiring: true,
    tech: true,
    expansion: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const handleCopy = (text: string, type: 'email' | 'subject' | 'body', id?: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'email' && id) {
      setCopiedEmail(id);
      setTimeout(() => setCopiedEmail(null), 2000);
    } else if (type === 'subject') {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else if (type === 'body') {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pt-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-heading">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Discovered Prospect Results
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sourced via live web research with full signal groundings and source attributions.
          </p>
        </div>
        <Badge variant="success">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Completed
          </span>
        </Badge>
      </div>

      {/* 1. Company Cards Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Target Accounts ({companies.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companies.map((c) => {
            const isSelected = selectedCompanyId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => { setSelectedCompanyId(c.id); setActiveEmailStep(0); }}
                className={`cursor-pointer glass-card p-5 rounded-2xl transition-all duration-200 border relative overflow-hidden ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/50'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
                )}
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm leading-tight group-hover:text-indigo-300">{c.name}</h4>
                    <p className="text-xs font-mono text-indigo-400 mt-0.5">{c.domain}</p>
                  </div>
                  <Badge variant={c.icp_score >= 80 ? 'success' : c.icp_score >= 60 ? 'info' : 'warning'}>
                    {c.icp_score}% Match
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mt-3 pt-3 border-t border-slate-800/60">
                  <p><span className="text-slate-500 font-medium">Industry:</span> {c.industry || 'Technology'}</p>
                  {c.employee_count && <p><span className="text-slate-500 font-medium">Employees:</span> {c.employee_count.toLocaleString()}</p>}
                  {c.icp_confidence && <p><span className="text-slate-500 font-medium">Confidence:</span> {c.icp_confidence}%</p>}
                </div>
                {c.source_url && (
                  <div className="mt-3">
                    <SourceLink url={c.source_url} label="Discovery Source" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ICP Match Reasoning */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span className="text-base font-bold text-slate-100">Algorithmic ICP Match Rationale</span>
          </div>
        }
        subtitle="Vector match breakdown for account targeting"
      >
        <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-xl flex items-start space-x-3 text-xs">
          <Target className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-100 text-sm">Account Match Analysis — {activeCompany.name}</p>
              <Badge variant={activeCompany.icp_score >= 80 ? 'success' : 'info'}>{activeCompany.icp_score}% ICP Fit</Badge>
              {activeCompany.icp_confidence && (
                <Badge variant="default">Confidence: {activeCompany.icp_confidence}%</Badge>
              )}
            </div>
            <p className="leading-relaxed text-slate-300">{activeCompany.icp_rationale || 'ICP rationale not available.'}</p>
            <SourceLink url={activeCompany.source_url} label="Discovery Source URL" />
          </div>
        </div>
      </Card>

      {/* 3 & 4: Contacts + Research Brief Accordions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Contact Cards */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span className="text-base font-bold text-slate-100">Contact Discovery ({contacts.length})</span>
            </div>
          }
          subtitle={`Decision-makers identified at ${activeCompany.name}`}
        >
          {contacts.length === 0 ? (
            <EmptyState
              title="No Contacts Found"
              description="Contact discovery agent returned no contacts for this domain."
            />
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-slate-700">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                        {contact.name}
                        {contact.is_fallback && (
                          <span className="text-[10px] text-amber-400 border border-amber-800/50 px-1.5 py-0.5 rounded-full font-mono">Pattern</span>
                        )}
                      </h4>
                      <p className="text-xs text-indigo-300 font-medium">{contact.title}</p>
                      {contact.email && (
                        <div className="flex items-center gap-2 pt-1">
                          <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            <Mail className="w-3.5 h-3.5 text-indigo-400" /> {contact.email}
                          </p>
                          <button
                            onClick={() => handleCopy(contact.email || '', 'email', contact.id)}
                            className="p-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 transition"
                            title="Copy email"
                          >
                            {copiedEmail === contact.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                      {contact.linkedin_url && (
                        <a
                          href={contact.linkedin_url} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] text-indigo-400 underline inline-flex items-center gap-1 pt-1"
                        >
                          <ExternalLink className="w-3 h-3" /> LinkedIn Profile
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

        {/* 4. Research Brief Accordions */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span className="text-base font-bold text-slate-100">Deep AI Research Brief</span>
            </div>
          }
          subtitle="Live company signals with web source attributions"
        >
          {!research ? (
            <EmptyState title="No Research Data" description="Research agent returned no data for this company." />
          ) : (
            <div className="space-y-3 text-xs">
              {/* Accordion 1: Company Overview */}
              <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                <button
                  onClick={() => toggleAccordion('summary')}
                  className="w-full p-3 flex items-center justify-between font-semibold text-slate-200 bg-slate-900/60 hover:bg-slate-900 transition"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Company Overview
                  </span>
                  {openAccordions.summary ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openAccordions.summary && (
                  <div className="p-3 text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {research.company_summary}
                  </div>
                )}
              </div>

              {/* Accordion 2: Funding & News */}
              <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                <button
                  onClick={() => toggleAccordion('funding')}
                  className="w-full p-3 flex items-center justify-between font-semibold text-slate-200 bg-slate-900/60 hover:bg-slate-900 transition"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Funding & Financial Signals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GroundedBadge grounded={research.recent_news_grounded} />
                    {openAccordions.funding ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                {openAccordions.funding && (
                  <div className="p-3 text-slate-300 leading-relaxed border-t border-slate-800/60 space-y-2">
                    <p>{research.recent_funding || 'No signal found.'}</p>
                    <SourceLink url={research.recent_funding_source_url} label="Verify Source" />
                  </div>
                )}
              </div>

              {/* Accordion 3: Hiring Signals */}
              <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                <button
                  onClick={() => toggleAccordion('hiring')}
                  className="w-full p-3 flex items-center justify-between font-semibold text-slate-200 bg-slate-900/60 hover:bg-slate-900 transition"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hiring Signals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GroundedBadge grounded={research.hiring_grounded} />
                    {openAccordions.hiring ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                {openAccordions.hiring && (
                  <div className="p-3 text-slate-300 leading-relaxed border-t border-slate-800/60 space-y-2">
                    <p>{research.hiring_signals || 'No signal found.'}</p>
                    <SourceLink url={research.hiring_signals_source_url} label="Verify Source" />
                  </div>
                )}
              </div>

              {/* Accordion 4: Tech Investments */}
              <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                <button
                  onClick={() => toggleAccordion('tech')}
                  className="w-full p-3 flex items-center justify-between font-semibold text-slate-200 bg-slate-900/60 hover:bg-slate-900 transition"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Technology Investments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GroundedBadge grounded={research.technology_grounded} />
                    {openAccordions.tech ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                {openAccordions.tech && (
                  <div className="p-3 text-slate-300 leading-relaxed border-t border-slate-800/60 space-y-2">
                    <p>{research.technology_signals || 'No signal found.'}</p>
                    <SourceLink url={research.technology_signals_source_url} label="Verify Source" />
                  </div>
                )}
              </div>

              {/* Accordion 5: Expansion & Growth */}
              <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                <button
                  onClick={() => toggleAccordion('expansion')}
                  className="w-full p-3 flex items-center justify-between font-semibold text-slate-200 bg-slate-900/60 hover:bg-slate-900 transition"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>Expansion & Growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GroundedBadge grounded={research.expansion_grounded} />
                    {openAccordions.expansion ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                {openAccordions.expansion && (
                  <div className="p-3 text-slate-300 leading-relaxed border-t border-slate-800/60 space-y-2">
                    <p>{research.expansion_signals || 'No signal found.'}</p>
                    <SourceLink url={research.expansion_signals_source_url} label="Verify Source" />
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 5. Personalization Hooks */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-base font-bold text-slate-100">Personalization Hooks & Outreach Angles</span>
          </div>
        }
        subtitle="Strategic outreach angles derived directly from researched signals"
      >
        {hooks.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No personalization hooks generated.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hooks.map((hook, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl border border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{hook.hook_type.replace('_', ' ').toUpperCase()}</Badge>
                  <SourceLink url={hook.source_url} label="Signal Source" />
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Why this hook was selected:</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{hook.reasoning}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400 font-semibold block text-[11px]">Outreach Angle:</span>
                  <p className="text-indigo-300 font-medium mt-0.5">{hook.outreach_angle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 6. Generated Email Sequence inside Editor Card with Copy Buttons */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            <span className="text-base font-bold text-slate-100">Generated Email Sequence</span>
          </div>
        }
        subtitle="3-touch signal-grounded cold outreach sequence"
      >
        {emails.length === 0 ? (
          <EmptyState title="No Emails Generated" description="No contacts were available for email generation." />
        ) : (
          <div className="space-y-4">
            {/* Sequence Step Switcher Tabs */}
            <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto">
              {emails.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveEmailStep(idx)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                    activeEmailStep === idx
                      ? 'bg-slate-900 text-indigo-300 border-t-2 border-x border-b-0 border-indigo-500 border-x-slate-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Step {step.step_number}: {step.step_name}
                </button>
              ))}
            </div>

            {/* Grounded signal callout banner */}
            {emails[activeEmailStep]?.grounded_signal && (
              <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-200">
                <Info className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-300">Signal Grounding: </span>
                  <span className="italic">&quot;{emails[activeEmailStep].grounded_signal}&quot;</span>
                  <SourceLink url={emails[activeEmailStep].signal_source_url} label="Verify Source" />
                </div>
              </div>
            )}

            {/* Subject Line Editor Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Subject Line</label>
                <button
                  onClick={() => handleCopy(emails[activeEmailStep]?.subject || '', 'subject')}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  {copiedSubject ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSubject ? 'Copied' : 'Copy Subject'}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-medium text-indigo-200">
                {emails[activeEmailStep]?.subject}
              </div>
            </div>

            {/* Email Body Editor Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Email Body</label>
                <button
                  onClick={() => handleCopy(emails[activeEmailStep]?.body || '', 'body')}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  {copiedBody ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBody ? 'Copied' : 'Copy Body'}</span>
                </button>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {emails[activeEmailStep]?.body}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
