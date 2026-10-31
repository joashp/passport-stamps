import { fitLine, polygon, rule } from '../../lib/layout.mjs';

// UNITED STATES: shield. Statue above, country name and date in the point of the shield.
export default function frame({ font, name, month, year }) {
  const outer = polygon([[200, 10], [388, 52], [388, 360], [200, 505], [12, 360], [12, 52]]);
  const inner = polygon([[200, 25], [376, 64], [376, 354], [200, 490], [24, 354], [24, 64]]);
  const n = fitLine(font, name, { cx: 200, baseline: 358, maxW: 330, cap: 36, spacing: 0.05 });
  const d = fitLine(font, `${month} ${year}`, { cx: 200, baseline: 430, maxW: 150, cap: 32, spacing: 0.05 });
  const warn = [n, d].some((l) => l.squeezed) ? [`text for "${name}" is squeezed to fit the shield`] : [];
  const art = `<path d="${outer}" fill="none" stroke="INK" stroke-width="5" stroke-linejoin="round"/>
<path d="${inner}" fill="none" stroke="INK" stroke-width="2" stroke-linejoin="round"/>${rule(24, 376, 312)}
<g fill="INK">${n.svg}${d.svg}</g>`;
  return { width: 400, height: 520, art, monumentAt: { x: 200, y: 178, scale: 0.98 }, warn };
}
