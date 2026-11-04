// Builds countries/<code>/ for every entry in data/countries.mjs that is not hand-built.
// Run again whenever the data or the kits change.
import fs from 'node:fs';
import { COUNTRIES } from '../data/countries.mjs';
import { toSVG } from '../lib/kits/draw.mjs';
import * as religious from '../lib/kits/religious.mjs';
import * as built from '../lib/kits/built.mjs';
import * as nature from '../lib/kits/nature.mjs';
import * as icons from '../lib/kits/icons.mjs';
import { Resvg } from '@resvg/resvg-js';
import { isWide, isTall } from '../lib/families.mjs';

// Shrink each monument's viewBox to its real content (plus a small margin) so frames can size it properly.
function tighten(code, k) {
  const probe = toSVG(code, k).replaceAll('INK', '#222');
  const b = new Resvg(probe).getBBox();
  if (!b || !(b.width > 0)) return k;
  const m = 5, r = (n) => +n.toFixed(1);
  return { ...k, vb: [r(b.x - m), r(b.y - m), r(b.width + 2 * m), r(b.height + 2 * m)] };
}

const KITS = { mosque: religious.mosque, mud: religious.mud, church: religious.church, pyramid: built.pyramid, ruins: built.ruins, buddhist: built.buddhist, fort: built.fort, gate: built.gate, bridge: built.bridge, peak: nature.peak, volcano: nature.volcano, falls: nature.falls, rock: nature.rock, tree: nature.tree, island: nature.island, cliff: nature.cliff, tower: icons.tower, pillar: icons.pillar, statue: icons.statue, hut: icons.hut, icon: icons.icon };
const INKS = ['navy', 'crimson', 'maroon', 'purple', 'green'];
const POOLS = {
  wide: ['notch', 'hexWide', 'banner', 'pill', 'stepWide', 'boxWide'],
  tall: ['shield', 'octTall', 'ogee', 'roundArch', 'boxTall', 'house', 'stepTall', 'hexTall', 'heater'],
  narrow: ['stepTall', 'octTall', 'roundArch', 'boxTall'],
  square: ['circle', 'scallop', 'seal', 'roundSquare', 'octSquare', 'heater', 'boxTall', 'notch'],
};
const used = { wide: 0, tall: 0, square: 0, narrow: 0 };
const roomy = new Set(['circle', 'scallop', 'seal', 'pill', 'hexWide', 'hexTall']);

const only = process.argv[2]?.split(',');
const report = [];
COUNTRIES.forEach(([code, name, landmark, where, kit, kind, params], i) => {
  const dir = `countries/${code.toLowerCase()}`;
  if (kit === 'custom') {
    const meta = JSON.parse(fs.readFileSync(`${dir}/country.json`));
    report.push({ code, name, landmark, where, kit: 'custom', kind: 'hand-built', frame: 'hand-built' });
    return;
  }
  if (only && !only.includes(code)) { return; }
  const k = tighten(code.toLowerCase(), KITS[kit](kind, params));
  const [, , w, h] = k.vb, r = w / h;
  const pool = r > 1.45 ? 'wide' : r < 0.55 ? 'narrow' : r < 0.82 ? 'tall' : 'square';
  let family, tries = 0;
  do { family = POOLS[pool][used[pool]++ % POOLS[pool].length]; tries++; } while (name.length > 16 && roomy.has(family) && tries < 12);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/monument.svg`, toSVG(code.toLowerCase(), k));
  fs.writeFileSync(`${dir}/country.json`, JSON.stringify({ code, name, ink: INKS[i % 5], landmark, frame: family }) + '\n');
  report.push({ code, name, landmark, where, kit, kind, frame: family });
});
if (!only) fs.writeFileSync('data/build-report.json', JSON.stringify(report, null, 1));
console.log(`built ${report.filter((r) => r.kit !== 'custom').length} countries`);
