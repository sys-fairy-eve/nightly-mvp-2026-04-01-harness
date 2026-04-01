import { useHarnessStore, EXAMPLE_TEAMS, nextAgentId } from '../store';
import { PATTERNS, AGENT_COLORS, AGENT_EMOJIS } from '../types';

export default function Sidebar() {
  const teamName = useHarnessStore((s) => s.teamName);
  const setTeamName = useHarnessStore((s) => s.setTeamName);
  const pattern = useHarnessStore((s) => s.pattern);
  const agents = useHarnessStore((s) => s.agents);
  const connections = useHarnessStore((s) => s.connections);
  const addAgent = useHarnessStore((s) => s.addAgent);
  const loadTeam = useHarnessStore((s) => s.loadTeam);
  const clearAll = useHarnessStore((s) => s.clearAll);
  const toggleExportPanel = useHarnessStore((s) => s.toggleExportPanel);
  const showExportPanel = useHarnessStore((s) => s.showExportPanel);

  const currentPattern = pattern ? PATTERNS.find((p) => p.id === pattern) : null;

  const handleAddAgent = () => {
    const id = nextAgentId();
    const colorIdx = agents.length % AGENT_COLORS.length;
    const emojiIdx = agents.length % AGENT_EMOJIS.length;
    addAgent({
      id,
      name: `Agent ${agents.length + 1}`,
      role: 'New agent — define its role',
      capabilities: [],
      emoji: AGENT_EMOJIS[emojiIdx],
      color: AGENT_COLORS[colorIdx],
    });
  };

  return (
    <div className="w-72 h-full bg-slate-800/50 border-r border-slate-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🔧</span>
          <h1 className="font-bold text-white text-lg">Harness</h1>
        </div>
        {pattern && (
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Current Pattern */}
        {currentPattern && (
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Pattern
            </h2>
            <div
              className="flex items-center gap-2 p-2 rounded-lg border"
              style={{ borderColor: currentPattern.color + '60', backgroundColor: currentPattern.color + '10' }}
            >
              <span>{currentPattern.icon}</span>
              <span className="text-sm font-medium text-white">{currentPattern.name}</span>
            </div>
            <button
              onClick={clearAll}
              className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Change pattern
            </button>
          </div>
        )}

        {/* Agents */}
        {pattern && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Agents ({agents.length})
              </h2>
              <button
                onClick={handleAddAgent}
                className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
              >
                + Add
              </button>
            </div>
            <div className="space-y-1">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors cursor-default"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: agent.color }}
                  />
                  <span className="text-sm">{agent.emoji}</span>
                  <span className="text-sm text-slate-300 truncate">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connections */}
        {pattern && connections.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Connections ({connections.length})
            </h2>
            <div className="space-y-1">
              {connections.map((conn) => {
                const src = agents.find((a) => a.id === conn.sourceId);
                const tgt = agents.find((a) => a.id === conn.targetId);
                return (
                  <div key={conn.id} className="text-xs text-slate-400 p-1.5 rounded bg-slate-900/50">
                    <span className="text-slate-300">{src?.name || '?'}</span>
                    <span className="mx-1">→</span>
                    <span className="text-slate-300">{tgt?.name || '?'}</span>
                    {conn.label && (
                      <span className="text-slate-500 ml-1">({conn.label})</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Examples */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Example Teams
          </h2>
          <div className="space-y-1">
            {EXAMPLE_TEAMS.map((team, i) => {
              const p = PATTERNS.find((pt) => pt.id === team.pattern);
              return (
                <button
                  key={i}
                  onClick={() => loadTeam(team)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-700/30 transition-all text-sm"
                >
                  <div className="font-medium text-white text-xs">{team.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {p?.icon} {p?.name} · {team.agents.length} agents
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {pattern && (
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={toggleExportPanel}
            className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
              showExportPanel
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {showExportPanel ? '✓ Export Panel Open' : '📦 Export Config'}
          </button>
        </div>
      )}
    </div>
  );
}
