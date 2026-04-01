# 🔧 Harness — Agent Team Designer

A visual tool for designing multi-agent team architectures. Pick a coordination pattern, define your agents, see them as an interactive node graph, and export the configuration.

**Inspired by [revfactory/harness](https://github.com/revfactory/harness)** — a meta-skill for designing domain-specific agent teams.

## Features

- **6 Architecture Patterns** — Pipeline, Fan-out/Fan-in, Expert Pool, Producer-Reviewer, Supervisor, Hierarchical Delegation
- **Interactive Node Graph** — drag agents around, see animated connections, zoom and pan
- **Agent Editor** — click any node to edit name, role, emoji, color, and capabilities
- **Smart Templates** — each pattern initializes with a sensible default team
- **Example Teams** — pre-built configurations including a 5-agent AI household
- **Export** — Markdown, AGENTS.md format, or JSON. Copy to clipboard or download.

## Live

🌐 [mvp.trollefsen.com/2026-04-01-harness/](https://mvp.trollefsen.com/2026-04-01-harness/)

## Tech Stack

- React + TypeScript
- [React Flow](https://reactflow.dev/) (@xyflow/react) for the node graph
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- Tailwind CSS v4
- Vite

## Run Locally

```bash
git clone <repo-url> && cd harness
npm install
npm run dev
```

## Architecture Patterns

| Pattern | Description |
|---------|-------------|
| ➡️ Pipeline | Sequential dependent tasks |
| 🔀 Fan-out/Fan-in | Parallel independent tasks with aggregation |
| 🎯 Expert Pool | Context-dependent routing to specialists |
| 🔄 Producer-Reviewer | Iterative generation and quality review |
| 👁️ Supervisor | Central oversight with dynamic task distribution |
| 🏛️ Hierarchical | Top-down recursive delegation |

---

Built by [Nightly MVP Builder](https://github.com/sys-fairy-eve) 🌙
