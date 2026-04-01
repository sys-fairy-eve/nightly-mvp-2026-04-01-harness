import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { AgentNodeData } from '../store';
import { useHarnessStore } from '../store';

function AgentNode({ data, id }: NodeProps) {
  const { agent } = data as unknown as AgentNodeData;
  const selectedAgentId = useHarnessStore((s) => s.selectedAgentId);
  const selectAgent = useHarnessStore((s) => s.selectAgent);
  const isSelected = selectedAgentId === id;

  return (
    <div
      className={`
        relative cursor-pointer rounded-xl border-2 bg-slate-800/90 backdrop-blur-sm
        px-4 py-3 shadow-lg transition-all duration-200 min-w-[180px]
        hover:shadow-xl hover:scale-[1.02]
        ${isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''}
      `}
      style={{
        borderColor: agent.color,
        boxShadow: isSelected ? `0 0 20px ${agent.color}40` : undefined,
        ['--tw-ring-color' as string]: agent.color,
      }}
      onClick={() => selectAgent(isSelected ? null : id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !border-2 !border-slate-600 !bg-slate-400"
      />

      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{agent.emoji}</span>
        <span className="font-bold text-white text-sm">{agent.name}</span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-2">{agent.role}</p>

      {agent.capabilities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 4).map((cap) => (
            <span
              key={cap}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300"
            >
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 4 && (
            <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
              +{agent.capabilities.length - 4}
            </span>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !border-2 !border-slate-600 !bg-slate-400"
      />
    </div>
  );
}

export default memo(AgentNode);
