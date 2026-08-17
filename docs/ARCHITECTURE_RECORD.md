# Architecture Record

## Provenance and scope

- Standalone Navabharat Limited / NBL portfolio derived from `G:\oil-palm-1.5-gui-work` at commit `f6a821e`.
- The build is intentionally isolated to the `nbl` company profile and its workbook-derived demo data. It enters that dashboard directly; the multi-company landing page and company switcher are excluded.
- The persistent header pairs the approved NBL logo with the PalmWatch product name.
- All farm, location, operational, and ownership content remains explicitly identified as demo data or NBL-supported/linked plantation areas; it must not imply company ownership unless source data establishes that fact.

## Decisions and interfaces

- The site is a static, repository-subpath-safe application: document, asset, and navigation references use relative paths so both local preview and GitHub Pages work.
- The production build emits the deployable site to `dist/`; the GitHub Actions Pages workflow tests and builds before publishing that directory.
- Accessibility repairs are part of the accepted implementation: active navigation exposes `aria-current`, grouped toggles expose pressed state, menus support keyboard operation, decorative icons are hidden from assistive technology, text uses contrast-safe tokens, and the document supplies a favicon.

## Current codebase map

- `index.html` — standalone application shell, NBL-only data and behavior, direct dashboard entry, branding, and accessibility semantics.
- `assets/company-logos/nbl.png` — approved company logo used by the persistent brand area.
- `tests/` — static isolation/build assertions and browser coverage for responsive, keyboard, accessibility, and runtime behavior.
- `scripts/build.mjs` — minimal static packager that creates the Pages-ready `dist/` output.
- `.github/workflows/deploy-pages.yml` — CI test/build and GitHub Pages deployment workflow for `main`.

## Verification status

Independent verification passed for this increment:

- Static checks, production build, and diff checks: passed.
- Forbidden cross-company strings: `0` matches.
- Production artifact: `9` files, `3,345,277` bytes.
- Browser suite: `46/46` checks passed across desktop and tablet viewports.
- Axe serious/critical accessibility scan: `0` violations.
- Browser console errors, page errors, failed requests, and HTTP failures: `0` each.

## Pending and next safe task

- Pending final deployment verification at `https://vjk7989.github.io/Navabharat-Limited-NBL-Portfolio/`.
- Next safe task after public verification: begin the TGOILFED standalone portfolio increment.
