# Fluid Size Forge - Comprehensive CSS Variables with Clamp()

## Executive Summary

This document identifies all CSS variables across common design systems that could benefit from fluid `clamp()` sizing, organized by category. Each category includes standard sizes (S, M, L) with optional expanded scales.

---

## Variable Categories

### 1. SPACING (Current FSF Focus)
**Status:** ✅ Implemented  
**Variables:** `--sp-{size}` or `--space-{size}`  
**Scale:** xs, sm, md, lg, xl, xxl (6 sizes)  
**Use Cases:** margin, padding, gap  

### 2. TYPOGRAPHY
**Status:** 🔄 Proposed  
**Variables:** `--fs-{size}` (font-size)  
**Standard Scale:** sm, md, lg (3 sizes)  
**Expanded Scale:** xs, sm, md, lg, xl, xxl, display (7 sizes)  
**Example:**
```css
--fs-sm: clamp(0.875rem, calc(0.8rem + 0.2vw), 1rem);    /* 14px → 16px */
--fs-md: clamp(1rem, calc(0.9rem + 0.3vw), 1.25rem);     /* 16px → 20px */
--fs-lg: clamp(1.25rem, calc(1.1rem + 0.4vw), 1.75rem);  /* 20px → 28px */
```

### 3. LINE HEIGHT
**Status:** 🔄 Proposed  
**Variables:** `--lh-{size}` (line-height)  
**Standard Scale:** tight, normal, loose (3 sizes)  
**Expanded Scale:** ultra-tight, tight, snug, normal, relaxed, loose, ultra-loose (7 sizes)  
**Example:**
```css
--lh-tight: clamp(1.2, calc(1.15 + 0.1vw), 1.3);
--lh-normal: clamp(1.4, calc(1.35 + 0.1vw), 1.5);
--lh-loose: clamp(1.6, calc(1.55 + 0.1vw), 1.75);
```

### 4. LETTER SPACING
**Status:** 🔄 Proposed  
**Variables:** `--ls-{size}` (letter-spacing)  
**Standard Scale:** tight, normal, wide (3 sizes)  
**Expanded Scale:** ultra-tight, tight, snug, normal, wide, ultra-wide (6 sizes)  
**Example:**
```css
--ls-tight: clamp(-0.02em, calc(-0.025em + 0.01vw), -0.01em);
--ls-normal: clamp(0em, calc(0em + 0vw), 0em);
--ls-wide: clamp(0.02em, calc(0.015em + 0.01vw), 0.05em);
```

### 5. BORDER RADIUS
**Status:** 🔄 Proposed  
**Variables:** `--radius-{size}` or `--br-{size}`  
**Standard Scale:** sm, md, lg (3 sizes)  
**Expanded Scale:** none, xs, sm, md, lg, xl, full (7 sizes)  
**Example:**
```css
--radius-sm: clamp(0.25rem, calc(0.2rem + 0.1vw), 0.375rem);  /* 4px → 6px */
--radius-md: clamp(0.375rem, calc(0.3rem + 0.15vw), 0.5rem);  /* 6px → 8px */
--radius-lg: clamp(0.5rem, calc(0.4rem + 0.2vw), 0.75rem);    /* 8px → 12px */
```

### 6. BORDER WIDTH
**Status:** 🔄 Proposed  
**Variables:** `--bw-{size}` (border-width)  
**Standard Scale:** thin, medium, thick (3 sizes)  
**Expanded Scale:** hairline, thin, medium, thick, ultra (5 sizes)  
**Example:**
```css
--bw-thin: clamp(1px, calc(1px + 0.05vw), 1.5px);
--bw-medium: clamp(2px, calc(1.5px + 0.1vw), 3px);
--bw-thick: clamp(3px, calc(2.5px + 0.15vw), 4px);
```

### 7. WIDTH / MAX-WIDTH (Containers)
**Status:** 🔄 Proposed  
**Variables:** `--container-{size}` or `--width-{size}`  
**Standard Scale:** sm, md, lg (3 sizes)  
**Expanded Scale:** xs, sm, md, lg, xl, xxl, full (7 sizes)  
**Example:**
```css
--container-sm: clamp(640px, calc(600px + 10vw), 768px);
--container-md: clamp(768px, calc(720px + 15vw), 1024px);
--container-lg: clamp(1024px, calc(960px + 20vw), 1280px);
```

### 8. HEIGHT (Components)
**Status:** 🔄 Proposed  
**Variables:** `--height-{size}` or `--h-{size}`  
**Standard Scale:** sm, md, lg (3 sizes)  
**Expanded Scale:** xs, sm, md, lg, xl (5 sizes)  
**Common Uses:** buttons, inputs, cards, headers  
**Example:**
```css
--h-button-sm: clamp(2rem, calc(1.8rem + 0.5vw), 2.5rem);    /* 32px → 40px */
--h-button-md: clamp(2.5rem, calc(2.25rem + 0.6vw), 3rem);   /* 40px → 48px */
--h-button-lg: clamp(3rem, calc(2.75rem + 0.75vw), 3.5rem);  /* 48px → 56px */
```

### 9. ICON SIZE
**Status:** 🔄 Proposed  
**Variables:** `--icon-{size}`  
**Standard Scale:** sm, md, lg (3 sizes)  
**Expanded Scale:** xs, sm, md, lg, xl (5 sizes)  
**Example:**
```css
--icon-sm: clamp(1rem, calc(0.9rem + 0.25vw), 1.25rem);    /* 16px → 20px */
--icon-md: clamp(1.5rem, calc(1.4rem + 0.3vw), 2rem);      /* 24px → 32px */
--icon-lg: clamp(2rem, calc(1.8rem + 0.5vw), 3rem);        /* 32px → 48px */
```

### 10. SHADOW / ELEVATION
**Status:** 🔄 Proposed  
**Variables:** `--shadow-{size}` or `--elevation-{size}`  
**Standard Scale:** sm, md, lg (3 sizes)  
**Expanded Scale:** none, xs, sm, md, lg, xl, xxl (7 sizes)  
**Note:** Uses clamp() for blur radius and spread  
**Example:**
```css
--shadow-sm: 0 clamp(1px, calc(0.5px + 0.1vw), 2px) clamp(2px, calc(1px + 0.2vw), 4px) rgba(0,0,0,0.1);
--shadow-md: 0 clamp(2px, calc(1px + 0.2vw), 4px) clamp(4px, calc(2px + 0.4vw), 8px) rgba(0,0,0,0.15);
--shadow-lg: 0 clamp(4px, calc(2px + 0.4vw), 8px) clamp(8px, calc(4px + 0.8vw), 16px) rgba(0,0,0,0.2);
```

### 11. Z-INDEX (Optional)
**Status:** ⚠️ Edge Case  
**Variables:** `--z-{layer}`  
**Standard Scale:** base, dropdown, modal (3 sizes)  
**Note:** Usually static integers, but could scale for complex UIs  
**Example:**
```css
--z-base: 1;
--z-dropdown: 100;
--z-modal: 1000;
```

### 12. TRANSITION DURATION
**Status:** 🔄 Proposed  
**Variables:** `--duration-{speed}` or `--transition-{speed}`  
**Standard Scale:** fast, normal, slow (3 sizes)  
**Expanded Scale:** instant, fast, normal, slow, ultra-slow (5 sizes)  
**Example:**
```css
--duration-fast: clamp(100ms, calc(80ms + 0.05vw), 150ms);
--duration-normal: clamp(200ms, calc(150ms + 0.1vw), 300ms);
--duration-slow: clamp(300ms, calc(250ms + 0.15vw), 500ms);
```

### 13. GAP (Grid/Flex specific)
**Status:** ✅ Partially Implemented (via spacing)  
**Variables:** `--gap-{size}`  
**Standard Scale:** sm, md, lg (3 sizes)  
**Note:** Often references spacing variables  
**Example:**
```css
--gap-sm: var(--sp-sm);   /* or independent clamp() */
--gap-md: var(--sp-md);
--gap-lg: var(--sp-lg);
```

### 14. ASPECT RATIO PADDING (Legacy technique)
**Status:** ⚠️ Less relevant with native aspect-ratio  
**Variables:** `--aspect-{ratio}`  
**Standard Scale:** square, video, wide (3 sizes)  
**Example:**
```css
--aspect-square: 100%;      /* 1:1 */
--aspect-video: 56.25%;     /* 16:9 */
--aspect-wide: 41.67%;      /* 21:9 */
```

---

## Recommended Implementation Priority

### Phase 1 (High Value, Low Complexity)
1. ✅ **Spacing** - Already implemented
2. **Typography (font-size)** - Natural extension, high demand
3. **Border Radius** - Common, visual impact, simple math

### Phase 2 (Medium Value, Medium Complexity)
4. **Height (Components)** - Buttons, inputs, cards
5. **Icon Size** - UI consistency
6. **Container Width** - Layout control

### Phase 3 (Lower Priority, Higher Complexity)
7. **Shadow/Elevation** - Complex syntax, multiple values
8. **Line Height** - Subtle, typography-focused
9. **Letter Spacing** - Typography refinement
10. **Border Width** - Less common, smaller visual impact

### Phase 4 (Edge Cases)
11. **Transition Duration** - Niche use case
12. **Z-Index** - Usually static
13. **Aspect Ratio** - Legacy technique

---

## UI Design Specification

### Conceptual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  FLUID SIZE FORGE                                     [Settings]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SIZE CATEGORY SELECTOR (Tabs)                            │  │
│  ├──────┬──────┬──────┬──────┬──────┬──────┬──────┬─────────┤  │
│  │Space │ Type │Radius│ Size │Shadow│ More...        [+Add] │  │
│  │ ✓    │      │      │      │      │                       │  │
│  └──────┴──────┴──────┴──────┴──────┴──────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ CATEGORY: SPACING                              [Enabled]│   │
│  │                                                          │   │
│  │ Output Prefix: --sp-          Unit: [REM ▼]            │   │
│  │ Number of Sizes: [●●●●●● 6] (3-10 range slider)       │   │
│  │                                                          │   │
│  │ Global Viewport Settings (applies to all categories)   │   │
│  │ Min Viewport: [375]px    Max Viewport: [1620]px        │   │
│  │                                                          │   │
│  │ ┌────────────────────────────────────────────────────┐  │   │
│  │ │ SIZE CONFIGURATION TABLE                           │  │   │
│  │ ├───┬──────┬─────────┬─────────┬─────────┬──────────┤  │   │
│  │ │ ⋮ │ Name │ Min Val │ Max Val │  Scale  │ Actions  │  │   │
│  │ ├───┼──────┼─────────┼─────────┼─────────┼──────────┤  │   │
│  │ │ ⋮ │ xs   │ 0.5rem  │ 0.625rem│ 1.125   │ ✎  🗑    │  │   │
│  │ │ ⋮ │ sm   │ 0.6rem  │ 0.75rem │ 1.125   │ ✎  🗑    │  │   │
│  │ │ ⋮ │ md   │ 0.75rem │ 1rem    │ 1.125   │ ✎  🗑    │  │   │
│  │ │ ⋮ │ lg   │ 1rem    │ 1.3rem  │ 1.125   │ ✎  🗑    │  │   │
│  │ │ ⋮ │ xl   │ 1.3rem  │ 1.7rem  │ 1.125   │ ✎  🗑    │  │   │
│  │ │ ⋮ │ xxl  │ 1.7rem  │ 2.2rem  │ 1.125   │ ✎  🗑    │  │   │
│  │ └───┴──────┴─────────┴─────────┴─────────┴──────────┘  │   │
│  │                                                          │   │
│  │ [+ Add Size]  [Reset to Defaults]  [Clear All]         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ LIVE PREVIEW                                            │   │
│  │ ┌─────────────────────┬─────────────────────────────┐  │   │
│  │ │ Min Viewport (375px)│ Max Viewport (1620px)       │  │   │
│  │ ├─────────────────────┼─────────────────────────────┤  │   │
│  │ │ xs: 0.5rem (8px)    │ xs: 0.625rem (10px)         │  │   │
│  │ │ sm: 0.6rem (9.6px)  │ sm: 0.75rem (12px)          │  │   │
│  │ │ md: 0.75rem (12px)  │ md: 1rem (16px)             │  │   │
│  │ │ lg: 1rem (16px)     │ lg: 1.3rem (20.8px)         │  │   │
│  │ │ xl: 1.3rem (20.8px) │ xl: 1.7rem (27.2px)         │  │   │
│  │ │ xxl: 1.7rem (27.2px)│ xxl: 2.2rem (35.2px)        │  │   │
│  │ └─────────────────────┴─────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ CSS OUTPUT                                    [Copy All]│   │
│  │ ┌────────────────────────────────────────────────────┐  │   │
│  │ │ :root {                                            │  │   │
│  │ │   --sp-xs: clamp(0.5rem, calc(0.45rem + ...);     │  │   │
│  │ │   --sp-sm: clamp(0.6rem, calc(0.54rem + ...);     │  │   │
│  │ │   --sp-md: clamp(0.75rem, calc(0.68rem + ...);    │  │   │
│  │ │   --sp-lg: clamp(1rem, calc(0.9rem + ...);        │  │   │
│  │ │   --sp-xl: clamp(1.3rem, calc(1.17rem + ...);     │  │   │
│  │ │   --sp-xxl: clamp(1.7rem, calc(1.53rem + ...);    │  │   │
│  │ │ }                                                  │  │   │
│  │ └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Specifications

### 1. Category Tabs (Top Navigation)

**Purpose:** Switch between different CSS variable categories  
**Design:**
- Horizontal tab bar with icon + label
- Active tab highlighted with gold (#f4c542)
- Badge showing "Enabled" count per category
- Overflow scroll for 10+ categories
- "+ Add Custom" button for user-defined categories

**Tab List:**
```
[Space ✓] [Type] [Radius] [Size] [Shadow] [Line] [Letter] [Border] [Icon] [More ▼] [+ Add]
```

**Interaction:**
- Click to switch category
- Shows/hides category configuration panel
- Maintains independent state per category
- Auto-save on category switch

### 2. Category Configuration Panel

**Purpose:** Configure settings for selected category  
**Components:**

**A. Category Header**
```
┌────────────────────────────────────────────────────┐
│ CATEGORY: TYPOGRAPHY                     [Enabled] │
│                                          └─toggle  │
└────────────────────────────────────────────────────┘
```

**B. Output Settings**
```
Output Prefix: [--fs-]      Unit: [REM ▼]
                └─text input      └─dropdown: PX, REM, EM
```

**C. Size Scale Selector**
```
Number of Sizes: [●●●●●● 6]
                 └─range slider (3-10)
                 
Presets: [3-Size] [6-Size] [7-Size] [10-Size] [Custom]
         └─quick buttons for common scales
```

**D. Viewport Settings** (shared across all categories)
```
┌────────────────────────────────────────────────────┐
│ Global Viewport Settings                          │
│ Min Viewport: [375]px    Max Viewport: [1620]px  │
│ └─affects all categories simultaneously           │
└────────────────────────────────────────────────────┘
```

### 3. Size Configuration Table

**Purpose:** Define individual size values  
**Columns:**

1. **⋮ Handle** - Drag to reorder
2. **Name** - Size suffix (xs, sm, md, etc.)
3. **Min Val** - Value at min viewport
4. **Max Val** - Value at max viewport
5. **Scale** - Scaling ratio (inherited or custom)
6. **Preview** - Visual representation (new!)
7. **Actions** - Edit (✎) and Delete (🗑)

**New Feature: Visual Preview Column**
```
┌─────────┐
│ Preview │
├─────────┤
│ [▁]     │  xs - tiny bar
│ [▃]     │  sm - small bar
│ [▅]     │  md - medium bar
│ [▇]     │  lg - large bar
│ [█]     │  xl - larger bar
│ [██]    │  xxl - largest bar
└─────────┘
```

**Enhanced Row Design:**
```
┌───┬──────┬─────────┬─────────┬─────────┬─────────┬──────────┐
│ ⋮ │ xs   │ 0.5rem  │ 0.625rem│ 1.125   │ [▁]     │ ✎  🗑    │
│   │      │ (8px)   │ (10px)  │         │         │          │
└───┴──────┴─────────┴─────────┴─────────┴─────────┴──────────┘
     └─────────────────────────────────────────────────────────
            Tooltip: "clamp(0.5rem, calc(...), 0.625rem)"
```

### 4. Multi-Category View (New Feature)

**Purpose:** See and compare multiple categories simultaneously  
**Design Option 1: Accordion**
```
┌──────────────────────────────────────────────────┐
│ ▼ SPACING (6 sizes)                    [Enabled] │
│   [Full table visible]                           │
│                                                  │
│ ► TYPOGRAPHY (3 sizes)                 [Enabled] │
│                                                  │
│ ► BORDER RADIUS (3 sizes)           [Disabled]  │
│                                                  │
│ ► SHADOW (4 sizes)                     [Enabled] │
└──────────────────────────────────────────────────┘
```

**Design Option 2: Side-by-Side Grid** (for large screens)
```
┌──────────────────┬──────────────────┬──────────────────┐
│ SPACING          │ TYPOGRAPHY       │ RADIUS           │
│ [6 sizes table]  │ [3 sizes table]  │ [3 sizes table]  │
│                  │                  │                  │
├──────────────────┼──────────────────┼──────────────────┤
│ SIZE             │ SHADOW           │ ICON             │
│ [5 sizes table]  │ [4 sizes table]  │ [5 sizes table]  │
└──────────────────┴──────────────────┴──────────────────┘
```

### 5. Enhanced Live Preview

**Current:** Two-column min/max comparison  
**Proposed:** Interactive viewport slider + visual samples

```
┌─────────────────────────────────────────────────────────────┐
│ LIVE PREVIEW                                                │
│                                                             │
│ Viewport: [●──────────────────────] 768px (Tablet)         │
│           └─slider: 375px → 1620px                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ SPACING Preview                                         ││
│ │ ┌────────────┐                                          ││
│ │ │ xs: 9px    │ [Tiny box with xs padding]              ││
│ │ └────────────┘                                          ││
│ │ ┌──────────────┐                                        ││
│ │ │ sm: 11px     │ [Small box with sm padding]           ││
│ │ └──────────────┘                                        ││
│ │ ┌────────────────┐                                      ││
│ │ │ md: 14px       │ [Medium box with md padding]        ││
│ │ └────────────────┘                                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ TYPOGRAPHY Preview                                      ││
│ │ sm: Sample Text (14px)                                  ││
│ │ md: Sample Text (17px)                                  ││
│ │ lg: Sample Text (22px)                                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ RADIUS Preview                                          ││
│ │ [Box with sm radius] [Box with md radius] [Box lg]     ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 6. Unified CSS Output Panel

**Purpose:** Show combined CSS from all enabled categories  
**Features:**

- **Tabbed output:** All, Spacing, Typography, Radius, etc.
- **Syntax highlighting:** Color-coded CSS
- **Copy buttons:** Copy All, Copy Category
- **Format options:** Minified, Formatted, CSS Layers

```
┌─────────────────────────────────────────────────────────┐
│ CSS OUTPUT                                    [Copy All]│
│ [All] [Spacing] [Typography] [Radius] [Shadow]         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ :root {                                           │  │
│ │   /* Spacing */                                   │  │
│ │   --sp-xs: clamp(0.5rem, calc(...), 0.625rem);   │  │
│ │   --sp-sm: clamp(0.6rem, calc(...), 0.75rem);    │  │
│ │                                                   │  │
│ │   /* Typography */                                │  │
│ │   --fs-sm: clamp(0.875rem, calc(...), 1rem);     │  │
│ │   --fs-md: clamp(1rem, calc(...), 1.25rem);      │  │
│ │                                                   │  │
│ │   /* Border Radius */                             │  │
│ │   --radius-sm: clamp(0.25rem, calc(...), ...);   │  │
│ │ }                                                 │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ [Download as CSS] [Copy to Clipboard] [Export JSON]   │
└─────────────────────────────────────────────────────────┘
```

### 7. Category Presets Library

**Purpose:** Quick-start templates for different variable types  
**Location:** Settings modal or sidebar

```
┌─────────────────────────────────────────────────┐
│ CATEGORY PRESETS                                │
├─────────────────────────────────────────────────┤
│ □ Spacing (6 sizes: xs-xxl)                     │
│ □ Typography (7 sizes: xs-display)              │
│ □ Border Radius (5 sizes: none-full)            │
│ □ Component Heights (5 sizes: xs-xl)            │
│ □ Icon Sizes (5 sizes: xs-xl)                   │
│ □ Shadows (7 sizes: none-xxl)                   │
│ □ Container Widths (7 sizes: xs-full)           │
│ □ Line Heights (3 sizes: tight-loose)           │
│ □ Letter Spacing (3 sizes: tight-wide)          │
│ □ Border Widths (3 sizes: thin-thick)           │
│                                                 │
│ [✓ Select All] [Load Selected Categories]      │
└─────────────────────────────────────────────────┘
```

---

## Technical Implementation Notes

### Data Structure (per category)

```javascript
const categoryConfig = {
  id: 'typography',
  enabled: true,
  name: 'Typography',
  icon: '🔤',
  prefix: '--fs-',
  unit: 'rem',
  unitOptions: ['px', 'rem', 'em'],
  minViewport: 375,
  maxViewport: 1620,
  sizes: [
    {
      id: 1,
      suffix: 'sm',
      minValue: 0.875,
      maxValue: 1,
      scale: 1.125,
      order: 1
    },
    {
      id: 2,
      suffix: 'md',
      minValue: 1,
      maxValue: 1.25,
      scale: 1.125,
      order: 2
    },
    // ... more sizes
  ]
};
```

### Storage Strategy

**Option 1: Unified Settings**
```php
// Single option containing all categories
update_option('fluidsizeforge_config', [
  'spacing' => [...],
  'typography' => [...],
  'radius' => [...],
  // etc.
]);
```

**Option 2: Category-Specific Options**
```php
// Separate options per category (current FSF pattern)
update_option('fluidsizeforge_spacing', [...]);
update_option('fluidsizeforge_typography', [...]);
update_option('fluidsizeforge_radius', [...]);
```

### JavaScript Module Structure

```
assets/js/
├── categories/
│   ├── category-manager.js      // Core category switching
│   ├── spacing-controller.js    // Spacing-specific logic
│   ├── typography-controller.js // Typography-specific logic
│   └── radius-controller.js     // Radius-specific logic
├── shared/
│   ├── clamp-calculator.js      // Shared clamp() math
│   ├── preview-generator.js     // Live preview rendering
│   └── table-controller.js      // Reusable table component
└── main.js                       // Initialization
```

---

## User Workflows

### Workflow 1: Enable Multiple Categories

1. User opens Fluid Size Forge
2. Clicks "Settings" → "Category Presets"
3. Checks: Spacing, Typography, Border Radius
4. Clicks "Load Selected Categories"
5. Three tabs appear in category selector
6. Each category has independent configuration
7. Combined CSS output shows all categories

### Workflow 2: Configure Typography

1. User clicks "Type" tab
2. Selects "7-Size" preset (xs, sm, md, lg, xl, xxl, display)
3. Sets prefix to `--fs-`
4. Adjusts min/max values per size
5. Drags viewport slider to preview interpolation
6. Copies CSS output for typography only

### Workflow 3: Export Complete Design System

1. User enables: Spacing, Typography, Radius, Shadow
2. Configures each category independently
3. Clicks "CSS Output" → "All" tab
4. Clicks "Download as CSS" → saves `design-tokens.css`
5. Includes comprehensive comment headers per category

---

## Visual Design Tokens (for FSF UI itself)

```css
/* Category Tab Colors */
--category-spacing: #3b82f6;    /* Blue */
--category-type: #8b5cf6;       /* Purple */
--category-radius: #ec4899;     /* Pink */
--category-size: #10b981;       /* Green */
--category-shadow: #6366f1;     /* Indigo */
--category-line: #f59e0b;       /* Amber */
--category-letter: #06b6d4;     /* Cyan */
--category-border: #84cc16;     /* Lime */
--category-icon: #f97316;       /* Orange */
--category-custom: #64748b;     /* Slate */
```

---

## Accessibility Considerations

1. **Keyboard Navigation:** Full tab/arrow key support across categories
2. **Screen Readers:** Announce category switches, value changes
3. **Focus Indicators:** Clear focus rings on all interactive elements
4. **Labels:** All inputs properly labeled with aria-label
5. **Color Contrast:** Maintain WCAG AA across all category colors

---

## Next Steps for Implementation

### Phase 1: Foundation (v1.3.0)
- Refactor current FSF to support multiple categories
- Create category manager module
- Implement category switching UI
- Add Typography category as proof of concept

### Phase 2: Expansion (v1.4.0)
- Add Border Radius category
- Add Component Heights category
- Add Icon Sizes category
- Implement unified CSS output

### Phase 3: Advanced Features (v1.5.0)
- Add Shadow/Elevation category
- Add Container Widths category
- Add Line Height category
- Implement category presets library

### Phase 4: Polish (v1.6.0)
- Enhanced live preview with interactive slider
- Visual preview column in size tables
- Category comparison view
- Export to design token formats (JSON, YAML)

---

## Summary

This comprehensive specification outlines 14 CSS variable categories that could benefit from fluid clamp() sizing, with detailed UI designs for managing them within a unified Fluid Size Forge interface. The modular architecture allows incremental implementation while maintaining the solid foundation of the current FSF spacing system.

**Total Variable Types:** 14  
**Recommended Initial Focus:** Spacing (done), Typography, Border Radius  
**Standard Scale:** 3 sizes (S/M/L)  
**Expanded Scale:** 5-10 sizes per category  
**UI Pattern:** Tab-based category switcher with shared configuration components
