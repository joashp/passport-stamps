import { lineText, textWidth, fitCap, star } from '../../lib/text.mjs';

// Starter: rounded box. Country across the top, mountain scene, date in a bottom band.
export default function frame({ font, name, month, year }) {
  const W = 400, H = 450, warn = [];
  const dateText = `${month} ${year}`;
  const titleCap = fitCap(font, name, 320, 54, 0.06);
  const dateCap = fitCap(font, dateText, 190, 38, 0.04);
  if (titleCap < 30) warn.push(`country "${name}" is squeezed to cap height ${titleCap.toFixed(0)}`);

  const art = `
<rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="42" fill="none" stroke="INK" stroke-width="5"/>
<rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="30" fill="none" stroke="INK" stroke-width="2"/>
<rect x="22" y="350" width="${W - 44}" height="3" fill="INK"/>
<g fill="INK">
${lineText(font, name, { cx: W / 2, y: 44 + titleCap * 0.81, cap: titleCap, spacing: 0.06 })}
${lineText(font, dateText, { cx: W / 2, y: 391 + dateCap * 0.405, cap: dateCap, spacing: 0.04 })}
${star(62, 391, 13)}${star(338, 391, 13)}
</g>`;
  return { width: W, height: H, art, monumentAt: { x: 200, y: 240 }, warn };
}
