import { useState } from 'react';

export default function Base64Tool() {
  const [plain, setPlain] = useState('');
  const [encoded, setEncoded] = useState('');
  const [error, setError] = useState('');
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [copiedEncoded, setCopiedEncoded] = useState(false);

  const encode = (value: string) => {
    setPlain(value);
    setError('');
    try {
      setEncoded(btoa(unescape(encodeURIComponent(value))));
    } catch {
      setEncoded('');
    }
  };

  const decode = (value: string) => {
    setEncoded(value);
    setError('');
    try {
      setPlain(decodeURIComponent(escape(atob(value))));
    } catch {
      setError('Invalid Base64 input.');
      setPlain('');
    }
  };

  const copy = async (text: string, which: 'plain' | 'encoded') => {
    await navigator.clipboard.writeText(text);
    if (which === 'plain') { setCopiedPlain(true); setTimeout(() => setCopiedPlain(false), 2000); }
    else { setCopiedEncoded(true); setTimeout(() => setCopiedEncoded(false), 2000); }
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Plain text */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Plain Text</label>
            <button onClick={() => copy(plain, 'plain')} className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded hover:bg-indigo-700">
              {copiedPlain ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={plain}
            onChange={e => encode(e.target.value)}
            placeholder="Type text to encode..."
            rows={8}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Base64 */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Base64</label>
            <button onClick={() => copy(encoded, 'encoded')} className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded hover:bg-indigo-700">
              {copiedEncoded ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={encoded}
            onChange={e => decode(e.target.value)}
            placeholder="Paste Base64 to decode..."
            rows={8}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <p className="text-xs text-slate-400">Edit either side — changes sync automatically. Nothing leaves your browser.</p>
    </div>
  );
}
