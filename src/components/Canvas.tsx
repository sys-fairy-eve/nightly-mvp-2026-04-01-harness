import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import { useHarnessStore } from '../store';
import AgentNode from './AgentNode';

const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
};

export default function Canvas() {
  const nodes = useHarnessStore((s) => s.getNodes());
  const edges = useHarnessStore((s) => s.getEdges());
  const addConnection = useHarnessStore((s) => s.addConnection);
  const selectAgent = useHarnessStore((s) => s.selectAgent);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addConnection({
          id: `conn-${Date.now()}`,
          sourceId: connection.source,
          targetId: connection.target,
          label: 'data',
        });
      }
    },
    [addConnection]
  );

  const onPaneClick = useCallback(() => {
    selectAgent(null);
  }, [selectAgent]);

  const defaultEdgeOptions = useMemo(
    () => ({
      animated: true,
      style: { stroke: '#6b7280', strokeWidth: 2 },
    }),
    []
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const data = n.data as { agent?: { color?: string } } | undefined;
            return data?.agent?.color || '#6b7280';
          }}
          maskColor="#0f172a80"
        />
      </ReactFlow>
    </div>
  );
}
