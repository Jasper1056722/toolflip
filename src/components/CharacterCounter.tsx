import { useState } from 'react';

const LIMITS = [
  { label: 'Twitter / X', limit: 280 },
  { label: 'Meta description', limit: 160 },
  { label: 'Meta title', limit: 60 },
  { label: 'LinkedIn post', limit: 3000 },
  { label: 'Instagram caption', limit: 2200 },
];

function Bar({ count, limit }: { count: number; limit: number }) {
  const pct = Math.min((count / limit) * 100, 100);
  const over = count > limit;
  return (
    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
      <div
        className={`h-1.5 rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-amber-400' : 'bg-indigo-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function CharacterCounter() {
  const [text, setText] = useState('');

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = text === '' ? 0 : text.split('\n').length;
  const sentences = text === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim()).length;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-2">Your Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste text..."
          rows={6}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Characters', value: chars },
          { label: 'No spaces', value: charsNoSpaces },
          { label: 'Words', value: words },
          { label: 'Lines', value: lines },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-indigo-600">{s.value.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platform limits */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Platform Limits</h3>
        {LIMITS.map(({ label, limit }) => {
          const over = chars > limit;
          return (
            <div key={label}>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{label}</span>
                <span className={over ? 'text-red-600 font-medium' : 'text-slate-500'}>
                  {chars} / {limit} {over && `(−${chars - limit} over)`}
                </span>
              </div>
              <Bar count={chars} limit={limit} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
