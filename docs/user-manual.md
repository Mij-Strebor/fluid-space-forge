# Fluid Space Forge User Manual

**Version 1.3.0**
Professional Responsive Spacing for WordPress

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Interface Overview](#interface-overview)
4. [About and How to Use Panels](#about-and-how-to-use-panels)
5. [Save and Autosave](#save-and-autosave)
6. [Output Format Tabs](#output-format-tabs)
7. [Settings Panel](#settings-panel)
8. [The Spacing Data Table](#the-spacing-data-table)
9. [Preview Panels](#preview-panels)
10. [CSS Output Panels](#css-output-panels)
11. [Upgrading from the Code Snippet Version](#upgrading-from-the-code-snippet-version)
12. [Understanding the Math](#understanding-the-math)
13. [Usage Examples](#usage-examples)
14. [Troubleshooting](#troubleshooting)

---

## Introduction

Fluid Space Forge is a WordPress admin tool that generates responsive spacing systems using CSS `clamp()` functions. Instead of writing media queries for every breakpoint, you define a spacing scale once and the plugin outputs CSS that scales smoothly between a minimum and maximum viewport width.

It's an admin-only tool — there is no public-facing component. Everything happens on a single page at **Tools → Fluid Space Forge**.

---

## Installation

1. **Plugins → Add New** in WordPress admin, search "Fluid Space Forge," **Install Now**, then **Activate** — or upload the plugin ZIP via **Plugins → Add New → Upload Plugin**.
2. Open **Tools → Fluid Space Forge**.
3. Requires WordPress 5.0+ and PHP 7.4+. Requires `manage_options` capability (Administrator by default).

On activation, the plugin checks for an older "Space Clamp Calculator" code-snippet version and, if found, automatically imports its settings the first time it runs (see [Upgrading from the Code Snippet Version](#upgrading-from-the-code-snippet-version)).

---

## Interface Overview

The admin page is a single scrolling layout, top to bottom:

1. **Header** — plugin title and current version number.
2. **About Fluid Space Forge** — collapsible intro panel with credits.
3. **How to Use Fluid Space Forge** — collapsible 4-step guide and best-practice tips.
4. **Autosave controls** — toggle, Save button, and status indicator (not collapsible).
5. **Tab navigation** — Classes / Variables / Utilities (Tailwind).
6. **Settings panel** (left column) and **spacing data table** (right column), side by side.
7. **Viewport Test Preview** — collapsible interactive slider preview.
8. **Space Size Preview** — collapsible side-by-side min/max preview.
9. **CSS output panels** — Selected Class CSS and Generated CSS (All Classes), each with its own copy button.
10. **Community and Tools** — links to documentation, related Jim R Forge plugins, and support options.

The four toggle panels (About, How to Use, Viewport Test Preview, Space Size Preview) each remember their expanded/collapsed state between visits.

---

## About and How to Use Panels

**About Fluid Space Forge** gives a one-paragraph description of the plugin and credits.

**How to Use Fluid Space Forge** lays out the workflow in four steps — Configure Settings, Manage Space Sizes, Preview Results, Copy CSS — plus a Pro Tip and a Best Practices box covering things like collapsing unused panels for a cleaner workspace and testing spacing at mobile/tablet/desktop widths.

Both panels can be collapsed once you're familiar with the tool, to reduce scrolling.

---

## Save and Autosave

The controls row above the tabs contains:

- **Autosave toggle** — on by default.
- **save button** — triggers an immediate full save.
- **Status indicator** — cycles through Ready 💾 → Saving... ⏳ → Saved! ✅ (or Error ❌ on failure, shown for 3 seconds).

**How saving actually works:**

- While **Autosave is on**, the plugin performs a full save (all settings and all three size tables) automatically every 30 seconds.
- Clicking **save** performs the same full save immediately, at any time, regardless of the Autosave toggle.
- **Control/UI settings** — panel expand/collapse states, the active tab, the selected unit (PX/REM), and the class/variable prefixes — save to the database immediately the moment you change them, independent of the Autosave toggle. Only your viewport/scale settings and spacing table depend on Autosave or a manual Save.
- This means refreshing the page without saving will lose unsaved viewport, scale, or table edits, but will never lose your panel layout, tab, unit, or prefix choices.

---

## Output Format Tabs

Three tabs control both the data table's Prefix field and the CSS that gets generated. Switching tabs does not lose data — each tab (Classes, Variables, Utilities) keeps its own independent set of sizes.

### Classes

Generates one CSS class per size using the **class prefix** (default `space`):

```css
.space-md { margin: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }
```

Each class sets only the `margin` property. If you need padding or gap behavior from the same scale, use the Utilities tab, or apply the generated class's `clamp()` value manually to whichever property you need.

### Variables

Generates CSS custom properties using the **variable prefix** (default `sp`), wrapped in a single `:root { }` block:

```css
:root {
  --sp-md: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem);
}
```

### Utilities (Tailwind)

Generates a full set of Tailwind-style directional utilities per size — no prefix field on this tab, since the property name is baked into the class name:

```css
/* Margin */
.mt-md { margin-top: clamp(...); }
.mb-md { margin-bottom: clamp(...); }
.ml-md { margin-left: clamp(...); }
.mr-md { margin-right: clamp(...); }
.mx-md { margin-left: clamp(...); margin-right: clamp(...); }
.my-md { margin-top: clamp(...); margin-bottom: clamp(...); }
.m-md  { margin: clamp(...); }

/* Padding — same pt/pb/pl/pr/px/py/p pattern */
.p-md { padding: clamp(...); }

/* Gap */
.gap-md   { gap: clamp(...); }
.gap-x-md { column-gap: clamp(...); }
.gap-y-md { row-gap: clamp(...); }
```

---

## Settings Panel

Left column, controls the math behind every size in the current data table:

| Field | Purpose | Valid Range |
|---|---|---|
| Space Units (PX/REM) | Output unit for all generated CSS | px or rem |
| Min Viewport Space Size | Base spacing value at the minimum viewport | 1–16px |
| Min Viewport Width | Screen width where the minimum applies | 200–5000px |
| Max Viewport Space Size | Base spacing value at the maximum viewport | 1–80px |
| Max Viewport Width | Screen width where the maximum applies | 200–5000px |
| Min Viewport Space Scaling | Scale ratio used for smaller screens | 1.067–1.333 |
| Max Viewport Space Scaling | Scale ratio used for larger screens | 1.067–1.333 |

Scale ratio options (musical harmony ratios): Minor Second (1.067), Major Second (1.125), Minor Third (1.200), Major Third (1.250), Perfect Fourth (1.333).

The **reset** button at the top of the Settings panel restores viewport width, base space, and scale values to their defaults after a confirmation prompt: 8px / 12px min/max space, 375px / 1620px min/max viewport, 1.125 Min Scale, and **1.333 Max Scale** (Perfect Fourth — this was changed from 1.25 in v1.2.4). It does not touch your class/variable Base selection or Prefix.

---

## The Spacing Data Table

Right column. Columns:

- **⋮** — drag handle. Click and hold to reorder rows. Order is visual only; calculations use each size's fixed ID, not its row position.
- **Suffix** — the name used in generated CSS (`xs`, `sm`, `md`, etc.). Click the ✎ icon to rename it.
- **Min Size** / **Max Size** — calculated automatically from the Base size and your scale settings; not directly editable.
- **Action** — ✎ edit (rename) and 🗑️ delete (with a confirmation dialog; deletion cannot be undone).

**Base dropdown** — selects which row is the reference point. Every other row's Min/Max Size is calculated as `base_value × scale^steps`, where `steps` is that row's distance from the base row in the table. Default base is `md` (the 3rd of the 6 default sizes).

**Prefix field** — the class prefix (Classes tab) or variable prefix (Variables tab) used when generating CSS. Hidden on the Utilities tab.

**Table buttons:**
- **add size** — adds a new row with an auto-generated suffix; rename it with the ✎ icon.
- **reset** — restores the original 6 default sizes (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`), resets Base back to `md`, and resets Prefix back to `space` (Classes) or `sp` (Variables).
- **clear all** — removes every row after a confirmation prompt. A notification with an **undo** button appears for 10 seconds afterward.

Sizes and prefixes are tracked separately per tab — clearing or resetting the Classes tab does not affect Variables or Utilities.

---

## Preview Panels

### Viewport Test Preview

An interactive slider (375px–1620px, matching your configured viewport range) driving three live samples:

- **Margin Preview** — shows the margin area expanding/contracting around fixed content.
- **Padding Preview** — shows a fixed container with padding growing inward as content shrinks.
- **Gap Preview** — a 2×2 grid showing spacing between four items.

The **Space Size** dropdown selects which row's value drives the preview. The viewport readout below the slider also reports a device category: Mobile (portrait), Mobile (landscape), Tablet (portrait), Tablet (landscape), Desktop, or Big Screen, based on the current slider position.

### Space Size Preview

Shows every size in the current table at once, side by side — all sizes at your configured minimum viewport on the left, all sizes at your configured maximum viewport on the right. Useful for reviewing the full scale at both extremes without moving a slider.

---

## CSS Output Panels

- **Selected Class CSS** — shows the CSS for whichever single size is currently selected via the Space Size dropdown, with its own **copy** button.
- **Generated CSS (All Classes)** — shows the complete CSS for every size on the active tab, with a **copy all** button. This panel scrolls internally (max height ~300px) rather than expanding the page.

Both use the clipboard API, which requires a secure (HTTPS) context or localhost — see [Troubleshooting](#troubleshooting) if copying fails.

---

## Upgrading from the Code Snippet Version

If Fluid Space Forge detects functions from an older "Space Clamp Calculator" code snippet still registered (`space_clamp_admin_page`, `render_space_clamp_page`, or `space_clamp_register_menu`), it displays a dismissible admin notice. On plugin activation, if no plugin settings exist yet, it automatically searches for and imports settings saved under any of several legacy option names used by that snippet.

To complete the upgrade: open **Code Snippets** in the WordPress admin, deactivate (and optionally delete) the old "Fluid Space Forge" / "Space Clamp Calculator" snippet, then refresh the Fluid Space Forge admin page.

---

## Understanding the Math

Every size's spacing is calculated with exponential scaling from the Base row:

```
steps = row_index - base_row_index
min_size = round(min_base_space × min_scale ^ steps)
max_size = round(max_base_space × max_scale ^ steps)
```

Those two values then become a CSS `clamp()` via linear interpolation between the min and max viewport widths:

```css
margin: clamp(min_size, calc(constant + coefficient·vw), max_size);
```

where `coefficient = (max_size − min_size) / (max_viewport − min_viewport) × 100` and `constant = min_size − coefficient × min_viewport / 100`. This produces a value that scales smoothly with viewport width with no breakpoints, and lands exactly on `min_size` and `max_size` at the two configured viewport widths.

---

## Usage Examples

### Component spacing with Variables

```css
.card {
  padding: var(--sp-lg);
  margin-bottom: var(--sp-md);
}
```

### Utility-first markup

```html
<div class="card p-lg mb-md">
  <h3 class="mb-sm">Card Title</h3>
  <p class="mb-md">Card content with fluid spacing</p>
</div>
```

### Class-based markup

```html
<div class="space-md">
  <p>This element carries fluid margin from the .space-md class.</p>
</div>
```

---

## Troubleshooting

**Spacing looks too small or too large.**
Adjust Min/Max Viewport Space Size in the Settings panel, or switch between PX and REM. Check the Space Size Preview panel to confirm the values at both extremes.

**Want more contrast between sizes.**
Increase Max Scale (try Major Third 1.250 or Perfect Fourth 1.333). This is the ratio applied per step away from your Base row.

**Spacing isn't scaling on the front end.**
Confirm the copied `clamp()` CSS wasn't altered, that no `!important` rule overrides it, and that the page has a standard viewport meta tag (`<meta name="viewport" content="width=device-width, initial-scale=1">`). Clear any caching plugin or CDN cache after regenerating CSS.

**Copy button doesn't work.**
The Clipboard API requires HTTPS (or localhost). Try a different browser, or manually select and copy the text with Ctrl+C.

**Can't reorder table rows.**
Click and hold directly on the ⋮ handle at the left edge of the row, then drag. Drag-and-drop requires JavaScript to be enabled; there is no keyboard-based reorder.

**Autosave doesn't seem to be saving.**
Confirm the Autosave toggle is on and wait for the 30-second interval, or click **save** to save immediately. Check the browser console (F12) for AJAX errors, and confirm your WordPress user still has the `manage_options` capability.

**Not sure what the Base dropdown does.**
It sets which row is the reference point for the scaling math. Every other row's Min/Max Size is calculated relative to the Base row using the Min/Max Scale ratios. Changing Base recalculates the entire table.

---

## Support

- **Plugin location**: Tools → Fluid Space Forge in WordPress admin
- **Quick Start**: [QUICK-START.md](QUICK-START.md)
- **Issues**: [GitHub Issues](https://github.com/Mij-Strebor/fluid-space-forge/issues)
- **WordPress support forum**: [wordpress.org/support/plugin/fluid-space-forge](https://wordpress.org/support/plugin/fluid-space-forge/)

---

*Fluid Space Forge v1.3.0 — © 2026 Jim R Forge ([jimrforge.com](https://jimrforge.com)). All rights reserved.*
