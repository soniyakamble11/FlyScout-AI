from enum import Enum

class EnvironmentType(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"

class AgentStatus(str, Enum):
    IDLE = "idle"
    INITIALIZING = "initializing"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"

class PipelineStep(str, Enum):
    PLANNER = "planner"
    ICP_MATCHING = "icp_matching"
    COMPANY_DISCOVERY = "company_discovery"
    CONTACT_DISCOVERY = "contact_discovery"
    RESEARCH = "research"
    PERSONALIZATION = "personalization"
    EMAIL_GENERATION = "email_generation"
    FINISHED = "finished"

class CampaignStatus(str, Enum):
    DRAFT = "draft"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
