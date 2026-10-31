// Lay every stamp from a CSV on one passport-style page.
import fs from 'node:fs';
import { pageSVG, toPNG, monthLabel } from '../render.mjs';
const rows = fs.readFileSync(process.argv[2], 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const stamps = rows.map((r, i) => {
  const [code, when] = r.split(',').map((x) => x.trim());
  const [year, month] = when.split('-');
  const col = i % 5, row = Math.floor(i / 5);
  return { country: code, month: +month, year: +year, x: 20 + col * 335, y: 30 + row * 400, scale: 0.66, rotate: ((i * 37) % 11) - 5, seed: i * 13 + 3, wear: 0.5 };
});
fs.writeFileSync(process.argv[3], toPNG(await pageSVG(1700, 860, stamps), 2200));
