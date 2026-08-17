import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const root = dirname(dirname(fileURLToPath(import.meta.url)));

for (const token of [
  "Navabharat Limited NBL Portfolio | PalmWatch",
  "Navabharat Limited logo",
  "Navabharat Limited / NBL",
  "PalmWatch",
  "deterministic demo data",
  "public place names do not imply farm ownership",
  "Map",
  "Table",
  "Cases & Treatments",
]) {
  assert.ok(html.includes(token), `Missing standalone NBL contract: ${token}`);
}

for (const forbidden of [
  "Change company",
  "Choose company portfolio",
  "data-company=",
  "TGOILFED",
  "tgoilfed.png",
  "TGOF_0001",
]) {
  assert.ok(!html.includes(forbidden), `Standalone NBL site leaked another company contract: ${forbidden}`);
}

assert.match(html, /let state = \{companyId:"nbl"/, "NBL must be the fixed startup portfolio");
assert.match(html, /<div class="app" id="appShell">/, "Dashboard must be visible without a company landing step");
assert.doesNotMatch(html, /id="landing"/, "Company selection landing page must be absent");
assert.match(html, /<header class="topbar">[\s\S]*?nbl\.png[\s\S]*?alt="Navabharat Limited logo"/, "Top branding must contain the approved accessible NBL logo");
assert.ok(existsSync(new URL("../assets/company-logos/nbl.png", import.meta.url)), "Approved NBL logo must be bundled");
assert.ok(!existsSync(new URL("../assets/company-logos/godrej-agrovet.png", import.meta.url)), "Godrej logo must not be bundled");
assert.ok(!existsSync(new URL("../assets/company-logos/tgoilfed.png", import.meta.url)), "TGOILFED logo must not be bundled");
assert.match(html, /(?:src|href)="assets\//, "Assets must use relative paths compatible with a GitHub Pages repository subpath");
const favicon = html.match(/<link rel="icon" type="image\/png" href="([^"]+)">/)?.[1];
assert.equal(favicon, "assets/company-logos/nbl.png", "Favicon must use the packaged NBL logo through a relative Pages-safe path");
assert.ok(!favicon.startsWith("/"), "Favicon must not use a root-absolute path on GitHub Pages");
assert.ok(existsSync(join(root, favicon)), "Favicon target must exist in source assets");

// Direct-entry and product-shell regression contracts.
assert.match(html, /<main class="main">/, "The standalone dashboard must expose a semantic main region");
assert.match(html, /<aside class="side" aria-label="Primary navigation">/, "Primary navigation must retain an accessible label");
assert.match(html, /<section class="content" id="content" aria-live="polite">/, "Dynamic route content must remain announced");
assert.match(html, /admin:\{[\s\S]*?"Overview"[\s\S]*?"Reports"[\s\S]*?"Cases & Treatments"[\s\S]*?"Administration"/, "Administrator navigation regression");
assert.match(html, /staff:\{[\s\S]*?farmIds:[\s\S]*?"Overview"[\s\S]*?"Alerts"[\s\S]*?"Cases & Treatments"[\s\S]*?"Settings"/, "Field Staff role scope/navigation regression");
for (const flow of ["renderOverview", "renderFarm", "renderTree", "renderReports", "renderCasesTreatments"]) {
  assert.match(html, new RegExp(`function ${flow}\\(`), `Missing retained ${flow} flow`);
}

// Keyboard-operable controls must remain native controls; mobile/tablet rules must
// keep the dashboard contained rather than relying on pointer-only interactions.
assert.match(html, /role="grid" aria-label="Editable acre/, "Tree layout must retain an accessible grid name");
assert.match(html, /<button type="button" class="tcell is-editable[\s\S]*?aria-pressed=/, "Editable tree cells must remain keyboard buttons with state");
assert.match(html, /@media\(max-width:980px\)[\s\S]*?\.mapwrap[\s\S]*?grid-template-columns:1fr/, "Tablet layout contract is missing");
assert.match(html, /@media\(max-width:620px\)[\s\S]*?\.content\{padding:18px 14px 40px\}/, "Mobile layout contract is missing");
assert.match(html, /\.data-scroll\{overflow-x:auto\}/, "Wide tables need bounded horizontal scrolling");

// Contrast tokens keep sidebar copy fully opaque and separate readable risk
// foregrounds from the brighter risk color retained by dots, bars, and fills.
const logoSubRule = html.match(/\.logosub\{([^}]*)\}/)?.[1] ?? "";
const navLabelRule = html.match(/\.navlabel\{([^}]*)\}/)?.[1] ?? "";
for (const [selector, rule] of [[".logosub", logoSubRule], [".navlabel", navLabelRule]]) {
  assert.ok(rule, `Missing ${selector} style rule`);
  assert.ok(!/opacity\s*:/.test(rule), `${selector} must not reduce text opacity`);
  assert.match(rule, /color:var\(--fg\)/, `${selector} must use the readable foreground token`);
}
assert.match(html, /--risk:oklch\([^)]+\);[\s\S]*?--risk-text:oklch\([^)]+\);/, "Risk graphics and text need distinct palette tokens");
assert.match(html, /\.tone-risk\{color:var\(--risk-text\)\}/, "Risk metric text must use --risk-text");
assert.match(html, /\.h-risk \.railn\{color:var\(--risk-text\)\}/, "Risk rail text must use --risk-text");
assert.match(html, /\.badge\.h-risk,\.h-risk \.blobinf\{color:var\(--risk-text\)\}/, "Risk badge and blob foregrounds must use --risk-text");
assert.match(html, /\.h-risk\{--c:var\(--risk\);--cb:var\(--risk-bg\)\}/, "Risk graphics must retain the brighter --risk token");
assert.match(html, /\.badge::before\{[^}]*background:var\(--c\)/, "Risk badge dots must continue using the graphic color variable");
assert.match(html, /\.indicator-segment\{[^}]*background:var\(--c\)/, "Risk indicator graphics must continue using the graphic color variable");

// Navigation exposes the current page only on the selected item, while the
// Overview display switch provides a name and synchronizes one pressed button.
assert.match(html, /state\.page===label\?' aria-current="page"':""/, "Only the active navigation item may expose aria-current=page");
assert.doesNotMatch(html, /data-nav="\$\{label\}" aria-current="page"/, "Navigation must not mark every item current");
assert.match(html, /data-nav="\$\{label\}"[^>]*><span class="nico" aria-hidden="true">\$\{navIcons\[label\]\}<\/span><span>\$\{label\}<\/span>/, "Decorative navigation icons must be hidden so button names remain label-only");
assert.match(html, /id="viewToggle" role="group" aria-label="Overview display"/, "Overview display controls need an accessible group name");
assert.match(html, /data-view="map" aria-pressed="true">Map<\/button><button[^>]*data-view="table" aria-pressed="false">Table<\/button>/, "Initial Overview display state must select Map only");
assert.match(html, /function syncViewToggleState\(\)\{[\s\S]*?const selected=button\.dataset\.view===state\.view;[\s\S]*?button\.setAttribute\("aria-pressed",String\(selected\)\)/, "Overview display buttons must synchronize mutually exclusive pressed state");
assert.match(html, /function render\(\)\{[\s\S]*?classList\.toggle\("hidden", state\.page!=="Overview"[\s\S]*?syncViewToggleState\(\);/, "Pressed state must synchronize during each render");

// The disclosed account menu is controlled by its trigger and implements the
// complete expected wrapping keyboard model plus Escape focus restoration.
assert.match(html, /id="profileBtn"[\s\S]*?aria-controls="profileMenu"[\s\S]*?id="profileMenu" role="menu"/, "Profile trigger must control the named account menu");
assert.match(html, /menu\.addEventListener\("keydown",event=>\{[\s\S]*?!\["ArrowDown","ArrowUp","Home","End"\]\.includes\(event\.key\)[\s\S]*?event\.preventDefault\(\)/, "Account menu must handle its four navigation keys");
assert.match(html, /event\.key==="Home"\?items\[0\]:event\.key==="End"\?items\.at\(-1\):event\.key==="ArrowDown"\?items\[\(current\+1\+items\.length\)%items\.length\]:items\[\(current-1\+items\.length\)%items\.length\]/, "Account menu ArrowUp/Down must wrap and Home/End must select boundaries");
assert.match(html, /event\.key==="Escape"&&state\.profileOpen[\s\S]*?state\.profileOpen=false;renderProfileMenu\(\);document\.getElementById\("profileBtn"\)\.focus\(\)/, "Escape must close the account menu and return focus to its trigger");

// Evidence errors must be visible and all repository-local asset references must
// resolve in the source tree. Root-absolute paths would break Pages subpath hosting.
assert.match(html, /image\.addEventListener\("error",markEvidenceError\)/, "Evidence imagery needs an explicit load-error state");
assert.doesNotMatch(html, /(?:src|href)="\/assets\//, "Root-absolute assets break GitHub Pages repository paths");
const localAssetRefs = [...html.matchAll(/(?:src|href):?\s*[=:]\s*"(assets\/[^"]+)"/g)].map(match => match[1]);
assert.ok(localAssetRefs.length >= 7, "Expected the company logo and tree evidence assets to be referenced");
for (const relative of new Set(localAssetRefs)) {
  const target = normalize(join(root, relative));
  assert.ok(target.startsWith(normalize(join(root, "assets"))), `Asset escaped the repository: ${relative}`);
  assert.ok(existsSync(target), `Referenced asset is missing: ${relative}`);
}

// Build and delivery metadata are part of the standalone Pages contract.
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
assert.equal(packageJson.name, "navabharat-limited-nbl-portfolio");
assert.ok(packageJson.scripts?.test && packageJson.scripts?.build, "Package must expose test and build gates");
const workflow = readFileSync(join(root, ".github", "workflows", "deploy-pages.yml"), "utf8");
for (const contract of ["branches: [main]", "npm test", "npm run build", "actions/upload-pages-artifact@v3", "path: dist", "actions/deploy-pages@v4"]) {
  assert.ok(workflow.includes(contract), `Pages workflow contract missing: ${contract}`);
}
const readme = readFileSync(join(root, "README.md"), "utf8");
assert.ok(readme.includes("https://vjk7989.github.io/Navabharat-Limited-NBL-Portfolio/"), "README must document the public repository URL");
assert.match(readme, /deterministic demo data/i, "README must retain the demo-data disclaimer");
assert.match(readme, /do not imply farm ownership/i, "README must retain the ownership disclaimer");

console.log("Standalone NBL static checks passed (company isolation, direct entry, branding, disclaimer, and Pages paths)." );
