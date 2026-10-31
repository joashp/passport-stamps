import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
const codes = process.argv.slice(2);
const cells = codes.map((c, i) => {
  const svg = fs.readFileSync(`countries/${c}/monument.svg`, 'utf8').replaceAll('INK', '#2a2a2a');
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const s = 280 / Math.max(vb[2], vb[3]);
  return `<g transform="translate(${(i % 4) * 320 + 160} ${Math.floor(i / 4) * 320 + 160}) scale(${s})">${inner}</g>`;
}).join('');
const w = 1280, h = Math.ceil(codes.length / 4) * 320;
fs.writeFileSync('/tmp/claude-0/-home-user/6b6f2e3a-3455-5f27-ad44-f3d3da2af44c/scratchpad/mon.png',
  new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#f1e8d3"/>${cells}</svg>`).render().asPng());
