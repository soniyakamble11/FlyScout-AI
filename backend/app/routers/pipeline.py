import asyncio
import json
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from app.schemas.pipeline import PipelineRunRequestSchema, PipelineRunResponseSchema
from app.agents.planner_agent import PlannerAgent
from app.services.storage_service import storage_instance
from app.utils.helpers import generate_uuid, get_utc_now_iso
from app.core.enums import AgentStatus
from app.logging.logger import logger

router = APIRouter(prefix="/pipeline", tags=["Pipeline"])

# Single global planner instance (stateless agents, safe to share)
planner = PlannerAgent()


@router.post("/run", response_model=PipelineRunResponseSchema, summary="Run Pipeline")
async def run_pipeline(payload: PipelineRunRequestSchema):
    """
    Accept a campaign_id + company_limit and register a background job.
    The job ID is returned immediately; the frontend then opens /stream/{job_id}.
    """
    job_id = generate_uuid("job")
    job_record = {
        "job_id": job_id,
        "campaign_id": payload.campaign_id,
        "company_limit": payload.company_limit,
        # Use string value so Pydantic response_model serialisation works cleanly
        "status": AgentStatus.EXECUTING.value,
        "started_at": get_utc_now_iso(),
    }
    await storage_instance.save("jobs", job_id, job_record)
    logger.info(f"[Pipeline] Job {job_id} created for campaign {payload.campaign_id}")
    return job_record


@router.get("/stream/{job_id}", summary="Stream Pipeline Telemetry (SSE)")
async def stream_pipeline_progress(job_id: str):
    """
    Server-Sent Events endpoint. Streams one JSON event per agent step.
    The final email_generation event carries the complete pipeline dataset in data_snippet.
    """

    async def event_generator():
        try:
            job_record = await storage_instance.get("jobs", job_id)
            if not job_record:
                logger.warning(f"[Pipeline SSE] Job {job_id} not found in storage")

            company_limit = (job_record or {}).get("company_limit", 3)
            campaign_id = (job_record or {}).get("campaign_id", "")
            campaign = await storage_instance.get("campaigns", campaign_id) if campaign_id else None

            # Build campaign brief — use stored campaign or safe defaults
            campaign_brief: dict = campaign or {
                "name": "FlyScout Outreach Campaign",
                "product_name": "FlytScale AI",
                "value_proposition": (
                    "Automates cloud infrastructure scaling for high-growth SaaS "
                    "engineering teams, reducing AWS bills by up to 35% using "
                    "predictive workload modeling."
                ),
                "target_icp": {
                    "industries": ["Cloud SaaS", "Fintech", "Developer Tools"],
                    "employee_count_min": 50,
                    "employee_count_max": 500,
                    "geographies": ["North America"],
                    "target_roles": ["VP Engineering", "CTO", "Head of DevOps"],
                },
            }
            campaign_brief["company_limit"] = company_limit

            logger.info(
                f"[Pipeline SSE] Starting stream for job {job_id} "
                f"(campaign={campaign_brief.get('name')}, limit={company_limit})"
            )

            async for event in planner.execute_and_stream(campaign_brief):
                await asyncio.sleep(0.3)  # Slight delay so UI can render each step
                payload = {
                    "job_id": job_id,
                    "step": event["step"],
                    "status": event["status"],
                    "message": event["message"],
                    "progress_pct": event["progress_pct"],
                    "data_snippet": event.get("data_snippet", {}),
                }
                yield f"data: {json.dumps(payload, default=str)}\n\n"

        except Exception as e:
            logger.error(f"[Pipeline SSE] Fatal error in job {job_id}: {e}", exc_info=True)
            error_payload = {
                "job_id": job_id,
                "step": "planner",
                "status": "failed",
                "message": f"Pipeline error: {str(e)}",
                "progress_pct": 0,
                "data_snippet": {},
            }
            yield f"data: {json.dumps(error_payload)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Disable Nginx buffering
        },
    )
