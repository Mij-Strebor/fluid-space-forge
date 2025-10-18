/**
 * Fluid Font Forge - CSS Generator Controller
 *
 * Manages CSS clamp() generation, formatting, and copy-to-clipboard functionality.
 * Generates multiple output formats (classes, variables, tags, Tailwind) with
 * proper syntax and formatting for immediate use in production code.
 *
 * @package FluidFontForge
 * @version 4.3.0
 * @author Jim R (JimRWeb)
 * @link https://jimrweb.com
 * @since 4.2.0
 *
 * Dependencies:
 * - FontClampAdvanced instance (for settings and size data)
 * - FontForgeUtils (for size access)
 * - TabDataUtils (for tab-specific data)
 *
 * Features:
 * - CSS clamp() generation with mathematical precision
 * - Multiple output formats (classes, variables, tags, Tailwind)
 * - Copy-to-clipboard with visual feedback
 * - Keyboard shortcuts (Ctrl+Shift+C, Ctrl+Shift+A)
 * - Tooltip generation for user guidance
 */

/**
 * CSS Generator Controller Class
 *
 * Encapsulates all CSS generation and clipboard functionality with support
 * for multiple output formats and interactive copy operations.
 *
 * @class CSSGeneratorController
 * @param {FontClampAdvanced} fontClampAdvanced - Reference to main advanced features instance
 *
 * @example
 * const cssGenerator = new CSSGeneratorController(fontClampAdvanced);
 * cssGenerator.updateCSS(); // Generate and display CSS
 */
class CSSGeneratorController {
  /**
   * Initialize CSS generator controller
   *
   * @param {FontClampAdvanced} fontClampAdvanced - Main advanced features instance
   */
  constructor(fontClampAdvanced) {
    this.advanced = fontClampAdvanced;
    this.elements = {
      selectedCodeElement: null,
      generatedCodeElement: null,
      selectedCopyContainer: null,
      generatedCopyContainer: null,
    };

    this.init();
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  /**
   * Initialize the CSS generator
   *
   * Sets up DOM element references, creates copy buttons, and binds keyboard shortcuts.
   * Called automatically on instantiation.
   *
   * @returns {void}
   */
  init() {
    this.cacheElements();
    this.createCopyButtons();
    this.setupKeyboardShortcuts();
  }

  /**
   * Cache DOM element references
   *
   * Stores references to code display elements and copy button containers.
   * Improves performance by reducing repeated DOM queries.
   *
   * @returns {void}
   */
  cacheElements() {
    this.elements.selectedCodeElement = document.getElementById("class-code");
    this.elements.generatedCodeElement =
      document.getElementById("generated-code");
    this.elements.selectedCopyContainer = document.getElementById(
      "selected-copy-button"
    );
    this.elements.generatedCopyContainer = document.getElementById(
      "generated-copy-buttons"
    );
  }

  // ========================================================================
  // PUBLIC API - CSS GENERATION
  // ========================================================================

  /**
   * Update CSS displays and trigger data update event
   *
   * Main entry point for CSS regeneration. Called whenever settings or sizes change.
   * Generates both selected and full CSS outputs, updates display elements, and
   * dispatches custom event for other components.
   *
   * @returns {void}
   * @throws {Error} Logs error to console if generation fails
   */
  updateCSS() {
    try {
      const { selectedCodeElement, generatedCodeElement } = this.elements;

      if (selectedCodeElement && generatedCodeElement) {
        this.generateAndUpdateCSS(selectedCodeElement, generatedCodeElement);
      }

      const currentData = {
        classSizes: window.fluidfontforgeAjax?.data?.classSizes || [],
        variableSizes: window.fluidfontforgeAjax?.data?.variableSizes || [],
        tagSizes: window.fluidfontforgeAjax?.data?.tagSizes || [],
        coreInterface: window.fluifofoCore,
      };

      window.dispatchEvent(
        new CustomEvent("fluifofo_dataUpdated", {
          detail: currentData,
        })
      );
    } catch (error) {
      console.error("CSS update error:", error);
    }
  }

  // ========================================================================
  // CSS GENERATION METHODS
  // ========================================================================

  /**
   * Generate CSS and update display elements
   *
   * Coordinates the CSS generation process by gathering context, generating
   * selected and full CSS outputs, and updating DOM elements.
   *
   * @param {HTMLElement} selectedElement - Element for selected CSS display
   * @param {HTMLElement} generatedElement - Element for generated CSS display
   * @returns {void}
   * @throws {Error} Logs error to console if generation fails
   */
  generateAndUpdateCSS(selectedElement, generatedElement) {
    try {
      const context = this.getGenerationContext();
      const selectedCSS = this.generateSelectedCSS(context);
      const allCSS = this.generateAllCSS(context);

      this.updateCSSElements(
        selectedElement,
        generatedElement,
        selectedCSS,
        allCSS
      );
    } catch (error) {
      console.error("CSS generation error:", error);
    }
  }

  /**
   * Gather all data needed for CSS generation
   *
   * Collects current settings, sizes, and configuration into a single context object
   * for use by generation methods. Ensures consistent data access across generators.
   *
   * @returns {Object} Generation context object
   * @returns {Array} context.sizes - Current size array for active tab
   * @returns {string} context.activeTab - Current active tab identifier
   * @returns {string} context.unitType - Current unit type (px or rem)
   * @returns {number|null} context.selectedId - Currently selected size ID
   * @returns {number} context.minViewport - Minimum viewport width in pixels
   * @returns {number} context.maxViewport - Maximum viewport width in pixels
   * @returns {number} context.minRootSize - Minimum root font size
   * @returns {number} context.maxRootSize - Maximum root font size
   */
  getGenerationContext() {
    const sizes = this.advanced.getCurrentSizes();
    const activeTab = window.fluifofoCore?.activeTab || "class";
    const unitType = window.fluifofoCore?.unitType || "rem";
    const selectedId = this.getSelectedSizeId();

    const minViewport = parseFloat(
      this.advanced.elements?.minViewportInput?.value ||
        document.getElementById("min-viewport")?.value ||
        this.advanced.constants.DEFAULT_MIN_VIEWPORT
    );
    const maxViewport = parseFloat(
      this.advanced.elements?.maxViewportInput?.value ||
        document.getElementById("max-viewport")?.value ||
        this.advanced.constants.DEFAULT_MAX_VIEWPORT
    );
    const minRootSize = parseFloat(
      this.advanced.elements.minRootSizeInput?.value
    );
    const maxRootSize = parseFloat(
      this.advanced.elements.maxRootSizeInput?.value
    );

    return {
      sizes,
      activeTab,
      unitType,
      selectedId,
      minViewport,
      maxViewport,
      minRootSize,
      maxRootSize,
    };
  }

  /**
   * Generate CSS clamp() function for fluid font scaling
   *
   * Creates mathematically precise clamp() value using linear interpolation between
   * viewport sizes. Calculates slope and intersection for preferred size calculation.
   *
   * Mathematical approach:
   * - slope = (maxSize - minSize) / (maxViewport - minViewport)
   * - intersection = -minViewport * slope + minSize
   * - preferred = intersection + (slope * 100)vw
   * - result = clamp(minSize, preferred, maxSize)
   *
   * @param {number} minSize - Minimum font size
   * @param {number} maxSize - Maximum font size
   * @param {Object} context - Generation context from getGenerationContext()
   * @returns {string} Complete CSS clamp() function
   *
   * @example
   * generateClampCSS(1.0, 1.5, context)
   * // Returns: "clamp(1rem, 0.8rem + 2vw, 1.5rem)"
   */
  generateClampCSS(minSize, maxSize, context) {
    const { unitType, minViewport, maxViewport, minRootSize, maxRootSize } =
      context;

    if (isNaN(minRootSize) || isNaN(maxRootSize)) {
      return "clamp(1rem, 1rem, 1rem)";
    }

    let minValue, maxValue;
    if (unitType === "rem") {
      minValue = `${minSize}rem`;
      maxValue = `${maxSize}rem`;
    } else {
      minValue = `${minSize}px`;
      maxValue = `${maxSize}px`;
    }

    const slope = (maxSize - minSize) / (maxViewport - minViewport);
    const intersection = -minViewport * slope + minSize;
    const slopeInViewportWidth = (slope * 100).toFixed(4);

    const intersectionValue =
      unitType === "rem"
        ? `${intersection.toFixed(4)}rem`
        : `${intersection.toFixed(4)}px`;

    return `clamp(${minValue}, ${intersectionValue} + ${slopeInViewportWidth}vw, ${maxValue})`;
  }

  /**
   * Generate CSS for selected size only
   *
   * Creates CSS output for the currently selected size based on active tab type.
   * Formats output according to tab conventions (classes, variables, tags, Tailwind).
   *
   * @param {Object} context - Generation context from getGenerationContext()
   * @returns {string} Formatted CSS for selected size
   *
   * @example
   * // For class tab:
   * // ".large { font-size: clamp(...); line-height: 1.4; }"
   */
  generateSelectedCSS(context) {
    const { sizes, activeTab, selectedId } = context;

    const selectedSize = sizes.find((s) => s.id === selectedId);
    if (!selectedSize || !selectedSize.min || !selectedSize.max) {
      return "/* No size selected or calculated */";
    }

    const clampValue = this.generateClampCSS(
      selectedSize.min,
      selectedSize.max,
      context
    );
    const displayName = this.advanced.getSizeDisplayName(
      selectedSize,
      activeTab
    );

    switch (activeTab) {
      case "class":
        return `.${displayName} {\n  font-size: ${clampValue};\n  line-height: ${selectedSize.lineHeight};\n}`;
      case "vars":
        return `:root {\n  ${displayName}: ${clampValue};\n}`;
      case "tailwind":
        return `'${displayName}': '${clampValue}'`;
      default:
        return `${displayName} {\n  font-size: ${clampValue};\n  line-height: ${selectedSize.lineHeight};\n}`;
    }
  }

  /**
   * Generate CSS for all sizes in current tab
   *
   * Creates complete CSS output for all sizes using tab-specific formatting.
   * Delegates to generateCSSByType for consistent output generation.
   *
   * @param {Object} context - Generation context from getGenerationContext()
   * @returns {string} Complete formatted CSS for all sizes
   */
  generateAllCSS(context) {
    const { sizes, activeTab } = context;
    if (!sizes || sizes.length === 0) {
      return "/* No sizes calculated */";
    }

    return this.generateCSSByType(sizes, context, activeTab);
  }

  /**
   * Generate CSS using tab-specific formatting strategy
   *
   * Uses strategy pattern to generate appropriate CSS format for each tab type.
   * Each generator provides wrapper and rule functions for consistent output.
   *
   * @param {Array} sizes - Array of size objects to generate CSS for
   * @param {Object} context - Generation context from getGenerationContext()
   * @param {string} type - Tab type identifier (class, vars, tag, tailwind)
   * @returns {string} Complete formatted CSS for the specified type
   */
  generateCSSByType(sizes, context, type) {
    const generators = {
      class: {
        wrapper: (content) => content,
        rule: (size, clampValue) =>
          `.${size.className} {\n  font-size: ${clampValue};\n  line-height: ${size.lineHeight};\n}\n\n`,
      },
      vars: {
        wrapper: (content) => `:root {\n${content}}`,
        rule: (size, clampValue) => `  ${size.variableName}: ${clampValue};\n`,
      },
      tailwind: {
        wrapper: (content) =>
          `module.exports = {\n  theme: {\n    extend: {\n      fontSize: {\n${content}      }\n    }\n  }\n}`,
        rule: (size, clampValue, index, total) => {
          const comma = index < total - 1 ? "," : "";
          return `        '${size.tailwindName}': '${clampValue}'${comma}\n`;
        },
      },
      tag: {
        wrapper: (content) => content,
        rule: (size, clampValue) =>
          `${size.tagName} {\n  font-size: ${clampValue};\n  line-height: ${size.lineHeight};\n}\n\n`,
      },
    };

    const generator = generators[type] || generators.class;
    let content = "";

    sizes.forEach((size, index) => {
      if (size.min && size.max) {
        const clampValue = this.generateClampCSS(size.min, size.max, context);
        content += generator.rule(size, clampValue, index, sizes.length);
      }
    });

    return generator.wrapper(content);
  }

  /**
   * Update CSS display elements and recreate copy buttons
   *
   * Updates the text content of CSS display elements and refreshes copy buttons
   * to ensure they have current event handlers and tooltips.
   *
   * @param {HTMLElement} selectedElement - Element for selected CSS
   * @param {HTMLElement} generatedElement - Element for generated CSS
   * @param {string} selectedCSS - Selected CSS content
   * @param {string} allCSS - Generated CSS content
   * @returns {void}
   */
  updateCSSElements(selectedElement, generatedElement, selectedCSS, allCSS) {
    selectedElement.textContent = selectedCSS;
    generatedElement.textContent = allCSS;
    this.createCopyButtons();
  }

  // ========================================================================
  // COPY FUNCTIONALITY
  // ========================================================================

  /**
   * Create and bind copy buttons with tooltips
   *
   * Generates copy buttons for both selected and generated CSS displays.
   * Includes context-appropriate tooltips and binds click handlers.
   * Called after CSS generation to ensure buttons reflect current state.
   *
   * @returns {void}
   */
  createCopyButtons() {
    const { selectedCopyContainer, generatedCopyContainer } = this.elements;

    if (selectedCopyContainer) {
      const activeTab = window.fluifofoCore?.activeTab || "class";
      const tooltipText = this.getSelectedCSSTooltip(activeTab);

      selectedCopyContainer.innerHTML = `
                <button id="copy-selected-btn" class="fcc-copy-btn" 
                        data-tooltip="${tooltipText}" 
                        aria-label="Copy selected CSS to clipboard"
                        title="Copy CSS">
                    <span class="copy-icon">📋</span> copy
                </button>
            `;
    }

    if (generatedCopyContainer) {
      const activeTab = window.fluifofoCore?.activeTab || "class";
      const tooltipText = this.getGeneratedCSSTooltip(activeTab);

      generatedCopyContainer.innerHTML = `
                <button id="copy-all-btn" class="fcc-copy-btn" 
                        data-tooltip="${tooltipText}" 
                        aria-label="Copy all generated CSS to clipboard"
                        title="Copy All CSS">
                    <span class="copy-icon">📋</span> copy all
                </button>
            `;
    }

    setTimeout(() => {
      const copySelectedBtn = document.getElementById("copy-selected-btn");
      const copyAllBtn = document.getElementById("copy-all-btn");

      if (copySelectedBtn) {
        copySelectedBtn.addEventListener("click", () => this.copySelectedCSS());
      }

      if (copyAllBtn) {
        copyAllBtn.addEventListener("click", () => this.copyGeneratedCSS());
      }
    }, 100);
  }

  /**
   * Copy selected CSS to clipboard
   *
   * Retrieves CSS from selected code element and copies to clipboard with
   * validation to prevent copying placeholder text.
   *
   * @returns {void}
   */
  copySelectedCSS() {
    const cssElement = document.getElementById("class-code");
    if (!cssElement) {
      return;
    }

    const cssText = cssElement.textContent || cssElement.innerText;

    if (
      !cssText ||
      cssText.includes("Loading CSS") ||
      cssText.includes("No CSS")
    ) {
      return;
    }

    const button = document.getElementById("copy-selected-btn");
    this.copyToClipboard(cssText, button);
  }

  /**
   * Copy generated CSS to clipboard
   *
   * Retrieves CSS from generated code element and copies to clipboard with
   * validation to prevent copying placeholder text.
   *
   * @returns {void}
   */
  copyGeneratedCSS() {
    const cssElement = document.getElementById("generated-code");
    if (!cssElement) {
      return;
    }

    const cssText = cssElement.textContent || cssElement.innerText;

    if (
      !cssText ||
      cssText.includes("Loading CSS") ||
      cssText.includes("No CSS")
    ) {
      return;
    }

    const button = document.getElementById("copy-all-btn");
    this.copyToClipboard(cssText, button);
  }

  /**
   * Copy text to clipboard with visual feedback
   *
   * Uses modern Clipboard API with fallback for older browsers.
   * Provides visual success feedback on the button element.
   *
   * @param {string} text - Text to copy to clipboard
   * @param {HTMLElement} button - Button element for visual feedback
   * @returns {void}
   */
  copyToClipboard(text, button) {
    if (!text || text.trim() === "") {
      console.warn("No text to copy");
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.showButtonSuccess(button);
        })
        .catch((err) => {
          console.error("Copy failed:", err);
          this.fallbackCopy(text);
          this.showButtonSuccess(button);
        });
    } else {
      this.fallbackCopy(text);
      this.showButtonSuccess(button);
    }
  }

  /**
   * Fallback copy method for older browsers
   *
   * Creates temporary textarea, selects content, and executes copy command.
   * Used when modern Clipboard API is unavailable.
   *
   * @param {string} text - Text to copy to clipboard
   * @returns {void}
   */
  fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);

    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    document.body.removeChild(textarea);
  }

  /**
   * Show button success state
   *
   * Adds success class to button for visual feedback. Class is automatically
   * removed after 1.5 seconds via CSS or timeout.
   *
   * @param {HTMLElement} button - Button element to update
   * @returns {void}
   */
  showButtonSuccess(button) {
    if (!button) return;

    button.classList.add("success");

    setTimeout(() => {
      button.classList.remove("success");
    }, 1500);
  }

  // ========================================================================
  // TOOLTIP GENERATION
  // ========================================================================

  /**
   * Get tooltip text for selected CSS based on active tab
   *
   * Provides context-appropriate tooltip text for the selected CSS copy button.
   *
   * @param {string} activeTab - Current active tab identifier
   * @returns {string} Tooltip text
   */
  getSelectedCSSTooltip(activeTab) {
    switch (activeTab) {
      case "class":
        return "Copy the CSS for your selected class. Paste this into your stylesheet.";
      case "vars":
        return "Copy the CSS custom property for your selected variable.";
      case "tag":
        return "Copy the CSS for your selected HTML tag.";
      default:
        return "Copy the selected CSS to your clipboard.";
    }
  }

  /**
   * Get tooltip text for generated CSS based on active tab
   *
   * Provides context-appropriate tooltip text for the generated CSS copy button.
   *
   * @param {string} activeTab - Current active tab identifier
   * @returns {string} Tooltip text
   */
  getGeneratedCSSTooltip(activeTab) {
    switch (activeTab) {
      case "class":
        return "Copy all CSS classes with responsive font sizes.";
      case "vars":
        return "Copy all CSS custom properties for your :root selector.";
      case "tag":
        return "Copy all HTML tag styles for automatic responsive typography.";
      default:
        return "Copy all generated CSS for your project.";
    }
  }

  // ========================================================================
  // KEYBOARD SHORTCUTS
  // ========================================================================

  /**
   * Setup keyboard shortcuts for copy operations
   *
   * Binds global keyboard shortcuts:
   * - Ctrl+Shift+C: Copy selected CSS
   * - Ctrl+Shift+A: Copy all CSS
   *
   * Works with both Ctrl (Windows/Linux) and Cmd (Mac).
   *
   * @returns {void}
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        this.copySelectedCSS();
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "A") {
        e.preventDefault();
        this.copyGeneratedCSS();
      }
    });
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  /**
   * Get currently selected size ID
   *
   * Determines which size is selected, prioritizing explicit row selection
   * over base value dropdown selection.
   *
   * @returns {number|null} Selected size ID or null if none selected
   */
  getSelectedSizeId() {
    if (this.advanced.selectedRowId) {
      return this.advanced.selectedRowId;
    }

    const activeTab = window.fluifofoCore?.activeTab || "class";
    const baseValue = document.getElementById("base-value")?.value;

    if (!baseValue) return null;

    const sizes = this.advanced.getCurrentSizes();
    const selectedSize = sizes.find((size) => {
      switch (activeTab) {
        case "class":
          return size.className === baseValue;
        case "vars":
          return size.variableName === baseValue;
        case "tag":
          return size.tagName === baseValue;
      }
    });

    return selectedSize ? selectedSize.id : null;
  }

  /**
   * Destroy the CSS generator controller
   *
   * Cleanup method for removing references. Call this if the generator
   * needs to be removed from the page.
   *
   * @returns {void}
   */
  destroy() {
    Object.keys(this.elements).forEach((key) => {
      this.elements[key] = null;
    });
  }
}

// Make available globally for WordPress environment
window.CSSGeneratorController = CSSGeneratorController;
