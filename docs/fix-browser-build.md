# Fixing the Browser Build CJS `require()` Calls

## The Problem

When `ph-cli build` runs tsdown for the browser target, it correctly marks `react`/`react-dom` as external — they become ESM imports at the top of the output files. However, the dependency `react-confirm` (pulled in by `@powerhousedao/document-engineering`) is a CJS package that uses `require("react")`. Rolldown wraps this in a `__require()` shim that throws at runtime in the browser because `require` is undefined there.

The affected file after build: `dist/browser/editor-*.js` — it has proper ESM `import React from "react"` at the top, but also contains 6 `__require("react")` / `__require("react-dom")` / `__require("react-dom/client")` calls from the bundled CJS code.

## The Fix

A postbuild script (`scripts/fix-browser-build.mjs`) patches the browser output to replace the broken `__require()` calls with references to the already-imported ESM modules.

### How it works

The browser bundle already has correct ESM imports for react at the top of the file (`import React from "react"`). The `__require("react")` calls deep inside are from CJS code (`react-confirm`) that rolldown couldn't convert because react was marked external. The script simply replaces those runtime `__require()` calls with the module-level `React`/`ReactDOM` references that are already in scope.

### Replacements made

| Pattern | Replacement | Reason |
|---------|-------------|--------|
| `__require("react")` | `React` | Already imported as default/namespace at top of file |
| `__require("react-dom")` | `ReactDOM` | Already imported as `ReactDOM` |
| `__require("react-dom/client")` | `ReactDOM` | Client is part of react-dom in v19 |

### Build script

The `build` script in `package.json` chains the fix after `ph-cli build`:

```json
"build": "ph-cli build && node scripts/fix-browser-build.mjs"
```

### Verification

After building, verify no `__require()` calls remain:

```bash
grep -rn '__require(' dist/browser/ --include="*.js"
```

This should return no results.

## Publishing

After confirming the build is clean:

```bash
# bump the prerelease version
npm version 1.1.0-dev.XX --no-git-tag-version

# publish to npm
npm publish --access public
```

Then in consuming projects (e.g. contributor-billing), update `package.json` and `powerhouse.config.json` to point to the new version and `npm install` from npm (not a custom registry).
