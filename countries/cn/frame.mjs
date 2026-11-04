import { fitLine, notchRect, rule } from '../../lib/layout.mjs';

// CHINA: landscape plaque with quarter-circle bites out of the corners.
export default function frame({ font, name, month, year }) {
  const n = fitLine(font, name, { cx: 240, baseline: 78, maxW: 300, cap: 42, spacing: 0.1 });
  const d = fitLine(font, `${month} ${year}`, { cx: 240, baseline: 346, maxW: 260, cap: 30, spacing: 0.06 });
  const warn = [n, d].some((l) => l.squeezed) ? [`text for "${name}" is squeezed to fit the plaque`] : [];
  const art = `<path d="${notchRect(8, 8, 472, 372, 36)}" fill="none" stroke="INK" stroke-width="5" stroke-linejoin="round"/>
<path d="${notchRect(20, 20, 460, 360, 26)}" fill="none" stroke="INK" stroke-width="2"/>${rule(46, 434, 304, 2.5)}
<g fill="INK">${n.svg}${d.svg}</g>`;
  return { width: 480, height: 380, art, monumentAt: { x: 240, y: 208, scale: 0.85 }, warn };
}
