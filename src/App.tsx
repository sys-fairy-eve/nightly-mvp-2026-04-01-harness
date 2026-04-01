import { ReactFlowProvider } from '@xyflow/react';
import { useHarnessStore } from './store';
import Sidebar from './components/Sidebar';
import PatternSelector from './components/PatternSelector';
import Canvas from './components/Canvas';
import AgentEditor from './components/AgentEditor';
import ExportPanel from './components/ExportPanel';

export default function App() {
  const pattern = useHarnessStore((s) => s.pattern);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 relative">
          {pattern ? (
            <>
              <Canvas />
              <AgentEditor />
              <ExportPanel />
            </>
          ) : (
            <PatternSelector />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
