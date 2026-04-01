# Build Plan — Harness

## What does this project actually do?

Harness (revfactory/harness) is a Claude Code plugin that acts as a **meta-skill for designing agent teams**. You describe a domain ("build a harness for deep research"), and it generates a full set of agent definitions + skills organized into one of 6 architectural patterns (Pipeline, Fan-out/Fan-in, Expert Pool, Producer-Reviewer, Supervisor, Hierarchical Delegation). The output is `.claude/agents/` and `.claude/skills/` directories.

The core value: structured pre-configuration of multi-agent systems, turning a vague domain need into a concrete, coordinated agent team.

## Where does it fit?

**Agent household infrastructure.** Daniel's five-agent household (Eve, Wilson, Pepper, Radar, C-3PO) already runs on OpenClaw with SOUL.md/AGENTS.md conventions, custom skills, and inter-agent messaging. A visual harness designer would let Daniel:

1. **Design new agent team configurations visually** — instead of writing SKILL.md/AGENTS.md files from scratch, sketch the architecture and let it generate the scaffolding
2. **Visualize existing team patterns** — see how the current household maps to architectural patterns
3. **Experiment with team compositions** — try different patterns (Pipeline vs Fan-out vs Supervisor) for a given domain before committing

## What's the scoped MVP?

A **visual agent team designer** — browser-based tool where you:

1. **Pick an architectural pattern** from the 6 options (with visual diagrams showing the flow)
2. **Define agents** — name, role, capabilities, which agents they communicate with
3. **Define connections** — data flow between agents, with labels for what's passed
4. **See it rendered** as an interactive node graph (drag agents around, see connections)
5. **Generate output** — export the team config as markdown (AGENTS.md-style) or JSON
6. **Load example teams** — pre-built examples including Daniel's household config

The "wow" element: an **interactive node graph** where you drag agents around and connections animate. Not just a form — a visual canvas.

**No real API calls needed.** This is a design/planning tool, not an execution engine. All client-side.

## Tech Stack

- Vite + React + TypeScript + Tailwind CSS
- **React Flow** (@xyflow/react) for the interactive node graph — proven library, handles drag/drop/connections out of the box
- Static export (no server needed)

## Build Tasks

1. **Data model + state management** — Agent type, Connection type, Pattern type, Zustand store for the team state
2. **Pattern selector** — 6 cards with visual diagrams, click to initialize a template team
3. **Node graph canvas** — React Flow integration, custom agent nodes (showing name/role/capabilities), connection edges with labels
4. **Agent editor panel** — sidebar/modal for editing agent properties when you click a node
5. **Export panel** — generate markdown and JSON output from the current graph state
6. **Example teams** — pre-loaded configurations including the OpenClaw household

## Build Strategy

**`single`** — This is a cohesive UI app. All components share state through Zustand and React Flow. The pieces are tightly coupled (the graph canvas needs the data model, the editor panel needs the graph's selection state, export needs the full model). No genuine parallelism opportunity. Estimated ~2-3h.
