import { fitLine, stepRect, rule } from '../../lib/layout.mjs';

// MEXICO: rectangle with stepped corners, echoing the pyramid's terraces.
export default function frame({ font, name, month, year }) {
  const n = fitLine(font, name, { cx: 210, baseline: 82, maxW: 300, cap: 46, spacing: 0.1 });
  const d = fitLine(font, `${month} ${year}`, { cx: 210, baseline: 382, maxW: 280, cap: 40, spacing: 0.05 });
  const warn = [n, d].some((l) => l.squeezed) ? [`text for "${name}" is squeezed to fit the frame`] : [];
  const art = `<path d="${stepRect(8, 8, 412, 432, 15, 3)}" fill="none" stroke="INK" stroke-width="5" stroke-linejoin="miter"/>
<path d="${stepRect(22, 22, 398, 418, 10, 3)}" fill="none" stroke="INK" stroke-width="2" stroke-linejoin="miter"/>${rule(30, 390, 316)}
<g fill="INK">${n.svg}${d.svg}</g>`;
  return { width: 420, height: 440, art, monumentAt: { x: 210, y: 160, scale: 1.3 }, warn };
}
