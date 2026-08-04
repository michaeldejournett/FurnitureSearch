# Apartment Furniture Planner

An interactive, browser-based apartment planner for comparing furniture options, tracking a budget, and arranging items to scale on a floor plan.

**Live demo:** <https://michaeldejournett.github.io/FurnitureSearch/>

## Features

- Automatically loads the included furniture proposal data
- Filters products by design plan or displays the full library
- Supports adding, moving, rotating, copying, and removing furniture
- Tracks the selected furniture against a $4,500 budget
- Saves layouts in browser storage
- Imports custom floor plans and calibrates their scale
- Exports a bill of materials or a PNG of the layout

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
