import { arcText, arcSpan, lineText, fitCap } from '../../lib/text.mjs';

// Starter: oval. Dotted outer edge, ring broken at the top by the country name, month left and year right.
const CX = 240, CY = 170;
const pt = (rx, ry, t) => [CX + rx * Math.sin((t * Math.PI) / 180), CY - ry * Math.cos((t * Math.PI) / 180)].map((n) => n.toFixed(2));
const ellArc = (rx, ry, a, b) => {
  const [x1, y1] = pt(rx, ry, a), [x2, y2] = pt(rx, ry, b);
  return `M${x1},${y1} A${rx},${ry} 0 ${b - a > 180 ? 1 : 0} 1 ${x2},${y2}`;
};

export default function frame({ font, name, month, year }) {
  const warn = [];
  const top = { r: 200, cap: 28, spacing: 0.14 };
  if (arcSpan(font, name, top) > 50) warn.push(`country "${name}" is too wide for the top gap`);
  const monthCap = fitCap(font, month, 100, 36, 0.05);
  const yearCap = fitCap(font, String(year), 100, 36, 0.05);

  const art = `
<ellipse cx="${CX}" cy="${CY}" rx="232" ry="162" fill="none" stroke="INK" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 5.6"/>
<path d="${ellArc(220, 150, 29, 331)}" fill="none" stroke="INK" stroke-width="4.5"/>
<ellipse cx="${CX}" cy="${CY}" rx="178" ry="108" fill="none" stroke="INK" stroke-width="2"/>
<g fill="INK">
${arcText(font, name, { cx: CX, cy: 52 + top.r, center: 0, mode: 'out', ...top })}
${lineText(font, month, { cx: 140, y: CY + monthCap * 0.405, cap: monthCap, spacing: 0.05 })}
${lineText(font, String(year), { cx: 340, y: CY + yearCap * 0.405, cap: yearCap, spacing: 0.05 })}
</g>`;
  return { width: 480, height: 340, art, monumentAt: { x: CX, y: CY }, warn };
}
