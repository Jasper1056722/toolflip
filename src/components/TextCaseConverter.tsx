import { useState } from 'react';

const conversions: { label: string; fn: (s: string) => string }[] = [
  { label: 'lowercase', fn: s => s.toLowerCase() },
  { label: 'UPPERCASE', fn: s => s.toUpperCase() },
  { label: 'Title Case', fn: s => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { label: 'Sentence case', fn: s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { label: 'camelCase', fn: s => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { label: 'PascalCase', fn: s => s.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, (_, c) => c.toUpperCase()) },
  { label: 'snake_case', fn: s => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
  { label: 'kebab-case', fn: s => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
  { label: 'CONSTANT_CASE', fn: s => s.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [activeLabel, setActiveLabel] = useState('');
  const [copied, setCopied] = useState(false);

  const apply = (label: string, fn: (s: string) => string) => {
    setResult(fn(input));
    setActiveLabel(label);
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-2">Input Text</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste your text here..."
          rows={4}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {conversions.map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => apply(label, fn)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              activeLabel === label
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {result && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Result — {activeLabel}</label>
            <button onClick={copy} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono break-all">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
