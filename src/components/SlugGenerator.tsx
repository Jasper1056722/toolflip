import { useState } from 'react';

function toSlug(text: string, separator: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // strip accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, separator);
}

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [copied, setCopied] = useState(false);

  const slug = toSlug(input, separator);

  const copy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-2">Input Text</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="My Blog Post Title Here!"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">Separator:</span>
        {['-', '_'].map(s => (
          <label key={s} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="sep"
              value={s}
              checked={separator === s}
              onChange={() => setSeparator(s)}
              className="accent-indigo-600"
            />
            <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">{s === '-' ? 'hyphen  (-)' : 'underscore (_)'}</code>
          </label>
        ))}
      </div>

      {slug && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Slug</label>
            <button onClick={copy} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono text-indigo-700 break-all">
            {slug}
          </div>
        </div>
      )}
    </div>
  );
}
