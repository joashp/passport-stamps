import { lineText, fitCap, star } from './text.mjs';

// Centred line of text that shrinks to fit maxW. Returns svg plus the cap height it ended up with.
export function fitLine(font, text, { cx, baseline, maxW, cap, spacing = 0.06 }) {
  const c = fitCap(font, text, maxW, cap, spacing);
  return { svg: lineText(font, text, { cx, y: baseline, cap: c, spacing }), cap: c, squeezed: c < cap * 0.7 };
}

export const pts = (list) => list.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
const f = (n) => +n.toFixed(2);
export const polygon = (list) => `M${pts(list).replaceAll(' ', ' L')} Z`;

// Rectangle whose four corners are cut as staircases (n steps of size s).
export function stepRect(x0, y0, x1, y1, s, n) {
  const tl = [];
  for (let i = 0; i < n; i++) tl.push([x0 + i * s, y0 + (n - i) * s], [x0 + (i + 1) * s, y0 + (n - i) * s]);
  tl.push([x0 + n * s, y0]);
  const mx = (p) => [x0 + x1 - p[0], p[1]], my = (p) => [p[0], y0 + y1 - p[1]];
  const tr = tl.map(mx).reverse(), br = tl.map((p) => my(mx(p))), bl = tl.map(my).reverse();
  return polygon([...tl, ...tr, ...br, ...bl]);
}

// Rectangle with concave quarter-circle bites out of each corner.
export const notchRect = (x0, y0, x1, y1, r) =>
  `M${x0 + r},${y0} H${x1 - r} A${r},${r} 0 0 0 ${x1},${y0 + r} V${y1 - r} A${r},${r} 0 0 0 ${x1 - r},${y1} H${x0 + r} A${r},${r} 0 0 0 ${x0},${y1 - r} V${y0 + r} A${r},${r} 0 0 0 ${x0 + r},${y0} Z`;

export const rule = (x0, x1, y, w = 3) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${w}" fill="INK"/>`;
export { star };
