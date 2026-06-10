import { useState, useRef } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // ref always holds current input so minify() never reads stale closure
  const inputRef = useRef('');

  const format = (value: string, indent = 2) => {
    if (!value.trim()) { setOutput(''); setError(''); return; }
    try {
      setOutput(JSON.stringify(JSON.parse(value), null, indent));
      setError('');
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const minify = () => {
    const value = inputRef.current;
    if (!value.trim()) return;
    try {
      setOutput(JSON.stringify(JSON.parse(value)));
      setError('');
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    inputRef.current = e.target.value;
    setInput(e.target.value);
    format(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">JSON Input</label>
          <div className="flex gap-2">
            <button onClick={() => format(inputRef.current, 2)} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors">Format</button>
            <button onClick={minify} className="text-xs bg-slate-600 text-white px-3 py-1 rounded hover:bg-slate-700 transition-colors">Minify</button>
            <button onClick={() => { inputRef.current = ''; setInput(''); setOutput(''); setError(''); }} className="text-xs text-slate-400 hover:text-slate-600">Clear</button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={handleChange}
          placeholder='{"name": "Alice", "age": 30}'
          rows={8}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && input && (
        <div className="text-sm text-green-600 font-medium">✓ Valid JSON</div>
      )}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Output</label>
            <button onClick={copy} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="w-full rounded-lg border border-slate-200 bg-slate-900 text-green-400 px-4 py-3 text-sm font-mono overflow-auto max-h-80">{output}</pre>
        </div>
      )}
    </div>
  );
}
