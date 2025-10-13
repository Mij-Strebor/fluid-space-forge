/**
 * Fluid Space Forge - Calculations Module
 *
 * Pure mathematical functions for space calculations and CSS clamp()
 * generation. Handles linear interpolation, unit conversion, and
 * scaling calculations based on musical harmony ratios.
 *
 * @version 1.0
 */

(function (window) {
  "use strict";

  /**
   * Calculations Module
   *
   * Stateless module providing pure mathematical functions for
   * responsive space calculations. All methods are side-effect free.
   */
  const Calculations = {
    // ========================================================================
    // CONSTANTS
    // ========================================================================

    /**
     * Pixels per rem unit (browser default)
     * @type {number}
     * @const
     */
    PIXELS_PER_REM: 16,

    // ========================================================================
    // PUBLIC API - CSS GENERATION
    // ========================================================================

    /**
     * Generate CSS clamp() function with linear interpolation
     *
     * Creates a responsive CSS clamp() function that scales linearly
     * between viewport breakpoints. Uses the formula:
     * clamp(min, constant + coefficient*vw, max)
     *
     * Where:
     * - coefficient = (maxPx - minPx) / (maxViewport - minViewport) * 100
     * - constant = minPx - (coefficient * minViewport / 100)
     *
     * @param {number} minValue - Minimum space value at min viewport
     * @param {number} maxValue - Maximum space value at max viewport
     * @param {number} minViewport - Minimum viewport width in pixels
     * @param {number} maxViewport - Maximum viewport width in pixels
     * @param {string} unitType - Output unit type: 'px' or 'rem'
     * @returns {string} Complete CSS clamp() function string
     */
    generateClampFunction(
      minValue,
      maxValue,
      minViewport,
      maxViewport,
      unitType
    ) {
      // Convert input values to pixels for calculation
      const minPx =
        unitType === "rem" ? minValue * this.PIXELS_PER_REM : minValue;
      const maxPx =
        unitType === "rem" ? maxValue * this.PIXELS_PER_REM : maxValue;

      // Calculate linear interpolation coefficients
      const coefficient = ((maxPx - minPx) / (maxViewport - minViewport)) * 100;
      const constant = minPx - (coefficient * minViewport) / 100;

      // Format min/max values with units
      const minUnit = this._formatValue(minPx, unitType);
      const maxUnit = this._formatValue(maxPx, unitType);

      // Format preferred value (constant + coefficient)
      const preferredValue = this._formatPreferredValue(
        constant,
        coefficient,
        unitType
      );

      return `clamp(${minUnit}, ${preferredValue}, ${maxUnit})`;
    },

    // ========================================================================
    // PUBLIC API - SPACE CALCULATIONS
    // ========================================================================

    /**
     * Calculate space size based on position relative to base
     *
     * Determines space size by applying exponential scaling from a base
     * reference size. Size multiplier is calculated as scale^steps where
     * steps is the distance from the base size in the table.
     *
     * Steps calculation:
     * - Negative steps = smaller sizes (above base in table)
     * - Positive steps = larger sizes (below base in table)
     * - Zero steps = base size (no scaling applied)
     *
     * @param {number} sizeId - ID of the size to calculate
     * @param {Object} settings - Settings object containing:
     *   - minBasespace: Base space at minimum viewport (px)
     *   - maxBasespace: Base space at maximum viewport (px)
     *   - minScale: Scale ratio at minimum viewport
     *   - maxScale: Scale ratio at maximum viewport
     *   - unitType: Output unit type ('px' or 'rem')
     * @param {number} selectedBaseId - ID of the base reference size (default: 3)
     * @param {string} tabType - Optional explicit tab type to avoid DOM reads during init
     * @returns {Object} Object containing:
     *   - min: Minimum space value in pixels
     *   - max: Maximum space value in pixels
     *   - minUnit: Minimum value formatted with units
     *   - maxUnit: Maximum value formatted with units
     */
    calculateSpaceSize(sizeId, settings, selectedBaseId = 3, tabType = null) {
      // Validate and get base ID
      let baseId = this._validateBaseId(selectedBaseId);

      // Get current data array - use explicit type if provided to avoid DOM reads during init
      const currentSizes = tabType
        ? this._getSizesArrayByType(tabType)
        : this._getCurrentSizesArray();

      const baseIndex = currentSizes.findIndex((item) => item.id === baseId);
      const currentIndex = currentSizes.findIndex((item) => item.id === sizeId);

      // Validate indices
      if (baseIndex === -1 || currentIndex === -1) {
        console.log("❌ Base entry not found in table");
        return this._getFallbackValues();
      }

      // Get scaling ratios
      const minScale = parseFloat(settings.minScale);
      const maxScale = parseFloat(settings.maxScale);

      if (isNaN(minScale) || isNaN(maxScale)) {
        console.error("Invalid scaling values");
        return this._getFallbackValues();
      }

      // Get base space values
      const baseMinSpace = parseInt(settings.minBasespace);
      const baseMaxSpace = parseInt(settings.maxBasespace);

      // Calculate steps from base (negative = smaller, positive = larger)
      const steps = currentIndex - baseIndex;

      // Apply exponential scaling: scale^steps
      const minMultiplier = Math.pow(minScale, steps);
      const maxMultiplier = Math.pow(maxScale, steps);

      // Calculate final sizes
      const minSize = Math.round(baseMinSpace * minMultiplier);
      const maxSize = Math.round(baseMaxSpace * maxMultiplier);

      return {
        min: minSize,
        max: maxSize,
        minUnit: this._formatValue(minSize, settings.unitType),
        maxUnit: this._formatValue(maxSize, settings.unitType),
      };
    },

    // ========================================================================
    // PRIVATE - FORMATTING HELPERS
    // ========================================================================

    /**
     * Format value with appropriate units
     *
     * Converts pixel value to requested unit type with proper formatting.
     *
     * @param {number} pxValue - Value in pixels
     * @param {string} unitType - Target unit type: 'px' or 'rem'
     * @returns {string} Formatted value with unit suffix
     * @private
     */
    _formatValue(pxValue, unitType) {
      if (unitType === "rem") {
        return (pxValue / this.PIXELS_PER_REM).toFixed(3) + " rem";
      }
      return pxValue + " px";
    },

    /**
     * Format preferred value for clamp() function
     *
     * Creates the middle parameter of clamp() function using calc()
     * to combine constant and viewport-relative coefficient.
     *
     * @param {number} constant - Fixed offset in pixels
     * @param {number} coefficient - Viewport-relative multiplier
     * @param {string} unitType - Output unit type: 'px' or 'rem'
     * @returns {string} Formatted calc() expression or vw-only value
     * @private
     */
    _formatPreferredValue(constant, coefficient, unitType) {
      const constantFormatted = this._formatValue(constant, unitType);
      const coefficientFormatted = coefficient.toFixed(4) + "vw";

      // If no constant offset, return vw value alone
      if (constant === 0) {
        return coefficientFormatted;
      }

      return `calc(${constantFormatted} + ${coefficientFormatted})`;
    },

    // ========================================================================
    // PRIVATE - VALIDATION & FALLBACKS
    // ========================================================================

    /**
     * Validate base ID and provide fallback
     *
     * Ensures base ID is valid, falling back to DOM or default value.
     *
     * @param {number} selectedBaseId - Requested base ID
     * @returns {number} Valid base ID
     * @private
     */
    _validateBaseId(selectedBaseId) {
      let baseId = selectedBaseId;

      // Check if provided ID is invalid
      if (!baseId || isNaN(baseId)) {
        const baseComboValue = document.getElementById("base-value")?.value;
        if (!baseComboValue) {
          console.log("❌ No base value selected.");
          return 3; // Default fallback
        }
        baseId = parseInt(baseComboValue);
      }

      return baseId;
    },

    /**
     * Get current sizes array based on active tab
     *
     * Retrieves appropriate data array from global state based on
     * which tab is currently active.
     *
     * @returns {Array} Current sizes array for active tab
     * @private
     */
    _getCurrentSizesArray() {
      const currentTab =
        document
          .querySelector(".tab-button.active")
          ?.getAttribute("data-tab") || "class";

      let currentSizes;
      if (currentTab === "class") {
        currentSizes = window.spaceClampAjax.data.classSizes;
      } else if (currentTab === "vars") {
        currentSizes = window.spaceClampAjax.data.variableSizes;
      } else {
        currentSizes = window.spaceClampAjax.data.utilitySizes;
      }

      return currentSizes;
    },

    /**
     * Get sizes array by explicit tab type (avoids DOM reads)
     *
     * @param {string} tabType - Explicit tab type: 'class', 'vars', or 'utils'
     * @returns {Array} Sizes array for specified tab
     * @private
     */
    _getSizesArrayByType(tabType) {
      if (tabType === "class") {
        return window.spaceClampAjax.data.classSizes;
      } else if (tabType === "vars") {
        return window.spaceClampAjax.data.variableSizes;
      } else {
        return window.spaceClampAjax.data.utilitySizes;
      }
    },

    /**
     * Get fallback values for error cases
     *
     * Returns safe default values when calculations cannot proceed.
     *
     * @returns {Object} Fallback calculation result
     * @private
     */
    _getFallbackValues() {
      return {
        min: 8,
        max: 12,
        minUnit: "8px",
        maxUnit: "12px",
      };
    },
  };

  // ========================================================================
  // MODULE EXPORT
  // ========================================================================

  // Export to global namespace
  window.FluidSpaceForge = window.FluidSpaceForge || {};
  window.FluidSpaceForge.Calculations = Calculations;
})(window);
