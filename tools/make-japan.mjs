// Draws countries/jp/monument.svg. Origin is the middle of the scene; ground is y = +110.
import fs from 'node:fs';
const G = 110;
const torii = `
<path d="M-120,-128 Q-60,-104 0,-104 Q60,-104 120,-128 L114,-110 Q60,-92 0,-92 Q-60,-92 -114,-110 Z"/>
<path d="M-102,-94 L102,-94 L98,-85 L-98,-85 Z"/>
<rect x="-84" y="-62" width="168" height="11"/>
<rect x="-6" y="-85" width="12" height="24"/>
<path d="M-64,-85 L-46,-85 L-42,${G} L-68,${G} Z"/><path d="M46,-85 L64,-85 L68,${G} L42,${G} Z"/>
<rect x="-73" y="${G - 7}" width="36" height="7"/><rect x="37" y="${G - 7}" width="36" height="7"/>`;
const mountain = `M-195,${G} Q-90,80 -12,-42 Q0,-48 12,-42 Q90,80 195,${G} Z
M-20,-12 L-13,-6 L-6,-14 L0,-4 L6,-14 L13,-6 L20,-12 L14,-24 Q0,-30 -14,-24 Z`;
fs.writeFileSync('countries/jp/monument.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -140 400 260">
<defs><mask id="jp-gap" maskUnits="userSpaceOnUse" x="-200" y="-150" width="400" height="270">
<rect x="-200" y="-150" width="400" height="270" fill="#fff"/><g fill="#000" stroke="#000" stroke-width="9" stroke-linejoin="round">${torii}</g></mask></defs>
<g fill="INK">
<path d="${mountain}" fill-rule="evenodd" mask="url(#jp-gap)"/>
${torii}
</g></svg>`);
console.log('wrote countries/jp/monument.svg');
