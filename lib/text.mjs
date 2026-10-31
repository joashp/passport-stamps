import fs from 'node:fs';
import opentype from 'opentype.js';

// opentype.js toPathData is unreliable across versions, so serialise the commands directly.
const n2 = (v) => +v.toFixed(2);
function pathData(path) {
  return path.commands.map((c) => {
    switch (c.type) {
      case 'M': case 'L': return `${c.type}${n2(c.x)} ${n2(c.y)}`;
      case 'C': return `C${n2(c.x1)} ${n2(c.y1)} ${n2(c.x2)} ${n2(c.y2)} ${n2(c.x)} ${n2(c.y)}`;
      case 'Q': return `Q${n2(c.x1)} ${n2(c.y1)} ${n2(c.x)} ${n2(c.y)}`;
      default: return 'Z';
    }
  }).join('');
}

const CAP = 0.81; // Oswald cap height as a fraction of the em

export function loadFont(file) {
  const b = fs.readFileSync(file);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}

const sizeForCap = (cap) => cap / CAP;

// Lay out glyphs: returns [{ch, mid, path}] with x measured from the start, plus total width.
function layout(font, text, size, spacing) {
  const glyphs = [...text];
  let x = 0;
  const out = [];
  glyphs.forEach((ch, i) => {
    const adv = font.getAdvanceWidth(ch, size);
    const next = glyphs[i + 1];
    const kern = next ? font.getKerningValue(font.charToGlyph(ch), font.charToGlyph(next)) * (size / font.unitsPerEm) : 0;
    out.push({ ch, adv, mid: x + adv / 2 });
    x += adv + kern + spacing * size;
  });
  return { items: out, total: x - spacing * size };
}

export function textWidth(font, text, cap, spacing = 0) {
  return layout(font, text, sizeForCap(cap), spacing).total;
}

// Straight text, centred on cx, baseline at y. Output is pure path data (no font dependency).
export function lineText(font, text, { cx, y, cap, spacing = 0 }) {
  const size = sizeForCap(cap);
  const { items, total } = layout(font, text, size, spacing);
  return items.filter((g) => g.ch.trim()).map((g) => {
    const d = pathData(font.getPath(g.ch, 0, 0, size));
    return `<path transform="translate(${(cx - total / 2 + g.mid - g.adv / 2).toFixed(2)} ${y})" d="${d}"/>`;
  }).join('');
}

// Text on a circle. phi is degrees clockwise from 12 o'clock.
//  mode 'out': reads clockwise, letter tops point away from centre (top, left, right sides)
//  mode 'in' : reads counter-clockwise, letter tops point at the centre (bottom)
// r is the baseline radius.
export function arcText(font, text, { cx, cy, r, center, cap, spacing = 0, mode = 'out' }) {
  const size = sizeForCap(cap);
  const { items, total } = layout(font, text, size, spacing);
  const dir = mode === 'out' ? 1 : -1;
  return items.filter((g) => g.ch.trim()).map((g) => {
    const phi = center + dir * ((g.mid - total / 2) / r) * (180 / Math.PI);
    const rad = (phi * Math.PI) / 180;
    const px = cx + r * Math.sin(rad);
    const py = cy - r * Math.cos(rad);
    const rot = mode === 'out' ? phi : phi - 180;
    const d = pathData(font.getPath(g.ch, 0, 0, size));
    return `<path transform="translate(${px.toFixed(2)} ${py.toFixed(2)}) rotate(${rot.toFixed(2)}) translate(${(-g.adv / 2).toFixed(2)} 0)" d="${d}"/>`;
  }).join('');
}

// Angular span (degrees) a string occupies at radius r, used to check fit.
export function arcSpan(font, text, { r, cap, spacing = 0 }) {
  return (textWidth(font, text, cap, spacing) / r) * (180 / Math.PI);
}

// Largest cap height (up to capMax) at which the text fits within maxWidth.
export function fitCap(font, text, maxWidth, capMax, spacing = 0) {
  const w = textWidth(font, text, capMax, spacing);
  return w <= maxWidth ? capMax : capMax * (maxWidth / w);
}

export const star = (cx, cy, r) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.42 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(' ')}"/>`;
};
