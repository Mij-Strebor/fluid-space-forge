# Fluid Space Forge - Controls Reference

**Version:** 1.2.0
**Last Updated:** 2025-01-27

## Overview

This document defines all user-controllable elements in Fluid Space Forge (FSF). All controls listed here are **persistent** - their states are saved to the WordPress database and restored when the user returns to the plugin, even after closing the browser or logging out.

---

## Control Specifications

### About Panel

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Header toggle | Button | Open, Closed | Open | Collapsible panel toggle |

---

### How to Use Panel

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Header toggle | Button | Open, Closed | Open | Collapsible panel toggle |

---

### Main Controls (No specific panel)

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Autosave checkbox | Checkbox | Checked, Unchecked | Unchecked | Enables/disables automatic saving |
| Save button state | Indicator | Ready, Saving, Saved | Ready | Returns to "Ready" on page refresh |
| Tab selection | Tabs | Classes, Variables, Utilities | Classes | Active tab determines data table content |

---

### Settings Panel

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Space Units | Toggle buttons | PX, REM | PX | Units for space calculations |
| Min Viewport Space Size | Number input | 1-16 | 8 | Base space size at minimum viewport (px) |
| Min Viewport Width | Number input | 200-992 | 375 | Minimum viewport width (px) |
| Max Viewport Space Size | Number input | >min to 32 | 12 | Base space size at maximum viewport (px) |
| Max Viewport Width | Number input | >min to 1920 | 1620 | Maximum viewport width (px) |
| Min Viewport Space Scaling | Dropdown | List of harmonics | 1.125 Major Second | Scaling ratio at min viewport |
| Max Viewport Space Scaling | Dropdown | List of harmonics | 1.200 Minor Third | Scaling ratio at max viewport |

#### Type Scale Harmonics Reference

The scaling ratios are based on musical intervals and provide mathematically harmonious spacing progressions. These ratios determine how much each step in your spacing scale (xs → sm → md → lg → xl → xxl) increases.

| Ratio | Name | Musical Interval | Character | Best For |
|-------|------|-----------------|-----------|----------|
| 1.067 | Minor Second | Half step | Very subtle, tight | Compact designs, minimal hierarchy |
| 1.125 | Major Second | Whole step | **Subtle, balanced** | Most layouts, gentle progression |
| 1.200 | Minor Third | 3 half steps | **Noticeable, clear** | Good contrast, general purpose |
| 1.250 | Major Third | 4 half steps | Strong, distinctive | Bold designs, clear hierarchy |
| 1.333 | Perfect Fourth | 5 half steps | Dramatic, confident | Marketing sites, visual impact |
| 1.414 | Augmented Fourth | Tritone | Bold, striking | Experimental, modern designs |
| 1.500 | Perfect Fifth | 7 half steps | Very strong | High contrast layouts |
| 1.618 | Golden Ratio | Phi (φ) | Natural, elegant | Organic, sophisticated designs |

**How Scaling Works:**

If your base (md) is 8px:
- **1.125 (Major Second)** → xs: 6.3px, sm: 7.1px, **md: 8px**, lg: 9px, xl: 10.1px, xxl: 11.4px
- **1.200 (Minor Third)** → xs: 5.6px, sm: 6.7px, **md: 8px**, lg: 9.6px, xl: 11.5px, xxl: 13.8px
- **1.333 (Perfect Fourth)** → xs: 4.5px, sm: 6px, **md: 8px**, lg: 10.7px, xl: 14.2px, xxl: 19px

**Why Use Different Ratios for Min/Max Viewports?**

You can use the same ratio for both (e.g., 1.200 for consistency), or use different ratios to create responsive scaling behavior:
- **Tighter on mobile** (1.125 min) → **Bolder on desktop** (1.333 max) - Spaces compress on small screens, expand dramatically on large screens
- **Same ratio both** (1.200/1.200) - Consistent proportional relationships at all viewport sizes
- **Experimental** (1.500 min) → **Subtle on desktop** (1.125 max) - Reverse the typical pattern for unique effects

**Default Choice:** 1.125 (min) and 1.200 (max) provides subtle mobile spacing that opens up nicely on desktop while maintaining clear hierarchy.

---

### Space Size Classes Tab (Data Table Panel)

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Base | Dropdown | List of class suffixes from data table | md | Selected entry receives Settings base value |
| Prefix | Text input | Any text string | `space` | Must start with alpha character; used in generated CSS as `.{prefix}-{suffix}` |
| Data table rows | Editable table | List of any nonblank suffixes | xs, sm, md, lg, xl, xxl | User can add/edit/delete/reorder rows |

**Data Table Row Structure:**
- **Suffix** (e.g., "xs", "sm", "md") - User-editable text
- **Min Size** - Calculated based on Settings and Base selection
- **Max Size** - Calculated based on Settings and Base selection
- **Action buttons** - Edit, Delete, Drag handle

**Base Selection Logic:**
- The entry selected as Base receives the exact value from Settings (Min/Max Viewport Space Size)
- Other entries are calculated using the scaling ratios
- If user renames the Base entry, it remains the Base
- Any entry can be set as Base
- **Note:** This logic is currently working correctly

---

### CSS Custom Properties Tab (Data Table Panel)

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Base | Dropdown | List of variable suffixes from data table | md | Selected entry receives Settings base value |
| Prefix | Text input | Nonblank alpha string (min 1 char) | `sp` | Must be alpha characters; used in generated CSS as `--{prefix}-{suffix}` |
| Data table rows | Editable table | List of any nonblank suffixes | xs, sm, md, lg, xl, xxl | User can add/edit/delete/reorder rows |

**Data Table Row Structure:** Same as Space Size Classes tab

---

### Utilities (Tailwind) Tab (Data Table Panel)

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Base | Dropdown | List of utility suffixes from data table | md | Selected entry receives Settings base value |
| Prefix | **DOES NOT EXIST** | N/A | N/A | No prefix control for Utilities tab |
| Data table rows | Editable table | List of any nonblank suffixes | xs, sm, md, lg, xl, xxl | User can add/edit/delete/reorder rows |

**Generated Format:** `.{type}{side}-{suffix}` (e.g., `.mt-lg`, `.pb-md`, `.gap-sm`)

---

### Viewport Test Preview Panel

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Header toggle | Button | Open, Closed | Closed | Collapsible panel toggle |
| Space Size | Dropdown | Any suffix from active tab's data table | md | Selects which size to preview |
| Viewport Slider | Range slider | Min Viewport Width to Max Viewport Width | 1200 | Real-time viewport width simulation |

**Slider Initial Value:** 1200px (desktop breakpoint) - can be any value within the min-max range

---

### Space Size Preview Panel

| Control | Type | Possible States | Initial/Default State | Notes |
|---------|------|----------------|---------------------|-------|
| Header toggle | Button | Open, Closed | Closed | Collapsible panel toggle |

**Note:** This panel shows side-by-side min/max previews and has no additional controls beyond the toggle.

---

### Output Panels (Auto-generated, not user-controlled)

#### Selected CSS Panel
- Displays CSS for the currently selected row in the data table
- Auto-updates on row selection
- Has a Copy button

#### Generated CSS Panel
- Displays complete CSS for all entries in the active tab
- Auto-updates whenever settings or data table changes
- Has a Copy All button

---

## Persistence Details

### What Gets Saved

All controls listed above persist their state in the WordPress options table using these option keys:

- `fluispfo_settings` - Contains:
  - Panel collapse states (aboutExpanded, howToUseExpanded, viewportTestExpanded, spaceSizeExpanded)
  - Autosave state (autosaveEnabled)
  - Active tab (activeTab)
  - Space units (unitType)
  - Viewport settings (minViewport, maxViewport, minBasespace, maxBasespace)
  - Scaling ratios (minViewportScaling, maxViewportScaling)
  - **Prefix values** (classPrefix, variablePrefix)
  - Save button state indicator

- `fluispfo_class_sizes` - Array of class size objects
- `fluispfo_variable_sizes` - Array of variable size objects
- `fluispfo_utility_sizes` - Array of utility size objects

### When Saving Occurs

1. **Manual Save:** User clicks Save button
2. **Autosave:** If enabled, triggers after data changes (debounced)
3. **State Changes:** Panel toggles, tab switches, and control changes all trigger saves when autosave is enabled

### On Page Load

All saved states are restored from the database, ensuring the exact UI configuration the user last used.

---

## Validation Rules

### Settings Panel
- **Min Viewport Space Size:** 1-16 (integers)
- **Max Viewport Space Size:** Must be > Min Viewport Space Size, max 32
- **Min Viewport Width:** 200-992 (px)
- **Max Viewport Width:** Must be > Min Viewport Width, max 1920 (px)

### Prefix Fields
- **Classes Prefix:**
  - Any text string
  - Should start with alpha character (recommended)
  - Cannot be blank (defaults to "space")

- **Variables Prefix:**
  - Must be nonblank
  - Must be alpha characters only
  - Minimum 1 character
  - Defaults to "sp"

### Data Table Suffixes
- Cannot be blank
- Should be unique within the tab's data table
- Recommended: lowercase, alphanumeric with hyphens

---

## Default Initial State (Fresh Install)

```javascript
{
  // Panel states
  aboutExpanded: true,
  howToUseExpanded: true,
  viewportTestExpanded: false,
  spaceSizeExpanded: false,

  // Main controls
  autosaveEnabled: false,
  activeTab: 'class',

  // Settings
  unitType: 'px',
  minBasespace: 8,
  maxBasespace: 12,
  minViewport: 375,
  maxViewport: 1620,
  minViewportScaling: 1.125, // Major Second
  maxViewportScaling: 1.200, // Minor Third

  // Prefixes
  classPrefix: 'space',
  variablePrefix: 'sp',

  // Data tables (each tab)
  sizes: [
    { id: 1, suffix: 'xs', ... },
    { id: 2, suffix: 'sm', ... },
    { id: 3, suffix: 'md', ... }, // Base entry
    { id: 4, suffix: 'lg', ... },
    { id: 5, suffix: 'xl', ... },
    { id: 6, suffix: 'xxl', ... }
  ],

  // Viewport Test Preview
  viewportSliderValue: 1200,
  selectedSpaceSize: 'md'
}
```

---

## Notes for Developers

### Current Known Issues (as of 2025-01-27)
1. Panel collapse states not persisting across refresh
2. Prefix values not saving to database
3. Variables tab shows "space" instead of "sp" on initial load
4. Utilities tab Prefix control still visible (should be hidden)

### Implementation Files
- **Settings storage:** `fluid-space-forge.php` - `create_default_settings()`, `save_settings()`
- **JavaScript state:** `admin-script.js` - Various functions handle state management
- **Autosave logic:** `autosave-manager.js`
- **Templates:** `templates/admin/*.php`

---

## Related Documentation

For a similar control reference for Font Forge (FFF), see: `[TBD - to be created]`

---

**Document Status:** ✅ Complete and ready for implementation reference
