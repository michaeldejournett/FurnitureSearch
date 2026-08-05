# Furniture Search — Apartment Planner

A browser-based furniture planner: search and compare furniture options, track a budget, and arrange pieces to scale on an apartment floor plan.

**Live app:** <https://michaeldejournett.github.io/FurnitureSearch/>

## Features

- Full-text search across products, types, retailers, and rooms, with room filter chips and sorting (price, name, footprint)
- Design-plan tabs, each with its own saved layout, plus a custom-build mode over the full library
- Adding, moving, rotating, duplicating, and removing furniture with keyboard shortcuts and an on-canvas details panel
- Editable budget with a live progress bar and over-budget warnings
- Type-aware floor plan rendering (sofas, beds, tables, and rugs each read differently at a glance)
- Saves layouts and budget in browser storage
- Imports custom floor plans (with wall calibration) and custom furniture CSVs
- Exports a bill of materials (with totals) or a PNG of the layout

## Run locally

The application fetches its CSV data at runtime, so serve the directory over HTTP instead of opening `index.html` directly.

```bash
git clone https://github.com/michaeldejournett/FurnitureSearch.git
cd FurnitureSearch
npm start
```

Then open <http://localhost:8080>. `npm start` uses `npx http-server`, so Node.js and npm are required.

## Project structure

```text
index.html       Application entry point
assets/          Floor plans, product images, and favicon
css/             Application styles
data/            Furniture proposal CSV
js/              Planner behavior and browser state
scripts/         Development and deployment validation tools
```

## Deployment

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) deploys the site on every push to `main` and can also be run manually.

The workflow deliberately publishes only:

- `index.html`
- `assets/`
- `css/`
- `data/`
- `js/`
- `.nojekyll`

Scraping scripts, planning spreadsheets, test captures, and downloadable archives are not included in the Pages artifact. The workflow validates local HTML, CSS, JavaScript, and CSV asset references before deployment.

The repository's GitHub Pages source must be set to **GitHub Actions**. The production URL is case-sensitive and includes the repository name: `/FurnitureSearch/`.
