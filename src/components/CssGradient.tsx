import { useState } from 'react';

interface Stop {
  color: string;
  position: number;
}

export default function CssGradient() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<Stop[]>([
    { color: '#6366f1', position: 0 },
    { color: '#22d3ee', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const stopList = [...stops]
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  const css = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stopList})`
    : `radial-gradient(circle, ${stopList})`;

  const updateStop = (index: number, patch: Partial<Stop>) => {
    setStops(stops.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addStop = () => {
    if (stops.length >= 5) return;
    setStops([...stops, { color: '#f472b6', position: 50 }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(`background: ${css};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div
        className="w-full h-44 rounded-xl border border-slate-200"
        style={{ background: css }}
        aria-label="Gradient preview"
      />

      {/* Type + angle */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
          {(['linear', 'radial'] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-1.5 capitalize ${type === t ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {type === 'linear' && (
          <label className="flex items-center gap-3 text-sm text-slate-600">
            Angle
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={e => setAngle(Number(e.target.value))}
              className="w-40 accent-indigo-600"
            />
            <span className="font-mono text-xs w-10">{angle}°</span>
          </label>
        )}
      </div>

      {/* Stops */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Color stops</label>
          <button
            onClick={addStop}
            disabled={stops.length >= 5}
            className="text-xs text-indigo-600 hover:underline disabled:text-slate-300 disabled:no-underline"
          >
            + Add stop
          </button>
        </div>
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              type="color"
              value={stop.color}
              onChange={e => updateStop(i, { color: e.target.value })}
              className="w-9 h-9 rounded cursor-pointer border border-slate-200"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={stop.position}
              onChange={e => updateStop(i, { position: Number(e.target.value) })}
              className="flex-1 accent-indigo-600"
            />
            <span className="font-mono text-xs text-slate-500 w-10">{stop.position}%</span>
            <button
              onClick={() => removeStop(i)}
              disabled={stops.length <= 2}
              className="text-xs text-slate-400 hover:text-red-500 disabled:opacity-30"
              aria-label="Remove stop"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">CSS</label>
          <button
            onClick={copy}
            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="w-full rounded-lg border border-slate-200 bg-slate-900 text-green-400 px-4 py-3 text-sm font-mono overflow-auto whitespace-pre-wrap break-all">
          background: {css};
        </pre>
      </div>
    </div>
  );
}
