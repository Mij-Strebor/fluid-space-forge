## [1.2.3] - 2025-11-13

### Changed

- **WordPress.org Compliance:** Removed backup and temporary files that are not permitted in plugin submissions
  - Removed `.bak` files (admin-styles.css.bak, about-section.php.bak)
  - Removed `.backup-*` files (admin-styles.css.backup-original, admin-styles.css.backup-pre-design-system)
  - Removed `.before-*` development files (fluid-space-forge.php.before-sanitization)
  - Removed temporary documentation file (templates/docs/naming-conventions-md)
  - Resolves WordPress.org plugin review feedback from November 13, 2025

### Technical Details

- No functional changes - purely file cleanup for WordPress.org submission
- Review ID: R fluid-space-forge/mijstrebor/25Oct25/T4 13Nov25/3.6

## [1.2.2] - 2025-11-08

### Fixed

- **WordPress.org Compliance:** Fixed inline `<script>` tag that violated WordPress plugin guidelines
  - Replaced inline JavaScript with properly enqueued script using `wp_add_inline_script()`
  - Created `enqueue_notice_scripts()` method following WordPress enqueueing standards
  - All scripts now use WordPress `wp_enqueue_script()` and `wp_add_inline_script()` functions
  - Resolves WordPress.org plugin review feedback from November 5, 2025

### Technical Details

- Added `enqueue_notice_scripts()` hook to `admin_enqueue_scripts` action
- Registered `fluispfo-notice-dismiss` script handle with jQuery dependency
- Moved migration notice dismiss functionality to properly enqueued inline script
- No functional changes - purely compliance fix for WordPress.org submission

![Fluid Space Forge banner](docs/screenshots/changelog-1544x500.png)

## [1.2.1] - 2025-10-29

### Fixed

- **Critical Bug:** Fixed clear all functionality not clearing the Selected Class CSS panel - now properly clears both data table and CSS output
- **Button Styling:** Fixed UNDO button in clear all notification to match design system (gold background, no border, lowercase text, 14px font)
- **Modal Consistency:** Updated Reset Settings modal warning text to be more descriptive about what gets reset
- **Preview Layout:** Fixed overflow issues in preview columns by adding scrolling (max-height: 800px with overflow-y: auto)

### Changed

- **Design System Standardization:** Achieved complete visual parity with Fluid Font Forge v5.1.0 for cohesive JimRForge ecosystem
  - Updated all core brand colors to FFF standard (#3d2f1f deep brown, #6d4c2f medium brown, #f4c542 gold)
  - Fixed 4-level background hierarchy (#faf6f0 page, #ffffff cards, #faf9f6 panels, #fff fields)
  - Standardized ALL button styling: gold #f4c542 background, brown #3d2f1f text, no borders, 14px font, lowercase text
  - Changed tab buttons to 64px height (FFF standard)
  - Restored DevTools-style preview colors (blue #9fc5e7 content, green #c3deb6 padding, peach #f8cb9c margin/gap)

- **Button Text Standardization:** Made all button text lowercase for consistency (except tabs and unit selectors which remain uppercase)
  - Data table buttons: "add size", "reset", "clear all"
  - Copy buttons: "copy", "copy all" (removed 📋 emoji icons)
  - Settings button: "reset"
  - Modal buttons: "confirm", "cancel", "ok", "save"
  - All buttons maintain gold styling except danger confirms (reset/clear)

- **Modal System:** Standardized all modal dialogs to use gold buttons instead of gray
  - Edit modals: Gold "save" and "cancel" buttons
  - Confirm modals: Gold buttons with danger styling only for destructive actions
  - Alert modals: Gold "ok" button
  - All modal button text now lowercase

- **Preview Panel Enhancements:**
  - Added blue selection highlight to Space Size Preview items (rgba(59, 130, 246, 0.15) background)
  - Changed size name font from Arial 14px to Inter 600 32px for better readability
  - Fixed gap sample padding and centering for visual consistency
  - Removed borders from Viewport Test Preview sample box wrappers (FFF standard)

- **User Experience:** Added "Close this preview if not used." instruction text to both preview panels (Space Size Preview and Viewport Test Preview) to encourage UI cleanup when not needed

- **Documentation:** Indented Community panel text sections to match Related Tools panel styling (20px left padding)

### Security & Compliance

- **WordPress.org Compliance:** Resolved all 6 WordPress Plugin Checker issues
  - Removed compressed file (fluid-space-forge.zip)
  - Removed application files (fix-wordpress-issues.sh, apply-typo-fix.sh)
  - Added phpcs:ignore comments for proper JSON sanitization pattern (wp_unslash before decode, field sanitization after)
  - Updated readme.txt stable tag to match plugin version (1.2.1)

### Technical Notes

- All changes maintain backward compatibility with existing user settings
- CSS variables used throughout for maintainable color system
- Modal Manager module now handles 100% of modal styling and behavior
- Button styling cascade: `.fcc-btn` (base gold) → `.fcc-btn-danger` (red for destructive)
- Preview columns use responsive scrolling with 8px right padding for scrollbar spacing
- FFF v5.1.0 established as canonical UI reference for all future JimRForge plugins

---

## Fluid Space Forge [1.0.3] - 2025-10-15

### Fixed

   - Fixed CSS table selector syntax error (missing dot before space-table class)


- **Critical:** Created symlink for development environment to ensure VS Code changes sync with Local WordPress installation
- **Accessibility:** Achieved WCAG 2.1 AA compliance - resolved 96 accessibility issues identified by axe DevTools
  - Added `aria-label` to viewport slider for screen reader support
  - Fixed color contrast ratios on all text elements to meet 4.5:1 minimum
  - Darkened sample preview text colors for better readability
  - Corrected heading hierarchy (h1 → h2 → h3) for proper document structure
  - Added keyboard accessibility (`tabindex`, `role`, `aria-label`) to CSS code output panels
  - Styled `<code>` elements with proper contrast in panel descriptions
  - Fixed active unit button (PX/REM) text color contrast
  - Fixed danger button (clear all) text color contrast
  - Excluded WordPress admin bar from link color overrides to maintain proper contrast

### Changed
- **Refactoring:** Centralized all hardcoded colors into CSS variables for easier maintenance
  - Moved link colors to `--clr-link` and `--clr-link-hover` variables
  - Created sample preview color variables (margin, padding, gap, content text colors)
  - Added sample container color variables for consistent styling
  - Updated JavaScript to use CSS variables instead of hardcoded hex values
- **Color Palette:** Adjusted colors for WCAG AA compliance
  - Darkened `--clr-txt-muted` from `#6b7280` to `#5f6672`
  - Darkened `--clr-danger` from `#ef4444` to `#dc2626`
  - Darkened sample text colors: margin (`#b71c1c`), padding (`#1b5e20`), content (`#0d47a1`)
  - Updated link color to `#8B3A3A` for better contrast on beige backgrounds

### Enhanced
- **Developer Experience:** Improved maintainability by eliminating hardcoded colors throughout codebase
- **Testing:** Completed comprehensive browser compatibility testing (Chrome, Firefox, Edge)
- **Testing:** Completed accessibility audit using axe DevTools - all Critical and Serious issues resolved

### Technical Notes
- All color contrast ratios now meet or exceed WCAG 2.1 Level AA standards (4.5:1 for normal text)
- Plugin content is fully keyboard navigable with proper focus indicators
- Screen readers can properly announce all interactive elements and form fields
- 15 distinct color-related Find & Replace operations performed in `admin-script.js`
- Symlink created: `C:\Users\Owner\Local Sites\site\app\public\wp-content\plugins\fluid-space-forge` → `E:\onedrive\projects\plugins\fsf`

---


## [1.0.2] - 2025-10-4

### Added
- Generate responsive spacing using CSS clamp() functions
- Three output formats: Classes, CSS Variables, and Utility classes
- Drag and drop reordering of space sizes in data table
- Autosave functionality with visual status indicators
- Live preview showing space sizes at min and max viewport widths
- Modal dialog for editing and adding space sizes
- Musical harmony scale ratios for consistent spacing progression
- Support for both pixel and rem units
- Base value selector for relative space calculations
- A readme.txt for WordPress confirmation
- Modal Manager Module: New centralized modal management system in `assets/js/modal-manager.js`
- Inline Error Banners: New `.fcc-modal-error` style component for displaying validation errors within modals
- Danger Buttons: New `.fcc-btn-danger` style using `--clr-danger` color for destructive actions
- Modal System Migration: Replaced PHP-templated edit modal and JavaScript alert/confirm dialogs with unified JavaScript-based modal system following Fluid Font Forge pattern
- Edit/Add Modals: Now dynamically generated via JavaScript for consistency and maintainability
- Inline Error Display: Validation errors now display as inline banners within modals (5-second auto-hide) instead of separate alert dialogs
- Confirmation Modals: Delete, Reset, and Clear All actions now use styled confirmation modals with danger buttons
- Modal Manager: New `modal-manager.js` module handles all modal types (edit, alert, confirmation) with consistent styling and behavior


### Enhanced
- Organized CSS with proper KSS documentation following industry standards
- Structured: Design Tokens → Resets → Typography → Layout → Components → States → Animations → Responsive
- Each section numbered (1.0, 1.1, etc.) with descriptions
- Modularized JavaScript with complete JSDoc documentation
- DragDropManager class with public/private method organization
- AutosaveManager module with state management
- Classes tab now generates margin (.space-m-*), padding (.space-p-*), and gap (.space-g-*) variants
- Utilities tab renamed to "Utilities (Tailwind)" for clarity
- Added gap utilities (.gap-*, .gap-x-*, .gap-y-*) to Tailwind-style utilities
- Calculations module with pure mathematical functions
- Plugin moved from J Forge submenu to WordPress Tools menu
- Refactored admin-script.js to use centralized TAB_CONFIG
- Eliminated ~50 lines of repetitive if/else logic using helper functions
- Improved code maintainability and consistency across tab types
- Added styling for edit button to match delete button appearance
- Edit and delete buttons now have consistent hover effects
- **Gap Preview**: Upgraded from 2-item row to 2x2 grid showing gap behavior in both dimensions simultaneously- 
- **Sample Space Preview**: All three displays (Margin, Padding, Gap) now respond to viewport slider in real-time with accurate interpolation
- **Settings Validation UX**: Users can type freely; validation only occurs on blur with helpful error messages explaining corrections
- **Preview Panel Unit Consistency**: All preview panels (Viewport Test Preview and Space Size Preview) now respect the selected unit type (PX/REM), providing accurate visual feedback across the entire interface
- **DRY Panel Templates**: Consolidated three similar panel templates (classes, variables, utilities) into single parameterized generic template
  - Created `generic-panel.php` with marker-based configuration system
  - Moved panel configuration (titles, descriptions, icons, empty state text) to PHP constants
  - Simplified JavaScript `generatePanel()` function to use centralized configuration
  - Reduced code duplication and improved maintainability
  - Empty state properly handles disabled "clear all" button when no data exists
  - Both empty and populated states now function correctly with proper button visibility


### Fixed
- **Calculation Errors**: Fixed "Base entry not found in table" errors during initial page load by passing explicit tab type to calculations
- **Event Target Issues**: Fixed delete and edit buttons not responding when clicking on emoji icons by using `event.currentTarget` instead of `event.target`
- **Modal Stacking**: Implemented modal stack system to properly handle alert modals appearing over edit modals
- **Unit Button Initialization**: Fixed PX/REM unit buttons not responding on initial page load by attaching listeners directly in init()
- **Sample Space Controller**: Fixed initialization error by removing undefined populateSizeSelector() method call
- **Base Selector Initialization**: Base selector now properly updates table values on page load without requiring tab switch
- **Sample Space Preview Display**: Fixed all three preview samples (Margin, Padding, Gap) to accurately demonstrate spacing behavior:
  - Margin: Pink area now correctly expands/contracts around fixed-size content
  - Padding: Green container stays fixed while content shrinks as padding increases from all sides
  - Gap: Created 2x2 grid with equal horizontal and vertical gaps that change together
- **Preview Panel Height**: Increased max-height from 1200px to 1500px to prevent content cutoff
- **Preview Panel Names**: Fixed size names showing as "unknown" by using getSizeName() instead of getDisplayName()
- **Settings Change Reactivity**: Sample Space Preview now updates immediately when settings change, without requiring slider movement
- **Settings Validation**: Implemented comprehensive input validation with error messages:
  - Min Viewport Space: Constrained to 1-16px with validation on blur
  - Max Viewport Space: Must be greater than Min Space and ≤ 80px
  - Min Viewport Width: Constrained to 200-992px (tablet portrait maximum)
  - Max Viewport Width: Must be greater than Min Viewport and ≤ 1920px (big screen maximum)
  - Clear error tooltips display for 3 seconds when values are auto-corrected
  - All validation uses PHP constants for consistency
- **Unit Display in Preview Panels**: Fixed Viewport Test Preview and Space Size Preview panels to correctly display values in selected units (PX/REM) when toggling unit selector
  - Sample Space Controller now passes unit type to all display update methods
  - Added `_formatDisplayValue()` and `_formatCSSValue()` helper methods for proper unit conversion
  - Modified `generatePreviewContent()` to format display values while maintaining pixel-based CSS rendering
  - Unit change handler now triggers Sample Space Controller refresh for immediate preview updates
  - Both preview panels now synchronize with unit selector in real-time
- **Unit Display in Preview Panels**: Fixed Viewport Test Preview and Space Size Preview panels to correctly display values in selected units (PX/REM) when toggling unit selector
  - Sample Space Controller now passes unit type to all display update methods
  - Added `_formatDisplayValue()` and `_formatCSSValue()` helper methods for proper unit conversion
  - Modified `generatePreviewContent()` to format display values while maintaining pixel-based CSS rendering
  - Unit change handler now triggers Sample Space Controller refresh for immediate preview updates  
- **Button Event Listeners Not Firing**: Fixed critical issue where buttons were unresponsive due to duplicate DOM elements
  - Discovered populated and empty state templates both existed in DOM simultaneously with identical button IDs
  - JavaScript was attaching listeners to hidden buttons (zero width/height) instead of visible ones
  - Implemented unique button IDs for empty vs populated states (`add-size` vs `add-size-populated`)
  - Added proper event listeners for both empty state and populated state button variants
- **Tooltips Not Displaying**: Fixed tooltip visibility issues caused by `overflow: hidden` on multiple elements (`.fcc-btn`, `.space-clamp-container`, `.tab-button`, `.font-units-buttons`). Implemented wrapper-based tooltip system for input and select elements which cannot support pseudo-elements. All interactive elements now display consistent tooltips on hover.
- **Table Layout Issues**: Fixed malformed table cell structure causing extra empty column. Adjusted column width percentages and padding for proper alignment of data under headers.
### Security & Compliance
- Removed external Tailwind CDN dependency (WordPress.org compliance)
- Added local Tailwind replacement utilities (Section 13 in CSS)
- Enhanced input sanitization with proper wp_unslash() usage
- Improved nonce verification in AJAX handlers
- Added phpcs annotations for intentional dev functions
- Fixed all output escaping for WordPress.org standards
- Updated readme.txt metadata (tested up to 6.8)

### Refactored
- **Single Source of Truth for Default Sizes**: Consolidated hardcoded default size arrays into PHP constants
  - Added `DEFAULT_SIZE_SUFFIXES` constant defining the 6 default suffix names (xs, sm, md, lg, xl, xxl)
  - Added `SIZE_TYPE_PROPERTY_NAMES` constant mapping tab types to property names
  - Refactored `create_default_sizes()` in PHP to generate arrays from constants
  - Refactored `restoreDefaults()` in JavaScript to use constants passed from PHP
  - Eliminated 5 duplicate hardcoded arrays, improving maintainability
  - Both PHP and JavaScript now share a single source of truth for default configurations  - 
- **Namespace Implementation**: Added PSR-4 compliant namespace `JimRForge\FluidSpaceForge` to prevent conflicts with other plugins
- **Class Naming**: Renamed main class from `fluidSpaceForge` to `FluidSpaceForge` following PSR-4 conventions
