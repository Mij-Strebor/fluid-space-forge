# Fluid Space Forge

**Generate responsive spacing systems using CSS clamp() functions.**

[![WordPress Plugin Version](https://img.shields.io/badge/version-1.0.4-blue.svg)](https://github.com/Mij-Strebor/fluid-space-forge)
[![License](https://img.shields.io/badge/license-GPL--2.0%2B-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
[![WordPress](https://img.shields.io/badge/WordPress-5.0%2B-blue.svg)](https://wordpress.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://php.net/)

Create consistent, scalable spacing that adapts beautifully from mobile to desktop. Perfect companion to **Fluid Font Forge** for building complete fluid design systems.

---

## Features

### Responsive Spacing System
- **CSS clamp() Functions** - Generate fluid spacing that scales smoothly across all device sizes
- **Three Output Formats** - CSS Classes, CSS Custom Properties, or Tailwind-style Utilities
- **Live Preview** - See your spacing at different screen sizes in real-time
- **Drag & Drop** - Reorder your spacing scale with intuitive interface

### Professional Tools
- **Mathematical Scaling** - Use proven typographic ratios (Minor Second, Major Third, Perfect Fourth, etc.)
- **Dual Units** - Full support for both `px` and `rem` units
- **Autosave** - Automatic saving with manual save option
- **Export Ready** - Copy generated CSS code with one click

### Output Formats

**CSS Classes**
```css
.space-m-lg { margin: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem); }
.space-p-md { padding: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem); }
.space-g-sm { gap: clamp(0.4rem, calc(0.35rem + 0.15vw), 0.5rem); }
```

**CSS Custom Properties**
```css
:root {
  --space-lg: clamp(0.75rem, calc(0.7rem + 0.2vw), 1rem);
  --space-md: clamp(0.6rem, calc(0.55rem + 0.18vw), 0.75rem);
}
```

**Tailwind-style Utilities**
```css
.mt-lg { margin-top: clamp(...); }
.px-md { padding-left: clamp(...); padding-right: clamp(...); }
.gap-y-sm { row-gap: clamp(...); }
```

---

## Installation

### From WordPress.org (Coming Soon)
1. Go to **Plugins → Add New**
2. Search for "Fluid Space Forge"
3. Click **Install Now** and then **Activate**
4. Access via **Tools → Fluid Space Forge**

### From GitHub
1. Download the latest release ZIP file
2. Go to **Plugins → Add New → Upload Plugin**
3. Upload the ZIP file and click **Install Now**
4. Click **Activate Plugin**
5. Access via **Tools → Fluid Space Forge**

---

## Usage

1. Navigate to **Tools → Fluid Space Forge**
2. Configure your base spacing values and viewport range in the Settings panel
3. Choose your output format: Classes, Variables, or Utilities
4. Customize your spacing scale by adding, editing, or reordering sizes
5. Preview your spacing at different screen sizes
6. Copy the generated CSS code and add it to your theme

---

## Requirements

- **WordPress**: 5.0 or higher
- **PHP**: 7.4 or higher
- **Browser Support**: Modern browsers with CSS clamp() support
  - Chrome 79+
  - Firefox 75+
  - Safari 13.1+
  - Edge 79+

---

## Perfect Companion

**Fluid Space Forge** works beautifully alongside **[Fluid Font Forge](https://github.com/Mij-Strebor/fluid-font-forge)**! While typography scales smoothly across devices, your spacing should too. Together, they create cohesive, responsive design systems.

---

## Privacy

This plugin does not collect, store, or transmit any user data. All calculations and settings are stored locally in your WordPress database.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

---

## Credits

- **Developer**: Jim R. - [JimRWeb.com](https://jimrweb.com)
- **Development Assistant**: Claude AI by Anthropic

---

## Support

- **Documentation**: [GitHub Repository](https://github.com/Mij-Strebor/fluid-space-forge)
- **Issues**: [Report bugs](https://github.com/Mij-Strebor/fluid-space-forge/issues)
- **Website**: [JimRWeb.com](https://jimrweb.com)

---

**Start creating responsive spacing systems today!** 🚀
