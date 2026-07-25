# Architecture & System Design

FlyScout AI is built on a state-driven multi-agent AI architecture:

## Core Agents
1. **Planner Agent**: Orchestrates state transitions & job execution.
2. **ICP Matching Agent**: Defines ICP scoring criteria.
3. **Company Discovery Agent**: Finds target accounts matching ICP via search.
4. **Contact Discovery Agent**: Finds decision-makers & verified emails.
5. **Research Agent**: Scrapes signals, news & company pain points.
6. **Personalization Agent**: Synthesizes buying triggers & outreach angles.
7. **Email Generation Agent**: Generates 3-step personalized email sequences.

## System Topology
```
[React + Vite Dashboard] <== (REST API / SSE Stream) ==> [FastAPI Engine] <==> [AI Multi-Agent Pipeline]
```
