import { useState, useEffect } from 'react';

// WCAG 2.x relative luminance: sRGB channels are linearized before weighting
function luminance(hex: string): number {
  const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(c => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

interface ColorFieldProps {
  label: string;
  color: string;
  onChange: (hex: string) => void;
}

function ColorField({ label, color, onChange }: ColorFieldProps) {
  const [text, setText] = useState(color);

  // keep the text field in sync when the color comes from the picker or swap
  useEffect(() => { setText(color); }, [color]);

  const handleText = (value: string) => {
    setText(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value)) onChange(value);
  };

  return (
    <label className="text-sm text-slate-600 space-y-1.5">
      <span className="block font-medium text-slate-700">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-slate-200"
        />
        <input
          type="text"
          value={text}
          onChange={e => handleText(e.target.value)}
          className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm font-mono"
          spellCheck={false}
        />
      </span>
    </label>
  );
}

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${
      pass ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
    }`}>
      <span>{label}</span>
      <span className="font-semibold">{pass ? '✓ Pass' : '✗ Fail'}</span>
    </div>
  );
}

export default function ColorContrast() {
  const [fg, setFg] = useState('#1e293b');
  const [bg, setBg] = useState('#f8fafc');

  const ratio = contrastRatio(fg, bg);
  const rounded = Math.round(ratio * 100) / 100;

  const swap = () => { setFg(bg); setBg(fg); };

  return (
    <div className="space-y-5">
      {/* Color inputs */}
      <div className="flex flex-wrap items-end gap-4">
        <ColorField label="Text color" color={fg} onChange={setFg} />
        <button
          onClick={swap}
          className="h-10 px-3 rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-50 text-sm"
          title="Swap colors"
        >
          ⇄ Swap
        </button>
        <ColorField label="Background color" color={bg} onChange={setBg} />
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-slate-200 p-8" style={{ backgroundColor: bg }}>
        <p className="text-2xl font-semibold mb-2" style={{ color: fg }}>Large heading text</p>
        <p className="text-sm" style={{ color: fg }}>
          Normal body text — the quick brown fox jumps over the lazy dog.
        </p>
      </div>

      {/* Ratio */}
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-900">{rounded}:1</div>
        <div className="text-xs text-slate-400 mt-1">contrast ratio</div>
      </div>

      {/* WCAG results */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Badge pass={ratio >= 4.5} label="AA — Normal text (≥ 4.5)" />
        <Badge pass={ratio >= 3} label="AA — Large text (≥ 3.0)" />
        <Badge pass={ratio >= 7} label="AAA — Normal text (≥ 7.0)" />
        <Badge pass={ratio >= 4.5} label="AAA — Large text (≥ 4.5)" />
      </div>

      <p className="text-xs text-slate-400">
        Large text = 18pt (24px) or larger, or 14pt (18.5px) bold or larger.
      </p>
    </div>
  );
}
