// node tools/atlas.mjs <page> [perPage]   -> writes out/atlas-<page>.png (labelled contact sheet)
import fs from 'node:fs';
import { pageSVG, toPNG } from '../render.mjs';
import { COUNTRIES } from '../data/countries.mjs';
import { loadFont, lineText } from '../lib/text.mjs';

const arg = process.argv[2] ?? '0', byCodes = /[A-Z]/.test(arg), page = byCodes ? 0 : +arg, per = +(process.argv[3] ?? 20), cols = +(process.argv[4] ?? 5), sc = +(process.argv[5] ?? 0.52);
const font = loadFont(new URL('../fonts/Oswald-600.woff', import.meta.url).pathname);
const all = [...COUNTRIES].sort((a, b) => a[0].localeCompare(b[0]));
const list = byCodes ? arg.split(',').map((c) => all.find((x) => x[0] === c)) : all.slice(page * per, page * per + per);
const cw = Math.round(1500 / cols), ch = Math.round(cw * 1.03), W = cols * cw, H = Math.ceil(list.length / cols) * ch;
const stamps = list.map(([code], i) => ({ country: code, month: (i % 12) + 1, year: 2024, x: (i % cols) * cw + 10, y: Math.floor(i / cols) * ch + 6, scale: sc * (cw / 300), rotate: 0, seed: i * 7 + 2, wear: 0.4 }));
let svg = await pageSVG(W, H, stamps);
const labels = list.map(([code, name, landmark], i) => `<g fill="#222">${lineText(font, `${code}  ${landmark}`, { cx: (i % cols) * cw + cw / 2, y: Math.floor(i / cols) * ch + ch - 8, cap: 8, spacing: 0.04 })}</g>`).join('');
svg = svg.replace('</svg>', labels + '</svg>');
fs.mkdirSync('out', { recursive: true });
fs.writeFileSync(byCodes ? 'out/atlas-check.png' : `out/atlas-${page}.png`, toPNG(svg, 2000));
console.log(list.map((x) => x[0]).join(' '));
