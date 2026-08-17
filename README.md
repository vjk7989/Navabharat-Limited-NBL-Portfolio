# Navabharat Limited / NBL Portfolio

A standalone PalmWatch static dashboard for the Navabharat Limited / NBL demonstration portfolio. It opens directly into the operational dashboard and includes the existing role-scoped overview, maps, farm and tree views, alerts, reports, cases, treatments, administration, and settings workflows.

## Data notice

Farm-area rows are derived from the supplied demonstration workbook. Health, survey, alert, case, and treatment values are deterministic demo data. Public place names and simulated coordinates do not imply farm ownership, and the displayed observations are not image-derived diagnoses.

## Local use

Open `index.html` directly, or serve this directory with any static file server.

```powershell
npm test
npm run build
```

The dependency-free build copies the site and required assets into `dist/`. Relative asset paths allow the output to work at the GitHub Pages repository URL:

`https://vjk7989.github.io/Navabharat-Limited-NBL-Portfolio/`

## Deferred

- Automatic tree detection
- Image-derived NDVI, NDRE, diagnosis, or confidence
- Backend persistence
