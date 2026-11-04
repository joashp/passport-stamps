# Passport stamps

![Ten example stamps on a passport page](docs/top10-example.png)

Vector passport stamps for **all 195 countries** (the 193 UN member states plus the Holy See and Palestine). Every stamp shows the country name, its best known landmark, and a month and year that your code fills in. Each stamp is one ink colour from a palette of five, with a paper and ink texture applied when it is rendered, so no two look alike.

Browse every stamp: [docs/atlas/countries-1.png](docs/atlas/countries-1.png), [2](docs/atlas/countries-2.png), [3](docs/atlas/countries-3.png), [4](docs/atlas/countries-4.png), [5](docs/atlas/countries-5.png). Which landmark each one uses: [docs/MONUMENTS.md](docs/MONUMENTS.md).

## Use it

```bash
npm install
node stamp.mjs make FR 2024-05             # one stamp  -> out/
node stamp.mjs batch trips.all195.csv      # many stamps from a CSV or JSON file
node stamp.mjs serve 3000                  # HTTP: GET /stamp/FR/2024/05.png
node stamp.mjs list                        # what exists
node stamp.mjs validate                    # check every country before you ship
```

From code: `import { stampPNG } from './render.mjs'; await stampPNG('FR', 'MAY', 2024)`.
The month can be `MAY`, `may` or `5`. The same country, month and year always gives the same look. Pass `--seed`, `--rotate` or `--wear` to change it.

Each run writes a transparent PNG, a textured SVG, and a clean `.master.svg` with no texture. Open the master in Figma or Illustrator. The textured SVG relies on SVG filters, so render it with this tool or a browser.

## How it is built

```
countries/<code>/country.json   name, ink colour, landmark, frame family
countries/<code>/monument.svg   the landmark, flat shapes in the colour INK
countries/<code>/frame.mjs      only for hand-built frames (optional)
lib/kits/                       drawing kits: mosque, fort, volcano, falls, tower and more
lib/families.mjs                20 frame shapes, with long names split over two lines
data/countries.mjs              the table that drives it all (landmark, kit, settings)
tools/build-all.mjs             regenerates every country folder from that table
```

- **Ten countries are hand-built** (France, Spain, United States, China, Italy, Turkey, Mexico, United Kingdom, Japan, Germany). Each has its own frame and monument.
- **The other 185 are generated.** Each uses a drawing kit with settings that match its landmark, inside a frame chosen for the monument's proportions. A few one-off icons (Taj Mahal, Angkor Wat, Petra, Machu Picchu, Sydney Opera House) have their own drawings.
- **Text is converted to outlines**, so stamps do not depend on installed fonts. Dates fit their frame whether it is `SEP` or `DEC`.

## Improving a stamp

The generated monuments are clean first versions, not final art. To replace one with your own drawing:

1. Set its row in `data/countries.mjs` to the kit `'custom'`, so `build-all` stops overwriting it.
2. Save your artwork as `countries/<code>/monument.svg`: flat shapes, the colour `INK` only, origin in the middle, no text or gradients.
3. Optionally add a `frame.mjs` for a frame that is unique to that country.
4. Run `node stamp.mjs validate`.

To add a country: `node stamp.mjs new DE GERMANY navy oval`, then follow the same steps.

## Which landmarks are verified

Checked against web sources on 2026-11-04: the 10 hand-built countries, plus 23 more marked **supported** (a source named it as the best known, iconic or symbolic landmark), 17 **partly** supported (a source confirms it as a major landmark or main sight), and 1 **changed** (Liberia). The other 144 were chosen from general knowledge and have **not** been checked. The search tool answers about one country per query and two list sites are blocked by this session's network allowlist, so coverage is partial. [docs/MONUMENTS.md](docs/MONUMENTS.md) shows the status and evidence for every country.

One thing to know: Sierra Leone's Cotton Tree is a confirmed national symbol, but a storm felled it in May 2023.

Politically sensitive picks (Israel, Palestine) and countries with several equally famous sights (Italy, Germany, Turkey) are easy to switch: change the row in `data/countries.mjs`, run `node tools/build-all.mjs`, then `node tools/docs.mjs`.
