import { useState, useCallback } from 'react';

// Conservative text-level optimizations only — never touches path data,
// so rendering is guaranteed identical.
function optimizeSvg(svg: string): string {
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?xml[\s\S]*?\?>\s*/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>\s*/g, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    .replace(/<title[\s\S]*?<\/title>/gi, '')
    .replace(/<desc[\s\S]*?<\/desc>/gi, '')
    .replace(/\s+(xmlns:(?!xlink)[a-z]+)="[^"]*"/gi, (m, attr) =>
      // drop editor namespaces (inkscape, sodipodi, etc.) but keep xlink
      /inkscape|sodipodi|serif|sketch|figma|adobe/i.test(m) ? '' : m
    )
    .replace(/\s+(inkscape|sodipodi|data-name|xml:space):?[a-z-]*="[^"]*"/gi, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatBytes(n: number): string {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;
}

export default function SvgOptimizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const optimize = useCallback((value: string) => {
    if (!value.trim()) { setOutput(''); setError(''); return; }
    if (!/<svg[\s>]/i.test(value)) {
      setError('Input does not look like SVG — expected an <svg> element.');
      setOutput('');
      return;
    }
    setError('');
    setOutput(optimizeSvg(value));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    optimize(e.target.value);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(text => { setInput(text); optimize(text); });
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([output], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'optimized.svg';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const inBytes = new Blob([input]).size;
  const outBytes = new Blob([output]).size;
  const saved = inBytes > 0 ? Math.max(0, Math.round((1 - outBytes / inBytes) * 100)) : 0;

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
          onChange={handleChange}
          placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; ...>"
          rows={8}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {output && (
        <>
          {/* Savings */}
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="font-mono">{formatBytes(inBytes)} → {formatBytes(outBytes)}</span>
            <span className="bg-green-50 border border-green-200 text-green-700 rounded-full px-3 py-0.5 text-xs font-semibold">
              −{saved}%
            </span>
          </div>

          {/* Preview before/after */}
          <div className="grid grid-cols-2 gap-4">
            {[['Original', input], ['Optimized', output]].map(([label, svg]) => (
              <div key={label}>
                <div className="text-xs text-slate-400 mb-1">{label}</div>
                <div
                  className="h-32 rounded-lg border border-slate-200 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%),linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] flex items-center justify-center overflow-hidden [&_svg]:max-h-28 [&_svg]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
            ))}
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Optimized SVG</label>
              <div className="flex gap-2">
                <button onClick={download} className="text-xs border border-slate-300 text-slate-600 px-3 py-1 rounded hover:bg-slate-50 transition-colors">
                  Download
                </button>
                <button onClick={copy} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <pre className="w-full rounded-lg border border-slate-200 bg-slate-900 text-green-400 px-4 py-3 text-sm font-mono overflow-auto max-h-64 whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
