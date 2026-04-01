import { useState } from 'react';
import { useHarnessStore } from '../store';
import { AGENT_COLORS, AGENT_EMOJIS } from '../types';

export default function AgentEditor() {
  const selectedAgentId = useHarnessStore((s) => s.selectedAgentId);
  const agents = useHarnessStore((s) => s.agents);
  const updateAgent = useHarnessStore((s) => s.updateAgent);
  const removeAgent = useHarnessStore((s) => s.removeAgent);
  const selectAgent = useHarnessStore((s) => s.selectAgent);

  const agent = agents.find((a) => a.id === selectedAgentId);
  const [newCap, setNewCap] = useState('');

  if (!agent) return null;

  const addCapability = () => {
    const cap = newCap.trim();
    if (cap && !agent.capabilities.includes(cap)) {
      updateAgent(agent.id, { capabilities: [...agent.capabilities, cap] });
      setNewCap('');
    }
  };

  const removeCap = (cap: string) => {
    updateAgent(agent.id, {
      capabilities: agent.capabilities.filter((c) => c !== cap),
    });
  };

  return (
    <div className="absolute right-4 top-4 w-80 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl z-50 animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span className="text-lg">{agent.emoji}</span>
          Edit Agent
        </h3>
        <button
          onClick={() => selectAgent(null)}
          className="text-slate-400 hover:text-white transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1">Name</label>
          <input
            type="text"
            value={agent.name}
            onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1">Role</label>
          <textarea
            value={agent.role}
            onChange={(e) => updateAgent(agent.id, { role: e.target.value })}
            rows={3}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Emoji */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1">Emoji</label>
          <div className="flex flex-wrap gap-1">
            {AGENT_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => updateAgent(agent.id, { emoji })}
                className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                  agent.emoji === emoji
                    ? 'bg-blue-600 scale-110'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1">Color</label>
          <div className="flex flex-wrap gap-1">
            {AGENT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateAgent(agent.id, { color })}
                className={`w-8 h-8 rounded-lg transition-all ${
                  agent.color === color ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1">Capabilities</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {agent.capabilities.map((cap) => (
              <span
                key={cap}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300"
              >
                {cap}
                <button
                  onClick={() => removeCap(cap)}
                  className="text-slate-500 hover:text-red-400 ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCap}
              onChange={(e) => setNewCap(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCapability()}
              placeholder="Add capability..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCapability}
              className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Delete */}
        <div className="pt-2 border-t border-slate-700">
          <button
            onClick={() => {
              removeAgent(agent.id);
              selectAgent(null);
            }}
            className="w-full px-3 py-2 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
          >
            Remove Agent
          </button>
        </div>
      </div>
    </div>
  );
}
