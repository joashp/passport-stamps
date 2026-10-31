// Library. Use the CLI in stamp.mjs, or import stampSVG / stampPNG from your own code.
//
// Each country is a folder under countries/:
//   country.json   name, ink (a colour name from palette.json)
//   frame.mjs      its own frame shape and text layout
//   monument.svg   its monument, drawn with the placeholder colour INK
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { loadFont } from './lib/text.mjs';
import { inkFilter, paperBackground } from './lib/texture.mjs';

const here = (p) => new URL(p, import.meta.url);
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const font = loadFont(here('./fonts/Oswald-600.woff').pathname);
const palette = JSON.parse(fs.readFileSync(here('./palette.json')));

export function monthLabel(m) {
  if (typeof m === 'number') return MONTHS[m - 1];
  const k = String(m).toUpperCase().slice(0, 3);
  if (!MONTHS.includes(k)) throw new Error(`Unknown month: ${m}`);
  return k;
}

export const listCountries = () =>
  fs.readdirSync(here('./countries').pathname, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name.toUpperCase());

// Same country + month + year always gets the same look, but every stamp differs from the next.
export function variation(code, month, year) {
  let h = 2166136261;
  for (const ch of `${code.toUpperCase()}${monthLabel(month)}${year}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const r = (n) => ((h >>> n) & 255) / 255;
  return { seed: (h % 9000) + 1, rotate: +(r(3) * 14 - 7).toFixed(1), wear: +(0.35 + r(11) * 0.35).toFixed(2) };
}

const cache = {};
async function loadCountry(code) {
  const dir = code.toLowerCase();
  if (!cache[dir]) {
    if (!fs.existsSync(here(`./countries/${dir}/country.json`))) throw new Error(`No country "${code}". Available: ${listCountries().join(', ')}`);
    const meta = JSON.parse(fs.readFileSync(here(`./countries/${dir}/country.json`)));
    const { default: frame } = await import(here(`./countries/${dir}/frame.mjs`));
    const mono = fs.readFileSync(here(`./countries/${dir}/monument.svg`), 'utf8');
    cache[dir] = { meta, frame, monument: mono.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '') };
  }
  return cache[dir];
}

// Stamp artwork in ink. No texture. Size comes from the country's own frame.
async function stampBody(code, month, year) {
  const { meta, frame, monument } = await loadCountry(code);
  const ink = palette[meta.ink] ?? meta.ink;
  const f = frame({ font, name: meta.name, month: monthLabel(month), year: String(year) });
  f.warn.forEach((w) => console.warn(`fit warning (${meta.code}):`, w));
  const body = `${f.art}<g transform="translate(${f.monumentAt.x} ${f.monumentAt.y}) scale(${f.monumentAt.scale ?? 1})">${monument}</g>`;
  return { body: body.replaceAll('INK', ink), width: f.width, height: f.height };
}

// Standalone stamp. textured=false gives the clean master vector.
export async function stampSVG(code, month, year, opts = {}) {
  const v = variation(code, month, year);
  const { seed = v.seed, wear = v.wear, rotate = v.rotate, textured = true, id = 's' } = opts;
  const { body, width: w, height: h } = await stampBody(code, month, year);
  const filter = textured ? inkFilter(`ink-${id}`, { seed, wear }) : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>${filter}</defs>
<g transform="rotate(${rotate} ${w / 2} ${h / 2})"><g${textured ? ` filter="url(#ink-${id})"` : ''}>${body}</g></g>
</svg>`;
}

export function toPNG(svg, width = 1200) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

// A passport page with stamps dropped onto it. scale is relative to the stamp's own units.
export async function pageSVG(w, h, stamps) {
  const defs = [], uses = [];
  for (const [i, s] of stamps.entries()) {
    const { body, width, height } = await stampBody(s.country, s.month, s.year);
    defs.push(inkFilter(`ink-${i}`, { seed: s.seed ?? i * 11 + 1, wear: s.wear ?? 0.5 }));
    uses.push(`<g transform="translate(${s.x} ${s.y}) rotate(${s.rotate ?? 0} ${(width * s.scale) / 2} ${(height * s.scale) / 2}) scale(${s.scale})" opacity="0.9"><g filter="url(#ink-${i})">${body}</g></g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>${defs.join('')}</defs>${paperBackground('paper', w, h)}${uses.join('')}</svg>`;
}


// Transparent PNG, ready to drop onto a passport page.
export async function stampPNG(code, month, year, { width = 1000, ...opts } = {}) {
  return toPNG(await stampSVG(code, month, year, opts), width);
}
