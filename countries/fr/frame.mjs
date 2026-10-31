import { arcText, arcSpan } from '../../lib/text.mjs';

// FRANCE: round stamp. Country name across the top, date across the bottom.
const C = 200;
const arcPath = (r, a, b) => {
  const p = (phi) => [C + r * Math.sin((phi * Math.PI) / 180), C - r * Math.cos((phi * Math.PI) / 180)].map((n) => n.toFixed(2));
  const [x1, y1] = p(a), [x2, y2] = p(b);
  return `M${x1},${y1} A${r},${r} 0 ${b - a > 180 ? 1 : 0} 1 ${x2},${y2}`;
};

export default function frame({ font, name, month, year }) {
  const warn = [];
  const dateText = `${month} ${year}`;
  const top = { r: 137, cap: 31, spacing: 0.1 };
  const bottom = { r: 175, cap: 28, spacing: 0.1 };
  if (arcSpan(font, name, top) > 120) warn.push(`country "${name}" is too wide for the top arc`);
  if (arcSpan(font, dateText, bottom) > 100) warn.push(`date "${dateText}" is too wide for the bottom arc`);

  const art = `
<circle cx="${C}" cy="${C}" r="186" fill="none" stroke="INK" stroke-width="4.5"/>
<path d="${arcPath(176, 42, 138)}" fill="none" stroke="INK" stroke-width="1.6"/>
<path d="${arcPath(176, 222, 318)}" fill="none" stroke="INK" stroke-width="1.6"/>
<circle cx="${C}" cy="${C}" r="122" fill="none" stroke="INK" stroke-width="4"/>
<g fill="INK">
${arcText(font, name, { cx: C, cy: C, center: 0, mode: 'out', ...top })}
${arcText(font, dateText, { cx: C, cy: C, center: 180, mode: 'in', ...bottom })}
</g>`;
  return { width: 400, height: 400, art, monumentAt: { x: C, y: C }, warn };
}
