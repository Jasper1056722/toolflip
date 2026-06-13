import { useState, useCallback } from 'react';
import { parse } from 'yaml';

const SAMPLE = `server:
  host: localhost
  port: 8080
features:
  - auth
  - logging
debug: true`;

export default function YamlToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback((value: string) => {
    if (!value.trim()) { setOutput(''); setError(''); return; }
    try {
      const data = parse(value);
      setOutput(JSON.stringify(data, null, 2));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid YAML.');
      setOutput('');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    convert(e.target.value);
  };

  const loadSample = () => { setInput(SAMPLE); convert(SAMPLE); };
  const clear = () => { setInput(''); setOutput(''); setError(''); };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">YAML Input</label>
          <div className="flex gap-2">
            <button onClick={loadSample} className="text-xs text-indigo-600 hover:underline">
              Load sample
            </button>
            <button onClick={clear} className="text-xs text-slate-400 hover:text-slate-600">
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={handleChange}
          placeholder={'server:\n  host: localhost\n  port: 8080'}
          rows={8}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">JSON Output</label>
            <button
              onClick={copy}
              className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="w-full rounded-lg border border-slate-200 bg-slate-900 text-green-400 px-4 py-3 text-sm font-mono overflow-auto max-h-80">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
