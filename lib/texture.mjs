// Ink distress filter. Applied at render time so every stamp gets its own wear.
// wear: 0 (fresh ink) .. 1 (tired stamp). seed: any integer.
export function inkFilter(id, { seed = 1, wear = 0.5 } = {}) {
  const thr = 0.74 - 0.12 * wear;           // speckle threshold on the fine noise
  const B = (24 * thr + 0.5).toFixed(3);
  return `<filter id="${id}" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}" result="warp"/>
  <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="wobble"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed + 1}" result="grain"/>
  <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -24 0 0 0 ${B}" result="speckle"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="${seed + 2}" result="blot"/>
  <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 0 0 0 ${(1.4 + 0.15 * (1 - wear)).toFixed(2)}" result="patch"/>
  <feComposite in="wobble" in2="speckle" operator="in" result="a"/>
  <feComposite in="a" in2="patch" operator="in"/>
</filter>`;
}

export function paperBackground(id, w, h, seed = 3) {
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="${seed}" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.47  0 0 0 0 0.33  0 0 0 -0.55 0.42"/>
</filter>
<rect width="${w}" height="${h}" fill="#f1e8d3"/><rect width="${w}" height="${h}" filter="url(#${id})"/>`;
}
