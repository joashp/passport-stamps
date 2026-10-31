import fs from 'node:fs';
import { pageSVG, toPNG } from '../render.mjs';

const page = await pageSVG(1100, 760, [
  { country: 'FR', month: 'MAY', year: 2024, x: 40,  y: 50,  scale: 0.8,  rotate: -7, seed: 7,  wear: 0.5 },
  { country: 'JP', month: 10,    year: 2023, x: 400, y: 30,  scale: 0.72, rotate: 6,  seed: 21, wear: 0.6 },
  { country: 'IT', month: 'sep', year: 2023, x: 690, y: 90,  scale: 0.66, rotate: -3, seed: 33, wear: 0.4 },
  { country: 'IT', month: 'dec', year: 2025, x: 60,  y: 440, scale: 0.6,  rotate: 5,  seed: 44, wear: 0.7 },
  { country: 'FR', month: 'jan', year: 2026, x: 700, y: 410, scale: 0.7,  rotate: -9, seed: 52, wear: 0.3 },
]);
fs.writeFileSync('out/passport-preview.svg', page);
fs.writeFileSync('out/passport-preview.png', toPNG(page, 1700));
