import { useState } from 'react';
import { useHarnessStore } from '../store';
import { PATTERNS } from '../types';

type ExportFormat = 'markdown' | 'json' | 'agents-md';

export default function ExportPanel() {
  const showExportPanel = useHarnessStore((s) => s.showExportPanel);
  const toggleExportPanel = useHarnessStore((s) => s.toggleExportPanel);
  const getTeamConfig = useHarnessStore((s) => s.getTeamConfig);
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [copied, setCopied] = useState(false);

  if (!showExportPanel) return null;

  const team = getTeamConfig();
  const pattern = PATTERNS.find((p) => p.id === team.pattern);

  const generateMarkdown = (): string => {
    const lines: string[] = [];
    lines.push(`# ${team.name}`);
    lines.push('');
    lines.push(`**Pattern:** ${pattern?.icon} ${pattern?.name} — ${pattern?.description}`);
    lines.push('');
    lines.push('## Agents');
    lines.push('');
    lines.push('| Agent | Role | Capabilities |');
    lines.push('|-------|------|-------------|');
    for (const a of team.agents) {
      lines.push(`| ${a.emoji} **${a.name}** | ${a.role} | ${a.capabilities.join(', ')} |`);
    }
    lines.push('');
    lines.push('## Data Flow');
    lines.push('');
    for (const c of team.connections) {
      const src = team.agents.find((a) => a.id === c.sourceId);
      const tgt = team.agents.find((a) => a.id === c.targetId);
      lines.push(`- **${src?.name}** → **${tgt?.name}**: ${c.label}`);
    }
    lines.push('');
    lines.push(`## Architecture Diagram`);
    lines.push('');
    lines.push('```');
    lines.push(pattern?.diagram || '');
    lines.push('```');
    return lines.join('\n');
  };

  const generateAgentsMd = (): string => {
    const lines: string[] = [];
    lines.push(`# AGENTS.md — ${team.name}`);
    lines.push('');
    lines.push(`> Architecture: ${pattern?.name} pattern`);
    lines.push('');
    lines.push('## Agent Roster');
    lines.push('');
    for (const a of team.agents) {
      lines.push(`### ${a.emoji} ${a.name}`);
      lines.push('');
      lines.push(`**Role:** ${a.role}`);
      lines.push('');
      if (a.capabilities.length > 0) {
        lines.push('**Capabilities:**');
        for (const cap of a.capabilities) {
          lines.push(`- ${cap}`);
        }
        lines.push('');
      }
      // Find connections for this agent
      const outgoing = team.connections.filter((c) => c.sourceId === a.id);
      const incoming = team.connections.filter((c) => c.targetId === a.id);
      if (outgoing.length > 0) {
        lines.push('**Sends to:**');
        for (const c of outgoing) {
          const tgt = team.agents.find((ag) => ag.id === c.targetId);
          lines.push(`- ${tgt?.name}: ${c.label}`);
        }
        lines.push('');
      }
      if (incoming.length > 0) {
        lines.push('**Receives from:**');
        for (const c of incoming) {
          const src = team.agents.find((ag) => ag.id === c.sourceId);
          lines.push(`- ${src?.name}: ${c.label}`);
        }
        lines.push('');
      }
    }
    lines.push('## Communication Protocol');
    lines.push('');
    lines.push('| From | To | Data |');
    lines.push('|------|----|------|');
    for (const c of team.connections) {
      const src = team.agents.find((a) => a.id === c.sourceId);
      const tgt = team.agents.find((a) => a.id === c.targetId);
      lines.push(`| ${src?.emoji} ${src?.name} | ${tgt?.emoji} ${tgt?.name} | ${c.label} |`);
    }
    return lines.join('\n');
  };

  const generateJSON = (): string => {
    return JSON.stringify(team, null, 2);
  };

  const getOutput = (): string => {
    switch (format) {
      case 'markdown':
        return generateMarkdown();
      case 'json':
        return generateJSON();
      case 'agents-md':
        return generateAgentsMd();
    }
  };

  const output = getOutput();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'json' ? 'json' : 'md';
    const filename = format === 'agents-md' ? 'AGENTS.md' : `${team.name.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[700px] max-w-[calc(100vw-320px)] max-h-[60vh] bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl z-40 animate-fade-in flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-white text-sm">📦 Export</h3>
          <div className="flex gap-1">
            {(
              [
                { key: 'markdown', label: 'Markdown' },
                { key: 'agents-md', label: 'AGENTS.md' },
                { key: 'json', label: 'JSON' },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFormat(key)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  format === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
          >
            Download
          </button>
          <button
            onClick={toggleExportPanel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-auto text-xs text-slate-300 font-mono leading-relaxed flex-1">
        {output}
      </pre>
    </div>
  );
}
