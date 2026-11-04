// Frame families for countries without a hand-built frame.
// Every family places: country name, the monument (scaled to fit its box), and the date.
// Long names are split over two lines and shrunk to fit.
import { lineText, fitCap, arcText, arcSpan, star } from './text.mjs';
import { polygon, stepRect, notchRect } from './layout.mjs';

const stroke = (d, w = 5) => `<path d="${d}" fill="none" stroke="INK" stroke-width="${w}" stroke-linejoin="round"/>`;
const inner = (d, cx, cy, k) => `<path d="${d}" transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})" fill="none" stroke="INK" stroke-width="${+(2.1 / k).toFixed(2)}" stroke-linejoin="round"/>`;
const double = (d, cx, cy, k) => stroke(d) + inner(d, cx, cy, k);
const rule = (x0, x1, y, h = 2.5) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="INK"/>`;

// Split "AND THE GRENADINES" style names into two balanced lines.
function split(name) {
  const w = name.split(' ');
  if (w.length < 2) return [name];
  let best = [name], bestDiff = Infinity;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(' '), b = w.slice(i).join(' ');
    const d = Math.abs(a.length - b.length);
    if (d < bestDiff) { bestDiff = d; best = [a, b]; }
  }
  return best;
}

function nameBlock(font, name, { cx, top, h, maxW, capMax, spacing = 0.08 }) {
  const one = fitCap(font, name, maxW, capMax, spacing);
  const lines = split(name);
  let out, cap;
  if (one >= capMax * 0.72 || lines.length === 1) {
    cap = one; const base = top + (h + cap) / 2;
    out = lineText(font, name, { cx, y: base, cap, spacing });
  } else {
    cap = Math.min(...lines.map((l) => fitCap(font, l, maxW, capMax * 0.82, spacing)));
    const gap = cap * 0.35, total = cap * 2 + gap, t0 = top + (h - total) / 2;
    out = lines.map((l, i) => lineText(font, l, { cx, y: t0 + cap + i * (cap + gap), cap, spacing })).join('');
  }
  return { svg: out, cap };
}

function place(vb, box) { // fit the monument (vb = its viewBox) into box, centred
  const [vx, vy, vw, vh] = vb;
  const s = Math.min(box.w / vw, box.h / vh, 1.7);
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  return { x: cx - (vx + vw / 2) * s, y: cy - (vy + vh / 2) * s, scale: +s.toFixed(3) };
}

// ---------- straight-text families ----------
const SPECS = {
  shield: { W: 400, H: 500, d: polygon([[200, 10], [388, 52], [388, 330], [200, 495], [12, 330], [12, 52]]), c: [200, 260], k: 0.935,
    name: { cx: 200, top: 62, h: 70, maxW: 310, capMax: 40 }, mono: { x: 50, y: 134, w: 300, h: 188 }, rule: [26, 374, 332], date: { baseline: 404, maxW: 170, cap: 32 } },
  octTall: { W: 400, H: 500, d: polygon([[70, 8], [330, 8], [392, 70], [392, 430], [330, 492], [70, 492], [8, 430], [8, 70]]), c: [200, 250], k: 0.94,
    name: { cx: 200, top: 44, h: 76, maxW: 240, capMax: 46 }, mono: { x: 40, y: 128, w: 320, h: 250 }, rule: [24, 376, 388], date: { baseline: 452, maxW: 230, cap: 36 } },
  ogee: { W: 400, H: 500, d: 'M12,490 V250 C12,170 70,120 120,90 C160,66 190,40 200,10 C210,40 240,66 280,90 C330,120 388,170 388,250 V490 Z', c: [200, 260], k: 0.94,
    name: { cx: 200, top: 108, h: 70, maxW: 200, capMax: 38 }, mono: { x: 40, y: 188, w: 320, h: 200 }, rule: [24, 376, 398], date: { baseline: 458, maxW: 250, cap: 38 } },
  roundArch: { W: 400, H: 500, d: 'M8,492 V200 A192,192 0 0 1 392,200 V492 Z', c: [200, 300], k: 0.945,
    name: { cx: 200, top: 62, h: 76, maxW: 250, capMax: 40 }, mono: { x: 48, y: 140, w: 304, h: 236 }, rule: [24, 376, 386], date: { baseline: 452, maxW: 260, cap: 38 } },
  boxTall: { W: 400, H: 470, d: 'M50,8 H350 Q392,8 392,50 V420 Q392,462 350,462 H50 Q8,462 8,420 V50 Q8,8 50,8 Z', c: [200, 235], k: 0.93,
    name: { cx: 200, top: 30, h: 80, maxW: 316, capMax: 54 }, mono: { x: 40, y: 118, w: 320, h: 218 }, rule: [24, 376, 348], date: { baseline: 418, maxW: 210, cap: 38 }, stars: [60, 340, 396] },
  house: { W: 400, H: 500, d: polygon([[200, 8], [392, 110], [392, 492], [8, 492], [8, 110]]), c: [200, 300], k: 0.94,
    name: { cx: 200, top: 118, h: 74, maxW: 316, capMax: 44 }, mono: { x: 42, y: 204, w: 316, h: 192 }, rule: [24, 376, 408], date: { baseline: 466, maxW: 270, cap: 38 } },
  stepTall: { W: 400, H: 500, d: stepRect(8, 8, 392, 492, 15, 3), c: [200, 250], k: 0.93,
    name: { cx: 200, top: 34, h: 74, maxW: 300, capMax: 50 }, mono: { x: 40, y: 116, w: 320, h: 262 }, rule: [28, 372, 392], date: { baseline: 452, maxW: 280, cap: 40 } },
  hexTall: { W: 400, H: 500, d: polygon([[200, 8], [392, 100], [392, 400], [200, 492], [8, 400], [8, 100]]), c: [200, 250], k: 0.935,
    name: { cx: 200, top: 96, h: 70, maxW: 320, capMax: 42 }, mono: { x: 44, y: 168, w: 312, h: 196 }, rule: [30, 370, 372], date: { baseline: 424, maxW: 130, cap: 30 } },
  roundSquare: { W: 400, H: 420, d: 'M70,8 H330 Q392,8 392,70 V350 Q392,412 330,412 H70 Q8,412 8,350 V70 Q8,8 70,8 Z', c: [200, 210], k: 0.93,
    name: { cx: 200, top: 28, h: 76, maxW: 300, capMax: 50 }, mono: { x: 44, y: 108, w: 312, h: 206 }, rule: [28, 372, 322], date: { baseline: 380, maxW: 250, cap: 36 }, stars: [58, 342, 354] },
  octSquare: { W: 400, H: 420, d: polygon([[120, 8], [280, 8], [392, 120], [392, 300], [280, 412], [120, 412], [8, 300], [8, 120]]), c: [200, 210], k: 0.93,
    name: { cx: 200, top: 54, h: 66, maxW: 232, capMax: 44 }, mono: { x: 60, y: 126, w: 280, h: 172 }, rule: [60, 340, 308], date: { baseline: 372, maxW: 200, cap: 32 } },
  heater: { W: 400, H: 440, d: 'M12,12 H388 V220 Q388,370 200,430 Q12,370 12,220 Z', c: [200, 220], k: 0.93,
    name: { cx: 200, top: 28, h: 76, maxW: 310, capMax: 48 }, mono: { x: 50, y: 110, w: 300, h: 180 }, rule: [26, 374, 300], date: { baseline: 358, maxW: 200, cap: 34 } },
  // wide
  notch: { W: 480, H: 380, d: notchRect(8, 8, 472, 372, 36), c: [240, 190], k: 0.945,
    name: { cx: 240, top: 34, h: 60, maxW: 340, capMax: 42 }, mono: { x: 50, y: 104, w: 380, h: 190 }, rule: [46, 434, 304], date: { baseline: 348, maxW: 280, cap: 32 } },
  hexWide: { W: 480, H: 400, d: polygon([[122, 8], [358, 8], [472, 200], [358, 392], [122, 392], [8, 200]]), c: [240, 200], k: 0.935,
    name: { cx: 240, top: 32, h: 72, maxW: 260, capMax: 42 }, mono: { x: 80, y: 114, w: 320, h: 200 }, rule: [90, 390, 322], date: { baseline: 366, maxW: 290, cap: 32 } },
  banner: { W: 480, H: 360, d: polygon([[8, 8], [472, 8], [440, 180], [472, 352], [8, 352], [40, 180]]), c: [240, 180], k: 0.94,
    name: { cx: 240, top: 26, h: 68, maxW: 330, capMax: 46 }, mono: { x: 70, y: 100, w: 340, h: 180 }, rule: [60, 420, 288], date: { baseline: 332, maxW: 280, cap: 34 } },
  pill: { W: 480, H: 340, d: 'M150,10 H330 Q470,10 470,170 Q470,330 330,330 H150 Q10,330 10,170 Q10,10 150,10 Z', c: [240, 170], k: 0.93,
    name: { cx: 240, top: 30, h: 60, maxW: 290, capMax: 40 }, mono: { x: 100, y: 96, w: 280, h: 148 }, rule: [96, 384, 252], date: { baseline: 300, maxW: 230, cap: 30 } },
  stepWide: { W: 480, H: 360, d: stepRect(8, 8, 472, 352, 14, 3), c: [240, 180], k: 0.93,
    name: { cx: 240, top: 34, h: 60, maxW: 330, capMax: 42 }, mono: { x: 56, y: 104, w: 368, h: 174 }, rule: [34, 446, 288], date: { baseline: 334, maxW: 290, cap: 32 } },
  boxWide: { W: 480, H: 340, d: 'M50,8 H430 Q472,8 472,50 V290 Q472,332 430,332 H50 Q8,332 8,290 V50 Q8,8 50,8 Z', c: [240, 170], k: 0.94,
    name: { cx: 240, top: 34, h: 56, maxW: 370, capMax: 40 }, mono: { x: 50, y: 96, w: 380, h: 150 }, rule: [28, 452, 254], date: { baseline: 306, maxW: 290, cap: 32 }, stars: [60, 420, 280] },
};

// ---------- round families (curved text) ----------
const scallop = (cx, cy, r, n = 28, bump = 7) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
    const p = (a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)].map((v) => +v.toFixed(2));
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    d += (i === 0 ? `M${x0},${y0}` : '') + ` A${bump},${bump} 0 0 1 ${x1},${y1}`;
  }
  return d + ' Z';
};
const arcPath = (cx, cy, r, a, b) => {
  const pt = (phi) => [cx + r * Math.sin((phi * Math.PI) / 180), cy - r * Math.cos((phi * Math.PI) / 180)].map((v) => +v.toFixed(2));
  const [x1, y1] = pt(a), [x2, y2] = pt(b);
  return `M${x1},${y1} A${r},${r} 0 ${b - a > 180 ? 1 : 0} 1 ${x2},${y2}`;
};
const ROUND = {
  circle: (C) => `<circle cx="${C}" cy="${C}" r="186" fill="none" stroke="INK" stroke-width="4.5"/><path d="${arcPath(C, C, 176, 42, 138)}" fill="none" stroke="INK" stroke-width="1.6"/><path d="${arcPath(C, C, 176, 222, 318)}" fill="none" stroke="INK" stroke-width="1.6"/><circle cx="${C}" cy="${C}" r="122" fill="none" stroke="INK" stroke-width="4"/>`,
  scallop: (C) => `<path d="${scallop(C, C, 186, 30, 6.2)}" fill="none" stroke="INK" stroke-width="3.6"/><circle cx="${C}" cy="${C}" r="170" fill="none" stroke="INK" stroke-width="1.8"/><circle cx="${C}" cy="${C}" r="122" fill="none" stroke="INK" stroke-width="3.6"/>`,
  seal: (C) => `<circle cx="${C}" cy="${C}" r="186" fill="none" stroke="INK" stroke-width="4.5"/><circle cx="${C}" cy="${C}" r="174" fill="none" stroke="INK" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 5.4"/><circle cx="${C}" cy="${C}" r="122" fill="none" stroke="INK" stroke-width="4"/><circle cx="${C}" cy="${C}" r="115" fill="none" stroke="INK" stroke-width="1.4"/>`,
};

export const FAMILY_NAMES = [...Object.keys(SPECS), ...Object.keys(ROUND)];
export const isWide = (f) => ['notch', 'hexWide', 'banner', 'pill', 'stepWide', 'boxWide'].includes(f);
export const isTall = (f) => ['shield', 'octTall', 'ogee', 'roundArch', 'boxTall', 'house', 'stepTall', 'hexTall', 'heater'].includes(f);

export function familyFrame(family, { font, name, month, year, monumentVB }) {
  const warn = [];
  const dateText = `${month} ${year}`;
  if (ROUND[family]) {
    const C = 200;
    let cap = 31;
    while (arcSpan(font, name, { r: 137, cap, spacing: 0.08 }) > 122 && cap > 12) cap -= 0.5;
    if (cap < 17) warn.push(`"${name}" is small (${cap.toFixed(0)}) to fit the round frame`);
    const top = arcText(font, name, { cx: C, cy: C, r: 137, center: 0, cap, spacing: 0.08, mode: 'out' });
    const dcap = 28;
    const bottom = arcText(font, dateText, { cx: C, cy: C, r: 175, center: 180, cap: dcap, spacing: 0.1, mode: 'in' });
    const R = 118, [vx, vy, vw, vh] = monumentVB;
    const s = Math.min((2 * R) / Math.hypot(vw, vh), 1.7);
    const art = ROUND[family](C) + `<g fill="INK">${top}${bottom}</g>`;
    return { width: 400, height: 400, art, monumentAt: { x: C - (vx + vw / 2) * s, y: C - (vy + vh / 2) * s, scale: +s.toFixed(3) }, warn };
  }
  const S = SPECS[family];
  if (!S) throw new Error(`Unknown frame family ${family}`);
  const n = nameBlock(font, name, S.name);
  if (n.cap < 17) warn.push(`"${name}" is small (cap ${n.cap.toFixed(0)}) in the ${family} frame`);
  const dCap = fitCap(font, dateText, S.date.maxW, S.date.cap, 0.06);
  const date = lineText(font, dateText, { cx: S.W / 2, y: S.date.baseline, cap: dCap, spacing: 0.06 });
  const stars = S.stars ? `<g fill="INK">${star(S.stars[0], S.stars[2], 12)}${star(S.stars[1], S.stars[2], 12)}</g>` : '';
  const art = double(S.d, S.c[0], S.c[1], S.k) + (S.rule ? rule(S.rule[0], S.rule[1], S.rule[2]) : '') + `<g fill="INK">${n.svg}${date}</g>` + stars;
  return { width: S.W, height: S.H, art, monumentAt: place(monumentVB, S.mono), warn };
}
