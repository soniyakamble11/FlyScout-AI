from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.core.enums import PipelineStep, AgentStatus

class PipelineRunRequestSchema(BaseModel):
    campaign_id: str = Field(..., description="Target campaign ID to execute pipeline against")
    company_limit: int = Field(default=3, ge=1, le=10, description="Max companies to discover")

class PipelineRunResponseSchema(BaseModel):
    job_id: str = Field(..., description="Unique background execution job ID")
    campaign_id: str = Field(..., description="Campaign ID associated with job")
    status: AgentStatus = Field(default=AgentStatus.INITIALIZING, description="Current execution state")
    started_at: str = Field(..., description="Execution start timestamp")

class PipelineProgressEventSchema(BaseModel):
    job_id: str = Field(..., description="Background job ID")
    step: PipelineStep = Field(..., description="Active pipeline step")
    status: AgentStatus = Field(..., description="Step execution status")
    message: str = Field(..., description="Human readable progress log message")
    progress_pct: int = Field(..., ge=0, le=100, description="Completion percentage")
    data_snippet: Optional[Dict[str, Any]] = Field(None, description="Optional step output payload preview")
