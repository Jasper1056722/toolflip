import { useState, useCallback } from 'react';

function csvToJson(csv: string): { data: unknown[] | null; error: string | null } {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return { data: null, error: 'Need at least a header row and one data row.' };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: unknown[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cells.length !== headers.length) {
      return { data: null, error: `Row ${i + 1} has ${cells.length} columns, expected ${headers.length}.` };
    }
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });
    rows.push(row);
  }

  return { data: rows, error: null };
}

const SAMPLE = `name,age,city
Alice,30,Amsterdam
Bob,25,Berlin
Carol,35,Copenhagen`;

export default function CsvToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback((value: string) => {
    if (!value.trim()) { setOutput(''); setError(''); return; }
    const { data, error } = csvToJson(value);
    if (error) { setError(error); setOutput(''); }
    else { setOutput(JSON.stringify(data, null, 2)); setError(''); }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    convert(e.target.value);
  };

  const loadSample = () => {
    setInput(SAMPLE);
    convert(SAMPLE);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => { setInput(''); setOutput(''); setError(''); };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">CSV Input</label>
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
          placeholder={"name,age,city\nAlice,30,Amsterdam"}
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
