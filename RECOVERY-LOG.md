# FSF Recovery Log

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
