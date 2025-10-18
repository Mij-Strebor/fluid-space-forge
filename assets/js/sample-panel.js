/**
 * Fluid Font Forge - Sample Panel Controller
 *
 * Manages the interactive sample text preview panel with viewport-based
 * font size interpolation. Provides real-time visual feedback of how
 * typography scales between minimum and maximum viewport sizes.
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
 *
 * Features:
 * - Interactive viewport slider for real-time size preview
 * - Interpolated font size calculation based on viewport position
 * - Synchronized header and body text with proper scaling
 * - Automatic updates when settings or base values change
 */

/**
 * Sample Panel Controller Class
 *
 * Encapsulates all functionality for the sample text preview panel including
 * viewport slider interaction, font size interpolation, and settings synchronization.
 *
 * @class SamplePanelController
 * @param {FontClampAdvanced} fontClampAdvanced - Reference to main advanced features instance
 *
 * @example
 * const samplePanel = new SamplePanelController(fontClampAdvanced);
 */
class SamplePanelController {
  /**
   * Initialize sample panel controller
   *
   * @param {FontClampAdvanced} fontClampAdvanced - Main advanced features instance
   */
  constructor(fontClampAdvanced) {
    this.advanced = fontClampAdvanced;
    this.elements = {
      sampleHeader: null,
      sampleText: null,
      viewportSlider: null,
      viewportDisplay: null,
      baseValueSelect: null,
      minRootSizeInput: null,
      maxRootSizeInput: null,
      minViewportInput: null,
      maxViewportInput: null,
    };

    this.init();
  }

  /**
   * Initialize the sample panel
   *
   * Sets up DOM element references, event bindings, and initial state.
   * Called automatically on instantiation.
   *
   * @returns {void}
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.populateBaseDropdowns();
    this.updateInitialState();
  }

  /**
   * Cache DOM element references
   *
   * Stores references to frequently accessed DOM elements for performance.
   * Centralizes element queries in one location for easier maintenance.
   *
   * @returns {void}
   */
  cacheElements() {
    this.elements.sampleHeader = document.getElementById("sample-header");
    this.elements.sampleText = document.getElementById("sample-text");
    this.elements.viewportSlider = document.getElementById("viewport-slider");
    this.elements.viewportDisplay = document.getElementById("viewport-display");
    this.elements.baseValueSelect = document.getElementById("base-value");
    this.elements.titlesBaseSelect =
      document.getElementById("titles-base-value");
    this.elements.textBaseSelect = document.getElementById("text-base-value");
    this.elements.minRootSizeInput = document.getElementById("min-root-size");
    this.elements.maxRootSizeInput = document.getElementById("max-root-size");
    this.elements.minViewportInput = document.getElementById("min-viewport");
    this.elements.maxViewportInput = document.getElementById("max-viewport");
  }

  /**
   * Populate Titles and Text base dropdowns from current tab data
   *
   * Populates both dropdowns with the same options from the active tab's data table.
   * Excludes custom entries to keep the list manageable.
   *
   * @returns {void}
   */
  populateBaseDropdowns() {
    const titlesSelect = this.elements.titlesBaseSelect;
    const textSelect = this.elements.textBaseSelect;

    if (!titlesSelect || !textSelect) {
      return;
    }

    const activeTab = window.fluifofoCore?.activeTab || "class";
    const propertyName = TabDataUtils.getPropertyName(activeTab);

    // Get current sizes (include all entries, even custom ones)
    let sizes;
    if (window.FontForgeData) {
      sizes = window.FontForgeData.getSizes(activeTab, { useDefaults: false });
    } else {
      sizes = FontForgeUtils.getCurrentSizes(activeTab, this.advanced);
    }

    if (!sizes || sizes.length === 0) {
      titlesSelect.innerHTML = "<option>No sizes available</option>";
      textSelect.innerHTML = "<option>No sizes available</option>";
      titlesSelect.disabled = true;
      textSelect.disabled = true;
      return;
    }

    // Clear and populate both dropdowns
    titlesSelect.innerHTML = "";
    textSelect.innerHTML = "";
    titlesSelect.disabled = false;
    textSelect.disabled = false;

    sizes.forEach((size) => {
      // Create options for Titles dropdown
      const titlesOption = document.createElement("option");
      titlesOption.value = size.id;
      titlesOption.textContent = size[propertyName];
      titlesSelect.appendChild(titlesOption);

      // Create options for Text dropdown
      const textOption = document.createElement("option");
      textOption.value = size.id;
      textOption.textContent = size[propertyName];
      textSelect.appendChild(textOption);
    });

    // Set default selections
    // Titles: select first (largest) size
    if (titlesSelect.options.length > 0) {
      titlesSelect.options[0].selected = true;
    }

    // Text: select middle size or "medium"/"--fs-md"/"p" based on tab
    const defaultTextValue = TabDataUtils.getBaseDefaultValue(activeTab);
    let textDefaultFound = false;

    for (let i = 0; i < textSelect.options.length; i++) {
      const option = textSelect.options[i];
      const size = sizes.find((s) => s.id == option.value);
      if (size && size[propertyName] === defaultTextValue) {
        option.selected = true;
        textDefaultFound = true;
        break;
      }
    }

    // If default not found, select middle option
    if (!textDefaultFound && textSelect.options.length > 0) {
      const middleIndex = Math.floor(textSelect.options.length / 2);
      textSelect.options[middleIndex].selected = true;
    }
  }

  /**
   * Refresh base dropdowns when tab changes
   *
   * Called when the active tab changes to update dropdown options.
   *
   * @returns {void}
   */
  refreshBaseDropdowns() {
    this.populateBaseDropdowns();
    // Trigger update of sample text with new selections
    setTimeout(() => {
      if (this.elements.viewportSlider) {
        this.updateSampleText(this.elements.viewportSlider.value);
      }
    }, 100);
  }

  /**
   * Get device type based on viewport width
   *
   * Categorizes viewport sizes into common device types.
   *
   * @param {number} viewportSize - Viewport width in pixels
   * @returns {string} Device type name
   */
  getDeviceType(viewportSize) {
    if (viewportSize < 576) {
      return "Mobile (portrait)";
    } else if (viewportSize < 768) {
      return "Mobile (landscape)";
    } else if (viewportSize < 992) {
      return "Tablet (portrait)";
    } else if (viewportSize < 1200) {
      return "Tablet (landscape)";
    } else if (viewportSize < 1920) {
      return "Desktop";
    } else {
      return "Big Screen";
    }
  }

  /**
   * Bind event listeners
   *
   * Attaches event handlers for viewport slider interaction and settings changes.
   * Uses event delegation where appropriate for dynamic elements.
   *
   * @returns {void}
   */
  bindEvents() {
    // Viewport slider input for real-time preview
    if (this.elements.viewportSlider) {
      this.elements.viewportSlider.addEventListener("input", (e) => {
        this.updateSampleText(e.target.value);
      });
    }

    // Titles base dropdown changes
    if (this.elements.titlesBaseSelect) {
      this.elements.titlesBaseSelect.addEventListener("change", () => {
        this.updateSampleTextFromSettings();
      });
    }

    // Text base dropdown changes
    if (this.elements.textBaseSelect) {
      this.elements.textBaseSelect.addEventListener("change", () => {
        this.updateSampleTextFromSettings();
      });
    }

    // Base value changes affect sample text
    if (this.elements.baseValueSelect) {
      this.elements.baseValueSelect.addEventListener("change", () => {
        this.updateSampleTextFromSettings();
      });
    }

    // Settings changes that affect interpolation
    const settingsInputs = [
      this.elements.minRootSizeInput,
      this.elements.maxRootSizeInput,
      this.elements.minViewportInput,
      this.elements.maxViewportInput,
    ];

    settingsInputs.forEach((input) => {
      if (input) {
        input.addEventListener("input", () => {
          setTimeout(() => this.updateSampleTextFromSettings(), 100);
        });
      }
    });
  }

  /**
   * Set initial state of sample panel
   *
   * Applies initial viewport slider value to sample text.
   * Called after DOM elements are cached and events are bound.
   *
   * @returns {void}
   */
  updateInitialState() {
    // Delay initial update to ensure base value dropdown is populated
    setTimeout(() => {
      if (this.elements.viewportSlider) {
        this.updateSampleText(this.elements.viewportSlider.value);
      }
    }, 500);
  }

  /**
   * Update sample text based on viewport slider value
   *
   * Calculates interpolated font size between min/max based on viewport position.
   * Updates both header (1.5x larger) and body text with proper scaling.
   *
   * Mathematical Approach:
   * 1. Clamp viewport to valid range
   * 2. Calculate interpolation factor (0 to 1)
   * 3. Interpolate between min/max sizes
   * 4. Convert to pixels based on unit type
   * 5. Apply to DOM elements with appropriate line heights
   *
   * @param {number} viewportSize - Current viewport size from slider
   * @returns {void}
   */
  updateSampleText(viewportSize) {
    const {
      sampleHeader,
      sampleText,
      viewportDisplay,
      titlesBaseSelect,
      textBaseSelect,
    } = this.elements;

    if (!sampleHeader || !sampleText || !viewportDisplay) {
      return;
    }

    // Update viewport display
    viewportDisplay.textContent = viewportSize + "px";

    // Update device type display
    const deviceTypeDisplay = document.getElementById("device-type-display");
    if (deviceTypeDisplay) {
      deviceTypeDisplay.textContent = this.getDeviceType(
        parseInt(viewportSize)
      );
    }

    // Get sizes from both dropdowns
    if (
      !titlesBaseSelect ||
      !titlesBaseSelect.value ||
      !textBaseSelect ||
      !textBaseSelect.value
    ) {
      return;
    }

    const sizes = FontForgeUtils.getCurrentSizes(
      window.fluifofoCore?.activeTab,
      this.advanced
    );

    const titlesSize = sizes.find((size) => size.id == titlesBaseSelect.value);
    const textSize = sizes.find((size) => size.id == textBaseSelect.value);

    if (
      !titlesSize ||
      !titlesSize.min ||
      !titlesSize.max ||
      !textSize ||
      !textSize.min ||
      !textSize.max
    ) {
      return;
    }

    // Get settings for interpolation
    const minViewport = parseFloat(
      this.elements.minViewportInput?.value || 375
    );
    const maxViewport = parseFloat(
      this.elements.maxViewportInput?.value || 1620
    );
    const minRootSize = parseFloat(this.elements.minRootSizeInput?.value || 16);
    const maxRootSize = parseFloat(this.elements.maxRootSizeInput?.value || 20);
    const unitType = window.fluifofoCore?.unitType || "rem";

    // Clamp viewport size to valid range
    const clampedViewport = Math.max(
      minViewport,
      Math.min(maxViewport, viewportSize)
    );

    // Calculate interpolation factor (0 to 1)
    const factor =
      (clampedViewport - minViewport) / (maxViewport - minViewport);

    // Interpolate between min and max sizes for TITLES
    const interpolatedTitlesSize =
      titlesSize.min + (titlesSize.max - titlesSize.min) * factor;

    // Interpolate between min and max sizes for TEXT
    const interpolatedTextSize =
      textSize.min + (textSize.max - textSize.min) * factor;

    // Convert to pixels for display
    let titlesFontSizeInPx, textFontSizeInPx;
    if (unitType === "rem") {
      const currentRootSize =
        minRootSize + (maxRootSize - minRootSize) * factor;
      titlesFontSizeInPx = interpolatedTitlesSize * currentRootSize;
      textFontSizeInPx = interpolatedTextSize * currentRootSize;
    } else {
      titlesFontSizeInPx = interpolatedTitlesSize;
      textFontSizeInPx = interpolatedTextSize;
    }

    // Apply to header (using titles size)
    sampleHeader.style.fontSize = titlesFontSizeInPx + "px";
    sampleHeader.style.lineHeight = titlesSize.lineHeight || "1.2";
    sampleHeader.style.fontWeight = "700";

    // Apply to body text (using text size)
    sampleText.style.fontSize = textFontSizeInPx + "px";
    sampleText.style.lineHeight = textSize.lineHeight || "1.4";
    sampleText.style.fontWeight = "400";

    // Update header labels to match their sample sizes
    const titlesLabel = document.getElementById("titles-header-label");
    const textLabel = document.getElementById("text-header-label");
    if (titlesLabel) {
      titlesLabel.style.fontSize = titlesFontSizeInPx + "px";
    }
    if (textLabel) {
      textLabel.style.fontSize = textFontSizeInPx + "px";
    }

    // Update px displays with readable size
    const titlesSizeDisplay = document.getElementById("titles-size-display");
    const textSizeDisplay = document.getElementById("text-size-display");
    if (titlesSizeDisplay) {
      titlesSizeDisplay.textContent = Math.round(titlesFontSizeInPx) + "px";
      titlesSizeDisplay.style.fontSize =
        Math.max(14, titlesFontSizeInPx * 0.5) + "px";
    }
    if (textSizeDisplay) {
      textSizeDisplay.textContent = Math.round(textFontSizeInPx) + "px";
      textSizeDisplay.style.fontSize =
        Math.max(14, textFontSizeInPx * 0.5) + "px";
    }
  }

  /**
   * Update sample text when settings change
   *
   * Wrapper method that updates sample text based on current viewport slider position.
   * Used by event handlers when settings change to refresh the preview.
   *
   * @returns {void}
   */
  updateSampleTextFromSettings() {
    if (this.elements.viewportSlider) {
      this.updateSampleText(this.elements.viewportSlider.value);
    }
  }

  /**
   * Destroy the sample panel controller
   *
   * Cleanup method for removing event listeners and clearing references.
   * Call this if the sample panel needs to be removed from the page.
   *
   * @returns {void}
   */
  destroy() {
    // Remove event listeners (if needed for cleanup)
    if (this.elements.viewportSlider) {
      this.elements.viewportSlider.removeEventListener(
        "input",
        this.updateSampleText
      );
    }

    // Clear element references
    Object.keys(this.elements).forEach((key) => {
      this.elements[key] = null;
    });
  }
}

// Make available globally for WordPress environment
window.SamplePanelController = SamplePanelController;
