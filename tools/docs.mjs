// Regenerates monuments.json and docs/MONUMENTS.md from data/build-report.json.
// The ten countries researched against sources keep their hand-written entries.
import fs from 'node:fs';
const report = JSON.parse(fs.readFileSync('data/build-report.json', 'utf8'));
const old = JSON.parse(fs.readFileSync('monuments.json', 'utf8'));
const verification = JSON.parse(fs.readFileSync('data/verification.json', 'utf8'));
const researched = new Map(old.countries.filter((c) => c.why).map((c) => [c.code, c]));
const KIT_NAMES = { mosque: 'mosque kit', mud: 'mud-brick kit', church: 'church kit', pyramid: 'pyramid kit', ruins: 'ruins kit', buddhist: 'Asian temple kit', fort: 'fort kit', gate: 'gate kit', bridge: 'bridge kit', peak: 'mountain kit', volcano: 'volcano kit', falls: 'waterfall kit', rock: 'rock formation kit', tree: 'tree kit', island: 'island kit', cliff: 'cliff kit', tower: 'tower kit', pillar: 'monument kit', statue: 'statue kit', hut: 'traditional structure kit', icon: 'one-off drawing' };
const countries = report.sort((a, b) => a.code.localeCompare(b.code)).map((r) => {
  if (researched.has(r.code)) return researched.get(r.code);
  const v = verification.entries[r.code];
  return { code: r.code, country: r.name, chosen: r.landmark, where: r.where, confidence: v ? v.status : 'unverified', ...(v && { evidence: v.note, sources: v.sources }), drawing: `${KIT_NAMES[r.kit]} (${r.kind})`, frame: r.frame };
});
const out = {
  note: "Landmark chosen for each stamp. high/medium: checked in the first research pass. supported: a source named it as the country's best known landmark. partly: a source lists it among the main sights. changed: replaced after checking. not confirmed / unverified: chosen from general knowledge and not checked. Many small countries could not be checked because several list sites were blocked by the session's network allowlist. The set is the 193 UN member states plus the Holy See and Palestine.",
  sources: old.sources,
  countries,
};
fs.writeFileSync('monuments.json', JSON.stringify(out, null, 1) + '\n');
const rows = ['# Monuments used on the stamps', '', out.note, '', `${countries.length} countries. Frame is the shape family (hand-built frames are unique to their country).`, '', '| Code | Country | Landmark | Where | Status | Evidence | Drawn with |', '|---|---|---|---|---|---|---|'];
for (const c of countries) rows.push(`| ${c.code} | ${c.country} | ${c.chosen} | ${c.where} | ${c.confidence} | ${c.evidence ?? c.why ?? ''} | ${c.drawing ?? 'hand-drawn'} |`);
rows.push('', '## Sources', '', ...out.sources.map((u) => `- ${u}`));
for (const c of countries) if (c.sources?.length) rows.push(`- ${c.code}: ${c.sources.join(', ')}`);
fs.writeFileSync('docs/MONUMENTS.md', rows.join('\n') + '\n');
const count = (st) => countries.filter((c) => c.confidence === st).length;
console.log(`${countries.length} entries: ${count('supported')} supported, ${count('partly')} partly, ${count('changed')} changed, ${count('not confirmed')} not confirmed, ${count('unverified')} unverified`);
