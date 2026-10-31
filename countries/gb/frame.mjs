import { fitLine, rule } from '../../lib/layout.mjs';

// UNITED KINGDOM: tall window with a round top. The clock tower stands in the opening.
const ARCH = 'M8,492 V200 A192,192 0 0 1 392,200 V492 Z';

export default function frame({ font, name, month, year }) {
  const n = fitLine(font, name, { cx: 200, baseline: 392, maxW: 320, cap: 34, spacing: 0.07 });
  const d = fitLine(font, `${month} ${year}`, { cx: 200, baseline: 456, maxW: 250, cap: 38, spacing: 0.05 });
  const warn = [n, d].some((l) => l.squeezed) ? [`text for "${name}" is squeezed to fit the window`] : [];
  const art = `<path d="${ARCH}" fill="none" stroke="INK" stroke-width="5" stroke-linejoin="round"/>
<path d="${ARCH}" transform="translate(200 300) scale(0.945) translate(-200 -300)" fill="none" stroke="INK" stroke-width="2.1" stroke-linejoin="round"/>${rule(24, 376, 346)}
<g fill="INK">${n.svg}${d.svg}</g>`;
  return { width: 400, height: 500, art, monumentAt: { x: 200, y: 200, scale: 1.1 }, warn };
}
