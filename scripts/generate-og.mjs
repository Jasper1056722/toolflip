// Generates public/og.png (1200x630) by screenshotting an inline HTML template.
import { chromium } from 'playwright';

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #020617;
    background-image: radial-gradient(circle, #1e293b 1px, transparent 1px);
    background-size: 24px 24px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 80px;
    position: relative;
    overflow: hidden;
  }
  .glow {
    position: absolute; top: -200px; right: -100px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%);
  }
  .logo { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; }
  .logo-box {
    width: 56px; height: 56px; border-radius: 12px; background: #6366f1;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 28px; font-weight: bold;
  }
  .logo-text { color: white; font-size: 36px; font-weight: 600; }
  h1 { color: white; font-size: 72px; font-weight: 700; line-height: 1.1; margin-bottom: 24px; }
  h1 .grad {
    background: linear-gradient(90deg, #818cf8, #22d3ee);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  p { color: #94a3b8; font-size: 30px; }
  .badge {
    position: absolute; bottom: 60px; left: 80px;
    display: inline-flex; align-items: center; gap: 10px;
    background: #1e293b; border: 1px solid #334155; border-radius: 999px;
    padding: 10px 22px; color: #94a3b8; font-size: 20px;
  }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #4ade80; }
  .url { position: absolute; bottom: 68px; right: 80px; color: #475569; font-size: 22px; font-family: monospace; }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="logo">
    <div class="logo-box">⚒</div>
    <div class="logo-text">ToolFlip</div>
  </div>
  <h1>Tools that run in<br><span class="grad">your browser.</span></h1>
  <p>Free dev tools — CSV, JSON, Base64, text utilities & more.</p>
  <div class="badge"><div class="dot"></div>100% client-side · nothing uploaded</div>
  <div class="url">toolflip.dev</div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png generated');
