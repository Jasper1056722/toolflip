import { useState } from 'react';

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  unit?: string;
  onChange: (v: number) => void;
}

function Slider({ label, min, max, value, unit = 'px', onChange }: SliderProps) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-600">
      <span className="w-24">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 accent-indigo-600"
      />
      <span className="font-mono text-xs w-14 text-right">{value}{unit}</span>
    </label>
  );
}

export default function BoxShadow() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(8);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(-4);
  const [color, setColor] = useState('#0f172a');
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const shadow = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity / 100)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(`box-shadow: ${shadow};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Preview -->  checkered-ish neutral area with sample card */}
      <div className="w-full h-48 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
        <div
          className="w-32 h-32 rounded-xl bg-white"
          style={{ boxShadow: shadow }}
          aria-label="Box shadow preview"
        />
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <Slider label="Offset X" min={-50} max={50} value={x} onChange={setX} />
        <Slider label="Offset Y" min={-50} max={50} value={y} onChange={setY} />
        <Slider label="Blur" min={0} max={100} value={blur} onChange={setBlur} />
        <Slider label="Spread" min={-50} max={50} value={spread} onChange={setSpread} />
        <Slider label="Opacity" min={0} max={100} value={opacity} unit="%" onChange={setOpacity} />

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Color
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-9 h-9 rounded cursor-pointer border border-slate-200"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={inset}
              onChange={e => setInset(e.target.checked)}
              className="accent-indigo-600 w-4 h-4"
            />
            Inset
          </label>
        </div>
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
          box-shadow: {shadow};
        </pre>
      </div>
    </div>
  );
}
