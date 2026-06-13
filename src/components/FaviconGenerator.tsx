import { useState } from 'react';

const PNG_SIZES = [16, 32, 48, 180, 192, 512];
const ICO_SIZES = [16, 32, 48];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not load image. Use PNG, JPG, or SVG.')); };
    img.src = url;
  });
}

function renderPng(img: HTMLImageElement, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, size, size);
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('PNG render failed.'))), 'image/png');
  });
}

// Modern ICO files may embed PNG data directly: 6-byte header,
// one 16-byte directory entry per image, then the raw PNG blobs.
async function buildIco(pngs: { size: number; blob: Blob }[]): Promise<Blob> {
  const buffers = await Promise.all(pngs.map(p => p.blob.arrayBuffer()));
  const headerSize = 6 + 16 * pngs.length;
  const total = headerSize + buffers.reduce((n, b) => n + b.byteLength, 0);
  const out = new DataView(new ArrayBuffer(total));

  out.setUint16(0, 0, true);            // reserved
  out.setUint16(2, 1, true);            // type: icon
  out.setUint16(4, pngs.length, true);  // image count

  let offset = headerSize;
  buffers.forEach((buf, i) => {
    const entry = 6 + 16 * i;
    const size = pngs[i].size;
    out.setUint8(entry, size === 256 ? 0 : size);     // width (0 means 256)
    out.setUint8(entry + 1, size === 256 ? 0 : size); // height
    out.setUint8(entry + 2, 0);                        // palette
    out.setUint8(entry + 3, 0);                        // reserved
    out.setUint16(entry + 4, 1, true);                 // planes
    out.setUint16(entry + 6, 32, true);                // bits per pixel
    out.setUint32(entry + 8, buf.byteLength, true);    // data size
    out.setUint32(entry + 12, offset, true);           // data offset
    new Uint8Array(out.buffer).set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  });

  return new Blob([out.buffer], { type: 'image/x-icon' });
}

interface Result {
  label: string;
  filename: string;
  url: string;
  previewSize: number;
}

export default function FaviconGenerator() {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sourceName, setSourceName] = useState('');

  const generate = async (file: File) => {
    setBusy(true);
    setError('');
    results.forEach(r => URL.revokeObjectURL(r.url));
    try {
      const img = await loadImage(file);
      const pngs = await Promise.all(
        PNG_SIZES.map(async size => ({ size, blob: await renderPng(img, size) }))
      );

      const ico = await buildIco(pngs.filter(p => ICO_SIZES.includes(p.size)));

      const out: Result[] = [
        { label: 'favicon.ico (16+32+48)', filename: 'favicon.ico', url: URL.createObjectURL(ico), previewSize: 32 },
        ...pngs.map(p => ({
          label: `${p.size}×${p.size}`,
          filename: p.size === 180 ? 'apple-touch-icon.png' : `favicon-${p.size}x${p.size}.png`,
          url: URL.createObjectURL(p.blob),
          previewSize: Math.min(p.size, 48),
        })),
      ];
      setResults(out);
      setSourceName(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed.');
      setResults([]);
    } finally {
      setBusy(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) generate(file);
  };

  return (
    <div className="space-y-5">
      {/* Upload */}
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-10 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
        <span className="text-3xl">⬡</span>
        <span className="text-sm text-slate-600 font-medium">
          {busy ? 'Generating…' : 'Click to upload an image'}
        </span>
        <span className="text-xs text-slate-400">SVG, PNG, or JPG — square works best. Processed locally.</span>
        <input type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
      </label>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-slate-600">
            Generated from <span className="font-mono text-xs">{sourceName}</span>:
          </div>
          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {results.map(r => (
              <li key={r.filename} className="flex items-center gap-4 px-4 py-2.5 bg-white">
                <img src={r.url} alt={r.label} width={r.previewSize} height={r.previewSize} className="border border-slate-100 rounded" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-700">{r.label}</div>
                  <div className="text-xs text-slate-400 font-mono truncate">{r.filename}</div>
                </div>
                <a
                  href={r.url}
                  download={r.filename}
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors shrink-0"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400">
            Tip: put favicon.ico in your site root, link the PNGs with{' '}
            <code className="bg-slate-100 px-1 rounded">&lt;link rel="icon"&gt;</code>, and use the 180×180 as{' '}
            <code className="bg-slate-100 px-1 rounded">apple-touch-icon</code>.
          </p>
        </div>
      )}
    </div>
  );
}
