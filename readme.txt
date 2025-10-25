=== Fluid Space Forge ===
Contributors: jimrweb
Donate link: https://buymeacoffee.com/jimrweb
Tags: spacing, css, clamp, responsive, design-system
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Generate responsive spacing systems using CSS clamp() functions. Perfect companion to Fluid Font Forge for creating fluid design systems.

== Description ==

**Fluid Space Forge** is a professional WordPress plugin that generates responsive spacing systems using modern CSS `clamp()` functions. Create consistent, scalable margins, padding, and gaps that adapt beautifully from mobile to desktop.

= Why Fluid Space Forge? =

* **Responsive Spacing** - Generate CSS `clamp()` functions for fluid spacing across all device sizes
* **Three Output Formats** - Choose between CSS Classes, CSS Custom Properties, or Tailwind-style Utilities
* **Live Preview** - See your spacing at different screen sizes in real-time
* **Drag & Drop** - Reorder your spacing scale with intuitive drag-and-drop interface
* **Mathematical Scaling** - Use proven typographic ratios (Minor Second, Major Third, Perfect Fourth, etc.)
* **Dual Units** - Full support for both `px` and `rem` units
* **Autosave** - Automatic saving with manual save option for complete control
* **Export Ready** - Copy generated CSS code with one click

= Perfect Companion =

Fluid Space Forge is the perfect companion to **Fluid Font Forge**! While typography scales smoothly across devices, your spacing should too. Together, they create cohesive, responsive design systems that work beautifully on any screen size.

= Output Formats =

**CSS Classes**
Generate margin, padding, and gap classes:
`.space-m-lg { margin: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }`
`.space-p-md { padding: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem); }`
`.space-g-sm { gap: clamp(0.4rem, calc(0.35rem + 0.15vw), 0.5rem); }`

**CSS Custom Properties**
Create reusable CSS variables:
`:root {
  --space-lg: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem);
  --space-md: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem);
}`

**Tailwind-style Utilities**
Generate complete utility class sets:
`.mt-lg { margin-top: clamp(...); }`
`.px-md { padding-left: clamp(...); padding-right: clamp(...); }`
`.gap-y-sm { row-gap: clamp(...); }`

= Key Features =

* **Customizable Spacing Scale** - Add, edit, remove, and reorder spacing sizes
* **Base Value System** - Calculate relative spacing from any size in your scale
* **Musical Ratios** - Use proven scaling ratios: 1.067, 1.125, 1.200, 1.250, 1.333
* **Visual Feedback** - Live preview showing spacing at min and max viewport widths
* **Modal Editing** - Clean interface for editing size names and properties
* **Professional UI** - Beautiful, intuitive admin interface with drag-and-drop support
* **WordPress Integration** - Located in Tools menu for easy access

= Use Cases =

* Building responsive WordPress themes
* Creating design system components
* Establishing spacing tokens for custom blocks
* Maintaining consistent spacing across projects
* Developing fluid, accessible layouts

= Browser Support =

CSS `clamp()` is supported in all modern browsers:
* Chrome 79+
* Firefox 75+
* Safari 13.1+
* Edge 79+

== Installation ==

= Automatic Installation =

1. Log into your WordPress admin panel
2. Navigate to Plugins → Add New
3. Search for "Fluid Space Forge"
4. Click "Install Now" and then "Activate"
5. Access the plugin via Tools → Fluid Space Forge

= Manual Installation =

1. Download the plugin zip file
2. Log into your WordPress admin panel
3. Navigate to Plugins → Add New → Upload Plugin
4. Choose the downloaded zip file and click "Install Now"
5. Click "Activate Plugin"
6. Access via Tools → Fluid Space Forge

= After Activation =

1. Navigate to **Tools → Fluid Space Forge** in your WordPress admin
2. Configure your base spacing values and viewport range in the Settings panel
3. Choose your output format: Classes, Variables, or Utilities
4. Customize your spacing scale by adding, editing, or reordering sizes
5. Preview your spacing at different screen sizes
6. Copy the generated CSS code and add it to your theme

== Frequently Asked Questions ==

= What is CSS clamp()? =

The `clamp()` CSS function calculates a value between a minimum and maximum, with a preferred value that scales fluidly. It's perfect for responsive spacing that adapts smoothly across all screen sizes.

= Do I need the Fluid Font Forge plugin? =

No! While Fluid Space Forge works beautifully alongside Fluid Font Forge, they are independent plugins. Each can be used separately or together for a complete fluid design system.

= Can I use this with any WordPress theme? =

Yes! Fluid Space Forge generates standard CSS that works with any WordPress theme, page builder, or block editor.

= What's the difference between the three output formats? =

* **Classes** - Traditional CSS classes with full names (`.space-m-lg`)
* **Variables** - CSS custom properties for reusable values (`--space-lg`)
* **Utilities** - Tailwind-style utilities with shorthand names (`.mt-lg`, `.px-md`)

= Can I customize the spacing scale? =

Absolutely! You can add unlimited spacing sizes, edit their names, delete sizes, and drag-and-drop to reorder them. The plugin comes with 6 default sizes (xs, sm, md, lg, xl, xxl) that you can customize or replace.

= Does this work with rem units? =

Yes! You can switch between px and rem units at any time. The plugin recalculates all values when you switch units.

= Is the generated CSS compatible with older browsers? =

The `clamp()` function is supported in modern browsers (Chrome 79+, Firefox 75+, Safari 13.1+, Edge 79+). For older browser support, you may need to provide fallback values.

= Can I reset to defaults? =

Yes! Each tab has a "Reset" button that restores the original 6 default sizes. Your custom settings are also preserved and can be restored.

= Does it save automatically? =

Yes! The plugin includes autosave functionality that saves your changes every 10 seconds. You can also manually save at any time using the Save button.

== Screenshots ==

1. Main admin interface showing the Classes tab with spacing scale editor
2. CSS Custom Properties (Variables) output format
3. Tailwind-style Utilities with margin, padding, and gap classes
4. Live preview showing spacing at different screen sizes
5. Settings panel for configuring base values and viewport range
6. Modal dialog for editing spacing size names
7. Drag and drop interface for reordering spacing scale

== Changelog ==

= 1.0 (2025-01-06) =
* Initial release
* Generate responsive spacing using CSS clamp() functions
* Three output formats: Classes, CSS Variables, and Utility classes
* Drag and drop reordering of spacing sizes
* Autosave functionality with visual status indicators
* Live preview showing spacing at min and max viewport widths
* Modal dialog for editing and adding spacing sizes
* Musical harmony scale ratios for consistent spacing progression
* Support for both pixel and rem units
* Base value selector for relative spacing calculations
* Classes tab generates margin, padding, and gap variants
* Utilities tab includes Tailwind-style margin, padding, and gap utilities
* Professional admin UI with organized CSS and modular JavaScript
* Plugin located in WordPress Tools menu

== Upgrade Notice ==

= 1.0 =
Initial release of Fluid Space Forge. Start creating responsive spacing systems today!

== Additional Information ==

= Credits =

* **Developer**: Jim R. - [JimRWeb.com](https://jimrweb.com)
* **Development Assistant**: Claude AI by Anthropic

= Support =

* **Documentation**: [GitHub Repository](https://github.com/jimrweb/fluid-space-forge)
* **Issues**: Report bugs via [GitHub Issues](https://github.com/jimrweb/fluid-space-forge/issues)
* **Website**: [JimRWeb.com](https://jimrweb.com)

= Privacy =

This plugin does not collect, store, or transmit any user data. All calculations and settings are stored locally in your WordPress database.

= Contributing =

Contributions are welcome! Visit the [GitHub repository](https://github.com/jimrweb/fluid-space-forge) to contribute to the project.