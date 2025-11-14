/**
 * Fluid Space Forge - Sample Space Controller
 *
 * Manages interactive sample space preview with viewport slider
 * and real-time interpolation of spacing values.
 *
 * @version 1.0
 */

(function (window, document) {
  "use strict";

  /**
   * Sample Space Controller Module
   *
   * Handles real-time preview of spacing at different viewport widths
   * with smooth interpolation between min and max values.
   */
  const SampleSpaceController = {
    // ========================================================================
    // STATE PROPERTIES
    // ========================================================================

    /**
     * Current viewport width from slider
     * @type {number}
     */
    currentViewport: 768,

    /**
     * Currently selected space size ID
     * @type {number}
     */
    selectedSizeId: 3,

    // ========================================================================
    // PUBLIC API - INITIALIZATION
    // ========================================================================

    /**
     * Initialize the sample space preview
     *
     * Sets up event listeners and populates initial state.
     */
    initialize() {
      // Attach event listeners
      this.attachListeners();

      // Initial render
      this.updatePreview();
    },

    /**
     * Refresh the sample preview
     *
     * Called when data changes (settings updated, sizes modified, etc.)
     */
    refresh() {
      this.populateSizeSelector();
      this.updatePreview();
    },

    // ========================================================================
    // PRIVATE - SETUP
    // ========================================================================

    /**
     * Populate the size selector dropdown
     *
     * Fills dropdown with all available sizes from current active tab.
     * @private
     */
    /**
     * Get display name from size object
     *
     * @param {Object} size - Size data object
     * @param {string} tabType - Tab identifier
     * @returns {string} Display name
     * @private
     */
    _getSizeName(size, tabType) {
      if (!size) {
        return "unknown";
      }

      let name;
      if (tabType === "class") {
        name = size.className;
      } else if (tabType === "vars") {
        name = size.variableName;
      } else if (tabType === "utils") {
        name = size.utilityName;
      } else {
        name = "unknown";
      }

      return name || "unknown";
    },

    /**
     * Attach event listeners
     *
     * Sets up listeners for slider and dropdown interactions.
     * @private
     */
    attachListeners() {
      const slider = document.getElementById("sample-viewport-slider");
      const selector = document.getElementById("sample-space-size");

      if (slider) {
        slider.addEventListener("input", (e) => {
          this.currentViewport = parseInt(e.target.value);
          this.updatePreview();
        });
      }

      if (selector) {
        // Populate the selector with current sizes
        this.populateSelector(selector);

        selector.addEventListener("change", (e) => {
          this.selectedSizeId = parseInt(e.target.value);
          this.updatePreview();
        });
      }
    },

    /**
     * Populate size selector dropdown
     *
     * Fills dropdown with all available sizes from current active tab.
     * @param {HTMLElement} selector - The select element to populate
     * @private
     */
    populateSelector(selector) {
      const currentTab = this._getCurrentTab();
      const sizes = this._getSizesForTab(currentTab);

      // Clear existing options
      selector.innerHTML = "";

      // Add option for each size
      sizes.forEach((size) => {
        const option = document.createElement("option");
        option.value = size.id;
        option.textContent = this._getSizeName(size, currentTab);

        // Select the default (id 3, typically 'md')
        if (size.id === 3) {
          option.selected = true;
          this.selectedSizeId = 3;
        }

        selector.appendChild(option);
      });
    },

    // ========================================================================
    // PRIVATE - PREVIEW UPDATE
    // ========================================================================

    /**
     * Update the preview display
     *
     * Calculates interpolated space value and updates all sample displays.
     * @private
     */
    /**
     * Update the preview display
     *
     * Calculates interpolated space value and updates all sample displays.
     * @private
     */
    updatePreview() {
      // Get settings
      const settings = window.fluispfoAjax.data.settings;
      const minVp = parseInt(settings.minViewport);
      const maxVp = parseInt(settings.maxViewport);
      const unitType = settings.unitType || "px";

      // Get base value ID from main base selector
      const baseSelect = document.getElementById("base-value");
      const baseId = baseSelect ? parseInt(baseSelect.value) : 3;

      // Calculate min/max space for selected size
      const calc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
        this.selectedSizeId,
        settings,
        baseId
      );

      // Interpolate current space at slider position
      const interpolatedSpace = this._interpolateSpace(
        calc.min,
        calc.max,
        minVp,
        maxVp,
        this.currentViewport
      );

      // Update displays
      this._updateMarginSample(interpolatedSpace, unitType);
      this._updatePaddingSample(interpolatedSpace, unitType);
      this._updateGapSample(interpolatedSpace, unitType);
      this._updateViewportDisplay();
    },

    /**
     * Interpolate space value at specific viewport width
     *
     * Linear interpolation between min and max space values.
     *
     * @param {number} minSpace - Space at minimum viewport
     * @param {number} maxSpace - Space at maximum viewport
     * @param {number} minVp - Minimum viewport width
     * @param {number} maxVp - Maximum viewport width
     * @param {number} currentVp - Current viewport width from slider
     * @returns {number} Interpolated space value
     * @private
     */
    _interpolateSpace(minSpace, maxSpace, minVp, maxVp, currentVp) {
      // Clamp viewport to valid range
      if (currentVp <= minVp) return Math.round(minSpace);
      if (currentVp >= maxVp) return Math.round(maxSpace);

      // Linear interpolation
      const progress = (currentVp - minVp) / (maxVp - minVp);
      const result = minSpace + (maxSpace - minSpace) * progress;

      return Math.round(result);
    },

    /**
     * Update margin sample display
     *
     * Margin: Pink area (margin) expands/contracts, blue content stays fixed size.
     * Container is invisible and centered.
     *
     * @param {number} space - Space value in pixels
     * @private
     */
    _updateMarginSample(space, unitType) {
      const sample = document.getElementById("margin-sample");
      const valueDisplay = document.getElementById("margin-value");

      const displayValue = this._formatDisplayValue(space, unitType);
      const cssValue = this._formatCSSValue(space, unitType);

      if (sample) {
        sample.style.padding = cssValue;
      }

      if (valueDisplay) {
        valueDisplay.textContent = displayValue;
      }
    },

    /**
     * Update padding sample display
     *
     * Padding: Green container stays fixed, padding grows inward, content shrinks.
     *
     * @param {number} space - Space value in pixels
     * @private
     */
    _updatePaddingSample(space, unitType) {
      const sample = document.getElementById("padding-sample");
      const valueDisplay = document.getElementById("padding-value");

      const displayValue = this._formatDisplayValue(space, unitType);
      const cssValue = this._formatCSSValue(space, unitType);

      if (sample) {
        sample.style.padding = cssValue;
      }

      if (valueDisplay) {
        valueDisplay.textContent = displayValue;
      }
    },

    /**
     * Update gap sample display
     *
     * Gap: Space between items changes, items stay fixed size.
     *
     * @param {number} space - Space value in pixels
     * @private
     */
    _updateGapSample(space, unitType) {
      const sample = document.getElementById("gap-sample");
      const valueDisplay = document.getElementById("gap-value");

      const displayValue = this._formatDisplayValue(space, unitType);
      const cssValue = this._formatCSSValue(space, unitType);

      if (sample) {
        sample.style.gap = cssValue;
      }

      if (valueDisplay) {
        valueDisplay.textContent = displayValue;
      }
    },

    /**
     * Update viewport display text
     *
     * Shows current viewport width and device type.
     * @private
     */
    _updateViewportDisplay() {
      const display = document.getElementById("sample-viewport-display");
      if (!display) return;

      const deviceType = this._getDeviceType(this.currentViewport);
      display.textContent = `${this.currentViewport}px • ${deviceType}`;
    },

    // ========================================================================
    // PRIVATE - UTILITY METHODS
    // ========================================================================

    /**
     * Get device type based on viewport width
     *
     * Categorizes viewport sizes into common device types.
     *
     * @param {number} viewportSize - Viewport width in pixels
     * @returns {string} Device type name
     * @private
     */
    _getDeviceType(viewportSize) {
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
    },

    /**
     * Get currently active tab
     *
     * @returns {string} Tab identifier
     * @private
     */
    _getCurrentTab() {
      const activeTab = document.querySelector(".tab-button.active");
      return activeTab ? activeTab.getAttribute("data-tab") : "class";
    },

    /**
     * Get sizes array for specific tab
     *
     * @param {string} tabType - Tab identifier
     * @returns {Array} Size data array
     * @private
     */
    _getSizesForTab(tabType) {
      if (tabType === "class") {
        return window.fluispfoAjax.data.classSizes;
      } else if (tabType === "vars") {
        return window.fluispfoAjax.data.variableSizes;
      } else {
        return window.fluispfoAjax.data.utilitySizes;
      }
    },

    /**
     * Get display name from size object
     *
     * @param {Object} size - Size data object
     * @param {string} tabType - Tab identifier
     * @returns {string} Display name
     * @private
     */
    _getSizeName(size, tabType) {
      if (!size) {
        return "unknown";
      }

      let name;
      if (tabType === "class") {
        name = size.className;
      } else if (tabType === "vars") {
        name = size.variableName;
      } else if (tabType === "utils") {
        name = size.utilityName;
      } else {
        name = "unknown";
      }

      return name || "unknown";
    },

    /**
     * Format value for display (with unit suffix)
     *
     * @param {number} space - Space value in pixels
     * @param {string} unitType - 'px' or 'rem'
     * @returns {string} Formatted display value
     * @private
     */
    _formatDisplayValue(space, unitType) {
      if (unitType === "rem") {
        const remValue = (space / 16).toFixed(3);
        return `${remValue}rem`;
      }
      return `${space}px`;
    },

    /**
     * Format value for CSS (for style attributes)
     *
     * @param {number} space - Space value in pixels
     * @param {string} unitType - 'px' or 'rem'
     * @returns {string} Formatted CSS value
     * @private
     */
    _formatCSSValue(space, unitType) {
      if (unitType === "rem") {
        const remValue = (space / 16).toFixed(3);
        return `${remValue}rem`;
      }
      return `${space}px`;
    },
  };

  // ========================================================================
  // MODULE EXPORT
  // ========================================================================

  // Export to global namespace
  window.FluidSpaceForge = window.FluidSpaceForge || {};
  window.FluidSpaceForge.SampleSpaceController = SampleSpaceController;
})(window, document);
