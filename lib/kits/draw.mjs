// Small SVG drawing helpers shared by every landmark kit. Shapes are plain filled paths.
// A kit returns { vb: [x, y, w, h], ink, holes, extra }:
//   ink    filled shapes in the stamp colour
//   holes  shapes cut out of ink (windows, doors, water, joints)
//   extra  shapes drawn on top of the cut-outs (strokes, finials)
export const f = (n) => +Number(n).toFixed(2);
export const rect = (x, y, w, h) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/>`;
export const path = (d) => `<path d="${d}"/>`;
export const poly = (pts) => path(`M${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')} Z`);
export const circle = (x, y, r) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
export const ring = (x, y, r, w = 2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="INK" stroke-width="${w}"/>`;
export const line = (d, w = 2, extra = '') => `<path d="${d}" fill="none" stroke="INK" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
export const cut = (d, w = 1.5) => `<path d="${d}" fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="round"/>`;
// Arched opening: bottom-centre cx, base y, width w, height h.
export const archShape = (cx, y, w, h) => path(`M${f(cx - w / 2)},${f(y)} V${f(y - h + w / 2)} A${f(w / 2)},${f(w / 2)} 0 0 1 ${f(cx + w / 2)},${f(y - h + w / 2)} V${f(y)} Z`);
export const dome = (cx, y, r, h = r) => path(`M${f(cx - r)},${f(y)} A${f(r)},${f(h)} 0 0 1 ${f(cx + r)},${f(y)} Z`);
export const onion = (cx, y, w, h) => path(`M${f(cx - w / 2)},${f(y)} C${f(cx - w * 0.68)},${f(y - h * 0.3)} ${f(cx - w * 0.18)},${f(y - h * 0.62)} ${f(cx)},${f(y - h)} C${f(cx + w * 0.18)},${f(y - h * 0.62)} ${f(cx + w * 0.68)},${f(y - h * 0.3)} ${f(cx + w / 2)},${f(y)} Z`);
export const spire = (cx, y, w, h) => poly([[cx - w / 2, y], [cx, y - h], [cx + w / 2, y]]);
export const cross = (cx, y, s = 7, w = 1.8) => line(`M${f(cx)},${f(y)} v${f(-s * 1.7)} M${f(cx - s / 2)},${f(y - s * 1.15)} h${f(s)}`, w);
export const crescent = (cx, y, r = 3.2) => `<path d="M${f(cx)},${f(y - r * 2)} a${r},${r} 0 1 0 ${f(r * 1.2)},${f(r * 1.6)} a${r * 0.78},${r * 0.78} 0 1 1 ${f(-r * 1.2)},${f(-r * 1.6)} Z"/>${line(`M${f(cx)},${f(y)} v${f(r * 1.2)}`, 1.4)}`;
export const minaret = (x, top, base, w = 7) => rect(x - w / 2, top + 16, w, base - top - 16) + rect(x - w * 0.95, top + 22, w * 1.9, 3.4) + spire(x, top + 16, w * 1.15, 18) + rect(x - 0.6, top - 6, 1.2, 8);
export const row = (n, x0, x1, fn) => Array.from({ length: n }, (_, i) => fn(n === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (n - 1), i)).join('');
export const mirror = (xs, fn) => xs.map(fn).join('') + xs.filter((x) => x).map((x) => fn(-x)).join('');

// Wrap a kit result into a complete monument SVG. INK is replaced by the stamp colour at render time.
export function toSVG(code, { vb, ink = '', holes = '', extra = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}">
<defs><mask id="${code}-m" maskUnits="userSpaceOnUse" x="-400" y="-400" width="800" height="800"><rect x="-400" y="-400" width="800" height="800" fill="#fff"/><g fill="#000" stroke="none">${holes}</g></mask></defs>
<g fill="INK" stroke="none"><g mask="url(#${code}-m)">${ink}</g>${extra}</g></svg>`;
}
