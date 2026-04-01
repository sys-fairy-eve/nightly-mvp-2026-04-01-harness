import { PATTERNS } from '../types';
import { useHarnessStore } from '../store';

export default function PatternSelector() {
  const selectPattern = useHarnessStore((s) => s.selectPattern);
  const currentPattern = useHarnessStore((s) => s.pattern);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            🔧 Harness
          </h1>
          <p className="text-lg text-slate-400">
            Design agent teams visually. Pick an architecture pattern to start.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PATTERNS.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => selectPattern(pattern.id)}
              className={`
                group text-left p-5 rounded-xl border-2 transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                ${currentPattern === pattern.id
                  ? 'bg-slate-700/50 shadow-lg'
                  : 'bg-slate-800/50 hover:bg-slate-700/30'
                }
              `}
              style={{
                borderColor: currentPattern === pattern.id ? pattern.color : '#334155',
                boxShadow: currentPattern === pattern.id ? `0 0 20px ${pattern.color}20` : undefined,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{pattern.icon}</span>
                <h3 className="font-bold text-white">{pattern.name}</h3>
              </div>
              <p className="text-sm text-slate-400 mb-3">{pattern.description}</p>
              <code className="text-xs text-slate-500 font-mono">{pattern.diagram}</code>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Or load an example team from the sidebar →
          </p>
        </div>
      </div>
    </div>
  );
}
