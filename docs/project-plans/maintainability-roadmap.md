# Fluid Space Forge - Maintainability Roadmap

## Phase 1: Configuration Consolidation

### 1.1 Centralize Tooltip Configuration
**Priority:** Medium  
**Effort:** 2-3 hours  
**Benefits:** Single source of truth for all tooltip text, easier i18n preparation

**Implementation:**
- Create `TOOLTIP_CONFIG` object in `admin-script.js`
- Move all hardcoded tooltip text from templates to config
- Apply tooltips via JavaScript `setAttribute()` on init
- Enables future i18n without template surgery

**Files Affected:**
- `assets/js/admin-script.js` (new config object)
- `templates/admin/*.php` (remove hardcoded data-tooltip)

---

### 1.2 Extract Table Column Configuration
**Priority:** High  
**Effort:** 3-4 hours  
**Benefits:** Responsive breakpoints easier, column changes in one place

**Implementation:**
```javascript
const TABLE_COLUMNS = {
  dragHandle: { width: '8%', minWidth: '6%', align: 'center', label: '⋮' },
  suffix: { width: '20%', minWidth: '25%', align: 'left', label: 'Suffix' },
  minSize: { width: '24%', minWidth: '30%', align: 'left', label: 'Min Size' },
  maxSize: { width: '24%', minWidth: '30%', align: 'left', label: 'Max Size' },
  action: { width: '24%', minWidth: '15%', align: 'center', label: 'Action' }
};
```

- Generate table headers dynamically from config
- Apply responsive widths via CSS classes
- Single place to adjust all column widths

**Files Affected:**
- `assets/js/admin-script.js` (new config, generatePanel refactor)
- `templates/admin/generic-panel.php` (dynamic header generation)
- `assets/css/admin-styles.css` (responsive column classes)

---

## Phase 2: Responsive Design

### 2.1 Mobile-First Table Strategy
**Priority:** High  
**Effort:** 4-6 hours  
**Benefits:** Works on tablets/phones, future-proof

**Implementation:**
- Add breakpoints at 768px (tablet), 480px (mobile)
- Stack table vertically on mobile (<480px)
- Reduce font sizes on tablet (768-1024px)
- Hide drag handle on touch devices
- Larger touch targets for edit/delete buttons

**Breakpoint Strategy:**
```css
/* Desktop (default) */
space-table { /* current styles */ }

/* Tablet (768-1024px) */
@media (max-width: 1024px) {
  space-table { font-size: 12px; }
  space-table th:first-child,
  space-table td:first-child { width: 6%; }
}

/* Mobile (<768px) */
@media (max-width: 767px) {
  space-table { display: block; }
  space-table thead { display: none; }
  space-table tr { 
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid var(--clr-bdr);
  }
  .drag-handle { display: none; }
}
```

**Files Affected:**
- `assets/css/admin-styles.css` (new media queries)
- `assets/js/drag-drop-controller.js` (disable on touch)

---

### 2.2 Viewport Test Preview Mobile Support
**Priority:** Medium  
**Effort:** 2-3 hours  
**Benefits:** Preview samples work on smaller admin screens

**Implementation:**
- Stack sample displays vertically on tablet
- Reduce sample box sizes on mobile
- Ensure slider remains usable on touch

**Files Affected:**
- `assets/css/admin-styles.css` (sample preview media queries)

---

## Phase 3: Code Quality

### 3.1 Add JSDoc for Public APIs
**Priority:** Medium  
**Effort:** 2-3 hours  
**Benefits:** Better IDE support, clearer intent

**Scope:**
- All public methods in `admin-script.js`
- All exported functions in modules
- Complex private methods with non-obvious logic

**Files Affected:**
- `assets/js/*.js` (all JavaScript files)

---

### 3.2 Document CSS Overflow Requirements
**Priority:** Low  
**Effort:** 30 minutes  
**Benefits:** Future developers won't break tooltips

**Implementation:**
```css
/* TOOLTIP REQUIREMENT: Elements with data-tooltip must have overflow: visible
   for ::before and ::after pseudo-elements to render outside element bounds.
   Do not add overflow: hidden to any element that needs tooltips. */

.fcc-btn,
.tab-button,
.unit-button {
    overflow: visible; /* Required for tooltips */
}
```

**Files Affected:**
- `assets/css/admin-styles.css` (add comments near tooltip styles)

---

### 3.3 Reduce Template Duplication
**Priority:** Low  
**Effort:** 3-4 hours  
**Benefits:** DRY principle, easier maintenance

**Implementation:**
- Empty state and populated state buttons are duplicated
- Create button template function in JavaScript
- Generate both states from single source
- Apply to: add/reset/clear buttons

**Files Affected:**
- `assets/js/admin-script.js` (new button generator)
- `templates/admin/generic-panel.php` (use generated buttons)

---

## Phase 4: Testing & Validation

### 4.1 Browser Compatibility Testing
**Priority:** High  
**Effort:** 4-6 hours  
**Benefits:** Confidence for WordPress.org submission

**Test Matrix:**
- Chrome (latest, -1, -2 versions)
- Firefox (latest, ESR)
- Safari (latest macOS, latest iOS)
- Edge (latest)

**Focus Areas:**
- Tooltip display and positioning
- Table layout at various widths
- Drag & drop functionality
- Modal interactions
- Input validation

---

### 4.2 Accessibility Audit
**Priority:** High  
**Effort:** 3-4 hours  
**Benefits:** WCAG compliance, better UX for all

**Checklist:**
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements (ARIA labels)
- Color contrast ratios (WCAG AA minimum)
- Focus indicators visible
- Error messages announced

**Tools:**
- axe DevTools
- WAVE browser extension
- Keyboard-only navigation test

**Files Affected:**
- All templates (add/improve ARIA labels)
- `assets/css/admin-styles.css` (focus indicators)
- `assets/js/*.js` (keyboard event handlers)

---

## Phase 5: Performance

### 5.1 Optimize Large Tables
**Priority:** Low  
**Effort:** 2-3 hours  
**Benefits:** Smooth performance with 50+ sizes

**Implementation:**
- Virtual scrolling for tables with >20 entries
- Debounce autosave triggers
- Cache calculated values between renders
- Lazy load preview panels (only when expanded)

**Files Affected:**
- `assets/js/admin-script.js` (virtual scrolling)
- `assets/js/autosave-manager.js` (debounce)
- `assets/js/sample-space-controller.js` (value caching)

---

### 5.2 Reduce Bundle Size
**Priority:** Low  
**Effort:** 1-2 hours  
**Benefits:** Faster page loads

**Implementation:**
- Minify JavaScript in production
- Remove console.log statements in production
- Combine CSS files if multiple exist
- Use WordPress script concatenation

**Files Affected:**
- `fluid-space-forge.php` (conditional minified assets)
- Build process (if using npm/webpack)

---

## Phase 6: Developer Experience

### 6.1 Add Development Mode
**Priority:** Low  
**Effort:** 1-2 hours  
**Benefits:** Easier debugging during development

**Implementation:**
```php
if (defined('WP_DEBUG') && WP_DEBUG) {
    // Load unminified assets
    // Enable verbose logging
    // Show debug panel with state info
}
```

**Files Affected:**
- `fluid-space-forge.php` (conditional asset loading)

---

### 6.2 Create Component Style Guide
**Priority:** Low  
**Effort:** 2-3 hours  
**Benefits:** Visual reference for all UI components

**Implementation:**
- Hidden admin page showing all components
- Buttons, inputs, tooltips, modals, tables
- Color swatches with CSS variable names
- Typography scale examples

**Files Affected:**
- New file: `templates/admin/style-guide.php`
- `fluid-space-forge.php` (add style guide page)

---

## Estimated Total Effort

| Phase | Priority | Hours |
|-------|----------|-------|
| Phase 1: Configuration | Medium-High | 5-7 |
| Phase 2: Responsive | High-Medium | 6-9 |
| Phase 3: Code Quality | Medium-Low | 5.5-7.5 |
| Phase 4: Testing | High | 7-10 |
| Phase 5: Performance | Low | 3-5 |
| Phase 6: Developer Experience | Low | 3-5 |
| **TOTAL** | | **29.5-43.5 hours** |

---

## Recommended Implementation Order

1. **Phase 4.1 & 4.2** - Testing & Accessibility (before beta release)
2. **Phase 2.1** - Responsive Tables (high user impact)
3. **Phase 1.2** - Table Config (enables responsive work)
4. **Phase 3.2** - CSS Documentation (quick win, prevents future bugs)
5. **Phase 1.1** - Tooltip Config (nice to have, enables i18n)
6. **Phases 5 & 6** - Performance/DX (post-launch polish)

---

## Breaking Changes to Avoid

- Keep existing option keys (backward compatibility)
- Maintain current data structure in database
- Don't change public CSS class names (users may override)
- Preserve existing JavaScript global namespace
- Keep template file names (child themes may override)

---

## Future Considerations

### Internationalization (i18n)
- Wrap all user-facing strings in `__()` / `esc_html__()`
- Generate `.pot` file for translators
- Test with RTL languages (Arabic, Hebrew)

### WordPress Multisite
- Network admin page for site-wide defaults
- Per-site overrides

### Export/Import
- Export settings as JSON
- Import from other installations
- Preset library (Material Design, Bootstrap, etc.)

### Advanced Features
- Custom scale formulas (beyond musical ratios)
- Non-linear scaling curves
- Multiple base values (different scales per breakpoint)
- Visual scale preview (interactive chart)

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-13  
**Maintained By:** Jim R. (JimRWeb)