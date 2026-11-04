import { f, rect, path, poly, circle, ring, line, cut, archShape, dome, spire, row, mirror } from './draw.mjs';
const V = (x, y, w, h) => [x, y, w, h];

// Snow cap: a zigzag hole cut across a peak near its top. y is the snow line.
const snow = (cx, y, w) => `<path d="M${f(cx - w)},${y} l${f(w * 0.3)},${f(-4)} l${f(w * 0.25)},${f(7)} l${f(w * 0.3)},${f(-8)} l${f(w * 0.3)},${f(8)} l${f(w * 0.25)},${f(-7)} l${f(w * 0.3)},${f(4)} V${f(y - 60)} H${f(cx - w)} Z"/>`;

export const peak = (kind = 'matterhorn') => {
  if (kind === 'matterhorn') {
    const ink = poly([[-100, 88], [-52, 22], [-34, 30], [-4, -76], [2, -80], [10, -60], [30, -14], [44, 4], [58, 36], [100, 88]]);
    const holes = poly([[-12, -40], [-4, -76], [2, -80], [10, -60], [4, -46], [-1, -52], [-6, -38]]) + cut('M-10,-30 L-30,20 M8,-20 L24,16 M-4,-10 L2,50', 1.6) + cut('M-4,-76 L8,-30 L0,10', 1.3);
    return { vb: V(-106, -90, 212, 185), ink, holes, extra: '' };
  }
  if (kind === 'table') { // flat-topped mountain with a cloud-line notch
    const ink = poly([[-110, 88], [-96, 40], [-84, 14], [-60, 6], [-52, -34], [48, -36], [60, -30], [70, 4], [96, 30], [110, 88]]);
    const holes = row(7, -40, 38, (x, i) => rect(x - 2, -26, 3, 28 + (i % 3) * 10)) + cut('M-90,36 L-30,48 L20,40 L80,54', 1.6);
    return { vb: V(-116, -46, 232, 140), ink, holes, extra: '' };
  }
  if (kind === 'kili') { // broad flat-topped volcano with a snowy cap
    const ink = path('M-108,88 Q-60,50 -42,-6 L-30,-26 L34,-26 L46,-6 Q64,50 108,88 Z');
    const holes = path('M-28,-14 L-18,-4 L-8,-16 L2,-2 L12,-16 L22,-4 L32,-14 L30,-24 L-26,-24 Z') + cut('M-40,10 L-30,60 M0,4 L2,70 M38,10 L28,64', 1.4);
    return { vb: V(-114, -36, 228, 130), ink, holes, extra: '' };
  }
  if (kind === 'twin') { // Mount Kenya style: two sharp summits
    const ink = poly([[-108, 88], [-60, 30], [-34, -30], [-26, -48], [-18, -34], [-8, -6], [6, -22], [14, -64], [22, -26], [36, 8], [66, 38], [108, 88]]);
    const holes = poly([[-32, -22], [-26, -48], [-20, -32], [-14, -16], [-22, -20]]) + poly([[8, -40], [14, -64], [20, -42], [18, -30], [10, -34]]) + cut('M-30,-8 L-44,36 M14,-20 L22,40', 1.5);
    return { vb: V(-114, -72, 228, 165), ink, holes, extra: '' };
  }
  if (kind === 'range') { // a jagged range
    const ink = poly([[-110, 88], [-80, 34], [-56, 52], [-24, -14], [-4, 14], [26, -38], [46, -2], [66, 10], [84, 40], [110, 88]]);
    const holes = poly([[-30, -4], [-24, -14], [-18, -2], [-24, 4]]) + poly([[20, -22], [26, -38], [32, -22], [26, -14]]) + cut('M-24,-4 L-34,40 M26,-14 L32,50', 1.4);
    return { vb: V(-116, -46, 232, 140), ink, holes, extra: '' };
  }
  if (kind === 'ararat') { // a big peak and a lesser one side by side, with a small monastery
    const ink = poly([[-110, 88], [-62, 20], [-32, -34], [-16, -34], [14, 22], [32, 4], [50, -24], [58, -24], [76, 6], [110, 88]]) + rect(-96, 66, 22, 20) + spire(-85, 66, 24, 14);
    const holes = poly([[-34, -22], [-32, -34], [-16, -34], [-14, -22], [-22, -26], [-26, -18]]) + poly([[48, -12], [50, -24], [58, -24], [62, -12], [56, -16]]);
    return { vb: V(-116, -44, 232, 138), ink, holes, extra: '' };
  }
  throw new Error('unknown peak ' + kind);
};

export const volcano = (kind = 'cone') => {
  if (kind === 'cone') { // a near-perfect cone with a plume
    const ink = path('M-104,88 Q-44,60 -22,-26 L-14,-34 L14,-34 L22,-26 Q44,60 104,88 Z');
    const holes = cut('M-20,-16 L-30,30 M0,-18 L0,52 M20,-16 L30,30', 1.5) + rect(-10, -26, 20, 4);
    const smoke = `<path d="M-6,-40 C-24,-52 -14,-66 -2,-62 C0,-80 24,-78 20,-64 C34,-62 28,-48 12,-42 Z"/>`;
    return { vb: V(-110, -84, 220, 178), ink, holes, extra: smoke };
  }
  if (kind === 'twin') { // two cones side by side
    const ink = path('M-108,88 Q-70,60 -52,0 L-44,-14 L-22,-14 L-14,0 Q0,50 12,44 Q26,10 36,-30 L44,-40 L62,-40 L70,-30 Q84,60 108,88 Z');
    const holes = cut('M-36,-4 L-42,40 M50,-30 L44,40 M64,-28 L72,50', 1.5);
    return { vb: V(-114, -50, 228, 144), ink, holes, extra: '' };
  }
  if (kind === 'crater') { // wide shield volcano with a glowing crater and plume
    const ink = path('M-112,88 Q-60,70 -36,22 L-28,10 L-10,2 L10,2 L28,10 L36,22 Q60,70 112,88 Z');
    const holes = path('M-14,2 L-8,-8 L-2,0 L4,-10 L10,0 L14,2 Z') + cut('M-26,24 L-30,56 M0,20 L2,60 M26,24 L32,58', 1.4);
    const plume = `<path d="M-4,-4 C-24,-16 -12,-32 -2,-26 C0,-48 24,-44 18,-28 C34,-24 26,-8 10,-4 Z"/>`;
    return { vb: V(-118, -54, 236, 148), ink, holes, extra: plume };
  }
  throw new Error('unknown volcano ' + kind);
};

export const falls = (kind = 'plunge') => {
  // Rock walls in ink, water as the gap between them, with flow lines, spray and ripples.
  const spray = (x, y) => circle(x, y, 5) + circle(x + 9, y + 3, 3.5) + circle(x - 9, y + 2, 3);
  const flow = (xs, y0, y1) => xs.map((x, i) => line(`M${x},${y0 + (i % 2) * 6} V${y1 - (i % 3) * 8}`, 2.6)).join('');
  if (kind === 'plunge') {
    const ink = poly([[-112, -56], [-12, -56], [-10, 70], [-112, 70]]) + poly([[12, -56], [112, -56], [112, 70], [10, 70]]) + rect(-114, 70, 228, 20);
    return { vb: V(-118, -64, 236, 164), ink, holes: cut('M-110,78 q10,-7 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0', 1.6) + cut('M-100,-30 L-60,-20 M30,0 L100,-10 M-96,20 L-50,30', 1.4), extra: flow([-3, 0, 3], -56, 64) + spray(0, 66) };
  }
  if (kind === 'wide') {
    const ink = rect(-114, -58, 228, 14) + poly([[-114, -44], [-84, -44], [-92, 70], [-114, 70]]) + poly([[114, -44], [84, -44], [92, 70], [114, 70]]) + rect(-116, 70, 232, 20);
    const xs = [-66, -50, -34, -18, -2, 14, 30, 46, 62];
    return { vb: V(-120, -66, 240, 164), ink, holes: cut('M-110,78 q10,-7 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0', 1.6), extra: flow(xs, -44, 66) + spray(-40, 66) + spray(30, 68) };
  }
  if (kind === 'twin') {
    const ink = poly([[-112, -54], [-52, -54], [-50, 70], [-112, 70]]) + poly([[-18, -54], [18, -54], [20, 70], [-20, 70]]) + poly([[52, -54], [112, -54], [112, 70], [50, 70]]) + rect(-114, 70, 228, 20);
    return { vb: V(-118, -62, 236, 160), ink, holes: cut('M-110,78 q10,-7 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0', 1.6), extra: flow([-40, -34, -28], -54, 64) + flow([28, 34, 40], -54, 64) + spray(-34, 66) + spray(34, 66) };
  }
  if (kind === 'cascade') {
    const ink = path('M-112,92 L-100,-46 Q-40,-62 30,-50 Q90,-40 112,40 L112,92 Z');
    const holes = path('M-52,-52 q22,4 30,18 q10,22 -10,30 q-24,10 -8,28 q16,16 0,34 q-8,12 -4,26 h16 q-2,-16 10,-26 q16,-18 -2,-38 q-12,-20 14,-30 q22,-12 8,-38 q-8,-16 -28,-20 Z');
    return { vb: V(-118, -66, 236, 164), ink, holes: holes + cut('M-90,20 L-70,30 M50,10 L80,24 M60,50 L90,60', 1.4), extra: spray(-8, 86) };
  }
  if (kind === 'victoria') { // the curtain, the gorge and the railway bridge across it
    const ink = rect(-114, -58, 228, 14) + poly([[-114, -44], [-86, -44], [-90, 90], [-114, 90]]) + poly([[114, -44], [88, -44], [92, 90], [114, 90]]);
    const xs = [-66, -50, -34, -18, -2, 14, 30, 46, 62];
    const br = line('M-86,52 Q0,10 88,52', 5) + [-60, -44, -28, -12, 4, 20, 36, 52, 68].map((x) => line(`M${x},${52 - 34 * (1 - (x / 88) ** 2) + 0} V54`, 1.4)).join('') + rect(-92, 52, 184, 4);
    return { vb: V(-120, -66, 240, 164), ink, holes: '', extra: flow(xs, -44, 40) + br + spray(-30, 88) + spray(34, 88) };
  }
  throw new Error('unknown falls ' + kind);
};

export const rock = (kind = 'arch') => {
  if (kind === 'arch') { // natural stone arch
    const ink = path('M-100,88 L-100,10 Q-92,-40 -50,-48 Q0,-62 50,-48 Q92,-40 100,10 L100,88 Z');
    const holes = path('M-58,88 L-58,36 Q-52,-6 0,-12 Q52,-6 58,36 L58,88 Z');
    return { vb: V(-106, -66, 212, 160), ink, holes, extra: '' };
  }
  if (kind === 'monolith') { // single steep inselberg
    const ink = path('M-96,88 Q-70,70 -52,30 L-38,-28 Q-24,-64 0,-66 Q24,-60 34,-24 L48,28 Q70,70 98,88 Z');
    return { vb: V(-102, -74, 204, 170), ink, holes: cut('M-30,-20 L-40,40 M6,-34 L4,60 M26,-10 L40,50', 1.5), extra: '' };
  }
  if (kind === 'needle') { // Pico Cao Grande
    const ink = path('M-90,88 Q-50,70 -26,30 L-16,-60 L-8,-104 L4,-106 L12,-60 L22,30 Q50,70 92,88 Z');
    return { vb: V(-96, -112, 192, 205), ink, holes: cut('M-6,-80 L-10,20 M6,-70 L10,10', 1.4), extra: '' };
  }
  if (kind === 'dome') { // granite dome
    const ink = path('M-104,88 Q-90,20 -40,-14 Q0,-44 44,-14 Q90,20 104,88 Z');
    return { vb: V(-110, -50, 220, 142), ink, holes: cut('M-60,40 Q-40,10 -30,50 M10,-20 Q20,20 14,60 M50,0 Q60,30 56,70', 1.5), extra: '' };
  }
  if (kind === 'chimneys') { // clustered limestone chimneys with steam
    let ink = rect(-108, 82, 216, 6), holes = '';
    [[-74, 54, 18], [-46, 78, 20], [-14, 100, 22], [20, 70, 20], [50, 92, 20], [80, 56, 18]].forEach(([x, h, w]) => { ink += path(`M${x - w / 2},82 L${x - w / 3},${82 - h} Q${x},${82 - h - 8} ${x + w / 3},${82 - h} L${x + w / 2},82 Z`); holes += cut(`M${x - 2},${82 - h + 10} v${h - 24}`, 1.2); });
    return { vb: V(-114, -30, 228, 124), ink, holes, extra: '' };
  }
  if (kind === 'leMorne') { // a flat-topped basalt monolith dropping into the sea
    const ink = path('M-108,88 L-76,60 L-58,-22 L-40,-46 L40,-48 L56,-30 L62,10 L90,60 L108,88 Z');
    return { vb: V(-114, -56, 228, 150), ink, holes: row(7, -44, 44, (x, i) => cut(`M${x},${-40 + (i % 2) * 6} v${40 + (i % 3) * 10}`, 1.8)) + cut('M-100,80 Q-60,74 -20,80 Q20,86 60,78 Q86,74 104,80', 2), extra: '' };
  }
  if (kind === 'mesa') { // Masada: flat plateau crowned with a fortress
    const ink = path('M-110,88 L-96,34 L-84,-14 L84,-14 L96,34 L110,88 Z') + rect(-50, -30, 100, 16) + crenel(-50, 50, -30) + rect(-14, -44, 28, 16);
    return { vb: V(-116, -54, 232, 148), ink, holes: row(5, -30, 30, (x) => rect(x - 3, -26, 6, 8)) + cut('M-84,18 L-60,26 L-30,14 M20,20 L50,28 L80,18', 1.6), extra: '' };
  }
  if (kind === 'seastack') { // Petra tou Romiou: stack and arch in the sea
    const ink = path('M-100,88 L-100,60 Q-70,48 -52,6 L-44,-44 Q-30,-70 -14,-50 L-6,-6 Q4,40 30,58 Q60,52 100,66 L100,88 Z') + path('M30,58 Q36,10 54,4 Q70,10 72,56 Z');
    return { vb: V(-106, -70, 212, 162), ink, holes: cut('M-100,76 q10,-8 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0', 1.6) + cut('M-40,-20 L-30,30', 1.4), extra: '' };
  }
  if (kind === 'pinnacles') { // Nauru-style coral-limestone pinnacles
    let ink = rect(-108, 80, 216, 8);
    [-86, -64, -40, -14, 10, 34, 58, 82].forEach((x, i) => { const h = 40 + ((i * 37) % 50); ink += path(`M${x - 9},82 L${x - 4},${82 - h} L${x},${82 - h - 8} L${x + 5},${82 - h + 2} L${x + 9},82 Z`); });
    return { vb: V(-114, -26, 228, 120), ink, holes: '', extra: '' };
  }
  if (kind === 'mushroom') { // Rock Islands: undercut mushroom islets
    let ink = '', holes = '';
    [[-60, 50, 1], [10, 62, 1.25], [66, 40, 0.8]].forEach(([x, y, s]) => { ink += path(`M${x - 36 * s},${y} Q${x - 40 * s},${y - 24 * s} ${x - 14 * s},${y - 28 * s} Q${x},${y - 40 * s} ${x + 14 * s},${y - 28 * s} Q${x + 40 * s},${y - 24 * s} ${x + 36 * s},${y} Q${x + 14 * s},${y + 8 * s} ${x + 10 * s},${y + 22 * s} L${x - 10 * s},${y + 22 * s} Q${x - 14 * s},${y + 8 * s} ${x - 36 * s},${y} Z`); });
    ink += `<path d="M-110,82 H110 V90 H-110 Z"/>`;
    return { vb: V(-116, -30, 232, 124), ink, holes: cut('M-100,76 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0', 1.4), extra: '' };
  }
  if (kind === 'karst') { // Ha Long Bay: tall sea stacks
    let ink = rect(-110, 82, 220, 8);
    [[-82, 70, 26], [-44, 98, 30], [0, 62, 28], [38, 104, 32], [80, 76, 26]].forEach(([x, h, w]) => { ink += path(`M${x - w / 2},84 L${x - w / 2 + 2},${84 - h * 0.7} Q${x - 2},${84 - h - 6} ${x + 4},${84 - h} Q${x + w / 2 - 2},${84 - h * 0.8} ${x + w / 2},84 Z`); });
    return { vb: V(-116, -34, 232, 128), ink, holes: cut('M-100,88 q10,-5 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0', 1.2), extra: '' };
  }
  if (kind === 'pitons') { // Gros Piton and Petit Piton
    const ink = path('M-108,88 L-80,50 L-56,-20 Q-44,-62 -28,-60 Q-8,-52 0,0 L14,36 L30,6 Q42,-30 52,-32 Q62,-28 70,10 L92,52 L108,88 Z');
    return { vb: V(-114, -70, 228, 165), ink, holes: cut('M-40,-30 L-50,30 M-22,-20 L-18,40 M50,-10 L46,40', 1.5), extra: '' };
  }
  if (kind === 'boulders') { // Anse Source d'Argent granite boulders and a palm
    let ink = rect(-110, 78, 220, 10) + path('M-86,80 Q-90,40 -52,32 Q-24,28 -16,60 Q-12,80 -16,80 Z') + path('M-30,80 Q-34,4 14,-4 Q56,-6 62,50 Q66,76 60,80 Z') + path('M50,80 Q54,40 84,40 Q104,44 100,80 Z');
    ink += line('M-62,36 Q-60,-20 -70,-44', 3.4) + [[-70, -44, -100, -34], [-70, -44, -92, -62], [-70, -44, -62, -66], [-70, -44, -40, -52], [-70, -44, -48, -34]].map(([x, y, a, b]) => line(`M${x},${y} Q${(x + a) / 2},${y - 14} ${a},${b}`, 2.6)).join('');
    return { vb: V(-114, -72, 228, 164), ink, holes: cut('M-54,40 L-46,70 M20,10 L24,70', 1.3), extra: '' };
  }
  if (kind === 'sigiriya') { // Lion Rock with a ruin on top and a stair
    const ink = path('M-98,88 Q-84,40 -66,8 L-52,-36 L48,-40 L62,-6 Q80,40 98,88 Z') + rect(-42, -52, 84, 14) + rect(-24, -64, 48, 12) + rect(-8, -72, 16, 8);
    return { vb: V(-104, -80, 208, 175), ink, holes: row(6, -26, 26, (x) => rect(x - 3, -50, 6, 6)) + cut('M-6,-30 L8,-10 L-4,10 L10,30 L0,52 L12,72', 2.6), extra: '' };
  }
  if (kind === 'tepui') { // Angel Falls: a sheer table mountain with the fall dropping from its lip
    const ink = path('M-92,92 L-84,-6 L-72,-48 L-44,-62 L-12,-54 L22,-64 L58,-54 L78,-22 L88,92 Z') + path('M-112,92 L-96,52 L-80,60 L-84,92 Z') + path('M112,92 L98,56 L84,62 L88,92 Z');
    const holes = path('M30,-60 h6 V84 h-6 Z') + cut('M-50,-30 L-56,20 M-20,-40 L-22,40 M52,-30 L58,30', 1.6);
    const spray = circle(33, 88, 6) + circle(43, 90, 4) + circle(24, 90, 4);
    return { vb: V(-118, -70, 236, 172), ink, holes, extra: spray + line('M33,-56 V80', 2.2) };
  }
  if (kind === 'dune') { // Sossusvlei: curved dune ridge and a dead tree
    const ink = path('M-110,88 Q-70,60 -30,10 Q0,-28 40,-44 Q60,-24 80,40 L110,88 Z');
    const holes = path('M40,-44 Q20,10 -10,50 Q-40,76 -60,88 L-30,88 Q-10,70 12,40 Q36,0 40,-44 Z') + cut('M-80,70 Q-40,64 -10,70', 1.2);
    const tree = line('M-70,84 V50 M-70,66 L-84,52 M-70,58 L-58,44 M-70,72 L-60,64 M-70,50 L-76,38', 2.4);
    return { vb: V(-116, -54, 232, 150), ink, holes, extra: tree };
  }
  throw new Error('unknown rock ' + kind);
};
const crenel = (x0, x1, y) => Array.from({ length: 6 }, (_, i) => rect(x0 + i * ((x1 - x0) / 5.6), y - 5, (x1 - x0) / 11.2, 5)).join('');

export const tree = (kind = 'baobab') => {
  const baobab = (x, s, top = 0) => {
    const w0 = 14 * s, w1 = 10 * s, h = 70 * s;
    const trunk = path(`M${f(x - w0)},84 Q${f(x - w1 - 2)},${f(84 - h * 0.5)} ${f(x - w1)},${f(84 - h)} L${f(x + w1)},${f(84 - h)} Q${f(x + w1 + 2)},${f(84 - h * 0.5)} ${f(x + w0)},84 Z`);
    const tuft = [[-22, -12], [-9, -24], [8, -26], [22, -14]].map(([dx, dy]) => line(`M${f(x + dx * 0.2 * s)},${f(84 - h)} L${f(x + dx * s)},${f(84 - h + dy * s)}`, 2.2 * s) + circle(x + dx * s, 84 - h + dy * s, 5.5 * s)).join('');
    return trunk + tuft;
  };
  if (kind === 'baobab') return { vb: V(-80, -60, 160, 160), ink: baobab(0, 1.9) + rect(-70, 84, 140, 4), holes: cut('M-8,50 Q-4,20 -6,-20 M8,50 Q10,20 7,-20', 1.4), extra: '' };
  if (kind === 'avenue') return { vb: V(-110, -50, 220, 140), ink: baobab(-74, 0.8) + baobab(-30, 1.05) + baobab(26, 1.3) + baobab(86, 0.95) + rect(-110, 84, 220, 5), holes: '', extra: '' };
  if (kind === 'cotton') { // a huge spreading tree: forked trunk, separate leafy clusters, buttress roots
    const branches = [[-70, -8], [-42, -40], [-10, -56], [26, -50], [58, -30], [82, 2], [-18, -18], [30, -14]];
    const limbs = branches.map(([x, y]) => line(`M${x > 0 ? 6 : -6},20 Q${x * 0.4},${(20 + y) / 2 - 10} ${x},${y}`, x === -18 || x === 30 ? 5 : 7)).join('');
    const clusters = branches.map(([x, y], i) => circle(x, y - 8, i < 6 ? 17 : 13)).join('');
    const ink = clusters + limbs + path('M-62,90 Q-30,82 -18,56 L-12,18 L12,18 L18,56 Q30,82 62,90 Z');
    return { vb: V(-110, -84, 220, 180), ink, holes: cut('M-4,30 L-6,80 M6,32 L8,82', 1.4), extra: '' };
  }
  throw new Error('unknown tree ' + kind);
};

export const island = (kind = 'palms') => { // a low coral island with palms
  const palm = (x, h, lean) => line(`M${x},84 Q${x + lean / 2},${84 - h / 2} ${x + lean},${84 - h}`, 3.4) + [[-30, -8], [-22, -22], [-4, -30], [18, -24], [30, -8]].map(([dx, dy]) => line(`M${x + lean},${84 - h} q${dx / 2},${dy - 10} ${dx},${dy}`, 3)).join('');
  const ink = path('M-104,86 Q-70,72 0,72 Q70,72 104,86 Q60,92 0,92 Q-60,92 -104,86 Z') + rect(-110, 90, 220, 3);
  return { vb: V(-110, -62, 220, 162), ink, holes: '', extra: palm(-40, 84, -10) + palm(6, 108, 8) + palm(48, 74, 14) };
};

export const cliff = (kind = 'moher') => {
  if (kind === 'moher') { // sea cliffs with a round lookout tower
    const ink = path('M-112,88 L-112,-14 L-80,-20 L-40,-34 L12,-30 L40,-42 L110,-38 L110,88 Z') + rect(-14, -64, 20, 30) + path('M-18,-64 L-4,-82 L10,-64 Z');
    const holes = cut('M-80,-6 L-70,70 M-40,-18 L-34,76 M0,-14 L6,72 M40,-26 L48,76 M80,-24 L90,70', 1.6) + rect(-8, -56, 4, 8);
    return { vb: V(-118, -90, 228, 186), ink, holes, extra: '' };
  }
  if (kind === 'monastery') { // white buildings clinging to a sheer cliff face (cut out of the dark rock)
    const bld = (x, y, w, h) => rect(x, y, w, h) + poly([[x - 7, y], [x - 2, y - 8], [x + w + 2, y - 8], [x + w + 7, y]]);
    const house = bld(-26, 6, 34, 24) + bld(-6, 44, 30, 20) + bld(14, -26, 18, 34) + bld(-42, 66, 26, 16);
    const ink = path('M-74,92 L-60,-24 L-36,-66 L10,-84 L54,-70 L66,-10 L76,92 Z');
    return { vb: V(-82, -94, 164, 192), ink, holes: house + cut('M-62,88 L-48,76 L-30,70 M-6,70 L12,80 L24,92', 2.2), extra: '' };
  }
  throw new Error('unknown cliff ' + kind);
};
