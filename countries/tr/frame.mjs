import { fitLine, rule } from '../../lib/layout.mjs';

// TURKEY: ogee (pointed) arch, like a mosque doorway. Name in the point, date at the foot.
const ARCH = 'M12,490 V250 C12,170 70,120 120,90 C160,66 190,40 200,10 C210,40 240,66 280,90 C330,120 388,170 388,250 V490 Z';

export default function frame({ font, name, month, year }) {
  const n = fitLine(font, name, { cx: 200, baseline: 150, maxW: 170, cap: 38, spacing: 0.1 });
  const d = fitLine(font, `${month} ${year}`, { cx: 200, baseline: 456, maxW: 240, cap: 40, spacing: 0.05 });
  const warn = [n, d].some((l) => l.squeezed) ? [`text for "${name}" is squeezed to fit the arch`] : [];
  const art = `<path d="${ARCH}" fill="none" stroke="INK" stroke-width="5" stroke-linejoin="round"/>
<path d="${ARCH}" transform="translate(200 260) scale(0.94) translate(-200 -260)" fill="none" stroke="INK" stroke-width="2.1" stroke-linejoin="round"/>${rule(24, 376, 396)}
<g fill="INK">${n.svg}${d.svg}</g>`;
  return { width: 400, height: 500, art, monumentAt: { x: 200, y: 258, scale: 1.15 }, warn };
}
