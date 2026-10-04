# Pomona Digital Access Map

Interactive map of households without internet or a computer, by census tract, for the City of Pomona, CA. Static site (Leaflet + plain JS), no build step.

## Files
- `index.html`, `style.css`, `app.js`: the site
- `data/pomona-tracts.geojson`: 31 Pomona tracts with geometry plus precomputed counts, %, rank, quartile
- `data/streets.geojson`, `data/tract-bounds.json`: major street/freeway lines + labels, and the street on each side of each tract (from OpenStreetMap)
- `scripts/build_data.py`: rebuilds the tract GeoJSON from `source/`
- `scripts/build_streets.py`: rebuilds the street files from `source/osm_roads_raw.json` (run after build_data.py). To label different streets, edit `MAJOR` at the top.
- `source/`: LA County CSV (all 2,495 tracts) and raw tract boundaries from Census TIGERweb

## Data
- Counts/percentages: LA County GIS Hub, "Internet and Computer Access (census tract)". Underlying ACS vintage and table definitions are **not stated in the export**; confirm before publishing.
- Boundaries: U.S. Census Bureau TIGERweb census tracts (GEOIDs match the CSV `tract` column). City limits: TIGERweb Incorporated Places, Pomona (GEOID 0658072), in `data/pomona-city.geojson`.
- Pomona = 31 tracts tagged "City of Pomona". Tract 06037402404 ("Unincorporated - Pomona", 4 households) is excluded.
- Ranks: 1 = highest share. Quartiles are rank-based (8/8/8/7 tracts). LA County rate is household-weighted from the CSV.
- No margins of error are in the source data.

## Run locally
```bash
python3 -m http.server 8765
```
Open http://localhost:8765 (opening index.html by double-click will not work).

## Update data
```bash
python3 scripts/build_data.py
```

## Publish on GitHub Pages (first time)
1. Create a free account at github.com.
2. Click **+ → New repository**. Name it `pomona-digital-access`, choose **Public**, click Create.
3. On the new repo page click **uploading an existing file**. Drag in the *contents* of this folder (`index.html`, `style.css`, `app.js`, `data/`, `fonts/`, optionally `scripts/`, `source/`, `README.md`). Click **Commit changes**.
4. Go to **Settings → Pages**. Under "Build and deployment" choose **Deploy from a branch**, branch **main**, folder **/ (root)**, Save.
5. After 1-2 minutes the site is live at `https://<your-username>.github.io/pomona-digital-access/`.

## Language
English/Español toggle in the panel (remembered per browser). All text lives in the `T` table at the top of `app.js`. **The Spanish is a draft; have a fluent reviewer check it before publishing.**

## Accessibility
Tracts are keyboard-focusable (Tab, then Enter), there is a "Choose a census tract" dropdown, Esc returns to the citywide view, and selections are announced to screen readers.

## Street data
Roads © OpenStreetMap contributors (ODbL). Tract boundary streets are detected automatically by matching each tract edge to the nearest named road; sides that follow a city limit, creek or rail line show no street and are left out.

## Font
Atkinson Hyperlegible Next (Braille Institute, SIL Open Font License 1.1), self-hosted in `fonts/` as a variable WOFF2 (latin 34 KB; latin-ext 19 KB loads only if needed). Type sizes are set as role tokens (`--fs-display` … `--fs-label`) at the top of `style.css`.

## Basemap note
Uses Esri's free Light Gray canvas tiles (no API key). CARTO's free tiles now require a key. Fine for a low-traffic nonprofit tool; revisit if traffic grows.
