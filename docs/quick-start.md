# Quick Start Guide

Get Fluid Space Forge installed and generate your first responsive spacing CSS in about 5 minutes.

## 1. Install and Activate

1. In WordPress admin, go to **Plugins → Add New**, search for "Fluid Space Forge," click **Install Now**, then **Activate**.
   (Or upload the plugin ZIP via **Plugins → Add New → Upload Plugin** if installing manually.)
2. Open the tool at **Tools → Fluid Space Forge** in the WordPress admin menu.

> **Upgrading from the old code snippet version?** If Fluid Space Forge detects an active "Space Clamp Calculator" code snippet, it shows an admin notice and automatically imports your existing settings the first time the plugin runs. Deactivate the old snippet afterward — full instructions appear in the notice itself.

## 2. Review the Defaults

The plugin opens with working defaults already in place — you don't have to configure anything to get useful output:

| Setting | Default |
|---|---|
| Units | px |
| Min Viewport Space | 8px |
| Max Viewport Space | 12px |
| Min Viewport Width | 375px |
| Max Viewport Width | 1620px |
| Min Scale | 1.125 (Major Second) |
| Max Scale | 1.25 (Major Third) |
| Base size | `md` (size 3 of 6) |

The data table starts pre-populated with 6 sizes: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`. All non-base sizes are calculated automatically from the base using the scale ratios — you never enter their values by hand.

## 3. Pick an Output Format

Three tabs sit above the data table, each producing a different kind of CSS from the same spacing scale:

- **Classes** — one CSS class per size, e.g. `.space-md { margin: clamp(...); }`. The class prefix (`space` by default) is editable in the **Prefix** field next to the Base selector.
- **Variables** — CSS custom properties, e.g. `--sp-md: clamp(...);`, output inside a `:root { }` block. The variable prefix (`sp` by default) is also editable.
- **Utilities (Tailwind)** — a full set of directional utility classes per size: `.mt-md`, `.mb-md`, `.ml-md`, `.mr-md`, `.mx-md`, `.my-md`, `.m-md` for margin; the same pattern for padding (`.p*-md`); and `.gap-md`, `.gap-x-md`, `.gap-y-md` for gaps. This tab has no prefix field.

Pick whichever tab matches how you plan to use the CSS.

## 4. Preview Before You Copy

Two collapsible preview panels sit below the data table:

- **Viewport Test Preview** — drag the viewport slider from 375px to 1620px and watch a live Margin, Padding, and Gap sample interpolate in real time. Switch the **Space Size** dropdown to preview any size in your table. The display also reports the current device category (Mobile portrait/landscape, Tablet portrait/landscape, Desktop, Big Screen).
- **Space Size Preview** — shows every size in your table at once, side by side: minimum viewport width on the left, maximum on the right.

Close either panel if you don't need it — the collapsed/expanded state is remembered.

## 5. Copy the CSS

1. Scroll to **Generated CSS (All Classes)** and click **copy all** to copy everything on the active tab.
2. Or select an individual size in the table to populate **Selected Class CSS** with just that entry, and click **copy** there instead.
3. Paste into your stylesheet.

## 6. Save Your Work

- **Autosave** is on by default and, while enabled, saves your full settings and spacing table to the database automatically every 30 seconds.
- Click **save** at any time to save immediately — useful right before you close the tab.
- Panel layout, active tab, unit selection, and prefixes always save the instant you change them, regardless of the Autosave toggle — only the spacing table and viewport/scale settings depend on Autosave or a manual Save.

## Example Output

```css
/* Classes tab */
.space-md { margin: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }

/* Variables tab */
:root {
  --sp-md: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem);
}

/* Utilities tab */
.p-md { padding: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }
.gap-md { gap: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }
```

## Next Steps

- Adjust **Min/Max Viewport Space** and **Min/Max Scale** in the Settings panel to fit your design, then watch the table and previews update automatically.
- Add, edit, or delete sizes in the data table using **add size**, the ✎ edit icon, and the 🗑️ delete icon. Drag the ⋮ handle to reorder rows.
- Use **reset** on the table to restore the original 6 sizes, or **clear all** to empty it (you get a 10-second undo).
- For every setting, panel, and workflow in detail, see [USER-MANUAL.md](USER-MANUAL.md).

---

*Fluid Space Forge v1.2.4 — Jim R Forge ([jimrforge.com](https://jimrforge.com))*
