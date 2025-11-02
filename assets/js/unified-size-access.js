/**
 * Unified Size Access System
 *
 * Single source of truth for all size data access throughout the application.
 * Eliminates scattered size retrieval patterns and provides consistent API.
 *
 * @package FluidFontForge
 * @since 4.0.2
 */

/**
 * FontForge Data Accessor
 *
 * Centralized data access layer that eliminates duplicate size retrieval logic
 * and provides a single, consistent API for all size operations.
 */
class FontForgeDataAccessor {
  constructor() {
    this.initialized = false;
    this.dataSource = null;
    this.activeTab = "class";
    this.cache = new Map();

    this.init();
  }

  /**
   * Initialize the data accessor
   */
  init() {
    // Primary data source from WordPress localized script
    this.dataSource = window.fluidfontforgeAjax?.data || {};

    // Listen for tab changes to clear relevant cache
    window.addEventListener("fontClamp_tabChanged", (e) => {
      this.activeTab = e.detail.activeTab;
      this.clearCache();
    });

    // Listen for data updates to clear cache
    window.addEventListener("fontClamp_dataUpdated", () => {
      this.clearCache();
    });

    this.initialized = true;
  }

  /**
   * Get sizes for any tab type with optional fallback to defaults
   *
   * @param {string} tabType - Tab type ('class', 'vars', 'tag', 'tailwind')
   * @param {object} options - Options object
   * @param {boolean} options.useDefaults - Whether to use defaults if no data (default: true)
   * @param {boolean} options.useCache - Whether to use cached results (default: true)
   * @returns {array} Array of size objects
   */
  getSizes(tabType = null, options = {}) {
    const { useDefaults = true, useCache = true } = options;

    const targetTab = tabType || this.getCurrentTab();
    const cacheKey = `sizes_${targetTab}`;

    // Check cache first if enabled
    if (useCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let sizes = this.getRawSizes(targetTab);

    // Apply defaults if needed and no explicit data exists
    if (
      sizes.length === 0 &&
      useDefaults &&
      !this.isExplicitlyCleared(targetTab)
    ) {
      sizes = this.getDefaultSizes(targetTab);

      // Update the data source with defaults for consistency
      this.updateRawSizes(targetTab, sizes);
    }

    // Cache the result
    if (useCache) {
      this.cache.set(cacheKey, sizes);
    }

    return sizes;
  }

  /**
   * Set sizes for a specific tab type
   *
   * @param {string} tabType - Tab type
   * @param {array} sizes - Array of size objects
   * @param {object} options - Options object
   * @param {boolean} options.clearCache - Whether to clear cache (default: true)
   * @param {boolean} options.triggerUpdate - Whether to trigger update event (default: true)
   */
  setSizes(tabType, sizes, options = {}) {
    const { clearCache = true, triggerUpdate = true } = options;

    if (!this.isValidTabType(tabType)) {
      console.error(`Invalid tab type: ${tabType}`);
      return false;
    }

    // Update the raw data source
    this.updateRawSizes(tabType, sizes);

    // Update core interface if available
    this.updateCoreInterface(tabType, sizes);

    // Clear cache if requested
    if (clearCache) {
      this.clearCache();
    }

    // Trigger update event if requested
    if (triggerUpdate) {
      this.triggerDataUpdate(tabType, sizes);
    }

    return true;
  }

  /**
   * Get current active tab
   *
   * @returns {string} Current active tab
   */
  getCurrentTab() {
    // Priority order: stored activeTab, core interface, settings, default
    return (
      this.activeTab ||
      window.fontClampCore?.activeTab ||
      this.dataSource?.settings?.activeTab ||
      "class"
    );
  }

  /**
   * Set current active tab
   *
   * @param {string} tabType - Tab type to set as active
   */
  setCurrentTab(tabType) {
    if (this.isValidTabType(tabType)) {
      this.activeTab = tabType;
      this.clearCache(); // Clear cache when tab changes
    }
  }

  /**
   * Get a specific size by ID from any tab
   *
   * @param {number|string} sizeId - Size ID to find
   * @param {string} tabType - Tab type to search in (optional, searches current tab if not provided)
   * @returns {object|null} Size object or null if not found
   */
  getSizeById(sizeId, tabType = null) {
    const sizes = this.getSizes(tabType);
    return sizes.find((size) => size.id == sizeId) || null;
  }

  /**
   * Add a new size to a tab
   *
   * @param {string} tabType - Tab type
   * @param {object} newSize - New size object
   * @returns {boolean} Success status
   */
  addSize(tabType, newSize) {
    const sizes = this.getSizes(tabType);
    sizes.push(newSize);
    return this.setSizes(tabType, sizes);
  }

  /**
   * Update an existing size
   *
   * @param {string} tabType - Tab type
   * @param {number|string} sizeId - Size ID to update
   * @param {object} updates - Properties to update
   * @returns {boolean} Success status
   */
  updateSize(tabType, sizeId, updates) {
    const sizes = this.getSizes(tabType);
    const sizeIndex = sizes.findIndex((size) => size.id == sizeId);

    if (sizeIndex === -1) {
      return false;
    }

    // Update the size object
    Object.assign(sizes[sizeIndex], updates);

    return this.setSizes(tabType, sizes);
  }

  /**
   * Remove a size from a tab
   *
   * @param {string} tabType - Tab type
   * @param {number|string} sizeId - Size ID to remove
   * @returns {boolean} Success status
   */
  removeSize(tabType, sizeId) {
    const sizes = this.getSizes(tabType);
    const filteredSizes = sizes.filter((size) => size.id != sizeId);

    if (filteredSizes.length === sizes.length) {
      return false; // Size not found
    }

    return this.setSizes(tabType, filteredSizes);
  }

  /**
   * Clear all sizes for a tab (marks as explicitly cleared)
   *
   * @param {string} tabType - Tab type to clear
   * @returns {boolean} Success status
   */
  clearSizes(tabType) {
    // Mark as explicitly cleared to prevent auto-restoration of defaults
    this.markExplicitlyCleared(tabType);

    return this.setSizes(tabType, []);
  }

  /**
   * Reset sizes to defaults for a tab
   *
   * @param {string} tabType - Tab type to reset
   * @returns {boolean} Success status
   */
  resetToDefaults(tabType) {
    // Clear the explicitly cleared flag
    this.clearExplicitlyCleared(tabType);

    const defaultSizes = this.getDefaultSizes(tabType);
    return this.setSizes(tabType, defaultSizes);
  }

  /**
   * Get display name for a size based on tab type
   *
   * @param {object} size - Size object
   * @param {string} tabType - Tab type (optional, uses current tab if not provided)
   * @returns {string} Display name
   */
  getSizeDisplayName(size, tabType = null) {
    const targetTab = tabType || this.getCurrentTab();
    const propertyName = TabDataUtils.getPropertyName(targetTab);
    return size[propertyName] || "";
  }

  /**
   * Check if any tab has data
   *
   * @returns {boolean} True if any tab has size data
   */
  hasAnyData() {
    const tabTypes = this.getValidTabTypes();
    return tabTypes.some(
      (tabType) => this.getSizes(tabType, { useDefaults: false }).length > 0
    );
  }

  /**
   * Get summary of all tab data
   *
   * @returns {object} Summary object with counts for each tab
   */
  getDataSummary() {
    const summary = {};
    const tabTypes = this.getValidTabTypes();

    tabTypes.forEach((tabType) => {
      const sizes = this.getSizes(tabType, { useDefaults: false });
      summary[tabType] = {
        count: sizes.length,
        hasDefaults: sizes.length > 0 && !this.isExplicitlyCleared(tabType),
        isEmpty: sizes.length === 0,
      };
    });

    return summary;
  }

  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================

  /**
   * Get raw sizes from data source without any processing
   *
   * @param {string} tabType - Tab type
   * @returns {array} Raw size array
   */
  getRawSizes(tabType) {
    if (!this.dataSource) {
      return [];
    }

    const dataKey = TabDataMap[tabType]?.dataKey;
    if (!dataKey) {
      return [];
    }

    return [...(this.dataSource[dataKey] || [])];
  }

  /**
   * Update raw sizes in data source
   *
   * @param {string} tabType - Tab type
   * @param {array} sizes - New sizes array
   */
  updateRawSizes(tabType, sizes) {
    if (!this.dataSource) {
      this.dataSource = {};
    }

    const dataKey = TabDataMap[tabType]?.dataKey;
    if (dataKey) {
      this.dataSource[dataKey] = [...sizes];
    }
  }

  /**
   * Update core interface data if available
   *
   * @param {string} tabType - Tab type
   * @param {array} sizes - New sizes array
   */
  updateCoreInterface(tabType, sizes) {
    if (!window.fontClampCore) {
      return;
    }

    const dataKey = TabDataMap[tabType]?.dataKey;
    if (dataKey) {
      // Update core interface data
      window.fontClampCore[dataKey] = [...sizes];
    }
  }

  /**
   * Get default sizes for a tab type
   *
   * @param {string} tabType - Tab type
   * @returns {array} Default sizes array
   */
  getDefaultSizes(tabType) {
    // Use FluidFontForgeDefaultData if available
    if (window.FluidFontForgeDefaultData) {
      const result = FluidFontForgeDefaultData.getDefaultSizesByType(tabType);
      return result;
    }

    // Fallback to fontClampAdvanced defaults
    if (window.fontClampAdvanced) {
      switch (tabType) {
        case "class":
          const result =
            window.fontClampAdvanced.getDefaultClassSizes?.() || [];
          // If still empty, force immediate initialization
          if (
            result.length === 0 &&
            window.fontClampAdvanced.initialized === false
          ) {
            window.fontClampAdvanced.init();
            return window.fontClampAdvanced.getDefaultClassSizes?.() || [];
          }
          return result;
          return window.fontClampAdvanced.getDefaultClassSizes?.() || [];
        case "vars":
          return window.fontClampAdvanced.getDefaultVariableSizes?.() || [];
        case "tag":
          return window.fontClampAdvanced.getDefaultTagSizes?.() || [];
        case "tailwind":
          return window.fontClampAdvanced.getDefaultTailwindSizes?.() || [];
      }
    }

    return [];
  }

  /**
   * Check if a tab type is valid
   *
   * @param {string} tabType - Tab type to validate
   * @returns {boolean} True if valid
   */
  isValidTabType(tabType) {
    return (
      TabDataUtils.isValidTab?.(tabType) ||
      ["class", "vars", "tag", "tailwind"].includes(tabType)
    );
  }

  /**
   * Get all valid tab types
   *
   * @returns {array} Array of valid tab types
   */
  getValidTabTypes() {
    return (
      TabDataUtils.getValidTabs?.() || ["class", "vars", "tag", "tailwind"]
    );
  }

  /**
   * Check if a tab is explicitly cleared (user chose to clear it)
   *
   * @param {string} tabType - Tab type
   * @returns {boolean} True if explicitly cleared
   */
  isExplicitlyCleared(tabType) {
    return this.dataSource?.explicitlyClearedTabs?.[tabType] === true;
  }

  /**
   * Mark a tab as explicitly cleared
   *
   * @param {string} tabType - Tab type
   */
  markExplicitlyCleared(tabType) {
    if (!this.dataSource) {
      this.dataSource = {};
    }
    if (!this.dataSource.explicitlyClearedTabs) {
      this.dataSource.explicitlyClearedTabs = {};
    }
    this.dataSource.explicitlyClearedTabs[tabType] = true;
  }

  /**
   * Clear the explicitly cleared flag for a tab
   *
   * @param {string} tabType - Tab type
   */
  clearExplicitlyCleared(tabType) {
    if (this.dataSource?.explicitlyClearedTabs) {
      delete this.dataSource.explicitlyClearedTabs[tabType];
    }
  }

  /**
   * Clear the internal cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Trigger data update event
   *
   * @param {string} tabType - Tab type that was updated
   * @param {array} sizes - Updated sizes array
   */
  triggerDataUpdate(tabType, sizes) {
    window.dispatchEvent(
      new CustomEvent("fontClamp_dataUpdated", {
        detail: {
          tabType,
          sizes,
          allData: this.dataSource,
        },
      })
    );
  }
}

// ========================================================================
// GLOBAL INITIALIZATION & REPLACEMENT UTILITIES
// ========================================================================

/**
 * Initialize the unified data accessor and replace existing utilities
 */
function initializeUnifiedSizeAccess() {
  // Create global instance
  window.FontForgeData = new FontForgeDataAccessor();

  // Replace FontForgeUtils.getCurrentSizes with unified accessor
  if (window.FontForgeUtils) {
    window.FontForgeUtils.getCurrentSizes = (
      activeTab = null,
      fontClampAdvanced = null
    ) => {
      return window.FontForgeData.getSizes(activeTab);
    };
  }

  // Create simplified global function for common usage
  window.getCurrentSizes = (tabType = null) => {
    return window.FontForgeData.getSizes(tabType);
  };
}

/**
 * Replacement methods for existing patterns throughout the codebase
 */
const UnifiedSizeAccess = {
  /**
   * Get current sizes (replaces all getCurrentSizes() calls)
   */
  getCurrentSizes(tabType = null) {
    return window.FontForgeData?.getSizes(tabType) || [];
  },

  /**
   * Get size by ID (replaces manual array searching)
   */
  getSizeById(sizeId, tabType = null) {
    return window.FontForgeData?.getSizeById(sizeId, tabType) || null;
  },

  /**
   * Update size data (replaces direct array manipulation)
   */
  updateSizes(tabType, sizes) {
    return window.FontForgeData?.setSizes(tabType, sizes) || false;
  },

  /**
   * Get display name (replaces scattered naming logic)
   */
  getDisplayName(size, tabType = null) {
    return window.FontForgeData?.getSizeDisplayName(size, tabType) || "";
  },
};

// Make replacement utilities available globally
window.UnifiedSizeAccess = UnifiedSizeAccess;

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUnifiedSizeAccess);
} else {
  initializeUnifiedSizeAccess();
}
