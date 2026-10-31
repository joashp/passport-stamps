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
  const towers = [[-90, -28, 15], [-65, -62, 16], [-39, -92, 17], [-13, -118, 18], [13, -118, 18], [39, -92, 17], [65, -62, 16], [90, -28, 15]];
  let ink = '', holes = '';
  for (const [x, top, w] of towers) {
    const h = w / 2;
    ink += `<path d="M${x - h},72 V${top + 36} C${x - h},${top + 20} ${x - h / 3},${top + 8} ${x},${top} C${x + h / 3},${top + 8} ${x + h},${top + 20} ${x + h},${top + 36} V72 Z" stroke="none"/><circle cx="${x}" cy="${top - 3.5}" r="2.6" stroke="none"/>`;
    for (let y = 60; y > top + 38; y -= 14) holes += `<rect x="${x - 1.4}" y="${y - 9}" width="2.8" height="9" rx="1.2" stroke="none"/>`;
  }
  ink += `<path d="M-112,100 V62 H112 V100 Z" stroke="none"/><rect x="-116" y="58" width="232" height="5" stroke="none"/>`;
  holes += `<path d="M-17,100 V82 A17,17 0 0 1 17,100 Z M-70,100 V88 A9,9 0 0 1 -52,88 V100 Z M52,100 V88 A9,9 0 0 1 70,88 V100 Z" stroke="none"/><circle cx="0" cy="68" r="5" stroke="none"/>`;
  out('es', wrap('es', '-125 -135 250 245', ink, holes));
}

// ---------- China: Great Wall ----------
{
  const pts = [[-112, 56], [-64, 28], [-20, -2], [30, -12], [70, -44], [112, -72]];
  const line = pts.map((p) => p.join(',')).join(' L');
  const towerAt = ([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-16" y="-34" width="32" height="42" stroke="none"/>${[-16, -5.5, 5.5].map((mx) => `<rect x="${mx}" y="-42" width="10.5" height="9" stroke="none"/>`).join('')}</g>`;
  const towerHole = ([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-4.5,8 V-6 A4.5,4.5 0 0 1 4.5,-6 V8 Z" stroke="none"/><rect x="-10" y="-24" width="3" height="8" stroke="none"/><rect x="7" y="-24" width="3" height="8" stroke="none"/></g>`;
  const towers = [pts[1], pts[3], pts[5]];
  let courses = '';
  for (const dy of [-4, 3, 10]) courses += `<path d="M${pts.map(([x, y]) => `${x},${y + dy}`).join(' L')}" fill="none" stroke-width="1.5"/>`;
  const ink = `<path d="M${line}" fill="none" stroke-width="26" stroke-linejoin="miter"/>
<path d="M${pts.map(([x, y]) => `${x},${y - 17}`).join(' L')}" fill="none" stroke-width="7" stroke-dasharray="8 6"/>${towers.map(towerAt).join('')}`;
  out('cn', wrap('cn', '-130 -120 260 200', ink, courses + towers.map(towerHole).join('')));
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
  let ink = `<rect x="-104" y="94" width="208" height="6" stroke="none"/><rect x="-96" y="88" width="192" height="6" stroke="none"/>
<rect x="-98" y="-6" width="196" height="16" stroke="none"/><rect x="-86" y="-30" width="172" height="24" stroke="none"/><rect x="-90" y="-33" width="180" height="4" stroke="none"/>`;
  for (const x of [-70, -42, -14, 14, 42, 70]) ink += `<rect x="${x - 5.5}" y="14" width="11" height="74" stroke="none"/><rect x="${x - 8}" y="10" width="16" height="4.5" stroke="none"/><rect x="${x - 8}" y="85" width="16" height="3.5" stroke="none"/>`;
  ink += `<rect x="-30" y="-40" width="60" height="8" stroke="none"/>`;
  for (const x of [-36, -12, 12, 36]) ink += `<path d="M${x - 5},-40 C${x - 5},-58 ${x - 3},-68 ${x + 3},-70 L${x + 9},-66 L${x + 5},-62 C${x + 4},-54 ${x + 5},-46 ${x + 5},-40 Z" stroke="none"/>`;
  ink += `<rect x="-5" y="-66" width="10" height="28" stroke="none"/><circle cx="0" cy="-72" r="4.4" stroke="none"/><path d="M0,-76 V-98" fill="none" stroke-width="1.8"/><circle cx="0" cy="-102" r="6" fill="none" stroke-width="2"/>`;
  let holes = '';
  for (let x = -70; x <= 70; x += 28) holes += `<rect x="${x - 0.8}" y="18" width="1.6" height="66" stroke="none"/>`;
  for (const x of [-64, -32, 0, 32, 64]) holes += `<rect x="${x - 10}" y="-26" width="20" height="14" stroke="none"/>`;
  out('de', wrap('de', '-115 -112 230 220', ink, holes));
}
