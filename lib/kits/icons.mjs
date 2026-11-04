import { f, rect, path, poly, circle, ring, line, cut, archShape, dome, onion, spire, cross, minaret, row, mirror } from './draw.mjs';
const V = (x, y, w, h) => [x, y, w, h];

// ---- Towers and skyscrapers ----
export const tower = (kind = 'cn') => {
  if (kind === 'cn') { // slender shaft, pod, and antenna
    const ink = poly([[-8, 92], [-5, -20], [5, -20], [8, 92]]) + path('M-26,-26 Q-26,-40 0,-42 Q26,-40 26,-26 Q26,-18 0,-16 Q-26,-18 -26,-26 Z') + rect(-14, -58, 28, 16) + poly([[-5, -58], [0, -112], [5, -58]]) + circle(0, -20, 8) + rect(-18, 88, 36, 6);
    const holes = row(5, -20, 20, (x) => rect(x - 1.4, -34, 2.8, 8));
    return { vb: V(-32, -118, 64, 218), ink, holes, extra: '' };
  }
  if (kind === 'burj') { // stepped, spiralling needle
    let ink = rect(-30, 88, 60, 6), holes = '';
    const tiers = [[28, 80, 38], [22, 60, 36], [17, 40, 28], [12, 20, 24], [8, 2, 20], [5, -16, 16]];
    tiers.forEach(([hw, y, h], i) => { const t = tiers[i + 1]; ink += rect(i % 2 ? -hw : -hw - 3, y - h, (i % 2 ? hw : hw + 3) * 2, h + 1); });
    ink += poly([[-5, -22], [-2, -88], [2, -88], [5, -22]]) + rect(-0.8, -112, 1.6, 26);
    for (let y = 84; y > -20; y -= 6) holes += rect(-3, y, 6, 1.2).replace('', '');
    return { vb: V(-34, -118, 68, 218), ink, holes: tiers.map(([hw, y]) => cut(`M${-hw + 4},${y - 6} v-18 M${hw - 4},${y - 6} v-18`, 1.2)).join(''), extra: '' };
  }
  if (kind === 'aspire') { // torch-shaped tower
    const ink = path('M-12,92 Q-14,40 -9,-20 L-18,-40 Q-30,-70 -18,-82 Q0,-104 18,-82 Q30,-70 18,-40 L9,-20 Q14,40 12,92 Z') + rect(-20, 88, 40, 6);
    const holes = row(5, -9, 9, (x) => cut(`M${x},-30 Q${x * 2.2},-56 ${x * 1.4},-84`, 1.1)) + [0, 24, 48, 70].map((y) => cut(`M-8,${y} h16`, 1.1)).join('');
    return { vb: V(-34, -108, 68, 206), ink, holes, extra: '' };
  }
  if (kind === 'stepped') { // Palace of Culture, stepped wedding-cake skyscraper
    let ink = rect(-60, 60, 120, 28);
    [[46, 26, 36], [34, 0, 28], [24, -22, 24], [14, -40, 20], [8, -56, 16]].forEach(([hw, y, h]) => { ink += rect(-hw, y, hw * 2, h + 1) + rect(-hw - 3, y - 2, hw * 2 + 6, 3); });
    ink += poly([[-6, -58], [0, -108], [6, -58]]) + mirror([60], (x) => rect(x - 12, 40, 24, 48));
    const holes = row(7, -40, 40, (x) => rect(x - 2, 64, 4, 18)) + row(7, -40, 40, (x) => rect(x - 2, 32, 4, 20)) + row(5, -28, 28, (x) => rect(x - 2, 6, 4, 14)) + row(3, -14, 14, (x) => rect(x - 2, -18, 4, 10));
    return { vb: V(-76, -112, 152, 205), ink, holes, extra: '' };
  }
  if (kind === 'cityHall') { // Stockholm City Hall: square tower with a lantern and three crowns
    const ink = rect(-62, 44, 124, 42) + rect(-24, -44, 48, 92) + rect(-28, -50, 56, 8) + poly([[-28, -50], [-18, -74], [18, -74], [28, -50]]) + rect(-12, -92, 24, 18) + dome(0, -92, 12, 12) + spire(0, -104, 2, 14) + rect(-66, 84, 132, 5);
    const holes = row(7, -48, 48, (x) => archShape(x, 82, 5, 22)) + row(3, -14, 14, (x) => archShape(x, 40, 5, 16)) + row(3, -14, 14, (x) => archShape(x, 6, 5, 16)) + row(3, -9, 9, (x) => archShape(x, -62, 4, 10));
    return { vb: V(-72, -118, 144, 210), ink, holes, extra: '' };
  }
  if (kind === 'palacio') { // Palacio Salvo: tall slim tower topped by a lantern
    const ink = rect(-30, 6, 60, 82) + rect(-24, -38, 48, 46) + rect(-18, -62, 36, 26) + dome(0, -62, 16, 16) + rect(-3, -92, 6, 14) + spire(0, -92, 12, 20) + mirror([34], (x) => rect(x - 7, 14, 14, 40)) + rect(-36, 86, 72, 6);
    const holes = row(5, -20, 20, (x) => archShape(x, 80, 5, 18)) + row(5, -20, 20, (x) => archShape(x, 54, 5, 18)) + row(5, -20, 20, (x) => archShape(x, 28, 5, 18)) + row(3, -14, 14, (x) => archShape(x, 2, 5, 18)) + row(3, -10, 10, (x) => archShape(x, -42, 4, 12));
    return { vb: V(-42, -116, 84, 214), ink, holes, extra: '' };
  }
  if (kind === 'kingdom') { // Kingdom Centre: a tower with a big hole near the top
    const ink = path('M-26,92 L-20,-54 Q-12,-72 0,-90 Q12,-72 20,-54 L26,92 Z');
    const holes = path('M-12,-30 Q0,-68 12,-30 Q0,-16 -12,-30 Z') + path('M-6,-34 Q0,-46 6,-34 Q0,-28 -6,-34 Z').replace('', '');
    const bridge = rect(-14, -36, 28, 5);
    return { vb: V(-34, -96, 68, 196), ink, holes: path('M-14,-26 Q0,-70 14,-26 Q0,-8 -14,-26 Z') + row(5, -14, 14, (x) => rect(x - 0.7, 8, 1.4, 76)), extra: bridge };
  }
  if (kind === 'flame') { // Flame Towers: three curved flame-shaped towers
    let ink = '';
    [[-34, 80, 20], [0, 100, 24], [34, 70, 18]].forEach(([x, h, w]) => { ink += path(`M${x - w},92 Q${x - w + 2},${92 - h * 0.6} ${x - 2},${92 - h} Q${x + w * 0.7},${92 - h * 0.5} ${x + w},92 Z`); });
    return { vb: V(-62, -22, 124, 120), ink, holes: row(8, -50, 44, (x) => cut(`M${x},82 V${40 - (Math.abs(x) * 0.2)}`, 1)), extra: '' };
  }
  if (kind === 'petronas') {
    const tw = (x) => poly([[x - 14, 92], [x - 14, 24], [x - 10, -6], [x - 6, -34], [x - 3, -70], [x, -100], [x + 3, -70], [x + 6, -34], [x + 10, -6], [x + 14, 24], [x + 14, 92]]) + rect(x - 18, 88, 36, 6);
    const ink = tw(-22) + tw(22) + rect(-10, -14, 20, 8);
    const holes = [-22, 22].map((x) => row(4, x - 8, x + 8, (xx) => rect(xx - 0.7, 0, 1.4, 84)).replace('', '')).join('') + [60, 30, 0, -26].map((y) => [-22, 22].map((x) => cut(`M${x - 11},${y} h22`, 1.1)).join('')).join('');
    return { vb: V(-48, -106, 96, 204), ink, holes, extra: '' };
  }
  if (kind === 'kuwait') { // three towers: two with spheres, one needle
    const ink = poly([[-40, 92], [-34, 20], [-30, -46], [-27, -80], [-24, -46], [-20, 20], [-14, 92]]) + circle(-27, -2, 14) + circle(-27, -34, 7) + poly([[14, 92], [20, 10], [27, -112], [30, 10], [36, 92]]) + circle(27, 38, 0.1) + poly([[48, 92], [50, 46], [52, 10], [54, 46], [56, 92]]) + rect(-50, 90, 112, 4);
    const holes = '';
    return { vb: V(-58, -118, 124, 218), ink: ink + ring(-27, -2, 14, 1.4) + path('M-27,-34 m-7,0 a7,7 0 1 0 14,0 a7,7 0 1 0 -14,0 Z').replace('', ''), holes: cut('M-27,-2 m-9,0 h18 M-27,-2 v-9', 1.5), extra: '' };
  }
  if (kind === 'mbs') { // Marina Bay Sands: three leaning towers carrying a ship-like sky park
    const ink = poly([[-50, 92], [-40, -34], [-20, -34], [-22, 92]]) + poly([[-12, 92], [-12, -34], [12, -34], [12, 92]]) + poly([[50, 92], [40, -34], [20, -34], [22, 92]]) + path('M-98,-44 Q-92,-54 -72,-54 L60,-54 Q92,-56 102,-44 Q94,-32 70,-35 L-72,-35 Q-94,-33 -98,-44 Z') + rect(-60, 90, 120, 4);
    return { vb: V(-106, -62, 212, 160), ink, holes: [30, 6, -18].map((y) => rect(-44, y, 88, 1.2)).join(''), extra: '' };
  }
  if (kind === 'atomium') { // nine spheres joined by tubes
    const pts = [[0, -64], [-44, -10], [44, -10], [0, 14], [0, 62], [-44, 62]].slice(0, 5);
    const balls = [[0, -66], [-48, -12], [48, -12], [0, 14], [-48, 68], [48, 68], [0, 68]].slice(0, 7);
    let extra = '';
    const tubes = [[0, -66, -48, -12], [0, -66, 48, -12], [-48, -12, 0, 14], [48, -12, 0, 14], [-48, -12, -48, 68], [48, -12, 48, 68], [-48, 68, 0, 68], [48, 68, 0, 68], [0, 14, 0, 68], [-48, -12, 48, -12], [-48, 68, 0, 14].slice(0, 4)];
    let ink = '';
    tubes.forEach(([a, b, c, d]) => { ink += line(`M${a},${b} L${c},${d}`, 7); });
    balls.forEach(([x, y]) => { ink += circle(x, y, 17); });
    const holes = balls.map(([x, y]) => `<path d="M${x - 17},${y - 4} Q${x},${y - 14} ${x + 17},${y - 4}" fill="none" stroke="#000" stroke-width="1.4"/>`).join('');
    return { vb: V(-72, -90, 144, 190), ink, holes: balls.map(([x, y]) => cut(`M${x - 12},${y - 6} Q${x},${y - 14} ${x + 12},${y - 6}`, 1.4)).join(''), extra: '' };
  }
  if (kind === 'tagliero') { // Fiat Tagliero: a tower with two enormous cantilevered wings
    const ink = rect(-12, -22, 24, 108) + path('M-12,-24 L-96,-12 L-96,-2 L-12,-8 Z') + path('M12,-24 L96,-12 L96,-2 L12,-8 Z') + rect(-18, 84, 36, 6) + rect(-20, -30, 40, 8) + rect(-4, -46, 8, 16);
    const holes = row(3, -6, 6, (x) => rect(x - 1.3, 4, 2.6, 18)) + row(3, -6, 6, (x) => rect(x - 1.3, 36, 2.6, 18)) + archShape(0, 84, 10, 18);
    return { vb: V(-104, -52, 208, 148), ink, holes, extra: '' };
  }
  if (kind === 'atlantis') { // twin towers joined by a bridge
    const ink = mirror([48], (x) => rect(x - 22, -20, 44, 106) + rect(x - 26, -26, 52, 8) + poly([[x - 22, -26], [x, -50], [x + 22, -26]]) + circle(x, -52, 3)) + rect(-30, 4, 60, 14) + rect(-70, 84, 140, 6);
    const holes = mirror([48], (x) => row(3, x - 12, x + 12, (xx) => rect(xx - 2, 6 + 0, 4, 14))) + mirror([48], (x) => row(3, x - 12, x + 12, (xx) => rect(xx - 2, 38, 4, 14))) + mirror([48], (x) => row(3, x - 12, x + 12, (xx) => rect(xx - 2, 62, 4, 14)));
    return { vb: V(-86, -62, 172, 158), ink, holes, extra: '' };
  }
  throw new Error('unknown tower ' + kind);
};

// ---- Pillars and abstract monuments ----
export const pillar = (kind = 'obelisk') => {
  if (kind === 'obelisk') {
    const ink = rect(-30, 84, 60, 8) + rect(-22, 76, 44, 8) + poly([[-16, 76], [-11, -76], [11, -76], [16, 76]]) + poly([[-11, -76], [0, -98], [11, -76]]);
    return { vb: V(-36, -104, 72, 202), ink, holes: row(2, -4, 4, (x) => cut(`M${x},-60 L${x},68`, 0.8)).replace('', ''), extra: '' };
  }
  if (kind === 'juche') { // stone shaft crowned by a torch
    const ink = rect(-24, 84, 48, 8) + poly([[-20, 84], [-14, -44], [14, -44], [20, 84]]) + rect(-18, -50, 36, 8) + path('M-8,-52 Q-20,-76 0,-100 Q20,-76 8,-52 Z');
    return { vb: V(-30, -106, 60, 202), ink, holes: row(2, -6, 6, (x) => cut(`M${x},-36 V74`, 0.9)).replace('', '') + path('M0,-60 Q-6,-76 0,-90 Q6,-76 0,-60 Z'), extra: '' };
  }
  if (kind === 'globe') { // Mitad del Mundo: tower topped with a globe
    const ink = rect(-40, 84, 80, 8) + poly([[-30, 84], [-22, -30], [22, -30], [30, 84]]) + rect(-26, -34, 52, 6) + circle(0, -54, 22);
    return { vb: V(-46, -80, 92, 176), ink, holes: archShape(0, 84, 14, 26) + cut('M-22,-54 H22 M0,-76 V-32 M-16,-66 Q0,-54 16,-66', 1.4), extra: '' };
  }
  if (kind === 'freedom') { // Freedom Monument: stacked column with a figure raising stars
    const ink = rect(-30, 84, 60, 8) + rect(-24, 70, 48, 14) + rect(-18, 40, 36, 30) + rect(-12, -56, 24, 96) + rect(-16, -62, 32, 8) + path('M-6,-62 L-8,-84 L8,-84 L6,-62 Z') + circle(0, -90, 4.5) + line('M0,-82 L-16,-104 M0,-82 L16,-104', 2.4) + [[-16, -108], [0, -112], [16, -108]].map(([x, y]) => circle(x, y, 3.4)).join('');
    return { vb: V(-36, -118, 72, 214), ink, holes: row(2, -6, 6, (x) => rect(x - 1.5, -44, 3, 74)).replace('', '') + archShape(0, 70, 10, 20), extra: '' };
  }
  if (kind === 'shaheed') { // Shaheed Minar: a central slab with slanted panels on each side
    const ink = rect(-70, 86, 140, 6) + mirror([46, 24], (x) => poly([[x - 7, 86], [x * 0.7 - 7, 6], [x * 0.7 + 7, 6], [x + 7, 86]]).replace('', '')) + poly([[-12, 86], [-12, -50], [-4, -66], [4, -66], [12, -50], [12, 86]]);
    return { vb: V(-76, -72, 152, 168), ink, holes: '', extra: '' };
  }
  if (kind === 'maqam') { // Maqam Echahid: three tall leaves around a flame
    const leaf = (rot) => `<g transform="rotate(${rot} 0 80)"><path d="M0,86 Q-30,20 -8,-60 Q0,-92 8,-60 Q30,20 0,86 Z"/></g>`;
    const ink = rect(-60, 84, 120, 8) + leaf(-22) + leaf(22) + leaf(0).replace('', '');
    return { vb: V(-76, -100, 152, 200), ink, holes: cut('M0,-20 Q-4,20 0,60 M-26,-10 Q-34,30 -24,66 M26,-10 Q34,30 24,66', 1.4), extra: '' };
  }
  if (kind === 'bayterek') { // Bayterek: a slender tree shaft holding a golden sphere
    const ink = rect(-30, 88, 60, 5) + path('M-16,88 Q-10,50 -6,0 L-3,-34 L3,-34 L6,0 Q10,50 16,88 Z') + path('M-36,-34 Q-30,-60 -6,-74 L6,-74 Q30,-60 36,-34 Z') + circle(0, -68, 24).replace('', '');
    return { vb: V(-42, -96, 84, 192), ink, holes: ring(0, -64, 14, 1).replace('', '') + cut('M-12,-46 Q0,-58 12,-46', 1.4), extra: '' };
  }
  if (kind === 'neutrality') { // Arch of Neutrality: a tripod carrying a golden statue
    const ink = poly([[-34, 88], [-6, -34], [2, -34], [-18, 88]]) + poly([[34, 88], [6, -34], [-2, -34], [18, 88]]) + poly([[-6, 88], [-3, -34], [3, -34], [6, 88]]) + rect(-12, -48, 24, 14) + poly([[-8, -48], [0, -100], [8, -48]]) + circle(0, -104, 4.5) + rect(-40, 86, 80, 6);
    return { vb: V(-46, -112, 92, 208), ink, holes: '', extra: '' };
  }
  if (kind === 'pearl') { // Pearl Monument: six sails holding a pearl
    let ink = rect(-44, 88, 88, 6) + circle(0, -76, 14);
    ink += mirror([6, 16, 26], (x) => poly([[x - 3, 88], [x * 0.7 - 3, -52], [x * 0.7 + 3, -52], [x + 3, 88]]).replace('', ''));
    return { vb: V(-50, -96, 100, 196), ink, holes: '', extra: '' };
  }
  if (kind === 'azadi') { // Azadi Tower: a tall pointed arch on a wide block
    const ink = rect(-72, 6, 144, 82) + path('M-72,6 Q-64,-60 0,-78 Q64,-60 72,6 Z') + rect(-30, -78, 60, 8) + rect(-18, -90, 36, 14) + dome(0, -90, 14, 16) + rect(-76, 86, 152, 6);
    const holes = path('M-34,88 L-34,30 Q-32,-20 0,-44 Q32,-20 34,30 L34,88 Z') + path('M-12,30 L-12,-16 Q0,-30 12,-16 L12,30 Z').replace('', '') + row(5, -52, 52, (x) => Math.abs(x) < 36 ? '' : archShape(x, 80, 6, 24));
    return { vb: V(-80, -108, 160, 205), ink, holes, extra: '' };
  }
  if (kind === 'cross') { // Millennium Cross on a hill
    const ink = path('M-108,90 Q-70,50 -30,38 Q0,32 30,38 Q70,50 108,90 Z') + rect(-6, -88, 12, 128) + rect(-30, -60, 60, 12);
    return { vb: V(-114, -96, 228, 192), ink, holes: cut('M-1,-80 V30', 1), extra: '' };
  }
  throw new Error('unknown pillar ' + kind);
};

// ---- Statues ----
export const statue = (kind = 'christ') => {
  if (kind === 'christ') {
    const ink = poly([[-36, 92], [-28, 46], [28, 46], [36, 92]]) + rect(-22, 36, 44, 12) + path('M-12,36 L-14,-24 L14,-24 L12,36 Z') + path('M-12,-26 L-90,-20 L-90,-6 L-12,-8 Z') + path('M12,-26 L90,-20 L90,-6 L12,-8 Z') + circle(0, -38, 10) + path('M-14,-24 Q0,-30 14,-24 L16,-4 L-16,-4 Z');
    return { vb: V(-96, -52, 192, 148), ink, holes: cut('M-4,2 Q-6,20 -4,34 M4,2 Q6,20 4,34', 1.1), extra: '' };
  }
  if (kind === 'rider') { // equestrian statue: horse, rider with raised sword, pedestal
    const ink = rect(-56, 84, 112, 8) + rect(-46, 66, 92, 18) + `<ellipse cx="-6" cy="30" rx="30" ry="14"/>` + path('M14,24 C22,10 26,-4 34,-14 L46,-10 L54,2 L50,6 L40,2 C36,10 34,22 30,34 Z') + path('M34,-14 L36,-22 L40,-12 Z') + line('M16,38 L32,46 L40,38', 6) + line('M6,40 L8,66', 6) + line('M-30,40 L-38,66', 6) + line('M-18,42 L-14,66', 6) + line('M-34,22 C-50,28 -52,44 -46,58', 4) + path('M-8,16 L-6,-22 L8,-22 L10,16 Z') + circle(1, -31, 7.5) + path('M-6,-20 Q-32,-14 -36,12 L-8,10 Z') + line('M6,-18 L22,-48', 3.2) + line('M18,-52 L28,-44', 2.6);
    return { vb: V(-64, -64, 128, 160), ink, holes: cut('M-30,76 h60', 1.4), extra: '' };
  }
  if (kind === 'mermaid') { // a figure seated on a rock by the sea
    const ink = path('M-80,90 Q-54,52 -20,50 Q10,44 40,58 Q74,56 90,90 Z') + path('M-18,50 Q-20,26 -10,12 Q-4,-2 -2,-14 Q4,-22 12,-14 Q16,-2 8,10 Q12,28 14,48 Z') + circle(5, -22, 8) + path('M14,48 Q34,56 50,44 Q64,34 76,40 Q64,54 52,56 Q36,66 12,60 Z');
    return { vb: V(-86, -34, 176, 128), ink, holes: cut('M-60,82 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0', 1.4), extra: '' };
  }
  if (kind === 'renaissance') { // African Renaissance Monument: a group on a hill
    const ink = path('M-90,92 Q-50,60 0,60 Q50,60 90,92 Z') + rect(-14, -30, 28, 94) + circle(0, -42, 9) + path('M-12,-26 L-34,-52 L-26,-56 L-6,-34 Z') + path('M14,24 L-14,24 L-10,60 L14,60 Z') + path('M6,-10 Q20,-6 26,10 Q24,24 16,26 Z') + circle(24, 0, 5.5);
    return { vb: V(-96, -64, 192, 160), ink, holes: cut('M0,-26 V40', 1.2), extra: '' };
  }
  if (kind === 'moai') { // three moai on a ahu platform: long faces, heavy brows, protruding noses
    const one = (x, sc, knot) => `<g transform="translate(${x} 0) scale(${sc})"><path d="M-15,86 L-13,0 L-17,-14 L-11,-26 L-10,-48 L10,-48 L11,-26 L17,-14 L13,0 L15,86 Z" stroke="none"/>${knot ? '<rect x="-9" y="-62" width="18" height="15" stroke="none"/>' : ''}</g>`;
    const eyes = (x, sc) => `<g transform="translate(${x} 0) scale(${sc})"><rect x="-9" y="-30" width="6" height="3.6" stroke="none"/><rect x="3" y="-30" width="6" height="3.6" stroke="none"/><path d="M-1.6,-26 L-3,-8 L3,-8 L1.6,-26 Z" stroke="none"/><rect x="-6" y="-4" width="12" height="2" stroke="none"/></g>`;
    const set = [[-64, 0.88, false], [0, 1.1, true], [62, 0.82, false]];
    return { vb: V(-110, -76, 220, 176), ink: set.map(([x, s, k]) => one(x, s, k)).join('') + rect(-108, 84, 216, 10), holes: set.map(([x, s]) => eyes(x, s)).join(''), extra: '' };
  }
  throw new Error('unknown statue ' + kind);
};

// ---- Traditional and ancient structures ----
export const hut = (kind = 'greatZim') => {
  if (kind === 'greatZim') { // a solid conical tower inside a curved dry-stone wall
    const ink = path('M-108,88 Q-100,30 -52,26 L52,26 Q100,30 108,88 Z') + path('M-26,26 Q-24,-22 -18,-46 L18,-46 Q24,-22 26,26 Z') + rect(-22, -54, 44, 8);
    const holes = row(5, -74, 74, (x, i) => cut(`M${x - 8},${44 + (i % 2) * 8} h16`, 1.4)) + cut('M-24,0 h48 M-22,-24 h44', 1.2) + archShape(0, 88, 18, 28).replace('', '');
    return { vb: V(-114, -62, 228, 156), ink, holes: row(6, -70, 70, (x, i) => cut(`M${x - 7},${44 + (i % 2) * 10} h14`, 1.4)) + cut('M-24,2 h48 M-22,-22 h44', 1.2), extra: '' };
  }
  if (kind === 'kasubi') { // a huge thatched dome on a circular wall
    const ink = path('M-72,82 L-72,34 Q-72,-56 0,-66 Q72,-56 72,34 L72,82 Z') + rect(-80, 80, 160, 6) + rect(-3, -84, 6, 22) + circle(0, -88, 5);
    const holes = row(6, -52, 52, (x, i) => cut(`M${x},40 Q${x * 0.4},-20 ${x * 0.2},-56`, 1.2)) + archShape(0, 82, 26, 46) + cut('M-70,32 Q0,24 70,32', 1.6);
    return { vb: V(-86, -96, 172, 192), ink, holes, extra: '' };
  }
  if (kind === 'maneaba') { // a wide, low thatched meeting house on posts
    const ink = path('M-104,58 Q-70,-8 0,-18 Q70,-8 104,58 Z') + rect(-96, 56, 192, 6) + mirror([84, 56, 28], (x) => rect(x - 3, 60, 6, 28)) + rect(-100, 86, 200, 4);
    return { vb: V(-110, -28, 220, 124), ink, holes: row(8, -70, 70, (x) => cut(`M${x},50 Q${x * 0.6},14 ${x * 0.3},-8`, 1.1)), extra: '' };
  }
  if (kind === 'tambaran') { // spirit house: very tall peaked gable with carved face
    const ink = path('M-78,90 L-60,30 L-36,-14 L-12,-60 L0,-100 L12,-60 L36,-14 L60,30 L78,90 Z');
    const holes = path('M-20,90 V30 Q0,12 20,30 V90 Z') + row(4, -24, 24, (x, i) => cut(`M${x},-4 V${22 + (i % 2) * 6}`, 1.4)) + circle(0, -30, 7) + cut('M-34,-4 L34,-4 M-48,26 L48,26', 1.5);
    return { vb: V(-84, -108, 168, 205), ink, holes, extra: '' };
  }
  if (kind === 'nanMadol') { // basalt-log ruins: walled islets with a tall enclosure
    let ink = '', holes = '';
    [[-70, 40, 56], [-4, 56, 70], [64, 36, 50]].forEach(([x, h, w]) => { ink += rect(x - w / 2, 80 - h, w, h) + crenelLog(x - w / 2, x + w / 2, 80 - h); for (let y = 80 - h + 8; y < 78; y += 8) holes += cut(`M${x - w / 2 + 2},${y} h${w - 4}`, 1.3); });
    return { vb: V(-110, -18, 220, 112), ink: ink + rect(-108, 80, 216, 8), holes, extra: '' };
  }
  if (kind === 'basotho') { // the Mokorotlo, the conical Basotho hat
    const ink = path('M-84,60 Q-50,50 -20,40 L-10,-48 Q0,-62 10,-48 L20,40 Q50,50 84,60 L84,70 Q0,80 -84,70 Z') + circle(0, -66, 6);
    return { vb: V(-90, -78, 180, 160), ink, holes: row(5, -56, 56, (x) => cut(`M${x * 0.15},-40 L${x},62`, 1.4)) + cut('M-60,56 Q0,66 60,56 M-28,28 Q0,36 28,28 M-14,-2 Q0,4 14,-2', 1.4), extra: '' };
  }
  throw new Error('unknown hut ' + kind);
};
const crenelLog = (x0, x1, y) => Array.from({ length: 4 }, (_, i) => rect(x0 + i * ((x1 - x0) / 3.6), y - 6, (x1 - x0) / 7.2, 6)).join('');

// ---- One-off icons ----
export const icon = (kind) => {
  if (kind === 'taj') {
    let ink = rect(-90, 82, 180, 6) + rect(-70, 74, 140, 8) + rect(-44, 34, 88, 42) + rect(-18, 12, 36, 24) + dome(0, 12, 28, 34) + rect(-2, -34, 4, 14) + circle(0, -36, 3);
    ink += mirror([54], (x) => dome(x, 34, 11, 13) + rect(x - 10, 34, 20, 8)) + mirror([84], (x) => rect(x - 6, -34, 12, 108) + dome(x, -34, 8, 10) + rect(x - 8, -8, 16, 3) + rect(x - 8, 24, 16, 3) + rect(x - 8, 52, 16, 3));
    const holes = archShape(0, 76, 22, 44) + mirror([30], (x) => archShape(x, 76, 11, 24)) + row(2, -10, 10, (x) => archShape(x, 36, 8, 18)).replace('', '') + mirror([52], (x) => archShape(x, 62, 7, 18)) + mirror([84], (x) => archShape(x, 70, 5, 18));
    return { vb: V(-96, -46, 192, 140), ink, holes, extra: '' };
  }
  if (kind === 'angkor') { // Angkor Wat: five lotus-bud towers on stepped terraces
    let ink = rect(-104, 84, 208, 6) + rect(-92, 76, 184, 8) + rect(-80, 66, 160, 10) + rect(-60, 56, 120, 10);
    const tw = (x, h, w) => path(`M${x - w / 2},56 L${x - w / 2},${56 - h * 0.25} Q${x - w / 2 - 1},${56 - h * 0.5} ${x - 4},${56 - h * 0.72} Q${x},${56 - h * 0.9} ${x},${56 - h} Q${x},${56 - h * 0.9} ${x + 4},${56 - h * 0.72} Q${x + w / 2 + 1},${56 - h * 0.5} ${x + w / 2},${56 - h * 0.25} L${x + w / 2},56 Z`);
    ink += tw(0, 100, 36) + mirror([40, 74], (x) => tw(x, Math.abs(x) > 50 ? 56 : 74, 26)).replace('', '');
    ink += mirror([40], (x) => tw(x, 74, 26)) + mirror([74], (x) => tw(x, 52, 22));
    const holes = row(9, -52, 52, (x) => rect(x - 2, 58, 4, 7)) + [30, 12, -6, -24, -44, -64].map((y) => cut(`M-13,${y} h26`, 1.3)).join('') + row(7, -70, 70, (x) => rect(x - 2, 70, 4, 6)) + archShape(0, 66, 14, 10);
    return { vb: V(-110, -52, 220, 148), ink, holes, extra: '' };
  }
  if (kind === 'petra') { // the Treasury carved from the cliff
    const ink = rect(-90, -60, 180, 148) + rect(-100, 86, 200, 6);
    const holes = archShape(0, 88, 30, 52) + mirror([44], (x) => rect(x - 9, 30, 18, 46)) + row(6, -50, 50, (x) => Math.abs(x) < 20 ? '' : rect(x - 2.5, 6, 5, 18)) + path('M-30,26 L30,26 L24,12 L-24,12 Z') + mirror([34], (x) => rect(x - 7, -30, 14, 36)) + row(5, -34, 34, (x) => Math.abs(x) > 28 ? '' : rect(x - 1.5, -28, 3, 20)) + `<path d="M-14,-12 h28 v-14 q0,-18 -14,-18 q-14,0 -14,18 Z"/>`;
    return { vb: V(-100, -66, 200, 164), ink, holes, extra: '' };
  }
  if (kind === 'machu') { // Huayna Picchu behind a terraced citadel
    const ink = poly([[-70, 90], [-44, 16], [-24, -36], [-6, -88], [6, -90], [22, -50], [40, 0], [66, 90]]) + poly([[-114, 90], [-96, 44], [-70, 30], [-70, 90]]) + poly([[114, 90], [98, 50], [70, 38], [70, 90]]) + rect(-114, 56, 228, 34);
    let holes = '';
    for (let i = 0; i < 3; i++) holes += cut(`M${-104 + i * 10},${62 + i * 9} H${104 - i * 10}`, 1.8);
    holes += [[-46, 44], [-22, 40], [2, 44], [26, 40], [50, 44]].map(([x, y]) => poly([[x - 7, y + 9], [x - 7, y + 2], [x, y - 5], [x + 7, y + 2], [x + 7, y + 9]]).replace('<path', '<path')).join('') + cut('M-40,-20 L-48,30 M-4,-60 L-8,20 M20,-30 L30,40', 1.4);
    return { vb: V(-120, -98, 240, 196), ink, holes, extra: '' };
  }
  if (kind === 'opera') { // Sydney Opera House sails
    let ink = rect(-104, 78, 208, 12) + rect(-90, 68, 180, 10);
    const sail = (x, h, w, flip = 1) => path(`M${x},68 Q${x + flip * w * 0.1},${68 - h * 0.8} ${x + flip * w * 0.5},${68 - h} Q${x + flip * w * 0.9},${68 - h * 0.7} ${x + flip * w},68 Z`);
    ink += sail(-86, 60, 46) + sail(-52, 78, 52) + sail(-10, 96, 58) + sail(-80, 36, -34).replace('', '') + sail(86, 60, -46, 1).replace('', '');
    ink += sail(86, 60, -46, 1) + sail(52, 78, -52, 1) + sail(10, 96, -58, 1) + sail(-8, 44, 34) + sail(22, 40, -30, 1);
    const holes = [-34, 6, 44].map((x) => cut(`M${x},62 Q${x + 4},30 ${x + 14},-10`, 1.2)).join('');
    return { vb: V(-110, -36, 220, 130), ink, holes, extra: '' };
  }
  if (kind === 'windmill') { // a Dutch tower mill
    const ink = poly([[-30, 88], [-18, -4], [18, -4], [30, 88]]) + poly([[-22, -4], [0, -34], [22, -4]]) + rect(-40, 86, 80, 6) + rect(-3, -38, 6, 8);
    const blades = [0, 90, 180, 270].map((a) => `<g transform="rotate(${a + 20} 0 -20)"><rect x="-1.8" y="-20" width="3.6" height="78" fill="INK"/><path d="M2,-12 h16 v52 h-16 Z" fill="INK"/></g>`).join('');
    const holes = archShape(0, 88, 12, 22) + rect(-4, 24, 8, 12) + rect(-4, 48, 8, 12);
    return { vb: V(-76, -80, 152, 176), ink, holes, extra: blades + circle(0, -20, 5) };
  }
  if (kind === 'lighthouse') {
    const ink = poly([[-22, 88], [-14, -26], [14, -26], [22, 88]]) + rect(-22, -34, 44, 8) + rect(-14, -56, 28, 22) + path('M-20,-56 L0,-80 L20,-56 Z') + rect(-30, 86, 60, 6) + circle(0, -86, 3);
    const holes = [58, 28, -2].map((y) => rect(-12, y, 24, 7)).join('').replace('', '') + archShape(0, 88, 10, 18) + rect(-8, -50, 16, 12);
    return { vb: V(-36, -94, 72, 190), ink, holes: [58, 28, -2].map((y) => rect(-3, y, 6, 8)).join('') + archShape(0, 88, 10, 18) + rect(-9, -50, 18, 12), extra: '' };
  }
  throw new Error('unknown icon ' + kind);
};
