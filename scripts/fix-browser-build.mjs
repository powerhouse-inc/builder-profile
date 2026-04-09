/**
 * Post-build fix for browser bundle CJS require() calls.
 *
 * The tsdown/rolldown browser build externalizes react/react-dom as ESM imports,
 * but CJS dependencies (like react-confirm) get bundled with __require("react")
 * calls that fail at runtime. This script patches those calls since the ESM
 * imports already exist at the top of the same files.
 */
import { readFileSync, writeFileSync, globSync, existsSync, rmSync, cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BROWSER_DIR = join(ROOT, "dist", "browser");

// Find all JS files in browser dist
const files = globSync("**/*.js", { cwd: BROWSER_DIR }).map((f) =>
  join(BROWSER_DIR, f),
);

const replacements = [
  // __require("react") → already imported as `React` (default) and `React$2` (namespace)
  [/__require\("react"\)/g, "React"],
  // __require("react-dom") → already imported as `ReactDOM`
  [/__require\("react-dom"\)/g, "ReactDOM"],
  // __require("react-dom/client") → already imported as `ReactDOM` (client is part of react-dom in v19)
  [/__require\("react-dom\/client"\)/g, "ReactDOM"],
];

let totalPatches = 0;

for (const filePath of files) {
  let content = readFileSync(filePath, "utf-8");
  let filePatches = 0;

  for (const [pattern, replacement] of replacements) {
    const matches = content.match(pattern);
    if (matches) {
      filePatches += matches.length;
      content = content.replace(pattern, replacement);
    }
  }

  if (filePatches > 0) {
    writeFileSync(filePath, content, "utf-8");
    const relative = filePath.replace(ROOT + "/", "");
    console.log(`  Patched ${filePatches} require() calls in ${relative}`);
    totalPatches += filePatches;
  }
}

if (totalPatches > 0) {
  console.log(`Fixed ${totalPatches} CJS require() calls in browser build.`);
} else {
  console.log("No CJS require() calls found — build is clean.");
}

// === Fix 2: Copy static assets into dist/browser/ (before browser/ copy) ===
// The bundled JS references assets via new URL("./assets/...", import.meta.url)
// but the bundler doesn't emit them. Copy from source into dist/browser/assets/.
const assetsDir = join(ROOT, "editors", "builder-profile", "assets");
const distAssetsDir = join(BROWSER_DIR, "assets");
if (existsSync(assetsDir)) {
  mkdirSync(distAssetsDir, { recursive: true });
  cpSync(assetsDir, distAssetsDir, { recursive: true });
  console.log("Copied editor assets → dist/browser/assets/ for static asset resolution.");
}

// === Fix 3: Copy dist/browser/ to package root for npm publish ===
// (runs after Fix 2 so assets are included in the copy)
const browserCopyPath = join(ROOT, "browser");
if (existsSync(browserCopyPath)) {
  rmSync(browserCopyPath, { recursive: true });
}
cpSync(join(ROOT, "dist", "browser"), browserCopyPath, { recursive: true });
console.log("Copied dist/browser/ → browser/ for Connect package loader.");

// === Fix 4: Merge all CSS into root style.css for Connect stylesheet loader ===
// dist/style.css has Tailwind CSS, dist/browser/style.css has component CSS (md-editor, etc.)
// Connect only loads one style.css from the package root, so we concatenate both.
const tailwindCss = join(ROOT, "dist", "style.css");
const componentCss = join(ROOT, "dist", "browser", "style.css");
const styleDest = join(ROOT, "style.css");

let combinedCss = "";
if (existsSync(tailwindCss)) {
  combinedCss += readFileSync(tailwindCss, "utf-8");
}
if (existsSync(componentCss)) {
  combinedCss += "\n/* === Component styles (bundled from browser build) === */\n";
  combinedCss += readFileSync(componentCss, "utf-8");
}
if (combinedCss) {
  writeFileSync(styleDest, combinedCss, "utf-8");
  console.log("Merged dist/style.css + dist/browser/style.css → style.css for Connect stylesheet loader.");
}
