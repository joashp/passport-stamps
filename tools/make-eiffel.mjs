// One-off generator for monuments/eiffel.svg. In your real workflow this file is
// drawn in Figma/Illustrator; the renderer only ever reads the finished SVG.
import fs from 'node:fs';

const Y0 = -100, Y1 = 98;               // spire tip, ground (relative to stamp centre)
const T = (y) => (y - Y0) / (Y1 - Y0);
const half = (y) => 2 + 52 * Math.pow(T(y), 2.4);
const plat = [0.15, 0.62, 0.83].map((t) => Y0 + t * (Y1 - Y0));   // third, second, first platform
const f = (n) => n.toFixed(2);

const edge = (sign) => {
  const pts = [];
  for (let i = 0; i <= 60; i++) { const y = Y0 + (i / 60) * (Y1 - Y0); pts.push(`${f(sign * half(y))},${f(y)}`); }
  return 'M' + pts.join(' L');
};

let lattice = '';
const panels = (ya, yb, n) => {
  for (let i = 0; i < n; i++) {
    const a = ya + ((yb - ya) * i) / n, b = ya + ((yb - ya) * (i + 1)) / n;
    lattice += `M${f(-half(a))},${f(a)} L${f(half(b))},${f(b)} M${f(half(a))},${f(a)} L${f(-half(b))},${f(b)} M${f(-half(b))},${f(b)} H${f(half(b))} `;
  }
};
panels(plat[0], plat[1], 9);
panels(plat[1], plat[2], 4);
panels(plat[2], Y1, 3);

const spire = `M${f(-half(plat[0]))},${f(plat[0])} L-1,${f(Y0 - 8)} L1,${f(Y0 - 8)} L${f(half(plat[0]))},${f(plat[0])} Z`;
const rect = (y, hw, th) => `<rect x="${f(-hw)}" y="${f(y - th / 2)}" width="${f(hw * 2)}" height="${th}"/>`;
const arc = 'M-39,98 C-39,84 -20,75 0,75 C20,75 39,84 39,98 Z';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240">
<!-- INK is swapped for the stamp colour at render time. Origin = centre of the stamp. -->
<defs><clipPath id="tower-clip"><path clip-rule="evenodd" d="M-120,${f(plat[2] - 2)} H120 V120 H-120 Z ${arc}"/></clipPath>
<clipPath id="tower-clip-top"><rect x="-120" y="-120" width="240" height="${f(plat[2] + 120 - 2)}"/></clipPath></defs>
<g fill="INK" stroke="INK" stroke-linejoin="round" stroke-linecap="round">
  <path d="${spire}" stroke="none"/>
  <g fill="none">
    <path d="${edge(1)}" stroke-width="2.4"/><path d="${edge(-1)}" stroke-width="2.4"/>
    <g clip-path="url(#tower-clip-top)"><path d="${lattice}" stroke-width="1.15"/></g>
    <g clip-path="url(#tower-clip)"><path d="${lattice}" stroke-width="1.15"/></g>
    <path d="${arc}" stroke-width="2.2"/>
  </g>
  <g stroke="none">${rect(plat[0], half(plat[0]) + 4, 3)}${rect(plat[1], half(plat[1]) + 5, 4)}${rect(plat[2], half(plat[2]) + 6, 5)}${rect(Y1 - 1.5, 61, 3)}</g>
</g></svg>`;
fs.writeFileSync('countries/fr/monument.svg', svg);
console.log('wrote countries/fr/monument.svg');
