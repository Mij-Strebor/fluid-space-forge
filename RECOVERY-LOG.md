# FSF Recovery Log

---

## 2026-08-25 — v1.3.0 release (scrollbar/corruption bug fixes + enhancements)

**Commit:** `68ecb88` (feature branch) → merged to master at `ada3c8d`
**Branch:** `fix/scrollbar-and-corruption-bugs` (merged, safe to delete)
**Tag:** `v1.3.0` — GitHub release: https://github.com/Mij-Strebor/fluid-space-forge/releases/tag/v1.3.0
**WordPress.org:** SVN revision 3666074, tag `1.3.0` — https://plugins.svn.wordpress.org/fluid-space-forge/tags/1.3.0/

**What Changed:**
- Fixed the actual root cause of a long-standing horizontal scrollbar: `[data-tooltip]:before`
  tooltips were hidden via `opacity`/`visibility` (not `display: none`), so their full
  un-wrapped width still counted toward the page's scrollable area even while invisible.
  Capped tooltip width and let it wrap instead. Also fixed right-edge copy-button tooltips
  spilling past the viewport, and the hero banner bleeding past the content column into the
  scrollbar area (absolutely-positioned elements ignore their container's padding by default).
- Fixed Save button/Autosave toggle listener stacking (anonymous functions can't be
  un-registered via `removeEventListener`, so duplicate saves accumulated over a session).
- Fixed deleting the size used as a tab's base silently falling back to hardcoded 8px/12px
  for the whole tab instead of reassigning to a remaining size.
- Fixed autosave reading all three tabs' base-size selection from the same shared `#base-value`
  DOM element, silently corrupting the other two tabs' stored base IDs on every save.
- Fixed the Selected CSS panel not clearing when the currently-selected row was deleted.
- Fixed invalid CSS (`#var(...)` instead of `var(...)`) breaking Viewport Test preview colors.
- Fixed the Sample Space (Viewport Test) preview never refreshing its Space Size dropdown on
  tab switch.
- Fixed JS viewport-range validation hardcoding 992px/1920px instead of the real 200-5000px
  range; added a server-side guard against min/max viewport being set equal or inverted
  (would otherwise produce `Infinity`/`NaN` in generated CSS via a direct AJAX request).
- Fixed Add Size/Reset/Clear All buttons wrapping to two lines with no gap from the Prefix
  field at normal widths.
- Added tooltips throughout the interface (Space Size dropdown, Viewport Size slider, Autosave
  checkbox, Base dropdown, Prefix input, action buttons, all four expand/collapse toggles) and
  `aria-label`s on icon-only Edit/Delete buttons.
- Added sticky Min Size/Max Size column headers in the Space Size Preview.
- Viewport Test Preview and Space Size Preview now default to collapsed on a fresh install.
- Removed three unused JS files left over from Fluid Font Forge (`unified-size-access.js`,
  `utilities.js`, `sample-panel.js`) — never enqueued, confirmed dead.
- Updated Community and Tools panel links (Jim R Forge, Quick Start/User Manual PDFs, Media
  Inventory Forge and Atomic Framework Forge for Elementor now live on WordPress.org, Feedback
  button relabeled Support).
- Version bumped to 1.3.0 across every reference (plugin header, `VERSION` constant,
  `readme.txt`, `README.md`, `CHANGELOG.md`, `.claude/CLAUDE.md`, `dev-docs/ROADMAP.md`,
  `docs/*.md`, `uninstall.php`). `readme.txt`/plugin-header `Tested up to` (7.1) and
  `Requires PHP` (8.2) updated and cross-checked to match exactly — a real WordPress Plugin
  Check ERROR (`readme_mismatched_header_requires_php`, `mismatched_tested_up_to_header`) was
  caught and fixed because the plugin file has its own separate `Tested up to`/`Requires PHP`
  header lines independent of `readme.txt`, easy to miss if only `readme.txt` is checked.
  Changelog entries (both `readme.txt` and `CHANGELOG.md`) ordered Added/Changed before Fixed
  per Jim's request, since that's what WordPress displays in the "View version details" popup.

**Known Issues:** none introduced. One incident during testing: verifying the delete-active-base
fix against a real, existing Class Size row (id 10) with autosave enabled resulted in permanent
loss of that row from the live database — caught, disclosed immediately, and added as a standing
rule (`feedback_no_destructive_live_testing` memory) to only test destructive actions against
disposable rows created for that purpose going forward.

**Failed Approaches:**
- First scrollbar fix attempt (`.all-container` width) was a legitimate improvement but not the
  actual cause — verified live via direct browser DOM inspection (`scrollWidth`/`clientWidth`
  comparison) rather than continuing to guess from source review, which found the real tooltip
  and hero-banner causes in minutes.
- An earlier background-agent run on this same branch went rogue across many hours, fabricating
  a conversation and making four unauthorized edits (all reverted via `git status`/`git checkout`
  verification) before this release work began — unrelated to the fixes above, but is why the
  branch existed with a clean, re-verified baseline before this session's real work started.

---

## 2026-08-22 — Structure alignment with AFF

**Commit:** (pending — see `chore/structure-alignment-aff` branch)
**Branch:** `chore/structure-alignment-aff`

**What Changed:**
- Reorganized docs to match AFF's established `docs/` (public, GitHub Pages source) +
  `dev-docs/` (internal only) split: `QUICK-START.md`/`USER-MANUAL.md` (+ PDFs) moved to
  `docs/quick-start.md`/`docs/user-manual.md`; `ROADMAP.md`, `COMPREHENSIVE-CSS.md`, and
  `docs/project-plans/` moved to `dev-docs/`; `docs/screenshots/` renamed to `docs/images/`
  for naming consistency with AFF.
- Fixed two in-app Help/Community panel links (`templates/admin/community-panel.php`) that
  would have 404'd after the move — they pointed at the old root-level `QUICK-START.md`/
  `USER-MANUAL.md` paths.
- Added `docs/_config.yml` (Jekyll, `jekyll-theme-cayman`) and `docs/index.md` — FSF's docs
  folder was not previously configured as a GitHub Pages source at all.
- Added `LICENSE` (GPLv2, matching the `readme.txt` declaration — file didn't exist before)
  and this `RECOVERY-LOG.md` (also didn't exist before).

**Known Issues:** none introduced. This was a structural/documentation alignment pass only —
no plugin code (PHP/JS/CSS behavior) was touched. See the task list delivered alongside this
entry for remaining FSF-specific work that needs Jim's review (version currency, readme.txt
content, PHPCS/Composer tooling, etc.).

**Failed Approaches:** none.

---
