import { fitLine, polygon, rule } from '../../lib/layout.mjs';

// GERMANY: wide hexagon, pointed left and right, to suit a gate that is wider than it is tall.
const HEX = [[122, 8], [358, 8], [472, 200], [358, 392], [122, 392], [8, 200]];

export default function frame({ font, name, month, year }) {
  const n = fitLine(font, name, { cx: 240, baseline: 84, maxW: 260, cap: 42, spacing: 0.1 });
  const d = fitLine(font, `${month} ${year}`, { cx: 240, baseline: 362, maxW: 280, cap: 32, spacing: 0.06 });
  const warn = [n, d].some((l) => l.squeezed) ? [`text for "${name}" is squeezed to fit the hexagon`] : [];
  const art = `<path d="${polygon(HEX)}" fill="none" stroke="INK" stroke-width="5" stroke-linejoin="round"/>
<path d="${polygon(HEX)}" transform="translate(240 200) scale(0.935) translate(-240 -200)" fill="none" stroke="INK" stroke-width="2.1" stroke-linejoin="round"/>${rule(90, 390, 318, 2.5)}
<g fill="INK">${n.svg}${d.svg}</g>`;
  return { width: 480, height: 400, art, monumentAt: { x: 240, y: 207, scale: 1.02 }, warn };
}
