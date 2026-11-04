import { f, rect, path, poly, circle, ring, line, cut, archShape, dome, onion, spire, cross, crescent, minaret, row, mirror } from './draw.mjs';

const V = (x, y, w, h) => [x, y, w, h];

// ---- Mosques and minarets ----
export const mosque = (kind = 'grand', p = {}) => {
  if (kind === 'grand') {
    const { minarets = 2, domes = 1 } = p;
    let ink = rect(-72, 40, 144, 40) + dome(0, 40, 36) + rect(-16, 38, 32, 4) + path('M-4,4 h8 v-8 h-8 Z');
    let holes = row(7, -58, 58, (x) => (Math.abs(x) < 5 ? '' : archShape(x, 78, 9, 24))) + archShape(0, 80, 16, 30);
    if (domes >= 3) ink += mirror([46], (x) => dome(x, 40, 22));
    if (domes >= 5) ink += mirror([68], (x) => dome(x, 40, 12));
    const xs = minarets === 2 ? [98] : minarets === 4 ? [98, 80] : minarets === 1 ? [] : [98, 82, 66];
    ink += mirror(xs, (x) => minaret(x, -8 - (98 - Math.abs(x)) * 0.4, 80, 8));
    if (minarets === 1) ink += minaret(90, -20, 80, 9);
    return { vb: V(-115, -50, 230, 140), ink, holes, extra: crescent(0, 4 - 2, 3) };
  }
  if (kind === 'octagon') { // Dome of the Rock
    const ink = poly([[-58, 80], [-52, 34], [52, 34], [58, 80]]) + rect(-30, 22, 60, 14) + dome(0, 22, 32, 36) + rect(-62, 78, 124, 6);
    const holes = row(7, -42, 42, (x) => archShape(x, 76, 7, 30)) + archShape(0, 80, 12, 26);
    return { vb: V(-70, -30, 140, 120), ink, holes, extra: crescent(0, -14, 3) };
  }
  if (kind === 'squareMinaret') { // Hassan II style
    const ink = rect(-16, -78, 32, 160) + rect(-20, -84, 40, 7) + rect(-12, -100, 24, 18) + spire(0, -100, 14, 16) + rect(-72, 52, 144, 30) + rect(-76, 48, 152, 5);
    const holes = [-62, -34, -6, 22, 50].map((y) => archShape(0, y + 20, 14, 22)).join('') + row(6, -60, 60, (x) => archShape(x, 78, 10, 18));
    return { vb: V(-85, -115, 170, 205), ink, holes, extra: '' };
  }
  if (kind === 'jam') { // Minaret of Jam, tapering with three bands
    let ink = poly([[-30, 90], [-24, 70], [24, 70], [30, 90]]);
    const tiers = [[70, 24, 15, 58], [12, 15, 10, 44], [-32, 10, 6.5, 32]];
    tiers.forEach(([y, w0, w1, h]) => { ink += poly([[-w0, y], [-w1, y - h], [w1, y - h], [w0, y]]) + rect(-w1 - 4, y - h - 3, w1 * 2 + 8, 4); });
    ink += rect(-5, -76, 10, 16) + dome(0, -76, 7);
    let holes = '';
    for (let y = 60; y > -50; y -= 9) holes += row(5, -14, 14, (x) => `<path d="M${f(x)},${y} l2.5,3 l-2.5,3 l-2.5,-3 Z"/>`);
    return { vb: V(-40, -90, 80, 190), ink, holes: '', extra: '' };
  }
  if (kind === 'samarra') { // Malwiya spiral minaret
    let ink = rect(-60, 78, 120, 8) + rect(-44, 66, 88, 12);
    [[66, 36], [48, 30], [32, 24], [18, 18], [6, 13]].forEach(([y, hw]) => { ink += poly([[-hw - 2, y], [-hw + 4, y - 17], [hw - 4, y - 17], [hw + 2, y]]); });
    ink += rect(-7, -18, 14, 14) + dome(0, -18, 8);
    const holes = cut('M-38,66 L36,54 M34,48 L-30,38 M-28,32 L26,22 M24,16 L-20,8', 2.2);
    return { vb: V(-70, -34, 140, 125), ink, holes, extra: '' };
  }
  if (kind === 'burana') { // short, thick tapering tower on a block
    const ink = rect(-30, 56, 60, 26) + poly([[-24, 58], [-16, -40], [16, -40], [24, 58]]) + rect(-19, -44, 38, 5) + rect(-13, -52, 26, 8);
    const holes = archShape(0, 80, 12, 20) + [30, 4, -22].map((y) => cut(`M-14,${y} h28`, 1.8)).join('') + archShape(0, -42, 7, 10);
    return { vb: V(-40, -60, 80, 150), ink, holes, extra: '' };
  }
  if (kind === 'registan') {
    let ink = rect(-100, 30, 200, 52) + rect(-32, -30, 64, 112);
    ink += mirror([66], (x) => dome(x, 22, 16, 18) + rect(x - 18, 22, 36, 12));
    ink += mirror([100], (x) => minaret(x, -5, 82, 9));
    const holes = archShape(0, 82, 40, 78) + mirror([66], (x) => archShape(x, 80, 24, 44)) + row(4, -20, 20, (x) => archShape(x, 12, 6, 14)) + row(3, -26, 26, (x) => archShape(x, 66, 8, 16));
    return { vb: V(-115, -40, 230, 130), ink, holes, extra: '' };
  }
  throw new Error('unknown mosque ' + kind);
};

// ---- Mud-brick mosques and earthen towers ----
export const mud = (kind = 'djenne') => {
  const spikes = (pts, len = 7) => pts.map(([x, y]) => line(`M${x - len},${y} h${len * 2}`, 1.6)).join('');
  if (kind === 'djenne' || kind === 'chinguetti') {
    const xs = kind === 'djenne' ? [-52, 0, 52] : [-40, 40];
    let ink = rect(-84, 30, 168, 52), extra = '', holes = '';
    xs.forEach((x) => { ink += poly([[x - 16, 30], [x - 11, -44], [x + 11, -44], [x + 16, 30]]) + circle(x, -50, 5); extra += spikes([[x - 13, -14], [x + 13, -14], [x - 14, 8], [x + 14, 8]].map(([a, b]) => [a, b]), 6); holes += archShape(x, 30, 10, 22); });
    holes += row(6, -70, 70, (x) => archShape(x, 80, 8, 18));
    return { vb: V(-95, -62, 190, 150), ink, holes, extra };
  }
  if (kind === 'agadez') {
    const ink = poly([[-30, 82], [-18, 30], [-12, -40], [12, -40], [18, 30], [30, 82]]) + rect(-14, -46, 28, 6);
    const holes = archShape(0, 82, 12, 20);
    const sticks = [-30, -12, 8, 26, 46].map((y) => line(`M-24,${y} h-9 M24,${y} h9`, 1.8)).join('');
    return { vb: V(-45, -56, 90, 150), ink, holes, extra: sticks + line('M0,-46 v-10', 1.6) };
  }
  if (kind === 'shibam') {
    let ink = rect(-100, 78, 200, 6), holes = '';
    [[-84, 40, 18], [-62, 60, 16], [-40, 36, 20], [-16, 70, 18], [8, 46, 16], [30, 76, 20], [56, 54, 18], [78, 38, 16]].forEach(([x, h, w]) => {
      ink += rect(x - w / 2, 78 - h * 1.6, w, h * 1.6) + rect(x - w / 2 - 1, 78 - h * 1.6 - 3, w + 2, 3);
      for (let y = 78 - h * 1.6 + 8; y < 70; y += 11) holes += rect(x - 2.5, y, 5, 6);
    });
    return { vb: V(-105, -50, 210, 140), ink, holes, extra: '' };
  }
  if (kind === 'takienta') { // Koutammakou tower houses
    let ink = '', holes = '';
    [[-50, 1], [0, 1.25], [50, 1]].forEach(([x, s]) => {
      ink += rect(x - 22 * s, 38, 44 * s, 42) + path(`M${f(x - 28 * s)},38 Q${x},${f(-10 * s + 8)} ${f(x + 28 * s)},38 Z`) + circle(x - 14 * s, 30, 14 * s) + circle(x + 14 * s, 30, 14 * s) + rect(x - 14 * s, 38, 28 * s, 6);
      holes += archShape(x, 80, 9 * s, 16 * s);
    });
    return { vb: V(-85, -30, 170, 120), ink, holes, extra: '' };
  }
  throw new Error('unknown mud ' + kind);
};

// ---- Churches and cathedrals ----
const nave = (hw, y0, y1) => rect(-hw, y0, hw * 2, y1 - y0);
export const church = (kind = 'gothicTwin', p = {}) => {
  if (kind === 'gothicTwin') {
    const { slats = false } = p;
    let ink = nave(48, 20, 86) + mirror([30], (x) => rect(x - 13, -34, 26, 56) + spire(x, -34, 26, 56) + spire(x - 13, -34, 8, 16) + spire(x + 13, -34, 8, 16)) + spire(0, 20, 38, 18) + rect(-54, 83, 108, 5);
    let holes = archShape(0, 86, 18, 36) + mirror([30], (x) => archShape(x, 6, 8, 26)) + mirror([30], (x) => archShape(x, 50, 8, 20)) + `<circle cx="0" cy="40" r="9"/>`;
    if (slats) for (let y = -26; y < 10; y += 6) holes += mirror([30], (x) => rect(x - 9, y, 18, 1.6));
    return { vb: V(-62, -100, 124, 195), ink, holes, extra: cross(30, -90, 5, 1.4) + cross(-30, -90, 5, 1.4) };
  }
  if (kind === 'gothicSpire') {
    const ink = nave(34, 10, 86) + rect(-20, -20, 40, 32) + poly([[-20, -20], [0, -108], [20, -20]]) + mirror([26], (x) => spire(x, -4, 10, 26)) + rect(-50, 50, 100, 36);
    const holes = archShape(0, 86, 16, 34) + archShape(0, -2, 9, 22) + `<circle cx="0" cy="30" r="8"/>` + mirror([36], (x) => archShape(x, 84, 8, 20)) + [-40, -62, -84].map((y) => cut(`M-9,${y} h18`, 1.5)).join('');
    return { vb: V(-58, -125, 116, 220), ink, holes, extra: cross(0, -108, 5, 1.6) };
  }
  if (kind === 'romanesqueTower') {
    let ink = rect(-30, -30, 60, 110) + rect(-34, -34, 68, 5) + poly([[-34, -34], [0, -70], [34, -34]]) + rect(-70, 54, 40, 26) + rect(30, 54, 40, 26);
    let holes = '';
    [-14, 14, 42].forEach((y, i) => { holes += row(i === 2 ? 1 : 2, -10, 10, (x) => archShape(x, y + 24, 8, 22)); });
    holes += archShape(0, 80, 14, 24);
    return { vb: V(-76, -80, 152, 170), ink, holes, extra: '' };
  }
  if (kind === 'stave') { // Urnes: stacked steep roofs with dragon heads
    let ink = '', holes = '';
    [[0, 54, 56], [0, 22, 40], [0, -6, 24]].forEach(([x, y, hw], i) => { ink += poly([[-hw - 6, y + 28], [-hw + 6, y], [hw - 6, y], [hw + 6, y + 28]]) + rect(-hw + 4, y + 26, hw * 2 - 8, 8); });
    ink += rect(-50, 78, 100, 14) + poly([[-8, -12], [0, -52], [8, -12]]) + rect(-1, -66, 2, 16);
    [[-62, 52], [62, 52], [-46, 20], [46, 20], [-30, -8], [30, -8]].forEach(([x, y]) => { ink += path(`M${x},${y + 8} q${x < 0 ? -10 : 10},-6 ${x < 0 ? -14 : 14},-14 q-6,4 ${x < 0 ? 6 : -6},12 Z`); });
    holes += row(5, -36, 36, (x) => archShape(x, 90, 6, 14));
    return { vb: V(-82, -70, 164, 165), ink, holes, extra: '' };
  }
  if (kind === 'hallgrim') { // Hallgrimskirkja: basalt column stepping up to a tower
    let ink = poly([[-50, 86], [-50, 30], [-34, 26], [-20, 30], [-20, 86]]) + poly([[50, 86], [50, 30], [34, 26], [20, 30], [20, 86]]) + poly([[-20, 86], [-20, 10], [-14, -6], [-14, -64], [0, -96], [14, -64], [14, -6], [20, 10], [20, 86]]) + rect(-8, -62, 16, 3);
    const holes = row(5, -14, 14, (x) => rect(x - 1.2, -50, 2.4, 52)) + archShape(0, 86, 14, 36) + row(3, -40, -24, (x, i) => rect(x - 3, 22, 6, 54 - i * 14));
    return { vb: V(-60, -105, 120, 200), ink, holes, extra: cross(0, -96, 4.5, 1.4) };
  }
  if (kind === 'clocktower') {
    const { clock = true } = p;
    let ink = rect(-22, -30, 44, 114) + rect(-27, -36, 54, 8) + poly([[-27, -36], [0, -100], [27, -36]]) + mirror([24], (x) => spire(x, -36, 7, 18)) + rect(-40, 62, 80, 22) + rect(-30, 36, 60, 28);
    let holes = archShape(0, 84, 14, 24) + (clock ? '' : '') + [6, 36].map((y) => mirror([9], (x) => archShape(x, y + 18, 6, 16))).join('');
    const face = ring(0, -6, 12, 2.2) + line('M0,-6 v-8 M0,-6 l6,3', 1.8);
    holes += `<circle cx="0" cy="-6" r="12"/>`;
    return { vb: V(-45, -112, 90, 200), ink, holes, extra: face + line('M0,-100 v-12', 1.5) };
  }
  if (kind === 'townHall') { // Gothic hall with a tall slim octagonal spire
    const ink = rect(-60, 20, 120, 62) + rect(-14, -10, 28, 32) + poly([[-14, -10], [0, -104], [14, -10]]) + mirror([40], (x) => spire(x, 20, 14, 18)) + rect(-64, 78, 128, 6);
    const holes = row(5, -44, 44, (x) => archShape(x, 80, 9, 26)) + row(4, -34, 34, (x) => archShape(x, 50, 7, 16)) + archShape(0, 18, 8, 18);
    return { vb: V(-70, -112, 140, 205), ink, holes, extra: line('M0,-104 v-10 m-3,4 h6', 1.4) };
  }
  if (kind === 'baroque') {
    const ink = rect(-60, 16, 120, 68) + rect(-34, -22, 68, 40) + poly([[-34, -22], [0, -48], [34, -22]]) + mirror([46], (x) => rect(x - 10, -8, 20, 28) + dome(x, -8, 10, 12)) + dome(0, 8, 0.1) + rect(-66, 82, 132, 6);
    const holes = row(5, -44, 44, (x) => archShape(x, 84, 9, 30)) + row(3, -18, 18, (x) => archShape(x, 14, 8, 24)) + `<circle cx="0" cy="-20" r="6"/>`;
    return { vb: V(-72, -60, 144, 150), ink, holes, extra: cross(0, -48, 4.5, 1.4) };
  }
  if (kind === 'domeBasilica') {
    const { colonnade = true, tower = false, lantern = true, small = 0 } = p;
    let ink = rect(-64, 26, 128, 56) + rect(-72, 80, 144, 8) + rect(-26, 0, 52, 28) + dome(0, 0, 32, 36) + (lantern ? rect(-6, -40, 12, 10) + dome(0, -40, 7, 9) : '') + rect(-44, 12, 88, 14) + poly([[-44, 14], [0, 4], [44, 14]]);
    ink += small ? mirror([50], (x) => dome(x, 14, 11, 13)) : '';
    if (tower) ink += rect(76, -20, 18, 104) + spire(85, -20, 22, 26);
    let holes = row(colonnade ? 9 : 5, -54, 54, (x) => archShape(x, 80, 6, 34)) + row(5, -20, 20, (x) => archShape(x, 24, 5, 14));
    return { vb: V(-80, -62, tower ? 190 : 160, 160), ink, holes, extra: cross(0, -49, 4, 1.3) };
  }
  if (kind === 'capitol') {
    const ink = rect(-84, 36, 168, 46) + rect(-90, 80, 180, 7) + poly([[-44, 36], [-44, 16], [44, 16], [44, 36]]) + rect(-26, 0, 52, 18) + dome(0, 0, 28, 34) + rect(-5, -40, 10, 10) + spire(0, -40, 10, 16);
    const holes = row(15, -70, 70, (x) => rect(x - 1.8, 40, 3.6, 38)) + row(7, -34, 34, (x) => archShape(x, 16, 5, 12)) + row(5, -16, 16, (x) => archShape(x, -2, 4, 14));
    return { vb: V(-96, -62, 192, 150), ink, holes, extra: '' };
  }
  if (kind === 'station') { // low wide building with a central dome and spire
    const ink = rect(-84, 30, 168, 52) + rect(-24, 6, 48, 26) + dome(0, 6, 26, 24) + rect(-2, -34, 4, 18) + circle(0, -36, 3.5) + mirror([60], (x) => rect(x - 18, 18, 36, 14) + dome(x, 18, 12, 10));
    const holes = row(9, -72, 72, (x) => archShape(x, 80, 8, 28)) + row(3, -14, 14, (x) => archShape(x, 30, 6, 16));
    return { vb: V(-92, -42, 184, 130), ink, holes, extra: '' };
  }
  if (kind === 'helsinki') {
    const ink = rect(-62, 40, 124, 42) + rect(-34, 10, 68, 32) + poly([[-34, 14], [0, 2], [34, 14]]) + rect(-22, -18, 44, 22) + dome(0, -18, 24, 28) + rect(-4, -56, 8, 10) + mirror([46], (x) => rect(x - 8, 8, 16, 20) + dome(x, 8, 9, 11)) + rect(-70, 80, 140, 8);
    const holes = row(5, -30, 30, (x) => rect(x - 2, 44, 4, 36)) + row(6, -44, 44, (x) => archShape(x, 78, 6, 22)) + row(5, -16, 16, (x) => archShape(x, 2, 4, 12));
    return { vb: V(-76, -66, 152, 160), ink, holes, extra: cross(0, -56, 4, 1.3) };
  }
  if (kind === 'bahai') {
    let ink = '', holes = '';
    ink += poly([[-48, 82], [-44, 40], [44, 40], [48, 82]]) + path('M-44,40 Q-44,-6 0,-30 Q44,-6 44,40 Z') + rect(-52, 80, 104, 8);
    for (let k = -4; k <= 4; k++) holes += `<path d="M${k * 9},40 Q${k * 7},0 0,-24" fill="none" stroke="#000" stroke-width="1.5"/>`;
    holes += row(5, -30, 30, (x) => archShape(x, 80, 9, 30));
    return { vb: V(-56, -40, 112, 135), ink, holes, extra: '' };
  }
  if (kind === 'parliament') { // Budapest: central dome, long wings, many spires
    let ink = rect(-96, 36, 192, 46) + rect(-24, 6, 48, 32) + dome(0, 6, 22, 40) + spire(0, -34, 8, 36) + mirror([60, 88], (x) => rect(x - 12, 14, 24, 24) + spire(x, 14, 24, 30)) + mirror([36], (x) => spire(x, 22, 9, 24)) + rect(-100, 80, 200, 6);
    const holes = row(15, -84, 84, (x) => archShape(x, 78, 4, 28)) + row(11, -78, 78, (x) => archShape(x, 50, 3.5, 12)) + row(5, -14, 14, (x) => archShape(x, 36, 4, 18));
    return { vb: V(-104, -90, 208, 180), ink, holes, extra: '' };
  }
  if (kind === 'casino') { // Monte-Carlo: ornate facade with two domed corner towers
    let ink = rect(-70, 26, 140, 56) + rect(-30, 6, 60, 22) + dome(0, 6, 18, 10) + mirror([62], (x) => rect(x - 12, -12, 24, 40) + onion(x, -12, 24, 24) + rect(x - 14, -16, 28, 5)) + rect(-76, 80, 152, 7);
    const holes = row(5, -44, 44, (x) => archShape(x, 80, 10, 36)) + mirror([62], (x) => archShape(x, 22, 8, 22)) + row(5, -20, 20, (x) => archShape(x, 26, 5, 14));
    return { vb: V(-84, -50, 168, 140), ink, holes, extra: '' };
  }
  if (kind === 'mountainChurch') { // small church with a cone dome in front of a peak
    const church = rect(-22, 38, 44, 40) + poly([[-22, 38], [0, 18], [22, 38]]) + rect(-8, 6, 16, 14) + poly([[-8, 6], [0, -14], [8, 6]]) + rect(-1, -26, 2, 12);
    const dil = church.replaceAll('<rect', '<rect stroke="#000" stroke-width="7"').replaceAll('<path', '<path stroke="#000" stroke-width="7"');
    const ink = poly([[-104, 92], [-34, -40], [-14, -8], [10, -66], [104, 92]]);
    return { vb: V(-110, -80, 220, 176), ink, holes: dil, extra: church + archShape(0, 78, 0.1, 0.1) };
  }
  if (kind === 'islandChurch') { // Bled: church with a spire on a small island
    let ink = path('M-80,84 Q-40,58 0,62 Q50,58 84,84 Z') + rect(-18, 20, 36, 40) + rect(-9, -26, 18, 48) + spire(0, -26, 22, 34) + poly([[-18, 20], [-30, 36], [-30, 60], [-18, 60]]);
    const holes = archShape(0, 58, 10, 20) + archShape(0, -2, 6, 14);
    return { vb: V(-90, -68, 180, 160), ink, holes, extra: cross(0, -60, 4, 1.3) };
  }
  // Orthodox clusters
  if (kind === 'basil') {
    let ink = rect(-50, 36, 100, 46) + rect(-60, 80, 120, 7) + poly([[-14, 36], [-14, -20], [0, -58], [14, -20], [14, 36]]) + dome(0, -58, 0.1) + spire(0, -26, 28, 66) + onion(0, -64, 16, 24);
    [[-44, 18, 24], [44, 18, 24], [-26, 6, 20], [26, 6, 20], [-58, 38, 18], [58, 38, 18]].forEach(([x, y, w]) => { ink += rect(x - w / 3, y, w * 0.66, 28) + onion(x, y, w, w * 1.1); });
    const holes = row(5, -38, 38, (x) => archShape(x, 80, 6, 18)) + [[-44, 28], [44, 28], [-26, 18], [26, 18]].map(([x, y]) => cut(`M${x - 4},${y} v-6 M${x + 4},${y} v-6`, 1.4)).join('');
    return { vb: V(-68, -90, 136, 185), ink, holes, extra: [[0, -86], [-44, -9], [44, -9], [-26, -17], [26, -17], [-58, 10], [58, 10]].map(([x, y]) => cross(x, y, 3.2, 1)).join('') };
  }
  if (kind === 'nevsky' || kind === 'sophia') {
    let ink = rect(-58, 24, 116, 58) + rect(-66, 80, 132, 7) + rect(-14, -10, 28, 36) + onion(0, -10, 30, 36);
    ink += mirror([36], (x) => rect(x - 9, 6, 18, 20) + onion(x, 6, 18, 22)) + (kind === 'sophia' ? mirror([58], (x) => rect(x - 7, 16, 14, 12) + onion(x, 16, 14, 16)) : rect(70, -34, 18, 118) + onion(79, -34, 20, 28));
    const holes = row(7, -44, 44, (x) => archShape(x, 80, 5, 24)) + row(3, -10, 10, (x) => archShape(x, 22, 4, 12));
    return { vb: V(-72, -62, kind === 'nevsky' ? 168 : 144, 150), ink, holes, extra: [[0, -46], [36, -16], [-36, -16]].map(([x, y]) => cross(x, y, 3.4, 1.1)).join('') };
  }
  if (kind === 'sava') {
    let ink = rect(-56, 26, 112, 56) + rect(-66, 80, 132, 7) + rect(-30, -4, 60, 32) + dome(0, -4, 36, 34) + mirror([52], (x) => rect(x - 9, 8, 18, 20) + dome(x, 8, 12, 12)) + rect(-5, -48, 10, 12);
    const holes = row(7, -44, 44, (x) => archShape(x, 80, 6, 26)) + row(7, -24, 24, (x) => archShape(x, -2, 3.5, 12));
    return { vb: V(-72, -64, 144, 155), ink, holes, extra: cross(0, -48, 4.5, 1.4) + mirror([52], (x) => cross(x, -4, 2.6, 1)) };
  }
  throw new Error('unknown church ' + kind);
};
