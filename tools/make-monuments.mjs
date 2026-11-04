// Generates monument.svg for each country below. In production you would draw these by hand;
// these are clean first versions. Origin (0,0) is the middle of the artwork. INK is the stamp colour.
import fs from 'node:fs';

const f = (n) => +n.toFixed(2);
const wrap = (code, vb, ink, holes = '', extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">
<defs><mask id="${code}-m" maskUnits="userSpaceOnUse" x="-200" y="-200" width="400" height="400"><rect x="-200" y="-200" width="400" height="400" fill="#fff"/><g fill="#000" stroke="#000" stroke-linecap="round" stroke-linejoin="round">${holes}</g></mask></defs>
<g fill="INK" stroke="INK" stroke-linejoin="round"><g mask="url(#${code}-m)">${ink}</g>${extra}</g></svg>`;
const out = (dir, svg) => { fs.mkdirSync(`countries/${dir}`, { recursive: true }); fs.writeFileSync(`countries/${dir}/monument.svg`, svg); console.log('wrote', dir); };

// ---------- United States: Statue of Liberty ----------
{
  let crown = '';
  for (let k = -3; k <= 3; k++) {
    const a = (k * 24 * Math.PI) / 180, s = Math.sin(a), c = Math.cos(a), px = 0, py = -50;
    const bx = px + 8 * s, by = py - 8 * c, tx = px + 30 * s, ty = py - 30 * c, nx = c * 3.6, ny = s * 3.6;
    crown += `<path d="M${f(bx - nx)},${f(by + ny)} L${f(tx)},${f(ty)} L${f(bx + nx)},${f(by - ny)} Z" stroke="none"/>`;
  }
  const ink = `
<path d="M-58,115 V100 H-50 V88 H-40 L-34,56 H34 L40,88 H50 V100 H58 V115 Z" stroke="none"/>
<path d="M-34,56 C-40,30 -38,6 -30,-12 L-20,-28 L-10,-36 H10 L18,-30 C30,-18 36,10 34,56 Z" stroke="none"/>
<path d="M-14,-26 Q-26,-46 -33,-90" fill="none" stroke-width="11" stroke-linecap="round"/>
<path d="M-47,-103 H-23 L-28,-93 H-42 Z" stroke="none"/>
<path d="M-35,-134 C-23,-120 -26,-110 -35,-105 C-44,-110 -47,-120 -35,-134 Z" stroke="none"/>
<circle cx="0" cy="-50" r="10.5" stroke="none"/>${crown}`;
  const holes = `<path d="M-18,-2 C-20,20 -22,40 -24,56 M-6,-8 C-6,20 -6,40 -6,56 M8,-6 C8,20 10,40 12,56" fill="none" stroke-width="2.4"/>
<g transform="rotate(10 31 -3)"><rect x="19" y="-22" width="24" height="36" rx="2" fill="#000" stroke-width="5"/></g>`;
  const tablet = `<g transform="rotate(10 31 -3)"><rect x="19" y="-22" width="24" height="36" rx="2" stroke="none"/></g>`;
  out('us', wrap('us', '-80 -140 160 260', ink, holes, tablet));
}

// ---------- Spain: Sagrada Familia ----------
{
  // Nine spires: the tall central Tower of Jesus Christ (with its cross) and four stepped-down spires either side.
  const towers = [[-90, -30, 14], [-69, -58, 15], [-47, -86, 16], [-24, -112, 17], [0, -150, 24], [24, -112, 17], [47, -86, 16], [69, -58, 15], [90, -30, 14]];
  let ink = '', holes = '';
  for (const [x, top, w] of towers) {
    const h = w / 2;
    ink += `<path d="M${x - h},72 V${top + 36} C${x - h},${top + 20} ${x - h / 3},${top + 8} ${x},${top} C${x + h / 3},${top + 8} ${x + h},${top + 20} ${x + h},${top + 36} V72 Z" stroke="none"/>`;
    ink += `<circle cx="${x}" cy="${top - 4}" r="${x === 0 ? 4 : 3}" stroke="none"/>`;
    for (let y = 60; y > top + 40; y -= 13) holes += `<rect x="${x - 1.4}" y="${y - 9}" width="2.8" height="9" rx="1.2" stroke="none"/>`;
    if (x === 0) for (let y = top + 38; y < 56; y += 26) holes += `<rect x="-9" y="${y}" width="18" height="2" stroke="none"/>`;
  }
  ink += `<path d="M0,-176 V-152 M-7,-168 H7" fill="none" stroke-width="2.6" stroke-linecap="round"/>`;
  ink += `<path d="M-112,100 V62 H112 V100 Z" stroke="none"/><rect x="-116" y="58" width="232" height="5" stroke="none"/>`;
  holes += `<path d="M-17,100 V82 A17,17 0 0 1 17,100 Z M-70,100 V88 A9,9 0 0 1 -52,88 V100 Z M52,100 V88 A9,9 0 0 1 70,88 V100 Z" stroke="none"/><circle cx="0" cy="68" r="5" stroke="none"/>`;
  out('es', wrap('es', '-125 -180 250 290', ink, holes));
}

// ---------- China: Great Wall ----------
{
  // The wall climbing a ridge: crenellated walkway, banded masonry and three watchtowers.
  const P = [[-136, 46], [-106, 26], [-76, -8], [-46, -14], [-18, 14], [8, 38], [34, 26], [58, -10], [84, -40], [110, -46], [136, -26]];
  const H = 34;
  const body = `M${P.map(([x, y]) => `${x},${y}`).join(' L')} L${[...P].reverse().map(([x, y]) => `${x},${y + H}`).join(' L')} Z`;
  let merlons = '';
  for (let i = 0; i < P.length - 1; i++) {
    const [x0, y0] = P[i], [x1, y1] = P[i + 1], len = Math.hypot(x1 - x0, y1 - y0), ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI, n = Math.max(1, Math.floor(len / 10));
    for (let k = 0; k < n; k++) { const t = (k + 0.5) / n; merlons += `<rect transform="translate(${f(x0 + (x1 - x0) * t)} ${f(y0 + (y1 - y0) * t)}) rotate(${f(ang)})" x="-3.2" y="-8" width="6.4" height="9" stroke="none"/>`; }
  }
  const tower = ([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-18" y="-46" width="36" height="${46 + H}" stroke="none"/><rect x="-21" y="-50" width="42" height="5" stroke="none"/>${[-18, -6, 6].map((mx) => `<rect x="${mx}" y="-58" width="12" height="9" stroke="none"/>`).join('')}</g>`;
  const towerHoles = ([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-5,${H} V${H - 12} A5,5 0 0 1 5,${H - 12} V${H} Z" stroke="none"/><path d="M-11,-30 v10 a3,3 0 0 0 6,0 v-10 a3,3 0 0 0 -6,0 Z M5,-30 v10 a3,3 0 0 0 6,0 v-10 a3,3 0 0 0 -6,0 Z" stroke="none"/></g>`;
  const towers = [P[2], P[5], P[8]];
  let courses = '';
  for (const dy of [9, 17, 25]) courses += `<path d="M${P.map(([x, y]) => `${x},${y + dy}`).join(' L')}" fill="none" stroke-width="1.5"/>`;
  const ink = `<path d="${body}" stroke="none"/>${merlons}${towers.map(tower).join('')}`;
  out('cn', wrap('cn', '-150 -112 300 196', ink, courses + towers.map(towerHoles).join('')));
}

// ---------- Turkey: Hagia Sophia ----------
{
  const minaret = (x, top) => `<g transform="translate(${x} 0)"><rect x="-3.5" y="${top + 16}" width="7" height="${100 - top - 16}" stroke="none"/><rect x="-6.5" y="${top + 22}" width="13" height="3.4" stroke="none"/><path d="M-4,${top + 16} L0,${top - 4} L4,${top + 16} Z" stroke="none"/><rect x="-0.6" y="${top - 14}" width="1.2" height="12" stroke="none"/></g>`;
  let ink = `
<path d="M-40,0 A40,40 0 0 1 40,0 Z" stroke="none"/><rect x="-40" y="0" width="80" height="24" stroke="none"/>
<path d="M-90,34 A31,31 0 0 1 -28,34 Z" stroke="none"/><path d="M28,34 A31,31 0 0 1 90,34 Z" stroke="none"/>
<rect x="-90" y="34" width="180" height="66" stroke="none"/><rect x="-44" y="24" width="88" height="10" stroke="none"/>
<rect x="-0.7" y="-52" width="1.4" height="14" stroke="none"/><circle cx="0" cy="-55" r="2.6" stroke="none"/>
${minaret(-100, -66)}${minaret(100, -66)}${minaret(-62, -30)}${minaret(62, -30)}`;
  let holes = '';
  for (let x = -30; x <= 30; x += 10) holes += `<path d="M${x - 2.6},21 V12 A2.6,2.6 0 0 1 ${x + 2.6},12 V21 Z" stroke="none"/>`;
  for (let x = -78; x <= 78; x += 13) { if (Math.abs(x) < 6) continue; holes += `<path d="M${x - 3},60 V50 A3,3 0 0 1 ${x + 3},50 V60 Z M${x - 3},88 V73 A3,3 0 0 1 ${x + 3},73 V88 Z" stroke="none"/>`; }
  holes += `<path d="M-9,100 V80 A9,9 0 0 1 9,100 Z" stroke="none"/>`;
  out('tr', wrap('tr', '-130 -75 260 180', ink, holes));
}

// ---------- Mexico: Chichen Itza ----------
{
  let ink = '', holes = '';
  for (let i = 0; i < 9; i++) ink += `<rect x="${-(190 - i * 14) / 2}" y="${100 - 11 * (i + 1)}" width="${190 - i * 14}" height="11" stroke="none"/>`;
  ink += `<rect x="-20" y="-23" width="40" height="24" stroke="none"/><rect x="-25" y="-29" width="50" height="6" stroke="none"/><rect x="-14" y="-33" width="28" height="4" stroke="none"/>`;
  holes += `<rect x="-6" y="-12" width="12" height="13" stroke="none"/>`;
  for (let k = 0; k < 20; k++) holes += `<rect x="-18" y="${4 + k * 4.8}" width="36" height="1.3" stroke="none"/>`;
  for (let i = 1; i < 9; i++) holes += `<rect x="${-(190 - i * 14) / 2 + 3}" y="${100 - 11 * i - 0.9}" width="${190 - i * 14 - 6}" height="1.3" stroke="none"/>`;
  holes += `<rect x="-20.6" y="1" width="2.2" height="99" stroke="none"/><rect x="18.4" y="1" width="2.2" height="99" stroke="none"/>`;
  out('mx', wrap('mx', '-100 -40 200 150', ink, holes));
}

// ---------- United Kingdom: Elizabeth Tower (Big Ben) ----------
{
  let ink = `
<path d="M-14,-92 L0,-114 L14,-92 Z" stroke="none"/><rect x="-0.8" y="-128" width="1.6" height="16" stroke="none"/><circle cx="0" cy="-130" r="2.2" stroke="none"/>
<rect x="-20" y="-92" width="40" height="32" stroke="none"/>
<rect x="-30" y="-62" width="60" height="5" stroke="none"/>
<rect x="-27" y="-58" width="54" height="52" stroke="none"/>
<rect x="-31" y="-10" width="62" height="5" stroke="none"/>
<rect x="-21" y="-6" width="42" height="94" stroke="none"/>
<rect x="-27" y="84" width="54" height="31" stroke="none"/><rect x="-31" y="108" width="62" height="7" stroke="none"/>
${[-25, 25].map((x) => `<path d="M${x - 4},-62 L${x},-80 L${x + 4},-62 Z" stroke="none"/>`).join('')}
${[-23, 23].map((x) => `<path d="M${x - 4},-92 L${x},-104 L${x + 4},-92 Z" stroke="none"/>`).join('')}`;
  let holes = `<circle cx="0" cy="-32" r="19" stroke="none"/>`;
  for (const x of [-11, 0, 11]) holes += `<path d="M${x - 3},-62 V-76 A3,3 0 0 1 ${x + 3},-76 V-62 Z" stroke="none"/>`;
  for (let y = 4; y < 80; y += 22) for (const x of [-9, 0, 9]) holes += `<rect x="${x - 2.4}" y="${y}" width="4.8" height="15" rx="2.4" stroke="none"/>`;
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; ticks += `<path d="M${f(14 * Math.sin(a))},${f(-32 - 14 * Math.cos(a))} L${f(17 * Math.sin(a))},${f(-32 - 17 * Math.cos(a))}" stroke-width="1.6" fill="none"/>`; }
  const face = `<circle cx="0" cy="-32" r="19" fill="none" stroke-width="2.4"/>${ticks}<path d="M0,-32 V-45 M0,-32 L8,-27" fill="none" stroke-width="2.2" stroke-linecap="round"/>`;
  out('gb', wrap('gb', '-45 -135 90 255', ink, holes, face));
}

// ---------- Germany: Brandenburg Gate ----------
{
  // Six Doric columns, the wide central passage, the attic, and Victoria's quadriga with her wreath staff.
  const cols = [-80, -50, -18, 18, 50, 80];
  let ink = `<rect x="-104" y="92" width="208" height="6" stroke="none"/><rect x="-98" y="86" width="196" height="6" stroke="none"/>
<rect x="-98" y="2" width="196" height="12" stroke="none"/><rect x="-102" y="-4" width="204" height="6" stroke="none"/><rect x="-94" y="-24" width="188" height="20" stroke="none"/><rect x="-98" y="-27" width="196" height="4" stroke="none"/>`;
  for (const x of cols) ink += `<rect x="${x - 6}" y="14" width="12" height="72" stroke="none"/><rect x="${x - 8.5}" y="10" width="17" height="5" stroke="none"/><rect x="${x - 8.5}" y="83" width="17" height="4" stroke="none"/>`;
  let holes = '';
  for (let x = -90; x <= 90; x += 7.5) holes += `<rect x="${x - 1.2}" y="4" width="2.4" height="8" stroke="none"/>`;
  for (const x of cols) for (let k = -3; k <= 3; k += 2) holes += `<rect x="${x + k - 0.5}" y="18" width="1" height="62" stroke="none"/>`;
  for (const x of [-68, -34, 0, 34, 68]) holes += `<rect x="${x - 11}" y="-20" width="22" height="12" stroke="none"/>`;
  const horse = (dx) => `<g transform="translate(${dx} -28)"><ellipse cx="0" cy="-17" rx="15" ry="7.5" stroke="none"/><path d="M6,-20 C11,-30 12,-36 16,-40 L22,-38 L28,-35 L28,-31 L21,-32 C19,-27 18,-22 15,-16 Z" stroke="none"/><path d="M16,-40 L17,-46 L21,-39 Z" stroke="none"/><path d="M8,-12 L17,-7 L21,-10" fill="none" stroke-width="3.4"/><path d="M-10,-12 L-13,-1 M-5,-12 L-3,-1" fill="none" stroke-width="3.6"/><path d="M-14,-20 C-22,-18 -23,-10 -21,-3" fill="none" stroke-width="2.6"/></g>`;
  ink += `<rect x="-38" y="-33" width="76" height="6" stroke="none"/>${[-4, 5, 14, 23].map(horse).join('')}`;
  ink += `<path d="M-36,-52 H-14 L-17,-37 H-34 Z" stroke="none"/><circle cx="-26" cy="-39" r="7.5" fill="none" stroke-width="2.4"/><path d="M-26,-46.5 V-31.5 M-33.5,-39 H-18.5" fill="none" stroke-width="1.2"/>`;
  ink += `<path d="M-30,-52 L-27,-76 H-21 L-19,-52 Z" stroke="none"/><circle cx="-24" cy="-80" r="3.8" stroke="none"/><path d="M-20,-72 L-16,-98" fill="none" stroke-width="1.8"/><circle cx="-15.5" cy="-103" r="5.5" fill="none" stroke-width="2"/>`;
  out('de', wrap('de', '-115 -112 230 216', ink, holes));
}
