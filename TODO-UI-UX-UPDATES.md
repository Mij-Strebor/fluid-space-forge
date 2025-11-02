# FSF UI/UX Updates to Match FFF v5.1.1 Standards

## Priority: High (Before WordPress.org Release)

### 1. Update Button Border Radius (From FFF Standard)
**Current:** FSF buttons use `border-radius: 4px` (less rounded)
**Target:** FFF buttons use `border-radius: 8px` (nicely rounded)

**Files to Update:**
- `assets/css/admin-styles.css` - Line ~508

**Change:**
```css
.fcc-btn,
.fcc-copy-btn {
    /* ... existing styles ... */
    border-radius: 8px;  /* Changed from 4px to 8px (FFF standard) */
    /* ... rest of styles ... */
}
```

**Rationale:** User comparison testing shows FFF's rounder buttons are significantly more appealing. FFF button style is now the JimRForge standard.

---

### 2. Add Loading Spinner on Startup
**Current:** FSF loads instantly with no transition
**Target:** Add professional loading screen like FFF has

**Implementation:**
- Create loading-screen template
- Add CSS spinner animation
- Show during plugin initialization
- Fade out when ready

**Rationale:** Provides better UX and professional appearance during plugin load.

---

### 3. Verify Drag Handle Style Matches FFF
**Current:** FSF uses doubled-dot columns for drag handles
**Status:** Already matches FFF standard ✅

**Action:** Document in UI/UX standards that this is the preferred style.

---

### 4. Add Reset Confirmation Modal
**Current:** FSF reset button in Settings panel has no confirmation
**Target:** Add confirmation modal like FFF has for reset actions

**Implementation:**
- Add confirmation modal for Settings reset button
- Modal should show warning about losing custom values
- "Confirm" button should use `fcc-btn-danger` class (red background, white text)
- "Cancel" button should use `fcc-btn-ghost` class (gray background, white text)

**Files to Reference:**
- FFF: `assets/js/utilities.js` - `WordPressAdminNotices.confirm()` method
- FFF: `assets/css/admin-styles.css` - `.fcc-btn-danger` and `.fcc-btn-ghost` classes

**Rationale:** Prevents accidental data loss and provides consistent UX across all destructive actions.

---

### 5. Fix Tab Button Typography
**Current:** FSF tab buttons use `Segoe UI` font at `14px` with `font-weight: 600`
**Target:** Match FFF standard with `Inter` font at `16px` with `font-weight: 700`

**Files to Update:**
- `templates/admin/header-controls.php` - Tab button inline styles (around line 44-47)

**Change:**
```php
<!-- Current -->
<button ... style="... font-size: 14px; font-weight: 600;">

<!-- Target -->
<button ... style="... font-size: 16px; font-weight: 700;">
```

**Note:** Inter font should already be loaded in the plugin. Verify in `assets/fonts/` directory and CSS font-face declarations.

**Rationale:** Establishes consistent typography standards across all JimRForge plugins.

---

## Testing Checklist
- [ ] Buttons have 8px border radius
- [ ] All button states (hover, active, disabled) work correctly
- [ ] Loading spinner displays on plugin load
- [ ] Loading spinner fades out smoothly
- [ ] Reset confirmation modal appears on Settings reset
- [ ] Confirmation buttons have correct styling (red confirm, gray cancel)
- [ ] Tab buttons use Inter font at 16px with 700 weight
- [ ] No visual regressions in other UI elements

---

**Created:** 2025-10-30
**Priority:** Complete before WordPress.org submission
**Standard Reference:** FFF v5.1.1 (canonical implementation)
