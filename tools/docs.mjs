// Regenerates monuments.json and docs/MONUMENTS.md from data/build-report.json.
// The ten countries researched against sources keep their hand-written entries.
import fs from 'node:fs';
const report = JSON.parse(fs.readFileSync('data/build-report.json', 'utf8'));
const old = JSON.parse(fs.readFileSync('monuments.json', 'utf8'));
const researched = new Map(old.countries.filter((c) => c.why).map((c) => [c.code, c]));
const KIT_NAMES = { mosque: 'mosque kit', mud: 'mud-brick kit', church: 'church kit', pyramid: 'pyramid kit', ruins: 'ruins kit', buddhist: 'Asian temple kit', fort: 'fort kit', gate: 'gate kit', bridge: 'bridge kit', peak: 'mountain kit', volcano: 'volcano kit', falls: 'waterfall kit', rock: 'rock formation kit', tree: 'tree kit', island: 'island kit', cliff: 'cliff kit', tower: 'tower kit', pillar: 'monument kit', statue: 'statue kit', hut: 'traditional structure kit', icon: 'one-off drawing' };
const countries = report.sort((a, b) => a.code.localeCompare(b.code)).map((r) => researched.get(r.code) ?? { code: r.code, country: r.name, chosen: r.landmark, where: r.where, confidence: 'unverified', drawing: `${KIT_NAMES[r.kit]} (${r.kind})`, frame: r.frame });
const out = {
  note: "Landmark chosen for each stamp. 'confidence: high/medium' entries were checked against the sources listed. 'unverified' entries were chosen from general knowledge of each country's best known landmark and have NOT been checked individually. Review them and tell us which to swap. The set is the 193 UN member states plus the Holy See and Palestine.",
  sources: old.sources,
  countries,
};
fs.writeFileSync('monuments.json', JSON.stringify(out, null, 1) + '\n');
const rows = ['# Monuments used on the stamps', '', out.note, '', `${countries.length} countries. Frame is the shape family (hand-built frames are unique to their country).`, '', '| Code | Country | Landmark | Where | Confidence | Drawn with | Frame |', '|---|---|---|---|---|---|---|'];
for (const c of countries) rows.push(`| ${c.code} | ${c.country} | ${c.chosen} | ${c.where} | ${c.confidence} | ${c.drawing ?? 'hand-drawn'} | ${c.frame ?? 'hand-built'} |`);
rows.push('', '## Sources for the researched entries', '', ...out.sources.map((u) => `- ${u}`));
fs.writeFileSync('docs/MONUMENTS.md', rows.join('\n') + '\n');
const un = countries.filter((c) => c.confidence === 'unverified').length;
console.log(`${countries.length} entries, ${un} unverified`);
