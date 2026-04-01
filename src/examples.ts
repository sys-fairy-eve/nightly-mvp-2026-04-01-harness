import type { TeamConfig } from './types';

export const EXAMPLE_TEAMS: TeamConfig[] = [
  {
    name: "Daniel's Agent Household",
    pattern: 'supervisor',
    agents: [
      { id: 'agent-1', name: 'Eve', role: 'Personal assistant — coordinator, memory keeper, knows Daniel best', capabilities: ['coordinate', 'memory', 'calendar', 'email-triage', 'context'], emoji: '✨', color: '#8b5cf6' },
      { id: 'agent-2', name: 'Wilson', role: 'Coding partner — builds, fixes, reviews, architects, orchestrates', capabilities: ['code', 'build', 'review', 'deploy', 'debug'], emoji: '🏐', color: '#3b82f6' },
      { id: 'agent-3', name: 'C-3PO', role: 'OpenClaw debug specialist — gateway, plugins, protocol expert', capabilities: ['debug', 'gateway-config', 'protocol', 'wiki-search'], emoji: '🤖', color: '#f59e0b' },
      { id: 'agent-4', name: 'Pepper', role: 'Email triage + cognitive protection — filters noise, surfaces signal', capabilities: ['email-triage', 'filter', 'summarize', 'prioritize'], emoji: '🌶️', color: '#ef4444' },
      { id: 'agent-5', name: 'Radar', role: 'Content curation + signal detection — finds interesting things', capabilities: ['scan', 'curate', 'trend-detect', 'recommend'], emoji: '📡', color: '#10b981' },
    ],
    connections: [
      { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'build tasks' },
      { id: 'conn-2', sourceId: 'agent-1', targetId: 'agent-3', label: 'debug queries' },
      { id: 'conn-3', sourceId: 'agent-1', targetId: 'agent-4', label: 'email routing' },
      { id: 'conn-4', sourceId: 'agent-1', targetId: 'agent-5', label: 'content signals' },
      { id: 'conn-5', sourceId: 'agent-2', targetId: 'agent-1', label: 'build status' },
      { id: 'conn-6', sourceId: 'agent-3', targetId: 'agent-1', label: 'debug results' },
      { id: 'conn-7', sourceId: 'agent-4', targetId: 'agent-1', label: 'urgent emails' },
      { id: 'conn-8', sourceId: 'agent-5', targetId: 'agent-1', label: 'curated feed' },
    ],
  },
  {
    name: 'Nightly MVP Builder',
    pattern: 'pipeline',
    agents: [
      { id: 'agent-1', name: 'Scanner', role: 'Fetches trending repos, filters, shortlists candidates', capabilities: ['web-search', 'filter', 'rank'], emoji: '🔍', color: '#06b6d4' },
      { id: 'agent-2', name: 'Planner', role: 'Analyzes repo, writes build plan, decides strategy', capabilities: ['analyze', 'plan', 'decompose'], emoji: '📐', color: '#8b5cf6' },
      { id: 'agent-3', name: 'Builder', role: 'Scaffolds, codes, and builds the MVP', capabilities: ['code', 'build', 'test'], emoji: '🔨', color: '#f59e0b' },
      { id: 'agent-4', name: 'Deployer', role: 'Deploys to Caddy, verifies live URL', capabilities: ['deploy', 'verify', 'caddy-config'], emoji: '🚀', color: '#10b981' },
      { id: 'agent-5', name: 'Reviewer', role: 'Post-build quality check — pass/fail verdict', capabilities: ['review', 'test', 'report'], emoji: '✅', color: '#ef4444' },
    ],
    connections: [
      { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'shortlisted repos' },
      { id: 'conn-2', sourceId: 'agent-2', targetId: 'agent-3', label: 'build plan' },
      { id: 'conn-3', sourceId: 'agent-3', targetId: 'agent-4', label: 'built project' },
      { id: 'conn-4', sourceId: 'agent-4', targetId: 'agent-5', label: 'deployed URL' },
    ],
  },
  {
    name: 'Deep Research Team',
    pattern: 'fan-out-fan-in',
    agents: [
      { id: 'agent-1', name: 'Coordinator', role: 'Decomposes research question into sub-queries', capabilities: ['decompose', 'synthesize'], emoji: '🧠', color: '#8b5cf6' },
      { id: 'agent-2', name: 'Web Researcher', role: 'Searches and summarizes web sources', capabilities: ['web-search', 'summarize'], emoji: '🌐', color: '#3b82f6' },
      { id: 'agent-3', name: 'Academic Researcher', role: 'Finds and analyzes papers and citations', capabilities: ['paper-search', 'cite', 'analyze'], emoji: '📚', color: '#10b981' },
      { id: 'agent-4', name: 'Community Analyst', role: 'Scans forums, social media, community sentiment', capabilities: ['social-scan', 'sentiment', 'trend'], emoji: '💬', color: '#f59e0b' },
      { id: 'agent-5', name: 'Synthesizer', role: 'Cross-validates findings and produces final report', capabilities: ['cross-validate', 'report', 'cite'], emoji: '📊', color: '#ec4899' },
    ],
    connections: [
      { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'web queries' },
      { id: 'conn-2', sourceId: 'agent-1', targetId: 'agent-3', label: 'academic queries' },
      { id: 'conn-3', sourceId: 'agent-1', targetId: 'agent-4', label: 'community queries' },
      { id: 'conn-4', sourceId: 'agent-2', targetId: 'agent-5', label: 'web findings' },
      { id: 'conn-5', sourceId: 'agent-3', targetId: 'agent-5', label: 'academic findings' },
      { id: 'conn-6', sourceId: 'agent-4', targetId: 'agent-5', label: 'community findings' },
    ],
  },
  {
    name: 'Code Review Pipeline',
    pattern: 'producer-reviewer',
    agents: [
      { id: 'agent-1', name: 'Developer', role: 'Writes code based on requirements', capabilities: ['code', 'implement', 'test'], emoji: '💻', color: '#3b82f6' },
      { id: 'agent-2', name: 'Reviewer', role: 'Reviews code for quality, security, performance', capabilities: ['review', 'security-audit', 'perf-check'], emoji: '🔍', color: '#ef4444' },
      { id: 'agent-3', name: 'Merger', role: 'Approves and merges passing code', capabilities: ['merge', 'deploy', 'notify'], emoji: '✅', color: '#10b981' },
    ],
    connections: [
      { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'PR / draft' },
      { id: 'conn-2', sourceId: 'agent-2', targetId: 'agent-1', label: 'review feedback' },
      { id: 'conn-3', sourceId: 'agent-2', targetId: 'agent-3', label: 'approved' },
    ],
  },
];
