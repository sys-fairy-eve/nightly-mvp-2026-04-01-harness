export type PatternType =
  | 'pipeline'
  | 'fan-out-fan-in'
  | 'expert-pool'
  | 'producer-reviewer'
  | 'supervisor'
  | 'hierarchical';

export interface PatternInfo {
  id: PatternType;
  name: string;
  description: string;
  icon: string;
  color: string;
  diagram: string; // ASCII-style description
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  emoji: string;
  color: string;
}

export interface ConnectionDefinition {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
}

export interface TeamConfig {
  name: string;
  pattern: PatternType;
  agents: AgentDefinition[];
  connections: ConnectionDefinition[];
}

export const PATTERNS: PatternInfo[] = [
  {
    id: 'pipeline',
    name: 'Pipeline',
    description: 'Sequential dependent tasks — each agent passes output to the next',
    icon: '➡️',
    color: '#3b82f6',
    diagram: 'A → B → C → D',
  },
  {
    id: 'fan-out-fan-in',
    name: 'Fan-out / Fan-in',
    description: 'Parallel independent tasks — a coordinator distributes work and collects results',
    icon: '🔀',
    color: '#8b5cf6',
    diagram: 'A → [B, C, D] → E',
  },
  {
    id: 'expert-pool',
    name: 'Expert Pool',
    description: 'Context-dependent routing — a router selects the right specialist for each task',
    icon: '🎯',
    color: '#ec4899',
    diagram: 'Router → Expert₁ | Expert₂ | Expert₃',
  },
  {
    id: 'producer-reviewer',
    name: 'Producer-Reviewer',
    description: 'Generation followed by quality review — iterative refinement loop',
    icon: '🔄',
    color: '#f59e0b',
    diagram: 'Producer ⇄ Reviewer → Output',
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Central agent with dynamic task distribution and oversight',
    icon: '👁️',
    color: '#10b981',
    diagram: 'Supervisor → [Worker₁, Worker₂, Worker₃]',
  },
  {
    id: 'hierarchical',
    name: 'Hierarchical Delegation',
    description: 'Top-down recursive delegation — managers delegate to sub-managers and workers',
    icon: '🏛️',
    color: '#6366f1',
    diagram: 'Director → Manager₁ → [W₁, W₂] | Manager₂ → [W₃, W₄]',
  },
];

export const AGENT_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1',
];

export const AGENT_EMOJIS = [
  '🤖', '🧠', '🔧', '📊', '🎨', '🔍', '📝', '🛡️', '🚀', '💡',
  '📡', '🏐', '🌶️', '✨', '⚡', '🎯', '🔬', '📦', '🗂️', '🧪',
];
