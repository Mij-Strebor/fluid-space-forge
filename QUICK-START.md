# Quick Start Guide

Get started with Fluid Space Forge in 5 minutes and generate your first responsive spacing system.

## Installation

1. **Activate the Plugin**
   - Navigate to **Plugins** in WordPress admin
   - Find "Fluid Space Forge" and click **Activate**

2. **Access the Interface**
   - Go to **Tools → Fluid Space Forge**
   - The admin interface will load with default settings

## Your First Spacing Scale

### Step 1: Review Default Settings (30 seconds)

The plugin starts with sensible defaults:
- **Viewport Range**: 375px (mobile) to 1620px (desktop)
- **Space Units**: PX (predictable, easy to understand)
- **Base Space**: 8px minimum, 12px maximum
- **Scaling**: Major Second (1.125) for min, Major Third (1.25) for max viewport
- **Pre-populated sizes**: 6 default sizes (xs, sm, md, lg, xl, xxl)

**Action**: Leave these defaults for now, or adjust if you have specific requirements.

### Step 2: Understand the Default Sizes (1 minute)

The data table comes pre-populated with 6 sizes:

| Suffix | Position | Min Size | Max Size | Use Case |
|--------|----------|----------|----------|----------|
| xs | 1 | ~4px | ~6px | Micro spacing, tight layouts |
| sm | 2 | ~6px | ~9px | Compact spacing, lists |
| md | 3 | ~8px | ~12px | Base spacing (reference) |
| lg | 4 | ~10px | ~16px | Standard sections |
| xl | 5 | ~13px | ~21px | Major sections |
| xxl | 6 | ~17px | ~28px | Hero areas, large gaps |

**Note**: The **Base** dropdown is set to "md" (size 3), making it the reference point. All other sizes scale proportionally from this base.

### Step 3: Preview Your Spacing (2 minutes)

#### Viewport Test Preview (Interactive)

1. **Expand "Viewport Test Preview" section**
   - See three live demonstrations: Margin, Padding, and Gap
   - Each shows how that spacing type behaves

2. **Use the viewport slider**
   - Drag from 375px (mobile) to 1620px (desktop)
   - Watch spacing interpolate smoothly in real-time
   - Notice device type labels (Mobile, Tablet, Desktop, Big Screen)

3. **Try different sizes**
   - Change **Space Size** dropdown from "md" to "lg"
   - See larger spacing in all three samples
   - Try "xs" to see minimal spacing

#### Space Size Preview (Side-by-Side)

1. **Expand "Space Size Preview" section**
   - Left column shows ALL sizes at minimum viewport (375px)
   - Right column shows ALL sizes at maximum viewport (1620px)
   - Each preview demonstrates margin, padding, and gap behavior

### Step 4: Generate CSS (1 minute)

1. **Choose Your Output Format** (tabs at top):
   - **Classes**: CSS classes like `.space-m-lg`, `.space-p-md`, `.space-g-sm`
   - **Variables**: CSS custom properties like `--sp-lg`, `--sp-md`
   - **Utilities (Tailwind)**: Utilities like `.mt-lg`, `.px-md`, `.gap-y-sm`

2. **Copy the Generated CSS**
   - Scroll to "Generated CSS (All Classes)"
   - Click the **copy all** button
   - Paste into your stylesheet

3. **Save Your Settings** (optional)
   - Click **Save** button or enable **Autosave**
   - Settings persist between sessions

## Example Output

### CSS Classes (Classes Tab)

```css
/* Margin classes */
.space-m-xs { margin: clamp(0.4rem, calc(0.35rem + 0.15vw), 0.5rem); }
.space-m-sm { margin: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem); }
.space-m-md { margin: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }

/* Padding classes */
.space-p-xs { padding: clamp(0.4rem, calc(0.35rem + 0.15vw), 0.5rem); }
.space-p-sm { padding: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem); }
.space-p-md { padding: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }

/* Gap classes */
.space-g-xs { gap: clamp(0.4rem, calc(0.35rem + 0.15vw), 0.5rem); }
.space-g-sm { gap: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem); }
.space-g-md { gap: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }
```

### CSS Variables (Variables Tab)

```css
:root {
  --sp-xs: clamp(0.4rem, calc(0.35rem + 0.15vw), 0.5rem);
  --sp-sm: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem);
  --sp-md: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem);
  --sp-lg: clamp(1rem, calc(0.95rem + 0.25vw), 1.3rem);
  --sp-xl: clamp(1.3rem, calc(1.23rem + 0.34vw), 1.7rem);
  --sp-xxl: clamp(1.7rem, calc(1.6rem + 0.45vw), 2.2rem);
}
```

### Tailwind Utilities (Utilities Tab)

```css
/* Margin utilities */
.mt-lg { margin-top: clamp(1rem, calc(0.95rem + 0.25vw), 1.3rem); }
.mb-lg { margin-bottom: clamp(1rem, calc(0.95rem + 0.25vw), 1.3rem); }
.ml-lg { margin-left: clamp(1rem, calc(0.95rem + 0.25vw), 1.3rem); }
.mr-lg { margin-right: clamp(1rem, calc(0.95rem + 0.25vw), 1.3rem); }
.mx-lg { margin-left: clamp(...); margin-right: clamp(...); }
.my-lg { margin-top: clamp(...); margin-bottom: clamp(...); }
.m-lg { margin: clamp(1rem, calc(0.95rem + 0.25vw), 1.3rem); }

/* Padding utilities */
.pt-md { padding-top: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }
.pb-md { padding-bottom: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }
.px-md { padding-left: clamp(...); padding-right: clamp(...); }
.py-md { padding-top: clamp(...); padding-bottom: clamp(...); }
.p-md { padding: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }

/* Gap utilities */
.gap-sm { gap: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem); }
.gap-x-sm { column-gap: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem); }
.gap-y-sm { row-gap: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem); }
```

## Usage in HTML

### Using Classes

```html
<!-- Card with fluid padding and margin -->
<div class="card space-p-lg space-m-md">
  <h3>Card Title</h3>
  <p>Card content with fluid spacing</p>
</div>

<!-- Grid with fluid gaps -->
<div class="grid space-g-md">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### Using Variables

```html
<!-- Component with CSS variables -->
<div class="card" style="padding: var(--sp-lg); margin-bottom: var(--sp-md);">
  <h3>Card Title</h3>
  <p>Responsive spacing with variables</p>
</div>

<!-- CSS in stylesheet -->
<style>
.hero-section {
  padding: var(--sp-xxl) var(--sp-xl);
  margin-bottom: var(--sp-lg);
}

.card-grid {
  display: grid;
  gap: var(--sp-md);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
```

### Using Tailwind Utilities

```html
<!-- Card with utility classes -->
<div class="card p-lg mb-md">
  <h3 class="mb-sm">Card Title</h3>
  <p class="mb-md">Card content</p>
  <button class="px-md py-sm">Read More</button>
</div>

<!-- Hero section -->
<section class="hero py-xxl px-lg">
  <h1 class="mb-md">Hero Heading</h1>
  <p class="mb-lg">Hero description</p>
</section>

<!-- Grid layout -->
<div class="grid gap-md">
  <div class="card p-lg">Card 1</div>
  <div class="card p-lg">Card 2</div>
  <div class="card p-lg">Card 3</div>
</div>
```

## Understanding the Output

### What is `clamp()`?

The CSS `clamp()` function has three values:

```css
margin: clamp(min, preferred, max);
```

- **min**: Smallest spacing (at minimum viewport width)
- **preferred**: Fluid calculation that scales with viewport
- **max**: Largest spacing (at maximum viewport width)

### How Spacing Types Work

**Margin (External Spacing):**
- Goes OUTSIDE elements
- Creates separation between components
- Can collapse with adjacent margins
- Use: `.space-m-*` classes or `.m-*`, `.mt-*`, etc. utilities

**Padding (Internal Spacing):**
- Goes INSIDE elements
- Creates breathing room around content
- Always adds to element size
- Use: `.space-p-*` classes or `.p-*`, `.pt-*`, etc. utilities

**Gap (Between Items):**
- Goes BETWEEN flex/grid items
- Maintains equal spacing automatically
- Doesn't collapse like margins
- Use: `.space-g-*` classes or `.gap-*`, `.gap-x-*`, `.gap-y-*` utilities

## Next Steps

### Beginner: Keep It Simple
1. Use the default 6 sizes
2. Use CSS Classes output (easiest to understand)
3. Apply `.space-m-*`, `.space-p-*`, `.space-g-*` classes in HTML
4. Copy and paste into your stylesheet
5. Test on different device sizes

### Intermediate: Customize Everything
1. Adjust viewport range to match your design
2. Try different scaling ratios for visual hierarchy
3. Use CSS Variables for a design system
4. Add custom sizes beyond the default 6
5. Use Viewport Test Preview to fine-tune values

### Advanced: Multi-Format Systems
1. Generate CSS Classes for components
2. Generate CSS Variables for design tokens
3. Generate Utilities for utility-first approach
4. Combine all formats in one stylesheet
5. Create semantic naming layer on top of primitives

## Common Workflows

### For Designers
1. Use Viewport Test Preview slider for client presentations
2. Show how layouts adapt from mobile to desktop
3. Demonstrate margin vs. padding vs. gap differences
4. Screenshot different viewport sizes for approval
5. Export exact CSS values for developer handoff

### For Developers
1. Create spacing sizes matching your component needs
2. Choose output format matching your CSS methodology
3. Integrate into build process (copy CSS to source)
4. Use Variables for design system tokens
5. Use Utilities for rapid prototyping

### For Component Libraries
1. Generate CSS Classes for reusable components
2. Document class naming conventions for team
3. Create examples showing proper usage
4. Add to style guide with visual examples
5. Maintain single source of truth for spacing

## Understanding the Data Table

### Columns Explained

**⋮ (Handle)**
- Drag to reorder rows
- Changes the visual order in the table
- Doesn't affect calculations (based on ID)

**Suffix**
- The name used in generated CSS
- Examples: xs, sm, md, lg, xl, xxl
- Can be edited by clicking ✎ icon
- Used in class names, variable names, utility names

**Min Size**
- Spacing at minimum viewport width
- Calculated automatically from base + scale
- Updates when you change Base or settings

**Max Size**
- Spacing at maximum viewport width
- Calculated automatically from base + scale
- Updates when you change Base or settings

**Action**
- ✎ Edit: Change the suffix name
- 🗑️ Delete: Remove this size

### The Base Dropdown

- Selects which size is your reference point
- All other sizes scale proportionally from this base
- Typically use "md" (middle size)
- Changing base recalculates all rows
- Your base size will match your Min/Max Viewport Space settings

### Table Operations

**Add Size**
- Adds a new row with default suffix "custom-N"
- Edit the suffix to give it a meaningful name
- Size values calculated from your base + scale

**Reset**
- Restores original 6 default sizes (xs through xxl)
- Loses any custom sizes you added
- Use when you want to start fresh

**Clear All**
- Removes ALL sizes from table
- Provides undo option (10 seconds)
- Use when building completely custom scale

## Tips for Success

### Do:
✓ Start with defaults and adjust incrementally
✓ Use REM units for accessibility
✓ Preview at multiple viewport sizes before exporting
✓ Test on real devices, not just browser DevTools
✓ Document your spacing system for team members
✓ Use semantic names (xs, sm, md) rather than pixel values (4, 8, 12)

### Don't:
✗ Make too many sizes (6-8 is usually enough)
✗ Use extreme viewport ranges (< 320px or > 2000px)
✗ Set min base space below 4px (too small for usability)
✗ Forget to click Save if autosave is disabled
✗ Apply multiple spacing classes to same element
✗ Mix spacing types (use margin OR padding, not both on same element)

## Troubleshooting

### Spacing looks too small/large?
- Adjust **Min Viewport Space** and **Max Viewport Space** in Settings
- These control your base spacing at viewport limits
- Consider switching between PX and REM units

### Want more dramatic size differences?
- Increase **Max Scale** (try Major Third 1.25 or Perfect Fourth 1.333)
- This affects the ratio between adjacent spacing sizes
- Preview changes in Space Size Preview panel

### Spacing not changing across viewports?
- Verify you copied the complete `clamp()` function
- Check viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Ensure no CSS with `!important` is overriding

### Preview not updating?
- Check that JavaScript is enabled
- Try refreshing the page
- Select a size from Space Size dropdown
- Check browser console for errors

### Copy button not working?
- Ensure you're on HTTPS (clipboard API requirement)
- Try manually selecting text and copying (Ctrl+C)
- Try different browser (Chrome, Firefox, Safari)
- Check browser permissions for clipboard access

### Can't reorder rows?
- Click and hold on ⋮ icon (leftmost edge)
- Drag slowly and steadily
- Ensure JavaScript is enabled
- Try in different browser

## Understanding Spacing Systems

### Why Fluid Spacing?

Traditional CSS uses fixed breakpoints:
```css
.card {
  margin: 8px;
}

@media (min-width: 768px) {
  .card {
    margin: 12px;
  }
}

@media (min-width: 1200px) {
  .card {
    margin: 16px;
  }
}
```

Fluid spacing uses one line:
```css
.card {
  margin: clamp(0.5rem, calc(0.4rem + 0.31vw), 1rem);
}
```

**Benefits:**
- No breakpoint management
- Smooth transitions during resize
- Works at ANY viewport size
- Less CSS code
- Better performance

### Spacing Scale Harmony

Musical ratios create harmonious spacing:

**Minor Second (1.067)** - Subtle
```
8px → 8.5px → 9px → 9.6px → 10.2px → 10.9px
Tight, compact, minimal contrast
```

**Major Second (1.125)** - Balanced
```
8px → 9px → 10px → 11.25px → 12.66px → 14.24px
Clean, modern, readable
```

**Minor Third (1.200)** - Clear
```
8px → 9.6px → 11.52px → 13.82px → 16.59px → 19.91px
Strong hierarchy, clear levels
```

**Major Third (1.250)** - Dramatic
```
8px → 10px → 12.5px → 15.63px → 19.53px → 24.41px
Bold, high contrast, editorial
```

**Perfect Fourth (1.333)** - Extreme
```
8px → 10.66px → 14.21px → 18.94px → 25.25px → 33.66px
Very dramatic, use sparingly
```

## Get Help

- **📘 [Full User Manual](USER-MANUAL)** - Detailed use cases and examples
- **🐛 [Report Issues](https://github.com/Mij-Strebor/fluid-space-forge/issues)** - Found a bug?
- **💬 [Discussions](https://github.com/Mij-Strebor/fluid-space-forge/discussions)** - Ask questions

---

**You're ready!** Generate your first fluid spacing scale and experience responsive layouts that "just work" across all devices.

---

*Generated for Fluid Space Forge v1.0.3*  
*© 2025 JimRWeb.com - All rights reserved*

---

[← Back to Documentation](index) | [User Manual](USER-MANUAL) | [Report Issues](https://github.com/Mij-Strebor/fluid-space-forge/issues)