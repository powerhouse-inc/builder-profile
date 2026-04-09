Instructions to paste in the builder-profile repo

I need to fix two build issues in this project so the published npm package works correctly when loaded by Connect's runtime package loader.

### Problem 1: Browser path mismatch

Connect's `BrowserPackageManager` loads packages at runtime via:
```js
const importUrl = `/node_modules/${name}/browser/index.js`;
But ph-cli build outputs the browser bundle to dist/browser/. The package.json exports map points to ./dist/browser/index.js (which works for Node resolution), but the browser dynamic import uses a literal URL path — so it gets a 404.

Fix: Add a postbuild step that copies or symlinks dist/browser → browser at the package root, and add "/browser" to the "files" array so it's included when published.

Problem 2: CJS require("react") in browser bundle
The dependency chain @powerhousedao/document-engineering → react-confirm uses CJS (require("react")). When tsdown/rolldown bundles this for the browser target, react is external (in neverBundle), so rolldown wraps the CJS require in a __require() shim that throws at runtime in browsers.

Fix: Add a postbuild step that patches __require("react"), __require("react-dom"), and __require("react-dom/client") calls in the browser output. These can safely be replaced with the module-level ESM imports that already exist at the top of the same files (React, ReactDOM).

Implementation
Create scripts/fix-browser-build.mjs with this content:

import { readFileSync, writeFileSync, mkdirSync, symlinkSync, existsSync, rmSync } from "node:fs";
import { globSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BROWSER_DIR = join(ROOT, "dist", "browser");

// === Fix 1: Patch CJS require() calls in browser bundle ===
const files = globSync("**/*.js", { cwd: BROWSER_DIR }).map((f) =>
  join(BROWSER_DIR, f),
);

const replacements = [
  [/__require\("react"\)/g, "React"],
  [/__require\("react-dom"\)/g, "ReactDOM"],
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

// === Fix 2: Create browser/ symlink at package root ===
const symlinkPath = join(ROOT, "browser");
if (existsSync(symlinkPath)) {
  rmSync(symlinkPath, { recursive: true });
}
symlinkSync("dist/browser", symlinkPath);
console.log("Created browser/ → dist/browser/ symlink for Connect package loader.");
In package.json, make these changes:

a. Update the "build" script to run the fix after ph-cli build:


"build": "ph-cli build && node scripts/fix-browser-build.mjs"
b. Add "/browser" to the "files" array so the symlink is included when published:


"files": ["/dist", "/browser"]
Add browser to .gitignore (it's a build artifact):


browser
Build, verify, and publish:


npm run build
# Verify no __require("react") calls remain:
grep -rn '__require(' dist/browser/ --include="*.js" | grep -v chunk-olfrzTEO
# Verify browser/ symlink works:
ls -la browser/index.js
# Bump version and publish to npm:
npm version 1.1.0-dev.15 --no-git-tag-version
npm publish --access public
Why these fixes are needed
Path fix: Connect's BrowserPackageManager#loadPackageFromNodeModules() constructs the URL as /node_modules/<pkg>/browser/index.js but ph-cli build outputs to dist/browser/. The symlink bridges this gap.
CJS fix: react-confirm (dep of @powerhousedao/document-engineering) is CJS and calls require("react"). Rolldown externalizes react but can't convert the CJS require to ESM import, so it uses a __require shim that throws in browsers. The patched code uses the React/ReactDOM variables that are already ESM-imported at the top of the same file.