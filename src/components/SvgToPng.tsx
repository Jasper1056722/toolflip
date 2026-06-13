import { useState } from 'react';

// Renders SVG markup onto a canvas via an Image and returns a PNG blob URL.
function svgToPngUrl(svg: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported.')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(png => {
        if (!png) { reject(new Error('PNG export failed.')); return; }
        resolve(URL.createObjectURL(png));
      }, 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not render SVG — check the markup.')); };
    img.src = url;
  });
}

// SVGs without width/height (viewBox only) render at 0x0 in some browsers,
// so we read intrinsic size from the markup with a 512px fallback.
function intrinsicSize(svg: string): { w: number; h: number } {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const el = doc.documentElement;
  const vb = el.getAttribute('viewBox')?.split(/[\s,]+/).map(Number);
  const w = parseFloat(el.getAttribute('width') || '') || (vb ? vb[2] : 512);
  const h = parseFloat(el.getAttribute('height') || '') || (vb ? vb[3] : 512);
  return { w: Math.round(w) || 512, h: Math.round(h) || 512 };
}

const SCALES = [1, 2, 4, 8];

export default function SvgToPng() {
  const [input, setInput] = useState('');
  const [scale, setScale] = useState(2);
  const [pngUrl, setPngUrl] = useState('');
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(setInput);
  };

  const convert = async () => {
    if (!input.trim()) return;
    if (!/<svg[\s>]/i.test(input)) {
      setError('Input does not look like SVG — expected an <svg> element.');
      setPngUrl('');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { w, h } = intrinsicSize(input);
      const outW = w * scale;
      const outH = h * scale;
      const url = await svgToPngUrl(input, outW, outH);
      if (pngUrl) URL.revokeObjectURL(pngUrl);
      setPngUrl(url);
      setSize({ w: outW, h: outH });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed.');
      setPngUrl('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">SVG Input</label>
          <label className="text-xs text-indigo-600 hover:underline cursor-pointer">
            Upload file
            <input type="file" accept=".svg,image/svg+xml" onChange={handleFile} className="hidden" />
          </label>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; ...>"
          rows={7}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Scale + convert */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          Scale
          <div className="flex rounded-lg border border-slate-300 overflow-hidden">
            {SCALES.map(s => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-3 py-1.5 text-sm ${scale === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={convert}
          disabled={!input.trim() || busy}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40"
        >
          {busy ? 'Converting…' : 'Convert to PNG'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      {pngUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 font-mono">{size.w} × {size.h} px</span>
            <a
              href={pngUrl}
              download="image.png"
              className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
            >
              Download PNG
            </a>
          </div>
          <div className="rounded-lg border border-slate-200 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%),linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] p-4 flex items-center justify-center">
            <img src={pngUrl} alt="PNG result" className="max-w-full max-h-72" />
          </div>
        </div>
      )}
    </div>
  );
}
