# Fix SCSS Deprecation Warnings — Implementation Plan

**Goal:** Replace deprecated `@import` with `@use` across all SCSS files so the build is clean under Dart Sass 3.0.

**Architecture:** Each partial that uses `$primary-color` adds `@use 'variables' as *` at its own top. `app.scss` changes its five `@import` statements to `@use`. The legacy-JS-API warning from Vite 4.x is suppressed in `vite.config.js` pending a future Vite upgrade.

**Stack:** Vite 4 · Dart Sass 1.62+

---

## File Structure

| Action | Path |
|---|---|
| Modify | `client/src/styles/app.scss` |
| Modify | `client/src/styles/_btn.scss` |
| Modify | `client/src/styles/_header.scss` |
| Modify | `client/src/styles/_video.scss` |
| Modify | `client/vite.config.js` |

---

### Task 1: Fix partials that consume variables

**Files:** `_btn.scss`, `_header.scss`, `_video.scss`

- [ ] Replace `@import 'variables'` with `@use 'variables' as *` in each file
  (`as *` keeps `$primary-color` available without a namespace prefix)

---

### Task 2: Fix app.scss

**Files:** `client/src/styles/app.scss`

- [ ] Replace all five `@import` lines with `@use`

---

### Task 3: Suppress legacy-JS-API warning in Vite config

**Files:** `client/vite.config.js`

- [ ] Add `silenceDeprecations: ['legacy-js-api']` to the scss preprocessor options
  (Vite 4.x cannot use the modern Sass API without upgrading to Vite 5)

---

### Task 4: Verify

- [ ] Run: `cd client && npx vite build`
  Expected: `✓ built` with zero deprecation warnings

- [ ] Commit

  ```bash
  git add client/src/styles/app.scss client/src/styles/_btn.scss \
          client/src/styles/_header.scss client/src/styles/_video.scss \
          client/vite.config.js
  git commit -m "fix: replace deprecated SCSS @import with @use"
  ```
