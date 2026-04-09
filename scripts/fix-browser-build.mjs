/**
 * Post-build fix for browser bundle CJS require() calls.
 *
 * The tsdown/rolldown browser build externalizes react/react-dom as ESM imports,
 * but CJS dependencies (like react-confirm) get bundled with __require("react")
 * calls that fail at runtime. This script patches those calls since the ESM
 * imports already exist at the top of the same files.
 */
import { readFileSync, writeFileSync, globSync, existsSync, rmSync, symlinkSync } from "node:fs";
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

// === Fix 2: Create browser/ symlink at package root ===
const symlinkPath = join(ROOT, "browser");
if (existsSync(symlinkPath)) {
  rmSync(symlinkPath, { recursive: true });
}
symlinkSync("dist/browser", symlinkPath);
console.log("Created browser/ → dist/browser/ symlink for Connect package loader.");
