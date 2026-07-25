export interface TargetICP {
  industries: string[];
  employee_count_min: number;
  employee_count_max: number;
  geographies: string[];
  target_roles: string[];
}

export interface Campaign {
  id: string;
  name: string;
  product_name: string;
  value_proposition: string;
  target_icp: TargetICP;
  status: 'draft' | 'running' | 'completed' | 'failed';
  created_at?: string;
}

export interface Contact {
  id: string;
  company_id: string;
  name: string;
  title: string;
  email?: string;
  email_verified: boolean;
  linkedin_url?: string;
  is_fallback?: boolean;  // True when email was pattern-generated, not verified
}

export interface PersonalizationHook {
  hook_type: 'funding_signal' | 'tech_signal' | 'hiring_signal' | 'expansion_signal' | 'general';
  reasoning: string;
  outreach_angle: string;
  source_url: string;
}

export interface ResearchBrief {
  company_id: string;
  company_summary: string;
  // Funding / news
  recent_funding?: string;
  recent_funding_source_url?: string;
  recent_news_grounded?: boolean;
  // Hiring
  hiring_signals?: string;
  hiring_signals_source_url?: string;
  hiring_grounded?: boolean;
  // Technology
  technology_signals?: string;
  technology_signals_source_url?: string;
  technology_grounded?: boolean;
  // Expansion
  expansion_signals?: string;
  expansion_signals_source_url?: string;
  expansion_grounded?: boolean;
  // Misc
  key_challenges?: string;
  buying_hooks: string[];
}

export interface EmailStep {
  id: string;
  contact_id: string;
  step_number: number;
  step_name: string;
  subject: string;
  body: string;
  grounded_signal?: string;      // The exact research snippet used in Line 1
  signal_source_url?: string;    // URL of the source for that signal
  status: 'generated' | 'edited' | 'sent';
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry?: string;
  employee_count?: number;
  headquarters?: string;
  icp_score: number;
  icp_confidence?: number;       // 0-100 from Tavily search score
  icp_rationale?: string;
  source_url?: string;           // Web source URL for this company
  contacts?: Contact[];
  research_brief?: ResearchBrief;
  personalization_hooks?: PersonalizationHook[];
  emails?: EmailStep[];
}

export type PipelineStep =
  | 'planner'
  | 'icp_matching'
  | 'company_discovery'
  | 'contact_discovery'
  | 'research'
  | 'personalization'
  | 'email_generation'
  | 'finished';

export interface PipelineProgressEvent {
  job_id: string;
  step: PipelineStep;
  status: 'idle' | 'initializing' | 'executing' | 'completed' | 'failed';
  message: string;
  progress_pct: number;
  data_snippet?: Record<string, any>;
}
