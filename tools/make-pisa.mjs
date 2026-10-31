// Draws countries/it/monument.svg. Origin is the middle of the oval; base of the tower is y = +98.
import fs from 'node:fs';
const BASE = 98;
const tiers = [[BASE - 30, BASE, 27, 'ground'], ...[0, 1, 2, 3, 4, 5].map((i) => [BASE - 30 - 18 * (i + 1), BASE - 30 - 18 * i, 26 - i * 0.3, 'arcade'])];
const topArc = BASE - 30 - 18 * 6;                  // top of the sixth arcade tier
tiers.push([topArc - 28, topArc, 20, 'belfry']);
const f = (n) => n.toFixed(2);
let body = '';
const opening = (x, yb, w, h) => `<path d="M${f(x - w / 2)},${f(yb)} V${f(yb - h + w / 2)} A${w / 2},${w / 2} 0 0 1 ${f(x + w / 2)},${f(yb - h + w / 2)} V${f(yb)} Z"/>`;
tiers.forEach(([y0, y1, hw, kind]) => {
  const n = kind === 'belfry' ? 5 : 9, span = hw * 2 - 8, step = span / (n - 1);
  const h = kind === 'ground' ? 16 : kind === 'belfry' ? 17 : 11, w = kind === 'belfry' ? 3.6 : 3;
  for (let i = 0; i < n; i++) body += opening(-hw + 4 + i * step, y1 - 3.5, w, h);
  body += `<rect x="${f(-hw - 1.5)}" y="${f(y0 - 1.75)}" width="${f(hw * 2 + 3)}" height="3.5"/>`;
});
const sides = tiers.map(([y0, y1, hw]) => `M${f(-hw)},${f(y1)} V${f(y0)} M${f(hw)},${f(y1)} V${f(y0)}`).join(' ');
const roofY = topArc - 28;
const roof = `<path d="M-14,${roofY - 1} V${roofY - 9} Q0,${roofY - 14} 14,${roofY - 9} V${roofY - 1} Z"/>`;
fs.writeFileSync('countries/it/monument.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -110 240 220">
<g fill="INK" stroke="INK">
<g transform="rotate(4 0 ${BASE})"><path d="${sides}" fill="none" stroke-width="2.2"/><g stroke="none">${body}${roof}</g></g>
<rect x="-52" y="${BASE}" width="104" height="4" stroke="none"/>
</g></svg>`);
console.log('wrote countries/it/monument.svg');
