import { fitLine, polygon, rule } from '../../lib/layout.mjs';

// SPAIN: tall octagon. Name on top, date in a band below the cathedral.
export default function frame({ font, name, month, year }) {
  const outer = polygon([[68, 8], [332, 8], [392, 68], [392, 412], [332, 472], [68, 472], [8, 412], [8, 68]]);
  const inner = polygon([[72, 22], [328, 22], [378, 72], [378, 408], [328, 458], [72, 458], [22, 408], [22, 72]]);
  const n = fitLine(font, name, { cx: 200, baseline: 96, maxW: 300, cap: 54, spacing: 0.08 });
  const d = fitLine(font, `${month} ${year}`, { cx: 200, baseline: 436, maxW: 280, cap: 40, spacing: 0.05 });
  const warn = [n, d].some((l) => l.squeezed) ? [`text for "${name}" is squeezed to fit the octagon`] : [];
  const art = `<path d="${outer}" fill="none" stroke="INK" stroke-width="5" stroke-linejoin="round"/>
<path d="${inner}" fill="none" stroke="INK" stroke-width="2" stroke-linejoin="round"/>${rule(22, 378, 382)}
<g fill="INK">${n.svg}${d.svg}</g>`;
  return { width: 400, height: 480, art, monumentAt: { x: 200, y: 252, scale: 1.05 }, warn };
}
