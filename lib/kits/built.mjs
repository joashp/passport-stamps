import { f, rect, path, poly, circle, ring, line, cut, archShape, dome, onion, spire, cross, row, mirror } from './draw.mjs';
const V = (x, y, w, h) => [x, y, w, h];

// ---- Pyramids and ancient ruins ----
export const pyramid = (kind = 'giza') => {
  if (kind === 'giza') {
    const ink = poly([[-112, 82], [-30, -40], [52, 82]]) + poly([[-6, 82], [58, -22], [116, 82]]) + poly([[56, 82], [86, 30], [112, 82]]) + rect(-116, 80, 232, 6);
    const holes = cut('M-30,-40 L-6,82', 1.6) + cut('M58,-22 L90,82', 1.6);
    return { vb: V(-120, -50, 240, 140), ink, holes, extra: '' };
  }
  if (kind === 'meroe') { // narrow steep Nubian pyramids with chapels
    let ink = rect(-110, 80, 220, 6), holes = '';
    [[-74, 74, 54], [-20, 96, 68], [36, 64, 50], [84, 80, 58]].forEach(([x, h, w]) => {
      ink += poly([[x - w / 2, 80], [x - 3, 80 - h], [x + 3, 80 - h], [x + w / 2, 80]]);
      for (let y = 74; y > 80 - h + 6; y -= 7) holes += rect(x - w / 2 + (80 - y) * 0.2, y, w - (80 - y) * 0.4, 1.1);
    });
    ink += mirror([100], (x) => rect(x - 8, 56, 16, 26));
    return { vb: V(-116, -30, 232, 125), ink, holes, extra: '' };
  }
  if (kind === 'maya' || kind === 'tikal' || kind === 'copan') {
    const tikal = kind === 'tikal';
    let ink = '', holes = '';
    const tiers = tikal ? 9 : 7, bw = tikal ? 120 : 150;
    for (let i = 0; i < tiers; i++) { const w = bw - i * (tikal ? 8 : 12); ink += rect(-w / 2, 82 - 9 * (i + 1), w, 9); holes += rect(-w / 2 + 4, 82 - 9 * i - 1, w - 8, 1.2); }
    const top = 82 - 9 * tiers;
    ink += rect(-20, top - 22, 40, 22) + rect(-24, top - 27, 48, 6) + (tikal ? rect(-14, top - 62, 28, 36) + rect(-18, top - 68, 36, 7) : rect(-14, top - 34, 28, 8));
    holes += archShape(0, top, 10, 18) + row(14, -12, 12, () => '').slice(0, 0);
    for (let k = 0; k < 16; k++) holes += rect(-9, 83 - k * 4.6, 18, 1.2);
    if (kind === 'copan') ink += mirror([88], (x) => rect(x - 5, 20, 10, 62) + rect(x - 8, 16, 16, 6));
    return { vb: V(-92, -48 - (tikal ? 38 : 0), 184, 140 + (tikal ? 38 : 0)), ink: ink + rect(-84, 80, 168, 6), holes, extra: '' };
  }
  throw new Error('unknown pyramid ' + kind);
};

export const ruins = (kind = 'greek') => {
  const cols = (xs, y0, y1, w = 8) => xs.map((x) => rect(x - w / 2, y0, w, y1 - y0) + rect(x - w / 2 - 2.5, y0 - 3, w + 5, 4) + rect(x - w / 2 - 2.5, y1 - 2, w + 5, 3)).join('');
  if (kind === 'greek') { // Parthenon
    const xs = row(8, -70, 70, (x) => x + ',').split(',').filter(Boolean).map(Number);
    const ink = rect(-90, 78, 180, 5) + rect(-86, 72, 172, 6) + cols(xs, 20, 72, 9) + rect(-82, 10, 164, 10) + poly([[-84, 10], [0, -24], [84, 10]]) + rect(-88, 8, 176, 3);
    const holes = xs.map((x) => [0, 1, 2].map((k) => rect(x - 3 + k * 2.4, 24, 0.9, 44)).join('')).join('') + poly([[-62, 8], [0, -16], [62, 8]]) + row(14, -76, 76, (x) => rect(x - 1.3, 12, 2.6, 6)).replace('', '');
    return { vb: V(-96, -34, 192, 125), ink, holes, extra: poly([[-54, 6], [0, -12], [54, 6]]).replace('<path', '<path fill="INK"') };
  }
  if (kind === 'baalbek') { // six enormous surviving columns
    const xs = [-60, -36, -12, 12, 36, 60];
    const ink = rect(-84, 82, 168, 6) + rect(-78, 76, 156, 6) + xs.map((x) => rect(x - 6, -30, 12, 106) + rect(x - 9, -38, 18, 8) + rect(x - 8, 70, 16, 6)).join('') + rect(-72, -48, 144, 10) + rect(-76, -52, 152, 4);
    const holes = xs.map((x) => [-3, 0, 3].map((k) => rect(x + k - 0.4, -26, 0.8, 94)).join('')).join('') + row(11, -64, 64, (x) => rect(x - 1.2, -46, 2.4, 6));
    return { vb: V(-90, -60, 180, 155), ink, holes, extra: '' };
  }
  if (kind === 'palmyra') { // colonnade with a triple arch
    const xs = [-92, -76, -60, 60, 76, 92];
    let ink = rect(-104, 80, 208, 6) + xs.map((x) => rect(x - 4, 14, 8, 66) + rect(x - 6, 10, 12, 5) + rect(x - 6, 76, 12, 4)).join('') + rect(-100, 4, 40, 6) + rect(60, 4, 40, 6);
    ink += rect(-38, -12, 76, 94) + rect(-44, -16, 88, 6);
    const holes = archShape(0, 80, 30, 66) + mirror([48], (x) => rect(x - 2.5, -4, 5, 14));
    return { vb: V(-110, -26, 220, 118), ink, holes, extra: '' };
  }
  if (kind === 'trilithon') { // Ha'amonga: two uprights and a lintel
    const ink = rect(-84, 78, 168, 8) + poly([[-48, 80], [-44, -12], [-22, -12], [-18, 80]]) + poly([[18, 80], [22, -12], [44, -12], [48, 80]]) + rect(-56, -34, 112, 24);
    return { vb: V(-92, -44, 184, 138), ink, holes: cut('M-34,0 v60 M32,6 v54', 1.2), extra: '' };
  }
  if (kind === 'amphitheatre') { // El Jem: oval arena, three tiers of arches
    let ink = path('M-96,82 L-90,-14 Q0,-34 90,-14 L96,82 Z'), holes = '';
    [[62, 20], [34, 17], [8, 14]].forEach(([y, hh]) => { holes += row(13, -78, 78, (x) => archShape(x * (1 - (62 - y) / 700), y + 16, 8, hh)); });
    holes += rect(-90, 20, 180, 1.4) + rect(-92, 46, 184, 1.4);
    return { vb: V(-102, -40, 204, 130), ink, holes, extra: '' };
  }
  if (kind === 'facade') { // ruined mission church facade
    const ink = rect(-46, -10, 92, 92) + poly([[-46, -10], [-30, -26], [-10, -42], [10, -42], [30, -26], [46, -10]]) + rect(-52, 80, 104, 7) + mirror([62], (x) => rect(x - 8, 40, 16, 40));
    const holes = archShape(0, 80, 24, 44) + archShape(0, -2, 12, 22) + mirror([28], (x) => archShape(x, 50, 9, 24)) + `<circle cx="0" cy="-26" r="6"/>`;
    return { vb: V(-76, -50, 152, 140), ink, holes, extra: '' };
  }
  throw new Error('unknown ruins ' + kind);
};

// ---- Buddhist and Asian temples ----
export const buddhist = (kind = 'boudha') => {
  if (kind === 'boudha') {
    const ink = rect(-60, 82, 120, 6) + rect(-52, 74, 104, 8) + rect(-44, 66, 88, 8) + dome(0, 66, 40, 42) + rect(-18, 20, 36, 20) + poly([[-12, 20], [-8, -46], [8, -46], [12, 20]]) + dome(0, -46, 8, 7) + rect(-1, -66, 2, 20);
    const holes = [-10, 10].map((x) => `<ellipse cx="${x}" cy="30" rx="3.2" ry="1.8"/>`).join('') + `<path d="M-3,32 h6 l-3,8 Z"/>` + row(6, -6, 6, (_, i) => rect(-6, -40 + i * 10, 12, 1.2)).replace('', '');
    return { vb: V(-64, -75, 128, 168), ink, holes, extra: '' };
  }
  if (kind === 'thatluang') { // golden lotus-bud spire on tiered base
    let ink = rect(-70, 80, 140, 6) + rect(-60, 70, 120, 10) + rect(-50, 60, 100, 10) + mirror([46], (x) => spire(x, 60, 14, 28) + spire(x, 60, 14, 28));
    ink += path('M-22,60 C-26,30 -18,0 -8,-30 L0,-84 L8,-30 C18,0 26,30 22,60 Z') + rect(-28, 56, 56, 6) + rect(-1.2, -104, 2.4, 22);
    const holes = row(5, -12, 12, (x) => cut(`M${x},56 Q${x},10 0,-60`, 1.1)) + [30, 6, -18].map((y) => cut(`M-18,${y} h36`, 1.2)).join('');
    return { vb: V(-76, -108, 152, 198), ink, holes, extra: '' };
  }
  if (kind === 'shwe') { // Shwedagon: tall bell-shaped stupa with many small ones
    let ink = rect(-80, 82, 160, 6) + rect(-64, 70, 128, 12) + rect(-50, 60, 100, 10) + path('M-34,60 C-36,36 -22,14 -12,-14 L0,-76 L12,-14 C22,14 36,36 34,60 Z') + rect(-14, -20, 28, 4) + rect(-1.2, -104, 2.4, 30) + path('M-6,-78 L0,-92 L6,-78 Z');
    ink += mirror([40, 60], (x) => poly([[x - 8, 70], [x, 38], [x + 8, 70]]) + rect(x - 1, 28, 2, 12));
    const holes = [40, 24, 8, -8].map((y) => cut(`M-26,${y} h52`, 1.4)).join('');
    return { vb: V(-86, -108, 172, 198), ink, holes, extra: '' };
  }
  if (kind === 'borobudur') {
    let ink = '', holes = '';
    [[82, 190, 10], [70, 160, 10], [58, 130, 10], [46, 100, 10]].forEach(([y, w, h]) => { ink += rect(-w / 2, y - h, w, h); });
    [38, 26, 14].forEach((y, i) => { const w = 76 - i * 16; ink += rect(-w / 2, y - 12, w, 12); });
    [[-60, 36], [-30, 36], [30, 36], [60, 36]].forEach(([x]) => { ink += dome(x, 36, 7, 8); });
    [-24, 0, 24].forEach((x) => { ink += dome(x, 14, 7, 8); });
    ink += dome(0, 2, 18, 20) + rect(-1, -26, 2, 12);
    for (let x = -80; x <= 80; x += 14) holes += rect(x - 3, 61, 6, 5);
    for (let x = -60; x <= 60; x += 14) holes += rect(x - 3, 49, 6, 5);
    holes += rect(-5, 37, 10, 45);
    return { vb: V(-98, -38, 196, 128), ink, holes, extra: '' };
  }
  if (kind === 'prang') { // Wat Arun
    let ink = rect(-70, 82, 140, 6) + rect(-56, 68, 112, 14) + mirror([48], (x) => path(`M${x - 8},68 L${x},26 L${x + 8},68 Z`) + rect(x - 0.8, 14, 1.6, 12)) + path('M-24,68 L-18,20 Q0,-62 18,20 L24,68 Z') + rect(-1, -66, 2, 22) + rect(-8, 20, 16, 4);
    const holes = [50, 34, 18, 2, -14, -30].map((y) => cut(`M-${18 - (y < 20 ? -(20 - y) * 0.2 : 0)},${y} h${36}`, 1.3)).join('') + row(3, -8, 8, (x) => archShape(x, 66, 6, 14));
    return { vb: V(-76, -76, 152, 170), ink, holes, extra: '' };
  }
  if (kind === 'palaceGate') { // Gwanghwamun: stone base with arches and a two-tier tiled roof
    let ink = rect(-90, 40, 180, 42) + rect(-62, 12, 124, 28) + path('M-84,14 Q-62,16 -56,4 L56,4 Q62,16 84,14 L72,22 L-72,22 Z') + rect(-46, -14, 92, 26) + path('M-62,-12 Q-38,-10 -30,-24 L30,-24 Q38,-10 62,-12 L50,-4 L-50,-4 Z') + rect(-8, -40, 16, 18) + path('M-22,-38 Q-6,-36 0,-50 Q6,-36 22,-38 L14,-32 L-14,-32 Z');
    const holes = mirror([0], () => archShape(0, 82, 30, 38)) + mirror([54], (x) => archShape(x, 82, 18, 26)) + row(5, -30, 30, (x) => rect(x - 1.5, -8, 3, 16)) + row(4, -42, 42, (x) => rect(x - 1.5, 18, 3, 16));
    return { vb: V(-96, -56, 192, 145), ink, holes, extra: '' };
  }
  if (kind === 'gopuram') { // South Indian temple tower
    let ink = rect(-60, 70, 120, 14);
    for (let i = 0; i < 7; i++) { const w = 100 - i * 11; ink += rect(-w / 2, 66 - i * 17, w, 16) + rect(-w / 2 - 2, 64 - i * 17, w + 4, 3); }
    ink += path('M-22,-52 Q0,-84 22,-52 Z') + circle(0, -78, 3) + rect(-9, 66, 18, 4);
    let holes = archShape(0, 84, 16, 28);
    for (let i = 0; i < 7; i++) holes += row(Math.max(2, 7 - i), -(44 - i * 6), 44 - i * 6, (x) => archShape(x, 80 - i * 17 - 2, 4, 10));
    return { vb: V(-66, -86, 132, 175), ink, holes, extra: '' };
  }
  throw new Error('unknown buddhist ' + kind);
};

// ---- Forts and castles ----
const crenels = (x0, x1, y, h = 6, n = null) => {
  const count = n ?? Math.max(2, Math.round((x1 - x0) / 10));
  const w = (x1 - x0) / (count * 2 - 1);
  return Array.from({ length: count }, (_, i) => rect(x0 + i * 2 * w, y - h, w, h)).join('');
};
export const fort = (kind = 'castle') => {
  const tower = (x, top, w, cone = false) => rect(x - w / 2, top, w, 84 - top) + (cone ? spire(x, top, w + 6, w * 1.3) : crenels(x - w / 2 - 1, x + w / 2 + 1, top, 6, 3));
  if (kind === 'castle') {
    const ink = rect(-80, 40, 160, 42) + crenels(-80, 80, 40, 6, 9) + tower(-70, -4, 24) + tower(70, -4, 24) + tower(0, -30, 30) + rect(-90, 80, 180, 6);
    const holes = archShape(0, 82, 22, 34) + mirror([70, 0], (x) => rect(x - 2, 6, 4, 14)) + row(5, -50, 50, (x) => Math.abs(x) < 12 ? '' : rect(x - 2, 52, 4, 14));
    return { vb: V(-92, -48, 184, 140), ink, holes, extra: '' };
  }
  if (kind === 'bran') { // fairy-tale castle on a rock, conical roofs
    const ink = path('M-96,86 Q-70,56 -44,60 L40,58 Q74,52 98,86 Z') + rect(-40, 8, 80, 52) + tower(-34, -14, 22, true) + rect(8, -20, 22, 80) + spire(19, -20, 28, 40) + rect(30, 4, 26, 56) + spire(43, 4, 30, 30) + rect(-14, 20, 20, 40) + poly([[-14, 20], [-4, 4], [6, 20]]);
    const holes = [-24, 4, 32].map((y) => rect(15, y, 8, 10)).join('') + rect(-30, 14, 6, 12) + rect(-30, 34, 6, 12) + rect(36, 22, 6, 10) + archShape(-4, 60, 9, 18);
    return { vb: V(-102, -66, 204, 155), ink, holes, extra: '' };
  }
  if (kind === 'keep4') { // four corner towers and a long hall
    const ink = rect(-64, 0, 128, 82) + mirror([64], (x) => rect(x - 13, -14, 26, 96) + spire(x, -14, 34, 22)) + rect(-72, 80, 144, 6) + rect(-42, -6, 84, 8);
    const holes = row(7, -50, 50, (x) => rect(x - 2.5, 16, 5, 12)) + row(7, -50, 50, (x) => rect(x - 2.5, 40, 5, 12)) + archShape(0, 82, 14, 24) + mirror([64], (x) => rect(x - 2, 6, 4, 12));
    return { vb: V(-84, -44, 168, 135), ink, holes, extra: '' };
  }
  if (kind === 'colonial') { // whitewashed sea fort with a ramp and cannon slits
    const ink = poly([[-92, 84], [-84, 36], [84, 36], [92, 84]]) + crenels(-84, 84, 36, 7, 10) + rect(-34, 4, 68, 34) + crenels(-34, 34, 4, 6, 4) + mirror([84], (x) => rect(x - 12, 14, 24, 24) + crenels(x - 12, x + 12, 14, 6, 3));
    const holes = row(8, -66, 66, (x) => Math.abs(x) < 14 ? '' : rect(x - 3, 54, 6, 9)) + archShape(0, 84, 20, 30) + row(3, -16, 16, (x) => rect(x - 2.5, 14, 5, 10));
    return { vb: V(-100, -44, 200, 135), ink, holes, extra: '' };
  }
  if (kind === 'citadelle') { // huge hilltop fortress
    const ink = path('M-100,86 L-78,44 L-60,40 L-22,-6 L36,-14 L66,24 L84,42 L102,86 Z') + rect(-14, -40, 56, 36) + poly([[-14, -40], [-8, -52], [36, -52], [42, -40]]) + crenels(-92, -26, 44, 6, 7) + crenels(46, 100, 42, 6, 6);
    const holes = row(6, -46, 76, (x, i) => rect(x - 2.5, 56 + (i % 2) * 8, 5, 8)) + row(4, -4, 34, (x) => rect(x - 2.5, -32, 5, 10)) + archShape(14, 86, 14, 22);
    return { vb: V(-108, -58, 216, 150), ink, holes, extra: '' };
  }
  if (kind === 'bastion') { // star-fort: angled walls, a sentry box
    const ink = poly([[-98, 84], [-70, 34], [-20, 20], [30, 26], [70, 34], [98, 84]]) + crenels(-70, 70, 34, 6, 9) + rect(-30, -6, 60, 38) + crenels(-30, 30, -6, 6, 4) + rect(-8, -26, 16, 22) + spire(0, -26, 22, 16);
    const holes = row(6, -56, 56, (x) => Math.abs(x) < 10 ? '' : rect(x - 3, 50, 6, 8)) + archShape(0, 84, 18, 30) + row(3, -16, 16, (x) => rect(x - 2, 6, 4, 9));
    return { vb: V(-104, -50, 208, 140), ink, holes, extra: '' };
  }
  if (kind === 'wallTowers') { // city walls with a round tower
    const ink = rect(-100, 36, 200, 46) + crenels(-100, 100, 36, 7, 14) + path('M-30,82 V-4 H30 V82 Z') + crenels(-36, 36, -4, 8, 5) + rect(-40, 4, 80, 5);
    const holes = row(7, -84, 84, (x) => Math.abs(x) < 36 ? '' : archShape(x, 82, 8, 26)) + row(3, -14, 14, (x) => rect(x - 2.5, 16, 5, 12)) + archShape(0, 82, 18, 30);
    return { vb: V(-106, -52, 212, 140), ink, holes, extra: '' };
  }
  if (kind === 'hillCastle') { // castle on a rocky hill
    const ink = path('M-100,88 Q-70,30 -30,24 L40,22 Q80,30 100,88 Z') + rect(-26, -6, 52, 32) + crenels(-26, 26, -6, 6, 4) + rect(-8, -46, 16, 44) + crenels(-12, 12, -46, 6, 3) + rect(30, 4, 24, 22) + crenels(30, 54, 4, 5, 3);
    const holes = row(3, -16, 16, (x) => rect(x - 2, 6, 4, 10)) + rect(-2, -34, 4, 9);
    return { vb: V(-106, -56, 212, 150), ink, holes, extra: '' };
  }
  if (kind === 'islandCastle') { // red-brick castle surrounded by water
    const ink = path('M-96,86 L-96,70 Q0,58 96,70 L96,86 Z') + rect(-64, 20, 128, 50) + crenels(-64, 64, 20, 7, 9) + rect(-12, -34, 24, 56) + poly([[-18, -34], [0, -58], [18, -34]]) + mirror([60], (x) => rect(x - 13, -2, 26, 24) + spire(x, -2, 30, 24));
    const holes = row(6, -46, 46, (x) => Math.abs(x) < 8 ? '' : archShape(x, 70, 7, 22)) + row(3, -6, 6, (x) => rect(x - 1.5, -22, 3, 12)) + archShape(0, 70, 14, 24);
    return { vb: V(-102, -66, 204, 160), ink, holes, extra: '' };
  }
  if (kind === 'belem') { return { vb: V(-60, -80, 120, 175), ink: rect(-34, -20, 68, 100) + mirror([34], (x) => circle(x, -26, 11) + spire(x, -34, 18, 18)) + rect(-30, -50, 60, 32) + poly([[-30, -50], [0, -74], [30, -50]]) + rect(-48, 78, 96, 8) + rect(-40, 50, 80, 8), holes: archShape(0, 80, 16, 26) + row(3, -16, 16, (x) => archShape(x, -22, 7, 20)) + row(3, -16, 16, (x) => archShape(x, 36, 7, 18)), extra: '' }; }
  if (kind === 'threeTowers') { // San Marino on a ridge
    const ink = path('M-104,88 L-80,52 L-40,40 L0,24 L44,30 L84,44 L104,88 Z') + rect(-74, 4, 22, 44) + crenels(-78, -48, 4, 5, 3) + spire(-63, 4, 0.1, 0.1) + rect(-12, -22, 24, 50) + crenels(-16, 16, -22, 6, 3) + rect(54, -2, 22, 44) + crenels(50, 80, -2, 5, 3);
    const holes = [[-70, 16], [0, -10], [60, 10]].map(([x, y]) => rect(x - 2, y, 4, 9)).join('');
    return { vb: V(-110, -36, 220, 130), ink, holes, extra: '' };
  }
  throw new Error('unknown fort ' + kind);
};

// ---- Gates and arches ----
export const gate = (kind = 'triumph') => {
  if (kind === 'triumph') {
    const ink = rect(-70, -26, 140, 106) + rect(-76, -34, 152, 12) + rect(-72, 78, 144, 6) + rect(-60, -46, 120, 12);
    const holes = archShape(0, 78, 46, 72) + mirror([54], (x) => archShape(x, 78, 12, 40)) + row(5, -48, 48, (x) => rect(x - 3, -22, 6, 10));
    return { vb: V(-82, -54, 164, 145), ink, holes, extra: '' };
  }
  if (kind === 'gate') { // free-standing monumental gate with sculptures on top
    const ink = rect(-60, 0, 120, 82) + rect(-66, -8, 132, 10) + rect(-12, -50, 24, 44) + circle(0, -58, 8) + mirror([36], (x) => rect(x - 7, -30, 14, 22) + spire(x, -30, 16, 14)) + rect(-70, 80, 140, 6);
    const holes = archShape(0, 82, 36, 66) + mirror([48], (x) => rect(x - 2, 16, 4, 26));
    return { vb: V(-76, -72, 152, 165), ink, holes, extra: '' };
  }
  if (kind === 'sun') { // Gate of the Sun: monolith with a doorway and a carved frieze
    const ink = rect(-62, -14, 124, 96) + rect(-70, 80, 140, 6);
    const holes = rect(-17, 22, 34, 60) + row(7, -44, 44, (x) => rect(x - 3, -4, 6, 14)) + `<circle cx="0" cy="2" r="2"/>`;
    return { vb: V(-76, -24, 152, 118), ink, holes, extra: rect(-3, -8, 6, 14) };
  }
  if (kind === 'arch22') { // Arch 22 Banjul: tall arch under a three-storey tower
    const ink = rect(-56, 10, 112, 74) + rect(-34, -50, 68, 62) + rect(-40, -58, 80, 10) + poly([[-40, -58], [0, -92], [40, -58]]) + mirror([46], (x) => rect(x - 8, -30, 16, 42)) + rect(-60, 82, 120, 6);
    const holes = archShape(0, 84, 38, 72) + row(3, -18, 18, (x) => archShape(x, -22, 7, 20)) + row(3, -18, 18, (x) => archShape(x, 6, 7, 14));
    return { vb: V(-66, -98, 132, 195), ink, holes, extra: '' };
  }
  if (kind === 'horseshoe') { return gate('triumph'); }
  throw new Error('unknown gate ' + kind);
};

// ---- Bridges ----
export const bridge = (kind = 'stari') => {
  if (kind === 'stari') { // single high stone arch over a river
    const ink = path('M-98,60 L-98,40 Q0,-30 98,40 L98,60 L82,60 Q0,-12 -82,60 Z') + rect(-110, 60, 220, 22) + poly([[-98, 40], [-98, 12], [-84, 12], [-84, 36]]) + poly([[98, 40], [98, 12], [84, 12], [84, 36]]) + mirror([96], (x) => rect(x - 12, -8, 24, 30) + spire(x, -8, 28, 20));
    return { vb: V(-116, -34, 232, 120), ink, holes: row(9, -56, 56, (x) => rect(x - 1, 28 - (x * x) / 160 - 8, 2, 8)).replace('', ''), extra: '' };
  }
  if (kind === 'twoArch') { // Adolphe Bridge: a big stone arch with a lower deck
    const ink = rect(-104, 4, 208, 10) + path('M-96,14 Q0,-6 96,14 L96,84 L-96,84 Z');
    const holes = path('M-72,84 Q0,-22 72,84 Z') + row(9, -80, 80, (x) => rect(x - 3.5, 24, 7, 14)).replace('', '') + mirror([72], () => '');
    return { vb: V(-110, -10, 220, 100), ink, holes: path('M-70,84 Q0,-22 70,84 Z') + row(7, -76, 76, (x) => (Math.abs(x) < 48 ? '' : archShape(x, 84, 8, 36))), extra: '' };
  }
  if (kind === 'steelArch') { // a tall steel arch carrying the deck
    let ink = rect(-110, 26, 220, 8) + rect(-110, 80, 220, 4) + line('M-86,80 Q0,-84 86,80', 7), extra = '', holes = '';
    for (let x = -72; x <= 72; x += 12) { const t = x / 86, top = 80 - 164 * (1 - t * t) * 0.5 - 0; extra += line(`M${x},34 V${Math.min(26 + (1 - t * t) * 40, 70)}`, 1.4); }
    return { vb: V(-116, -28, 232, 120), ink, holes, extra };
  }
  if (kind === 'suspension') {
    let ink = rect(-110, 40, 220, 7) + mirror([62], (x) => rect(x - 6, -42, 12, 90) + rect(x - 9, -48, 18, 8)), extra = '';
    extra += line('M-110,12 Q-62,-36 -62,-44 Q0,20 62,-44 Q62,-36 110,12', 2.2);
    for (let x = -100; x <= 100; x += 10) if (Math.abs(Math.abs(x) - 62) > 4) extra += line(`M${x},${f(40)} V${f(Math.abs(x) < 62 ? 40 - (-44 + ((x / 62) ** 2) * 64) * -1 * 0.0 - (4 + ((x / 62) ** 2) * 52) : 22 - (Math.abs(x) - 62) * 0.3)}`, 1);
    return { vb: V(-116, -54, 232, 112), ink, holes: '', extra };
  }
  throw new Error('unknown bridge ' + kind);
};
