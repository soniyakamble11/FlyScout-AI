import React, { useState, useRef } from 'react';
import { ICPForm } from '../components/ICPForm';
import { AgentPipelineProgress } from '../components/AgentPipelineProgress';
import { ResultsView } from '../components/ResultsView';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { Company } from '../types';
import { campaignApi, pipelineApi } from '../services/api';
import { API_BASE_URL } from '../config/constants';
import { Building2, Users, Mail, BarChart3, Sparkles, AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [pipelineResults, setPipelineResults] = useState<Company[] | null>(null);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const esRef = useRef<EventSource | null>(null);

  const handleLaunchCampaign = async (formData: any) => {
    // Reset state
    setIsExecuting(true);
    setPipelineError(null);
    setPipelineResults(null);
    setEvents([]);
    setHasRun(true);

    // Close any prior SSE connection
    if (esRef.current) {
      esRef.current.close();
    }

    try {
      // 1. Create campaign in backend
      const campaign = await campaignApi.create({
        name: formData.name,
        product_name: formData.product_name,
        value_proposition: formData.value_proposition,
        target_icp: {
          industries: formData.industries.split(',').map((s: string) => s.trim()).filter(Boolean),
          employee_count_min: Number(formData.employee_count_min) || 50,
          employee_count_max: Number(formData.employee_count_max) || 500,
          geographies: ['North America'],
          target_roles: formData.target_roles.split(',').map((s: string) => s.trim()).filter(Boolean),
        },
      });

      // 2. Trigger pipeline
      const job = await pipelineApi.run(campaign.id, 3);

      // 3. Open SSE stream
      const es = new EventSource(`${API_BASE_URL}/pipeline/stream/${job.job_id}`);
      esRef.current = es;

      es.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          setEvents((prev) => [...prev, event]);

          // Graceful failure handling
          if (event.status === 'failed') {
            setPipelineError(event.message);
            setIsExecuting(false);
            es.close();
            return;
          }

          // Harvest final result from the email_generation step data_snippet
          if (event.step === 'email_generation' && event.status === 'completed') {
            console.log("========== FINAL EVENT ==========");
            console.log(event);

            const snippet =
              event.data_snippet ||
              event.result ||
              event.payload ||
              event.output ||
              event.data ||
              {};

            console.log("========== FINAL PAYLOAD ==========");
            console.log(snippet);

            const companies = buildCompaniesFromPipelineResult(snippet);

            console.log("========== COMPANIES ==========");
            console.log(companies);

            setPipelineResults(companies);
            setIsExecuting(false);
            es.close();
          }
        } catch (err) {
          console.error('Failed to parse SSE event', err);
        }
      };

      es.onerror = () => {
        setPipelineError('Lost connection to pipeline stream. The backend may still be running — please wait or retry.');
        setIsExecuting(false);
        es.close();
      };

    } catch (err: any) {
      setPipelineError(err?.response?.data?.error?.message || err?.message || 'Failed to connect to backend. Is the server running?');
      setIsExecuting(false);
    }
  };

  // Calculate statistics metrics
  const companiesCount = pipelineResults?.length || 0;
  const contactsCount = pipelineResults?.reduce((acc, c) => acc + (c.contacts?.length || 0), 0) || 0;
  const emailsCount = pipelineResults?.reduce((acc, c) => acc + (c.emails?.length || 0), 0) || 0;
  
  const completedEventsCount = events.filter((e) => e.status === 'completed').length;
  const progressPct = isExecuting
    ? Math.min(Math.round((completedEventsCount / 7) * 100), 95)
    : hasRun && !pipelineError
    ? 100
    : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Multi-Agent Prospecting Mesh
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight font-heading">
            FlyScout AI — Outbound BDR Control Center
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Autonomous multi-agent platform for signal-based B2B outreach: ICP targeting → Company discovery → Contact discovery → Deep research → Personalization → Email generation.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Companies */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Companies Discovered</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-heading">{companiesCount}</span>
            <span className="text-xs text-slate-500">enterprise accounts</span>
          </div>
        </div>

        {/* Stat 2: Contacts */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contacts Identified</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-heading">{contactsCount}</span>
            <span className="text-xs text-slate-500">decision makers</span>
          </div>
        </div>

        {/* Stat 3: Emails */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emails Generated</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-heading">{emailsCount}</span>
            <span className="text-xs text-slate-500">personalized sequences</span>
          </div>
        </div>

        {/* Stat 4: Progress */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Progress</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-heading">{progressPct}%</span>
            <span className="text-xs text-slate-500">{isExecuting ? 'running...' : hasRun ? 'complete' : 'standby'}</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step 1: Campaign Brief Form */}
      <ICPForm onSubmitCampaign={handleLaunchCampaign} isLoading={isExecuting} />

      {/* Step 2: Agent Execution Timeline & Telemetry */}
      {hasRun && (
        <AgentPipelineProgress events={events} isExecuting={isExecuting} />
      )}

      {/* Error State */}
      {pipelineError && (
        <div className="p-4 rounded-2xl border border-rose-800/60 bg-rose-950/30 text-rose-300 text-sm flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-rose-200">Pipeline Error: </span>
            <span>{pipelineError}</span>
          </div>
        </div>
      )}

      {/* Loading state while executing */}
      {isExecuting && (
        <Loader label="AI agents executing — gathering live data from Tavily & Gemini..." />
      )}

      {/* Step 3: Results — rendered from live pipeline output */}
      {!isExecuting && pipelineResults && pipelineResults.length > 0 && (
        <ResultsView companies={pipelineResults} />
      )}

      {/* No-results state */}
      {!isExecuting && hasRun && !pipelineError && pipelineResults && pipelineResults.length === 0 && (
        <EmptyState
          title="No Target Companies Found"
          description="Try broadening your ICP criteria (increase employee count range, add more industries) or check your Tavily API key."
        />
      )}

      {/* Pre-run State Hint */}
      {!hasRun && (
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/40 text-center text-xs text-slate-400 space-y-2 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-slate-300 font-semibold text-sm">Ready to launch outbound campaign</p>
          <p className="max-w-lg mx-auto leading-relaxed">
            Fill in your Campaign Brief above and click <span className="text-indigo-400 font-semibold">Launch AI Prospecting Pipeline</span> to begin. The 7-agent mesh will discover target accounts, find decision makers, research signals, and generate personalized emails.
          </p>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Helper: assemble the Company[] display model
// from the final pipeline SSE event data_snippet
// ─────────────────────────────────────────────
function buildCompaniesFromPipelineResult(snippet: any): Company[] {
  const rawCompanies =
    snippet.companies_data ||
    snippet.companies ||
    snippet.accounts ||
    [];
  const contactsByCompany =
    snippet.contacts_by_company ||
    snippet.contacts ||
    {};
  const researchBriefs =
    snippet.research_briefs ||
    snippet.research ||
    {};
  const personalizationNotes =
    snippet.personalization_notes ||
    snippet.personalization ||
    {};
  const emailsByContact =
    snippet.emails_by_contact ||
    snippet.emails ||
    {};

  return rawCompanies.map((comp: any) => {
    const compId = comp.id;
    const contacts = (contactsByCompany[compId] || []).map((c: any) => ({
      id: c.id || `cnt_${compId}`,
      company_id: compId,
      name: c.name,
      title: c.title,
      email: c.email,
      email_verified: c.email_verified,
      linkedin_url: c.linkedin_url,
    }));

    const brief = researchBriefs[compId];
    const persona = personalizationNotes[compId];

    // Flatten all emails across all contacts for this company
    const allEmails: any[] = contacts.flatMap((c: any) => emailsByContact[c.id] || []);

    return {
      id: compId,
      name: comp.name,
      domain: comp.domain,
      industry: comp.industry,
      employee_count: comp.employee_count,
      headquarters: comp.headquarters,
      icp_score: comp.icp_score,
      icp_confidence: comp.icp_confidence,
      icp_rationale: comp.icp_rationale,
      source_url: comp.source_url,
      contacts,
      research_brief: brief ? {
        company_id: compId,
        company_summary: brief.company_summary,
        recent_funding: brief.recent_news,
        recent_funding_source_url: brief.recent_news_source_url,
        hiring_signals: brief.hiring_signals,
        hiring_signals_source_url: brief.hiring_signals_source_url,
        technology_signals: brief.technology_signals,
        technology_signals_source_url: brief.technology_signals_source_url,
        expansion_signals: brief.expansion_signals,
        expansion_signals_source_url: brief.expansion_signals_source_url,
        key_challenges: brief.key_challenges,
        buying_hooks: brief.buying_hooks,
        // Grounded flags for UI transparency
        recent_news_grounded: brief.recent_news_grounded,
        technology_grounded: brief.technology_grounded,
        hiring_grounded: brief.hiring_grounded,
        expansion_grounded: brief.expansion_grounded,
      } : undefined,
      personalization_hooks: persona ? persona.hooks : [],
      emails: allEmails,
    };
  });
}
