# CLAUDE.md — Fluid Space Forge (FSF)

## INHERITANCE — ADDS TO, NEVER REPLACES

**Parent chain** — every rule from every level above remains fully in effect here:
1. `C:\Users\Owner\.claude\CLAUDE.md` — Root: all Claude Code sessions
2. `E:\projects\.claude\CLAUDE.md` — All E:\projects\ work
3. `E:\projects\plugins\.claude\CLAUDE.md` — All plugin development rules

**This file adds:** FSF-specific rules only.

---

## Plugin Identity

- **Plugin name:** Fluid Space Forge
- **Acronym / folder:** `fsf` → `E:\projects\plugins\fsf`
- **Version:** v1.2.4
- **GitHub:** https://github.com/Mij-Strebor/fluid-space-forge
- **Text domain:** `fluid-space-forge`
- **Admin page slug:** `fluid-space-forge`
- **Required capability:** `manage_options`
- **Namespace:** `JimRForge\FluidSpaceForge`
- **Branding:** Always "Jim R Forge" — never "JimRWeb" or "JimRForge"
- **Author URI:** https://jimrforge.com

---

## What FSF Does

FSF is a WordPress admin tool that generates CSS `clamp()` values for fluid (responsive) spacing. It provides:
- A data table of spacing-scale entries (min size, max size, viewport range)
- Output formats: CSS classes, CSS custom properties, Tailwind utilities
- Real-time preview with DevTools-style box model visualization
- Settings panel with viewport and scale configuration
- Autosave functionality

---

## FSF is the Canonical UI Reference

**FSF v1.2.4 is the styling prototype for all JimRForge FFF-family plugins.** When in doubt about a visual or UX decision for any other plugin, check FSF first. Do not deviate from FSF's implementation without a deliberate standards update.

FSF itself must remain compliant with `E:\projects\JIMRFORGE-UI-STANDARDS.md` at all times. Any UI change to FSF potentially becomes the new standard and should be documented.

---

## CSS / JS Prefix

| Layer | Prefix | Example |
|-------|--------|---------|
| CSS classes | `fsf-` | `fsf-btn`, `fsf-modal` |
| AJAX actions | `fsf_` | `fsf_save_settings` |
| WP option keys | `fsf_` | `fsf_settings` |

---

## FSF-Specific Rules

- **Nonce constant:** `NONCE_ACTION = 'fluispfo_nonce'` — defined once in the main class.
- **Data persistence:** WP Options table only — no custom database tables.
- **No build process:** Pure PHP/JS/CSS. Hard-refresh (Ctrl+Shift+R) after JS/CSS edits.
- **DevTools preview colors** must match browser DevTools box model colors exactly:
  ```css
  --clr-sample-margin-bg:  #f8cb9c;    /* Peach/tan — margin */
  --clr-sample-padding-bg: #c3deb6;    /* Green — padding */
  --clr-sample-content-bg: #9fc5e7;    /* Blue — content */
  ```

---

## JimRForge UI Standards — FSF Implementation

FSF IS the canonical reference. It must match `E:\projects\JIMRFORGE-UI-STANDARDS.md` exactly.

### Brand

- Organization name: **Jim R Forge** — not "JimRWeb", not "JimRForge"
- Author URI: https://jimrforge.com

### Color System — Exact Values

```css
:root {
    --clr-primary:    #3d2f1f;    --clr-secondary:  #6d4c2f;    --clr-tertiary:   #86400e;
    --clr-accent:     #f4c542;    --clr-btn-hover:  #dda824;
    --clr-age-bg:     #faf6f0;    --clr-card-bg:    #ffffff;    --clr-light:      #faf9f6;    --clr-white: #fff;
    --clr-txt:        #6d4c2f;    --clr-txt-light:  #faf9f6;    --clr-txt-muted:  #64748b;
    --clr-link:       #ce6565;    --clr-link-hover: #b54545;
    --clr-border:     #c9b89a;
    --clr-shadow-sm:  0 1px 2px rgba(61, 47, 31, 0.08);
    --clr-shadow-md:  0 4px 6px rgba(61, 47, 31, 0.12);
    --clr-shadow-lg:  0 10px 20px rgba(61, 47, 31, 0.15);
    --clr-shadow-xl:  0 20px 30px rgba(61, 47, 31, 0.18);
    --clr-success: #059669; --clr-success-bg: #ecfdf5;
    --clr-error:   #dc2626; --clr-error-bg:   #fee2e2;
    --clr-warning: #f59e0b; --clr-warning-bg: #fef3c7;
    --clr-info:    #3b82f6; --clr-info-bg:    #dbeafe;
}
```

### Typography

- **Font:** Inter (locally loaded, WOFF2) — `assets/fonts/Inter-{Regular,Medium,SemiBold,Bold}.woff2`
- **Base size:** 16px; **Weights:** 400, 500, 600, 700

```css
--fs-xxs: 11px; --fs-xs: 13px; --fs-sm: 14px; --fs-md: 16px;
--fs-lg: 18px;  --fs-xl: 20px; --fs-xxl: 24px; --fs-xxxl: 32px;
```

### Spacing Scale

```css
--sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
--sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-9: 36px;
```

### Primary Button — `.fsf-btn`

- Background: `--clr-accent`, Text: `--clr-primary`; Font: 14px/600; sentence case in HTML; no border; radius 8px; padding 8px 16px
- Hover: `--clr-btn-hover`, `transform: translate(-2px, -2px)`, `--clr-shadow-lg`
- Dashicons: `margin-top: 3px`, 8px flexbox gap. **No icons in modal buttons.**

### Secondary — `.fsf-btn.fsf-btn-secondary`

- Background: `--clr-txt-muted` (#64748b), Text: white `!important`; Hover: `#475569`

### Danger — `.fsf-btn.fsf-btn-danger`

- Background: `--clr-error` (#dc2626), Text: white; Hover: `#b91c1c`, `transform: translate(-2px, -2px)`

### Standard Dashicon Assignments

Reset/Undo: `dashicons-undo` · Save: `dashicons-yes` · Add: `dashicons-plus-alt` · Delete: `dashicons-trash` · Copy: `dashicons-clipboard` · Export: `dashicons-download` · Import: `dashicons-upload`

### Forge Header

Every admin page: `assets/images/forge-banner.png` + `assets/css/forge-header.css`

### Accessibility — WCAG 2.1 AA minimum

Focus: `2px solid var(--clr-accent)`, `outline-offset: 2px`. All icon-only buttons: `aria-label`. Full keyboard navigation.
