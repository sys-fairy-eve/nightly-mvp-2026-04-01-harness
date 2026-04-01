import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Node, Edge } from '@xyflow/react';
import type { AgentDefinition, ConnectionDefinition, PatternType, TeamConfig } from './types';
import { AGENT_COLORS, AGENT_EMOJIS } from './types';
import { EXAMPLE_TEAMS } from './examples';

export interface AgentNodeData extends Record<string, unknown> {
  agent: AgentDefinition;
}

interface HarnessState {
  teamName: string;
  pattern: PatternType | null;
  agents: AgentDefinition[];
  connections: ConnectionDefinition[];
  selectedAgentId: string | null;
  showExportPanel: boolean;

  // Actions
  setTeamName: (name: string) => void;
  selectPattern: (pattern: PatternType) => void;
  addAgent: (agent: AgentDefinition) => void;
  updateAgent: (id: string, updates: Partial<AgentDefinition>) => void;
  removeAgent: (id: string) => void;
  addConnection: (conn: ConnectionDefinition) => void;
  updateConnectionLabel: (id: string, label: string) => void;
  removeConnection: (id: string) => void;
  selectAgent: (id: string | null) => void;
  toggleExportPanel: () => void;
  loadTeam: (team: TeamConfig) => void;
  clearAll: () => void;

  // Derived
  getNodes: () => Node<AgentNodeData>[];
  getEdges: () => Edge[];
  getTeamConfig: () => TeamConfig;
}

function generatePositions(count: number, pattern: PatternType | null): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const centerX = 400;
  const centerY = 300;

  if (!pattern || count === 0) return positions;

  switch (pattern) {
    case 'pipeline': {
      const spacing = 250;
      const startX = centerX - ((count - 1) * spacing) / 2;
      for (let i = 0; i < count; i++) {
        positions.push({ x: startX + i * spacing, y: centerY });
      }
      break;
    }
    case 'fan-out-fan-in': {
      if (count <= 2) {
        positions.push({ x: centerX - 200, y: centerY });
        if (count > 1) positions.push({ x: centerX + 200, y: centerY });
      } else {
        // First = distributor, last = collector, middle = workers
        positions.push({ x: 100, y: centerY });
        const workers = count - 2;
        for (let i = 0; i < workers; i++) {
          const yOff = (i - (workers - 1) / 2) * 150;
          positions.push({ x: centerX, y: centerY + yOff });
        }
        positions.push({ x: 700, y: centerY });
      }
      break;
    }
    case 'expert-pool': {
      // Router at left, experts in a column on right
      positions.push({ x: 150, y: centerY });
      for (let i = 1; i < count; i++) {
        const yOff = (i - 1 - (count - 2) / 2) * 150;
        positions.push({ x: 550, y: centerY + yOff });
      }
      break;
    }
    case 'producer-reviewer': {
      const spacing = 250;
      const startX = centerX - ((count - 1) * spacing) / 2;
      for (let i = 0; i < count; i++) {
        positions.push({ x: startX + i * spacing, y: centerY });
      }
      break;
    }
    case 'supervisor': {
      // Supervisor on top, workers below in a row
      positions.push({ x: centerX, y: 150 });
      for (let i = 1; i < count; i++) {
        const workers = count - 1;
        const xOff = (i - 1 - (workers - 1) / 2) * 220;
        positions.push({ x: centerX + xOff, y: 400 });
      }
      break;
    }
    case 'hierarchical': {
      // Director top, managers middle, workers bottom
      const levels = count <= 3 ? 2 : 3;
      if (levels === 2) {
        positions.push({ x: centerX, y: 150 });
        for (let i = 1; i < count; i++) {
          const xOff = (i - 1 - (count - 2) / 2) * 250;
          positions.push({ x: centerX + xOff, y: 400 });
        }
      } else {
        positions.push({ x: centerX, y: 100 }); // Director
        const managers = Math.min(2, count - 1);
        const workersPerManager = Math.ceil((count - 1 - managers) / Math.max(managers, 1));
        for (let m = 0; m < managers; m++) {
          const mxOff = (m - (managers - 1) / 2) * 400;
          positions.push({ x: centerX + mxOff, y: 280 });
        }
        let workerIdx = 0;
        for (let m = 0; m < managers; m++) {
          const mxOff = (m - (managers - 1) / 2) * 400;
          for (let w = 0; w < workersPerManager && 1 + managers + workerIdx < count; w++) {
            const wxOff = (w - (workersPerManager - 1) / 2) * 200;
            positions.push({ x: centerX + mxOff + wxOff, y: 460 });
            workerIdx++;
          }
        }
      }
      break;
    }
  }

  return positions;
}

let _nextAgentId = 1;
function nextAgentId(): string {
  return `agent-${_nextAgentId++}`;
}

export const useHarnessStore = create<HarnessState>()(persist((set, get) => ({
  teamName: 'New Team',
  pattern: null,
  agents: [],
  connections: [],
  selectedAgentId: null,
  showExportPanel: false,

  setTeamName: (name) => set({ teamName: name }),

  selectPattern: (pattern) => {
    // Initialize with a template team based on the pattern
    const templates = getPatternTemplate(pattern);
    _nextAgentId = templates.agents.length + 1;
    set({
      pattern,
      agents: templates.agents,
      connections: templates.connections,
      selectedAgentId: null,
      teamName: `${pattern.charAt(0).toUpperCase() + pattern.slice(1).replace(/-/g, ' ')} Team`,
    });
  },

  addAgent: (agent) => set((s) => ({ agents: [...s.agents, agent] })),

  updateAgent: (id, updates) =>
    set((s) => ({
      agents: s.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  removeAgent: (id) =>
    set((s) => ({
      agents: s.agents.filter((a) => a.id !== id),
      connections: s.connections.filter((c) => c.sourceId !== id && c.targetId !== id),
      selectedAgentId: s.selectedAgentId === id ? null : s.selectedAgentId,
    })),

  addConnection: (conn) => set((s) => ({ connections: [...s.connections, conn] })),

  updateConnectionLabel: (id, label) =>
    set((s) => ({
      connections: s.connections.map((c) => (c.id === id ? { ...c, label } : c)),
    })),

  removeConnection: (id) =>
    set((s) => ({ connections: s.connections.filter((c) => c.id !== id) })),

  selectAgent: (id) => set({ selectedAgentId: id }),

  toggleExportPanel: () => set((s) => ({ showExportPanel: !s.showExportPanel })),

  loadTeam: (team) => {
    _nextAgentId = team.agents.length + 1;
    set({
      teamName: team.name,
      pattern: team.pattern,
      agents: team.agents,
      connections: team.connections,
      selectedAgentId: null,
      showExportPanel: false,
    });
  },

  clearAll: () => {
    _nextAgentId = 1;
    set({
      teamName: 'New Team',
      pattern: null,
      agents: [],
      connections: [],
      selectedAgentId: null,
      showExportPanel: false,
    });
  },

  getNodes: () => {
    const { agents, pattern } = get();
    const positions = generatePositions(agents.length, pattern);
    return agents.map((agent, i) => ({
      id: agent.id,
      type: 'agentNode',
      position: positions[i] || { x: 100 + (i % 4) * 220, y: 100 + Math.floor(i / 4) * 200 },
      data: { agent },
    }));
  },

  getEdges: () => {
    const { connections } = get();
    return connections.map((conn) => ({
      id: conn.id,
      source: conn.sourceId,
      target: conn.targetId,
      label: conn.label,
      animated: true,
      style: { stroke: '#6b7280', strokeWidth: 2 },
      labelStyle: { fill: '#d1d5db', fontWeight: 600, fontSize: 12 },
      labelBgStyle: { fill: '#1f2937', fillOpacity: 0.8 },
      labelBgPadding: [6, 4] as [number, number],
    }));
  },

  getTeamConfig: () => {
    const { teamName, pattern, agents, connections } = get();
    return { name: teamName, pattern: pattern || 'pipeline', agents, connections };
  },
}), {
  name: 'harness-state',
  partialize: (state) => ({
    teamName: state.teamName,
    pattern: state.pattern,
    agents: state.agents,
    connections: state.connections,
  }),
}));

function getPatternTemplate(pattern: PatternType): { agents: AgentDefinition[]; connections: ConnectionDefinition[] } {
  switch (pattern) {
    case 'pipeline':
      return {
        agents: [
          { id: 'agent-1', name: 'Intake', role: 'Receives and validates input', capabilities: ['validation', 'parsing'], emoji: '📥', color: AGENT_COLORS[0] },
          { id: 'agent-2', name: 'Processor', role: 'Core processing logic', capabilities: ['transform', 'analyze'], emoji: '⚙️', color: AGENT_COLORS[1] },
          { id: 'agent-3', name: 'Output', role: 'Formats and delivers results', capabilities: ['format', 'deliver'], emoji: '📤', color: AGENT_COLORS[2] },
        ],
        connections: [
          { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'validated input' },
          { id: 'conn-2', sourceId: 'agent-2', targetId: 'agent-3', label: 'processed data' },
        ],
      };
    case 'fan-out-fan-in':
      return {
        agents: [
          { id: 'agent-1', name: 'Distributor', role: 'Splits work into parallel tasks', capabilities: ['decompose', 'route'], emoji: '🔀', color: AGENT_COLORS[0] },
          { id: 'agent-2', name: 'Worker A', role: 'Handles subtask A', capabilities: ['process'], emoji: '🔧', color: AGENT_COLORS[1] },
          { id: 'agent-3', name: 'Worker B', role: 'Handles subtask B', capabilities: ['process'], emoji: '🔧', color: AGENT_COLORS[2] },
          { id: 'agent-4', name: 'Worker C', role: 'Handles subtask C', capabilities: ['process'], emoji: '🔧', color: AGENT_COLORS[3] },
          { id: 'agent-5', name: 'Collector', role: 'Aggregates results from all workers', capabilities: ['merge', 'summarize'], emoji: '📊', color: AGENT_COLORS[4] },
        ],
        connections: [
          { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'subtask A' },
          { id: 'conn-2', sourceId: 'agent-1', targetId: 'agent-3', label: 'subtask B' },
          { id: 'conn-3', sourceId: 'agent-1', targetId: 'agent-4', label: 'subtask C' },
          { id: 'conn-4', sourceId: 'agent-2', targetId: 'agent-5', label: 'result A' },
          { id: 'conn-5', sourceId: 'agent-3', targetId: 'agent-5', label: 'result B' },
          { id: 'conn-6', sourceId: 'agent-4', targetId: 'agent-5', label: 'result C' },
        ],
      };
    case 'expert-pool':
      return {
        agents: [
          { id: 'agent-1', name: 'Router', role: 'Classifies incoming tasks and routes to experts', capabilities: ['classify', 'route'], emoji: '🎯', color: AGENT_COLORS[0] },
          { id: 'agent-2', name: 'Code Expert', role: 'Handles code-related tasks', capabilities: ['code-review', 'refactor', 'debug'], emoji: '💻', color: AGENT_COLORS[1] },
          { id: 'agent-3', name: 'Docs Expert', role: 'Handles documentation tasks', capabilities: ['write', 'format', 'review'], emoji: '📝', color: AGENT_COLORS[2] },
          { id: 'agent-4', name: 'Data Expert', role: 'Handles data analysis tasks', capabilities: ['analyze', 'visualize', 'query'], emoji: '📊', color: AGENT_COLORS[3] },
        ],
        connections: [
          { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'code tasks' },
          { id: 'conn-2', sourceId: 'agent-1', targetId: 'agent-3', label: 'doc tasks' },
          { id: 'conn-3', sourceId: 'agent-1', targetId: 'agent-4', label: 'data tasks' },
        ],
      };
    case 'producer-reviewer':
      return {
        agents: [
          { id: 'agent-1', name: 'Producer', role: 'Generates initial output', capabilities: ['generate', 'create'], emoji: '✍️', color: AGENT_COLORS[0] },
          { id: 'agent-2', name: 'Reviewer', role: 'Reviews and provides feedback', capabilities: ['review', 'critique', 'validate'], emoji: '🔍', color: AGENT_COLORS[1] },
          { id: 'agent-3', name: 'Publisher', role: 'Publishes approved output', capabilities: ['publish', 'deploy'], emoji: '🚀', color: AGENT_COLORS[2] },
        ],
        connections: [
          { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'draft' },
          { id: 'conn-2', sourceId: 'agent-2', targetId: 'agent-1', label: 'feedback' },
          { id: 'conn-3', sourceId: 'agent-2', targetId: 'agent-3', label: 'approved' },
        ],
      };
    case 'supervisor':
      return {
        agents: [
          { id: 'agent-1', name: 'Supervisor', role: 'Oversees all workers, distributes tasks dynamically', capabilities: ['coordinate', 'monitor', 'reassign'], emoji: '👁️', color: AGENT_COLORS[0] },
          { id: 'agent-2', name: 'Worker 1', role: 'Executes assigned tasks', capabilities: ['execute', 'report'], emoji: '🔧', color: AGENT_COLORS[1] },
          { id: 'agent-3', name: 'Worker 2', role: 'Executes assigned tasks', capabilities: ['execute', 'report'], emoji: '🔧', color: AGENT_COLORS[2] },
          { id: 'agent-4', name: 'Worker 3', role: 'Executes assigned tasks', capabilities: ['execute', 'report'], emoji: '🔧', color: AGENT_COLORS[3] },
        ],
        connections: [
          { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'task' },
          { id: 'conn-2', sourceId: 'agent-1', targetId: 'agent-3', label: 'task' },
          { id: 'conn-3', sourceId: 'agent-1', targetId: 'agent-4', label: 'task' },
          { id: 'conn-4', sourceId: 'agent-2', targetId: 'agent-1', label: 'status' },
          { id: 'conn-5', sourceId: 'agent-3', targetId: 'agent-1', label: 'status' },
          { id: 'conn-6', sourceId: 'agent-4', targetId: 'agent-1', label: 'status' },
        ],
      };
    case 'hierarchical':
      return {
        agents: [
          { id: 'agent-1', name: 'Director', role: 'Top-level strategy and delegation', capabilities: ['plan', 'delegate', 'decide'], emoji: '🏛️', color: AGENT_COLORS[0] },
          { id: 'agent-2', name: 'Manager A', role: 'Manages team A', capabilities: ['coordinate', 'review'], emoji: '📋', color: AGENT_COLORS[1] },
          { id: 'agent-3', name: 'Manager B', role: 'Manages team B', capabilities: ['coordinate', 'review'], emoji: '📋', color: AGENT_COLORS[2] },
          { id: 'agent-4', name: 'Worker A1', role: 'Executes tasks for team A', capabilities: ['execute'], emoji: '🔧', color: AGENT_COLORS[3] },
          { id: 'agent-5', name: 'Worker A2', role: 'Executes tasks for team A', capabilities: ['execute'], emoji: '🔧', color: AGENT_COLORS[4] },
          { id: 'agent-6', name: 'Worker B1', role: 'Executes tasks for team B', capabilities: ['execute'], emoji: '🔧', color: AGENT_COLORS[5] },
        ],
        connections: [
          { id: 'conn-1', sourceId: 'agent-1', targetId: 'agent-2', label: 'strategy' },
          { id: 'conn-2', sourceId: 'agent-1', targetId: 'agent-3', label: 'strategy' },
          { id: 'conn-3', sourceId: 'agent-2', targetId: 'agent-4', label: 'task' },
          { id: 'conn-4', sourceId: 'agent-2', targetId: 'agent-5', label: 'task' },
          { id: 'conn-5', sourceId: 'agent-3', targetId: 'agent-6', label: 'task' },
        ],
      };
  }
}

// Re-export for convenience
export { EXAMPLE_TEAMS };
export { nextAgentId };
