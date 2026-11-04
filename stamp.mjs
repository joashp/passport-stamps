#!/usr/bin/env node
// Passport stamp tool.
//   node stamp.mjs make FR 2024-05            one stamp
//   node stamp.mjs batch trips.csv            many stamps from a file
//   node stamp.mjs new DE GERMANY navy oval   scaffold a country
//   node stamp.mjs list                       what exists
//   node stamp.mjs validate                   check every country
//   node stamp.mjs serve 3000                 HTTP: /stamp/FR/2024/05.png
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { stampSVG, stampPNG, listCountries, monthLabel, variation } from './render.mjs';

const here = (p) => new URL(p, import.meta.url).pathname;
const palette = JSON.parse(fs.readFileSync(here('./palette.json')));
const args = process.argv.slice(2);
const flag = (k, d) => { const i = args.indexOf(`--${k}`); return i < 0 ? d : args[i + 1]; };
const has = (k) => args.includes(`--${k}`);
const positional = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] ?? '').startsWith('--'));

// "2024-05", "2024 may" or "MAY 2024" -> { month, year }
function parseWhen(...parts) {
  const t = parts.join(' ').replace(/[\/,-]/g, ' ').trim().split(/\s+/);
  const year = t.find((x) => /^\d{4}$/.test(x));
  const month = t.find((x) => x !== year);
  if (!year || !month) throw new Error(`Cannot read a month and year from "${parts.join(' ')}"`);
  return { month: /^\d+$/.test(month) ? +month : month, year: +year };
}

const opts = () => ({
  ...(flag('seed') && { seed: +flag('seed') }),
  ...(flag('rotate') && { rotate: +flag('rotate') }),
  ...(flag('wear') && { wear: +flag('wear') }),
});

async function writeStamp(code, month, year, out, { svg = true, clean = false } = {}) {
  fs.mkdirSync(out, { recursive: true });
  const base = path.join(out, `${code.toUpperCase()}-${year}-${monthLabel(month)}`);
  const o = clean ? { rotate: 0, wear: 0 } : opts();
  fs.writeFileSync(`${base}.png`, await stampPNG(code, month, year, { width: +flag('width', 1000), ...o }));
  if (svg) {
    fs.writeFileSync(`${base}.svg`, await stampSVG(code, month, year, o));
    fs.writeFileSync(`${base}.master.svg`, await stampSVG(code, month, year, { rotate: 0, textured: false }));
  }
  return base;
}

const cmds = {
  async make() {
    const [code, ...when] = positional.slice(1);
    const { month, year } = parseWhen(...when);
    console.log('wrote', await writeStamp(code, month, year, flag('out', 'out')) + '.{png,svg,master.svg}');
  },

  // CSV lines: FR,2024-05   or   FR,MAY,2024   (header line and # comments are ignored)
  async batch() {
    const file = positional[1];
    const rows = file.endsWith('.json')
      ? JSON.parse(fs.readFileSync(file, 'utf8')).map((r) => [r.country, r.month, r.year])
      : fs.readFileSync(file, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && !/^country/i.test(l)).map((l) => l.split(',').map((x) => x.trim()));
    let ok = 0;
    for (const [code, ...when] of rows) {
      try { const { month, year } = parseWhen(...when); await writeStamp(code, month, year, flag('out', 'out'), { svg: has('svg') }); ok++; }
      catch (e) { console.error(`skipped ${code} ${when.join(' ')}: ${e.message}`); }
    }
    console.log(`${ok} of ${rows.length} stamps written to ${flag('out', 'out')}/`);
  },

  async new() {
    const [, code, name, ink, kind = 'circle'] = positional;
    if (!code || !name || !palette[ink]) throw new Error(`usage: new <CODE> <NAME> <ink: ${Object.keys(palette).join('|')}> [circle|box|oval]`);
    const dir = here(`./countries/${code.toLowerCase()}`);
    if (fs.existsSync(dir)) throw new Error(`${dir} already exists`);
    fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/country.json`, JSON.stringify({ code: code.toUpperCase(), name: name.toUpperCase(), ink }) + '\n');
    fs.copyFileSync(here(`./templates/${kind}.mjs`), `${dir}/frame.mjs`);
    fs.copyFileSync(here('./templates/monument.svg'), `${dir}/monument.svg`);
    console.log(`Created countries/${code.toLowerCase()}/. Next: replace monument.svg with the real artwork, adjust frame.mjs if the frame should differ, then run: node stamp.mjs validate`);
  },

  async list() {
    for (const c of listCountries()) {
      const meta = JSON.parse(fs.readFileSync(here(`./countries/${c.toLowerCase()}/country.json`)));
      console.log(`${c}  ${meta.name.padEnd(14)} ${meta.ink}`);
    }
  },

  async validate() {
    let bad = 0;
    for (const c of listCountries()) {
      const dir = here(`./countries/${c.toLowerCase()}`);
      const problems = [];
      for (const f of ['country.json', 'monument.svg']) if (!fs.existsSync(`${dir}/${f}`)) problems.push(`missing ${f}`);
      if (!fs.existsSync(`${dir}/frame.mjs`) && !(fs.existsSync(`${dir}/country.json`) && JSON.parse(fs.readFileSync(`${dir}/country.json`)).frame)) problems.push('needs frame.mjs or a "frame" family in country.json');
      if (!problems.length) {
        const meta = JSON.parse(fs.readFileSync(`${dir}/country.json`));
        const svg = fs.readFileSync(`${dir}/monument.svg`, 'utf8');
        if (!meta.landmark) problems.push('country.json has no landmark (name the monument the stamp draws)');
        if (!palette[meta.ink]) problems.push(`ink "${meta.ink}" is not in palette.json`);
        if (svg.includes('PLACEHOLDER')) problems.push('monument.svg is still the placeholder');
        if (!svg.includes('INK')) problems.push('monument.svg never uses the INK colour');
        if (/<text|<image|gradient/i.test(svg.replace(/<!--[\s\S]*?-->/g, ''))) problems.push('monument.svg has text, an image or a gradient');
        const stray = [...svg.matchAll(/(?:fill|stroke)="(#[0-9a-f]{3,6})"/gi)].map((m) => m[1].toLowerCase()).filter((x) => !['#fff', '#ffffff', '#000', '#000000'].includes(x));
        if (stray.length) problems.push(`monument.svg uses fixed colours (${[...new Set(stray)].join(', ')}), use INK`);
        const warns = [];
        const w = console.warn; console.warn = (...a) => warns.push(a.join(' '));
        try { for (const [m, y] of [['SEP', 2023], ['DEC', 2025], ['MAY', 2024]]) await stampSVG(c, m, y); } catch (e) { problems.push(`render failed: ${e.message}`); }
        console.warn = w;
        problems.push(...new Set(warns));
      }
      console.log(`${problems.length ? 'FAIL' : 'ok  '} ${c}${problems.length ? '\n     ' + problems.join('\n     ') : ''}`);
      bad += problems.length ? 1 : 0;
    }
    process.exitCode = bad ? 1 : 0;
  },

  async serve() {
    const port = +(positional[1] ?? 3000);
    http.createServer(async (req, res) => {
      const m = new URL(req.url, 'http://x').pathname.match(/^\/stamp\/([A-Za-z]{2})\/(\d{4})\/([A-Za-z0-9]+)\.(png|svg)$/);
      if (!m) { res.writeHead(404).end('Use /stamp/FR/2024/05.png'); return; }
      try {
        const [, code, year, month, ext] = m;
        const mo = /^\d+$/.test(month) ? +month : month;
        res.writeHead(200, { 'content-type': ext === 'png' ? 'image/png' : 'image/svg+xml', 'cache-control': 'public, max-age=31536000' });
        res.end(ext === 'png' ? await stampPNG(code, mo, +year) : await stampSVG(code, mo, +year));
      } catch (e) { res.writeHead(400).end(e.message); }
    }).listen(port, () => console.log(`http://localhost:${port}/stamp/FR/2024/05.png`));
  },
};

const cmd = positional[0];
if (!cmds[cmd]) { console.log(fs.readFileSync(here('./stamp.mjs'), 'utf8').split('\n').slice(1, 9).join('\n')); process.exit(cmd ? 1 : 0); }
cmds[cmd]().catch((e) => { console.error(e.message); process.exit(1); });
