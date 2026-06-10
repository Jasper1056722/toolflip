import { useState, useRef } from 'react';

export default function LineSorter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // ref always holds current output so apply() never reads stale closure
  const outputRef = useRef('');

  const apply = (fn: (arr: string[]) => string[]) => {
    const source = outputRef.current || input;
    const result = fn(source.split('\n')).join('\n');
    outputRef.current = result;
    setOutput(result);
  };

  const actions: { label: string; fn: (arr: string[]) => string[] }[] = [
    { label: 'Sort A → Z', fn: a => [...a].sort((x, y) => x.localeCompare(y)) },
    { label: 'Sort Z → A', fn: a => [...a].sort((x, y) => y.localeCompare(x)) },
    { label: 'Reverse', fn: a => [...a].reverse() },
    { label: 'Remove duplicates', fn: a => [...new Set(a)] },
    { label: 'Remove empty lines', fn: a => a.filter(l => l.trim() !== '') },
    { label: 'Trim whitespace', fn: a => a.map(l => l.trim()) },
    { label: 'Shuffle', fn: a => [...a].sort(() => Math.random() - 0.5) },
  ];

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    outputRef.current = '';
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">Input — one item per line</label>
          <span className="text-xs text-slate-400">{input.split('\n').length} lines</span>
        </div>
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder={"banana\napple\ncherry\napple"}
          rows={8}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => apply(fn)}
            className="px-3 py-1.5 rounded text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {output && (
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Output</label>
            <button onClick={copy} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={8}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-mono resize-y"
          />
        </div>
      )}
    </div>
  );
}
