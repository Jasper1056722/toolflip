export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  accent: string;
  category: 'data' | 'text' | 'css' | 'svg';
  comingSoon?: boolean;
}

export const tools: Tool[] = [
  // Data
  { title: 'CSV to JSON', description: 'Convert CSV data to JSON instantly. Paste and go.', href: '/tools/csv-to-json', icon: '⇄', color: 'bg-blue-500/10 text-blue-500', accent: 'from-blue-500 to-blue-400', category: 'data' },
  { title: 'JSON Formatter', description: 'Prettify and validate JSON with syntax highlighting.', href: '/tools/json-formatter', icon: '{ }', color: 'bg-amber-500/10 text-amber-500', accent: 'from-amber-500 to-amber-400', category: 'data' },
  { title: 'Base64 Encoder', description: 'Encode and decode Base64 — two-way, live.', href: '/tools/base64', icon: '64', color: 'bg-emerald-500/10 text-emerald-500', accent: 'from-emerald-500 to-emerald-400', category: 'data' },
  { title: 'YAML to JSON', description: 'Convert YAML config files to JSON.', href: '/tools/yaml-to-json', icon: '⇄', color: 'bg-purple-500/10 text-purple-500', accent: 'from-purple-500 to-purple-400', category: 'data' },

  // Text
  { title: 'Character Counter', description: 'Count characters per platform — Twitter, LinkedIn, meta tags.', href: '/tools/character-counter', icon: '#', color: 'bg-pink-500/10 text-pink-500', accent: 'from-pink-500 to-pink-400', category: 'text' },
  { title: 'Text Case Converter', description: 'camelCase, snake_case, UPPER, Title Case and more.', href: '/tools/text-case', icon: 'Aa', color: 'bg-indigo-500/10 text-indigo-500', accent: 'from-indigo-500 to-indigo-400', category: 'text' },
  { title: 'Slug Generator', description: 'Turn any title into a clean URL-safe slug.', href: '/tools/slug-generator', icon: '/', color: 'bg-teal-500/10 text-teal-500', accent: 'from-teal-500 to-teal-400', category: 'text' },
  { title: 'Line Sorter', description: 'Sort, deduplicate, or reverse lines of text.', href: '/tools/line-sorter', icon: '↕', color: 'bg-orange-500/10 text-orange-500', accent: 'from-orange-500 to-orange-400', category: 'text' },

  // CSS
  { title: 'CSS Gradient Generator', description: 'Build linear and radial gradients visually.', href: '/tools/css-gradient', icon: '▓', color: 'bg-violet-500/10 text-violet-500', accent: 'from-violet-500 to-violet-400', category: 'css' },
  { title: 'Box Shadow Builder', description: 'Create and preview CSS box-shadow values.', href: '/tools/box-shadow', icon: '◻', color: 'bg-sky-500/10 text-sky-500', accent: 'from-sky-500 to-sky-400', category: 'css' },
  { title: 'Color Contrast Checker', description: 'Check WCAG AA/AAA compliance for text colors.', href: '/tools/color-contrast', icon: '◑', color: 'bg-rose-500/10 text-rose-500', accent: 'from-rose-500 to-rose-400', category: 'css' },

  // SVG
  { title: 'SVG Optimizer', description: 'Minify SVG files. Removes metadata and unused elements.', href: '/tools/svg-optimizer', icon: '◈', color: 'bg-cyan-500/10 text-cyan-500', accent: 'from-cyan-500 to-cyan-400', category: 'svg' },
  { title: 'SVG to PNG', description: 'Export SVG to PNG at any resolution, in browser.', href: '/tools/svg-to-png', icon: '↓', color: 'bg-lime-500/10 text-lime-500', accent: 'from-lime-500 to-lime-400', category: 'svg' },
  { title: 'Favicon Generator', description: 'Create ICO and PNG favicons from any SVG or image.', href: '/tools/favicon-generator', icon: '⬡', color: 'bg-fuchsia-500/10 text-fuchsia-500', accent: 'from-fuchsia-500 to-fuchsia-400', category: 'svg' },
];

export const liveTools = tools.filter(t => !t.comingSoon);
export const byCategory = (cat: Tool['category']) => tools.filter(t => t.category === cat);
