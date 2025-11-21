/**
 * Fluid Space Forge - Admin Script
 *
 * Main JavaScript controller for the WordPress admin interface.
 * Manages tab navigation, data tables, CSS generation, drag & drop,
 * row selection, and all user interactions.
 *
 * @version 1.0
 * @since 1.0
 */

(function (window, document) {
  "use strict";

  // ========================================================================
  // CONFIGURATION
  // ========================================================================

  /**
   * Tab type configuration
   *
   * Centralized configuration for all tab types (Classes, Variables, Utilities).
   * Uses constants passed from PHP for consistency across frontend and backend.
   *
   * @const {Object}
   * @property {Object} class - Configuration for Classes tab
   * @property {Object} vars - Configuration for Variables tab
   * @property {Object} utils - Configuration for Utilities tab
   */
  const TAB_CONFIG = {
    class: {
      dataKey: "classSizes",
      propertyName: "className",
      displayName: "Classes",
      displayNameSingular: "Class",
      modalAddTitle: "Add Class Size",
      modalEditTitle: "Edit Class Size",
      inputId: "class-name",
      emptyIcon: "🔭",
      emptyTitle: "No Space Classes",
      emptyText:
        "Get started by adding your first space class or reset to defaults.",
      emptyButtonText: "add first class",
    },
    vars: {
      dataKey: "variableSizes",
      propertyName: "variableName",
      displayName: "Variables",
      displayNameSingular: "Variable",
      modalAddTitle: "Add Variable Size",
      modalEditTitle: "Edit Variable Size",
      inputId: "variable-name",
      emptyIcon: "📐",
      emptyTitle: "No CSS Variables",
      emptyText:
        "Get started by adding your first variable or reset to defaults.",
      emptyButtonText: "add first variable",
    },
    utils: {
      dataKey: "utilitySizes",
      propertyName: "utilityName",
      displayName: "Utilities",
      displayNameSingular: "Utility",
      modalAddTitle: "Add Utility Size",
      modalEditTitle: "Edit Utility Size",
      inputId: "utility-name",
      emptyIcon: "🛠️",
      emptyTitle: "No Utility Classes",
      emptyText:
        "Get started by adding your first utility or reset to defaults.",
      emptyButtonText: "add first utility",
    },
  };

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /**
   * Initialize the application
   *
   * Sets up all initial state, event listeners, and UI components.
   * Called once when DOM is ready.
   *
   * @since 1.0
   */
  function init() {
    // Initialize toggle panels
    initTogglePanels();

    // Tab switching
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.addEventListener("click", handleTabSwitch);
    });

    // Attach unit button listeners immediately (they're outside the panel)
    const unitButtons = document.querySelectorAll(".unit-button");
    unitButtons.forEach((button) => {
      button.addEventListener("click", handleUnitChange);
    });

    // Generate initial content using saved active tab
    const initialTab = fluispfoAjax.data.settings.activeTab || "class";
    const panelContainer = document.getElementById("sizes-table-container");

    if (panelContainer) {
      panelContainer.innerHTML = generatePanelContent(initialTab);

      const settings = fluispfoAjax.data.settings;
      const currentSizes = getDataArray(initialTab);
      const cssGenerator = getCSSGenerator(initialTab);
      const css = cssGenerator(currentSizes, settings, getSelectedBaseId());

      const generatedCode = document.getElementById("generated-code");
      if (generatedCode) {
        generatedCode.textContent = css;
      }

      generatespacePreview(initialTab, currentSizes, getSelectedBaseId());

      // Initialize drag & drop manager
      const dragDropManager = new DragDropManager();
      window.dragDropManager = dragDropManager;

      // Initialize sample space controller
      if (
        window.FluidSpaceForge &&
        window.FluidSpaceForge.SampleSpaceController
      ) {
        window.FluidSpaceForge.SampleSpaceController.initialize();
      }

      // Attach initial event listeners
      attachEventListeners();
      // Initialize generates text and prefix input
      updateGeneratesText();

      // Set initial prefix input value based on active tab
      const prefixInput = document.getElementById("prefix-input");
      if (prefixInput) {
        const activeTab = document.querySelector(".tab-button.active")?.getAttribute("data-tab") || "class";
        const settings = fluispfoAjax.data.settings;
        if (activeTab === "class") {
          prefixInput.value = settings.classPrefix || "space";
        } else if (activeTab === "vars") {
          prefixInput.value = settings.variablePrefix || "sp";
        }
      }

      // Initialize sample space controller (with delay to ensure data is ready)
      setTimeout(() => {
        if (
          window.FluidSpaceForge &&
          window.FluidSpaceForge.SampleSpaceController
        ) {
          window.FluidSpaceForge.SampleSpaceController.initialize();
        }
      }, 100);
    }
  }

  /**
   * Initialize collapsible toggle panels
   *
   * Finds all buttons with data-toggle-target attribute and sets up
   * click handlers to toggle the expanded class on both button and content.
   *
   * @since 1.0
   */
  function initTogglePanels() {
    const toggleButtons = document.querySelectorAll("[data-toggle-target]");

    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-toggle-target");
        const content = document.getElementById(targetId);

        if (content) {
          content.classList.toggle("expanded");
          button.classList.toggle("expanded");

          // Save state to memory
          const isExpanded = content.classList.contains("expanded");
          if (targetId === "sample-space-content") {
            fluispfoAjax.data.settings.viewportTestExpanded = isExpanded;
          } else if (targetId === "preview-content") {
            fluispfoAjax.data.settings.spaceSizeExpanded = isExpanded;
          } else if (targetId === "about-content") {
            fluispfoAjax.data.settings.aboutExpanded = isExpanded;
          } else if (targetId === "info-content") {
            fluispfoAjax.data.settings.howToUseExpanded = isExpanded;
          }

          // Save panel state immediately (control setting)
          if (window.FluidSpaceForge && window.FluidSpaceForge.AutosaveManager) {
            window.FluidSpaceForge.AutosaveManager.saveControlSettings();
          }
        }
      });
    });
  }

  /**
   * Handle settings change with validation
   *
   * Validates input values on blur, constrains to valid ranges, and updates all displays.
   * Shows error messages for invalid values.
   *
   * @param {Event} event - Input or blur event from settings field
   * @since 1.0
   */
  /**
   * Handle Enter key on settings inputs
   *
   * Accepts current value, triggers validation, and moves to next control.
   *
   * @param {KeyboardEvent} event - Keydown event
   * @since 1.2.1
   */
  function handleSettingsKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();

      // Trigger blur to validate and update
      event.target.blur();

      // Move to next input in DOM tab order (2-column grid: left, right, left, right...)
      const settingsInputs = [
        "min-base-space",
        "min-viewport",
        "max-base-space",
        "max-viewport",
        "min-scale",
        "max-scale",
      ];

      const currentIndex = settingsInputs.indexOf(event.target.id);
      if (currentIndex !== -1 && currentIndex < settingsInputs.length - 1) {
        const nextInput = document.getElementById(
          settingsInputs[currentIndex + 1]
        );
        if (nextInput) {
          nextInput.focus();
          nextInput.select(); // Select text for easy replacement
        }
      }
    }
  }

  /**
   * Handle click on settings inputs
   *
   * Selects all text for easy replacement when clicking into an input field.
   *
   * @param {MouseEvent} event - Click event
   * @since 1.2.1
   */
  function handleInputClick(event) {
    // Select all text on click for replace-mode behavior
    event.target.select();
  }

  function handleSettingsChange(event) {
    const settings = fluispfoAjax.data.settings;
    const constants = fluispfoAjax.constants;

    const minBaseInput = document.getElementById("min-base-space");
    const maxBaseInput = document.getElementById("max-base-space");
    const minViewportInput = document.getElementById("min-viewport");
    const maxViewportInput = document.getElementById("max-viewport");

    // Only validate and constrain on blur
    if (event && event.type === "blur") {
      const target = event.target;
      let value = parseInt(target.value);
      let correctedValue = value;
      let errorMsg = null;

      if (target.id === "min-base-space") {
        if (isNaN(value) || value < constants.MIN_BASE_SPACE_RANGE[0]) {
          correctedValue = constants.MIN_BASE_SPACE_RANGE[0];
          errorMsg = `Min Space must be at least ${constants.MIN_BASE_SPACE_RANGE[0]}px`;
        } else if (value > constants.MIN_BASE_SPACE_RANGE[1]) {
          correctedValue = constants.MIN_BASE_SPACE_RANGE[1];
          errorMsg = `Min Space cannot exceed ${constants.MIN_BASE_SPACE_RANGE[1]}px`;
        }
        target.value = correctedValue;
      } else if (target.id === "max-base-space") {
        const minBase = parseInt(minBaseInput.value);
        if (isNaN(value) || value <= minBase) {
          correctedValue = minBase + 1;
          errorMsg = `Max Space must be greater than Min Space (${minBase}px)`;
        } else if (value > constants.MAX_BASE_SPACE_RANGE[1]) {
          correctedValue = constants.MAX_BASE_SPACE_RANGE[1];
          errorMsg = `Max Space cannot exceed ${constants.MAX_BASE_SPACE_RANGE[1]}px`;
        }
        target.value = correctedValue;
      } else if (target.id === "min-viewport") {
        if (isNaN(value) || value < 200) {
          correctedValue = 200;
          errorMsg = "Min Viewport must be at least 200px";
        } else if (value > 992) {
          correctedValue = 992;
          errorMsg = "Min Viewport cannot exceed 992px (tablet max)";
        }
        target.value = correctedValue;
      } else if (target.id === "max-viewport") {
        const minVp = parseInt(minViewportInput.value);
        if (isNaN(value) || value <= minVp) {
          correctedValue = minVp + 1;
          errorMsg = `Max Viewport must be greater than Min Viewport (${minVp}px)`;
        } else if (value > 1920) {
          correctedValue = 1920;
          errorMsg = "Max Viewport cannot exceed 1920px (big screen max)";
        }
        target.value = correctedValue;
      }

      if (errorMsg && correctedValue !== value) {
        showValidationError(target, errorMsg);
      }
    }

    // Get current values (after potential correction)
    const minBasespace =
      parseInt(minBaseInput.value) || constants.DEFAULT_MIN_BASE_space;
    const maxBasespace =
      parseInt(maxBaseInput.value) || constants.DEFAULT_MAX_BASE_space;
    const minViewport =
      parseInt(minViewportInput.value) || constants.DEFAULT_MIN_VIEWPORT;
    const maxViewport =
      parseInt(maxViewportInput.value) || constants.DEFAULT_MAX_VIEWPORT;

    settings.minBasespace = minBasespace;
    settings.maxBasespace = maxBasespace;
    settings.minViewport = minViewport;
    settings.maxViewport = maxViewport;
    settings.minScale =
      parseFloat(document.getElementById("min-scale").value) || 1.125;
    settings.maxScale =
      parseFloat(document.getElementById("max-scale").value) || 1.25;

    updateDataTableValues(getSelectedBaseId());
    updateCSSOutputs();

    if (
      window.FluidSpaceForge &&
      window.FluidSpaceForge.SampleSpaceController
    ) {
      window.FluidSpaceForge.SampleSpaceController.updatePreview();
    }
  }

  /**
   * Show validation error message
   *
   * Creates temporary tooltip displaying validation error.
   * Auto-fades after 3 seconds.
   *
   * @param {HTMLElement} input - Input element that had validation error
   * @param {string} message - Error message to display
   * @since 1.0
   */
  function showValidationError(input, message) {
    let tooltip = input.parentElement.querySelector(".validation-error");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "validation-error";
      tooltip.style.cssText = `
        position: absolute;
        background: var(--clr-danger);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        margin-top: 4px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      input.parentElement.style.position = "relative";
      input.parentElement.appendChild(tooltip);
    }

    tooltip.textContent = message;
    tooltip.style.display = "block";

    setTimeout(() => {
      tooltip.style.transition = "opacity 0.3s ease";
      tooltip.style.opacity = "0";
      setTimeout(() => {
        if (tooltip.parentElement) {
          tooltip.parentElement.removeChild(tooltip);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Attach event listeners
   *
   * Can be called multiple times to reattach listeners after DOM updates.
   * Removes existing listeners before attaching to prevent duplicates.
   *
   * @since 1.0
   */
  function attachEventListeners() {
    // Settings input listeners
    const spaceInputs = [
      "min-base-space",
      "max-base-space",
      "min-viewport",
      "max-viewport",
      "min-scale",
      "max-scale",
    ];
    spaceInputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      if (input) {
        // Only listen to blur, not input (avoid updating on every keypress)
        input.removeEventListener("blur", handleSettingsChange);
        input.addEventListener("blur", handleSettingsChange);

        // Handle Enter key - accept value and move to next control
        input.removeEventListener("keydown", handleSettingsKeydown);
        input.addEventListener("keydown", handleSettingsKeydown);

        // Select all text on click for easy replacement
        input.removeEventListener("click", handleInputClick);
        input.addEventListener("click", handleInputClick);
      }
    });

    // Base combo box listener
    const baseSelect = document.getElementById("base-value");
    if (baseSelect) {
      baseSelect.removeEventListener("change", handleBaseChange);
      baseSelect.addEventListener("change", handleBaseChange);
    }
    // Prefix input listeners
    const prefixInput = document.getElementById("prefix-input");
    if (prefixInput) {
      prefixInput.removeEventListener("input", handlePrefixChange);
      prefixInput.addEventListener("input", handlePrefixChange);
      prefixInput.removeEventListener("keydown", handlePrefixKeydown);
      prefixInput.addEventListener("keydown", handlePrefixKeydown);
    }

    // Unit button listeners (PX/REM)
    const unitButtons = document.querySelectorAll(".unit-button");
    unitButtons.forEach((button) => {
      button.removeEventListener("click", handleUnitChange);
      button.addEventListener("click", handleUnitChange);
    });

    // Edit button listeners
    const editButtons = document.querySelectorAll(".edit-size");
    editButtons.forEach((button) => {
      button.removeEventListener("click", handleEditClick);
      button.addEventListener("click", handleEditClick);
    });

    // Empty state button listeners
    const addFirstSizeBtn = document.getElementById("add-first-size");
    if (addFirstSizeBtn) {
      addFirstSizeBtn.removeEventListener("click", handleAddSize);
      addFirstSizeBtn.addEventListener("click", handleAddSize);
    }

    // Reset to defaults button
    const resetToDefaultsBtn = document.getElementById("reset-to-defaults");
    if (resetToDefaultsBtn) {
      resetToDefaultsBtn.removeEventListener("click", handleReset);
      resetToDefaultsBtn.addEventListener("click", handleReset);
    }

    // Populated state button listeners
    const addSizeBtn = document.getElementById("add-size");
    if (addSizeBtn) {
      addSizeBtn.removeEventListener("click", handleAddSize);
      addSizeBtn.addEventListener("click", handleAddSize);
    }

    // Reset settings button
    const resetSettingsBtn = document.getElementById("reset-settings-btn");
    if (resetSettingsBtn) {
      resetSettingsBtn.removeEventListener("click", handleSettingsReset);
      resetSettingsBtn.addEventListener("click", handleSettingsReset);
    }

    // Reset to defaults button
    const resetDefaultsBtn = document.getElementById("reset-defaults");
    if (resetDefaultsBtn) {
      resetDefaultsBtn.removeEventListener("click", handleReset);
      resetDefaultsBtn.addEventListener("click", handleReset);
    }

    // Clear all sizes button
    const clearSizesBtn = document.getElementById("clear-sizes");
    if (clearSizesBtn) {
      clearSizesBtn.removeEventListener("click", handleClearAll);
      clearSizesBtn.addEventListener("click", handleClearAll);
    }

    // Populated state button listeners (in case of multiple panels)
    const addSizeBtnPop = document.getElementById("add-size-populated");
    if (addSizeBtnPop) {
      addSizeBtnPop.removeEventListener("click", handleAddSize);
      addSizeBtnPop.addEventListener("click", handleAddSize);
    }

    // Reset to defaults button
    const resetBtnPop = document.getElementById("reset-defaults-populated");
    if (resetBtnPop) {
      resetBtnPop.removeEventListener("click", handleReset);
      resetBtnPop.addEventListener("click", handleReset);
    }

    // Clear all sizes button
    const clearSizesBtnPop = document.getElementById("clear-sizes-populated");
    if (clearSizesBtnPop) {
      clearSizesBtnPop.removeEventListener("click", handleClearAll);
      clearSizesBtnPop.addEventListener("click", handleClearAll);
    }

    // Delete button listeners
    const deleteButtons = document.querySelectorAll(".delete-size");
    deleteButtons.forEach((button) => {
      button.removeEventListener("click", handleDelete);
      button.addEventListener("click", handleDelete);
    });

    // Save button click handler
    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) {
      saveBtn.removeEventListener("click", () =>
        window.FluidSpaceForge.AutosaveManager.handleSaveButton()
      );
      saveBtn.addEventListener("click", () =>
        window.FluidSpaceForge.AutosaveManager.handleSaveButton()
      );
    }

    // Autosave toggle listener
    const autosaveToggle = document.getElementById("autosave-toggle");
    if (autosaveToggle) {
      autosaveToggle.removeEventListener("change", () =>
        window.FluidSpaceForge.AutosaveManager.handleAutosaveToggle()
      );
      autosaveToggle.addEventListener("change", () =>
        window.FluidSpaceForge.AutosaveManager.handleAutosaveToggle()
      );

      // Check initial state and start autosave if already enabled
      if (autosaveToggle.checked) {
        startAutosaveTimer();
      }
    }

    // Copy button listeners
    const copySelectedBtn = document.getElementById("copy-selected-btn");
    if (copySelectedBtn) {
      copySelectedBtn.removeEventListener("click", copySelectedCSS);
      copySelectedBtn.addEventListener("click", copySelectedCSS);
    }

    const copyAllBtn = document.getElementById("copy-all-btn");
    if (copyAllBtn) {
      copyAllBtn.removeEventListener("click", copyGeneratedCSS);
      copyAllBtn.addEventListener("click", copyGeneratedCSS);
    }

    // Row selection listeners
    const sizeRows = document.querySelectorAll(".size-row");
    sizeRows.forEach((row) => {
      row.removeEventListener("click", handleRowSelection);
      row.addEventListener("click", handleRowSelection);
    });

    // Initialize autosave if enabled
    window.FluidSpaceForge.AutosaveManager.initialize();

    // Initialize drag & drop for current tab
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";
    if (window.dragDropManager) {
      window.dragDropManager.initializeTable(currentTab);
    }
  }

  /**
   * Start autosave timer
   *
   * Delegates to AutosaveManager module.
   *
   * @since 1.0
   */
  function startAutosaveTimer() {
    if (window.FluidSpaceForge && window.FluidSpaceForge.AutosaveManager) {
      window.FluidSpaceForge.AutosaveManager.startTimer();
    }
  }

  // ========================================================================
  // CONFIGURATION HELPERS
  // ========================================================================

  /**
   * Get data array for specified tab type
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @returns {Array} Data array containing size objects
   * @since 1.0
   */
  function getDataArray(tabType) {
    const config = TAB_CONFIG[tabType];
    return config ? fluispfoAjax.data[config.dataKey] : [];
  }

  /**
   * Get property name for specified tab type
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @returns {string} Property name used in size objects
   * @since 1.0
   */
  function getPropertyName(tabType) {
    const config = TAB_CONFIG[tabType];
    return config ? config.propertyName : "className";
  }

  /**
   * Get display name for specified tab type
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @param {boolean} singular - Return singular form if true
   * @returns {string} Display name for UI
   * @since 1.0
   */
  function getDisplayName(tabType, singular = false) {
    const config = TAB_CONFIG[tabType];
    if (!config) return "Unknown";
    return singular ? config.displayNameSingular : config.displayName;
  }

  /**
   * Get input field ID for specified tab type
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @param {string} prefix - Input prefix: 'add' or 'edit'
   * @returns {string} Input field ID
   * @since 1.0
   */
  function getInputId(tabType, prefix = "add") {
    const config = TAB_CONFIG[tabType];
    return config ? `${prefix}-${config.inputId}` : "";
  }

  /**
   * Get size name from size object based on tab type
   *
   * @param {Object} size - Size object containing id and name properties
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @returns {string} Size name extracted from object
   * @since 1.0
   */
  function getSizeName(size, tabType) {
    const propertyName = getPropertyName(tabType);
    return size[propertyName] || "unknown";
  }

  /**
   * Get modal title for specified tab type and action
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @param {string} action - Action type: 'add' or 'edit'
   * @returns {string} Modal title text
   * @since 1.0
   */
  function getModalTitle(tabType, action) {
    const config = TAB_CONFIG[tabType];
    if (!config) return "Unknown";
    return action === "add" ? config.modalAddTitle : config.modalEditTitle;
  }

  /**
   * Get CSS generator function for specified tab type
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @returns {Function} CSS generator function
   * @since 1.0
   */
  function getCSSGenerator(tabType) {
    const generators = {
      class: generateClassesCSS,
      vars: generateVariablesCSS,
      utils: generateUtilitiesCSS,
    };
    return generators[tabType] || generateClassesCSS;
  }

  /**
   * Get currently selected base ID from combo box
   *
   * @returns {number} Selected base ID, defaults to 3 if not found
   * @since 1.0
   */
  function getSelectedBaseId() {
    const baseSelect = document.getElementById("base-value");
    return baseSelect ? parseInt(baseSelect.value) : 3;
  }

  // ========================================================================
  // CSS FORMATTING HELPERS
  // ========================================================================

  /**
   * Format CSS for class tab (margin, padding, gap)
   *
   * Generates CSS class definitions with proper selector and property formatting.
   * Creates three variants: margin (.space-m-), padding (.space-p-), and gap (.space-g-).
   *
   * @param {string} suffix - Size suffix (e.g., 'lg', 'md')
   * @param {string} clampFunction - Complete clamp() CSS string
   * @returns {Array<Object>} Array of objects with selector and css properties
   * @since 1.0
   */
  function formatClassCSS(suffix, clampFunction, prefix = 'space') {
    return `.${prefix}-${suffix} {\n  margin: ${clampFunction};\n}`;
  }


  /**
   * Format CSS for variables tab
   *
   * Generates CSS custom property with --sp- prefix if not already present.
   * Ensures consistent variable naming across the application.
   *
   * @param {string} variableName - CSS custom property name (e.g., 'lg' or '--sp-lg')
   * @param {string} clampFunction - Complete clamp() CSS string
   * @returns {string} Formatted CSS variable line with indentation
   * @since 1.0
   */
  function formatVariableCSS(variableName, clampFunction, prefix = 'sp') {
    let formattedName = variableName;
    if (!formattedName.startsWith("--")) {
      formattedName = `--${prefix}-${formattedName}`;
    }
    return `  ${formattedName}: ${clampFunction};`;
  }


  /**
   * Format CSS for utilities tab (Tailwind-style)
   *
   * Generates comprehensive utility classes for margins, padding, and gaps.
   * Includes directional variants (top, bottom, left, right, x-axis, y-axis, all).
   *
   * @param {string} suffix - Size suffix (e.g., 'lg', 'md')
   * @param {string} clampFunction - Complete clamp() CSS string
   * @returns {Object} Object with margin, padding, and gap arrays
   * @since 1.0
   */
  function formatUtilityCSS(suffix, clampFunction) {
    return {
      margin: [
        `.mt-${suffix} { margin-top: ${clampFunction}; }`,
        `.mb-${suffix} { margin-bottom: ${clampFunction}; }`,
        `.ml-${suffix} { margin-left: ${clampFunction}; }`,
        `.mr-${suffix} { margin-right: ${clampFunction}; }`,
        `.mx-${suffix} { margin-left: ${clampFunction}; margin-right: ${clampFunction}; }`,
        `.my-${suffix} { margin-top: ${clampFunction}; margin-bottom: ${clampFunction}; }`,
        `.m-${suffix} { margin: ${clampFunction}; }`,
      ],
      padding: [
        `.pt-${suffix} { padding-top: ${clampFunction}; }`,
        `.pb-${suffix} { padding-bottom: ${clampFunction}; }`,
        `.pl-${suffix} { padding-left: ${clampFunction}; }`,
        `.pr-${suffix} { padding-right: ${clampFunction}; }`,
        `.px-${suffix} { padding-left: ${clampFunction}; padding-right: ${clampFunction}; }`,
        `.py-${suffix} { padding-top: ${clampFunction}; padding-bottom: ${clampFunction}; }`,
        `.p-${suffix} { padding: ${clampFunction}; }`,
      ],
      gap: [
        `.gap-${suffix} { gap: ${clampFunction}; }`,
        `.gap-x-${suffix} { column-gap: ${clampFunction}; }`,
        `.gap-y-${suffix} { row-gap: ${clampFunction}; }`,
      ],
    };
  }

  // ========================================================================
  // CSS GENERATION
  // ========================================================================

  /**
   * Generate CSS for Classes tab
   *
   * Creates complete CSS output for all size classes including margin, padding, and gap variants.
   * Uses formatClassCSS helper for consistent formatting.
   *
   * @param {Array} sizes - Array of size objects
   * @param {Object} settings - Settings object with viewport and unit configuration
   * @param {number} selectedBaseId - ID of the base reference size
   * @returns {string} Complete CSS string with all class definitions
   * @since 1.0
   */
  function generateClassesCSS(sizes, settings, selectedBaseId = 3) {
    const minVp = settings.minViewport;
    const maxVp = settings.maxViewport;
    const unitType = settings.unitType;
    const prefix = settings.classPrefix || 'space';

    const allClasses = [];

    sizes.forEach((size) => {
      const calc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
        size.id,
        settings,
        selectedBaseId
      );
      const clampFunction =
        window.FluidSpaceForge.Calculations.generateClampFunction(
          calc.min,
          calc.max,
          minVp,
          maxVp,
          unitType
        );

      const suffix = size.className.replace("space-", "");
      const formatted = formatClassCSS(suffix, clampFunction, prefix);

      allClasses.push(formatted);
    });

    return allClasses.join("\n\n");
  }


  /**
   * Generate CSS for Variables tab
   *
   * Creates CSS custom properties wrapped in :root selector.
   * Uses formatVariableCSS helper to ensure consistent --sp- prefix.
   *
   * @param {Array} sizes - Array of size objects
   * @param {Object} settings - Settings object with viewport and unit configuration
   * @param {number} selectedBaseId - ID of the base reference size
   * @returns {string} Complete CSS string with :root declaration
   * @since 1.0
   */
  function generateVariablesCSS(sizes, settings, selectedBaseId = 3) {
    const minVp = settings.minViewport;
    const maxVp = settings.maxViewport;
    const unitType = settings.unitType;
    const prefix = settings.variablePrefix || 'sp';

    const variablesList = sizes
      .map((size) => {
        const calc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
          size.id,
          settings,
          selectedBaseId
        );
        const clampFunction =
          window.FluidSpaceForge.Calculations.generateClampFunction(
            calc.min,
            calc.max,
            minVp,
            maxVp,
            unitType
          );
        return formatVariableCSS(size.variableName, clampFunction, prefix);
      })
      .join("\n");

    return `:root {\n${variablesList}\n}`;
  }


  /**
   * Generate CSS for Utilities tab
   *
   * Creates Tailwind-style utility classes with directional variants.
   * Uses formatUtilityCSS helper for comprehensive utility generation.
   *
   * @param {Array} sizes - Array of size objects
   * @param {Object} settings - Settings object with viewport and unit configuration
   * @param {number} selectedBaseId - ID of the base reference size
   * @returns {string} Complete CSS string with all utility classes
   * @since 1.0
   */
  function generateUtilitiesCSS(sizes, settings, selectedBaseId = 3) {
    const minVp = settings.minViewport;
    const maxVp = settings.maxViewport;
    const unitType = settings.unitType;

    const marginUtils = [];
    const paddingUtils = [];
    const gapUtils = [];

    sizes.forEach((size) => {
      const calc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
        size.id,
        settings,
        selectedBaseId
      );
      const clampFunction =
        window.FluidSpaceForge.Calculations.generateClampFunction(
          calc.min,
          calc.max,
          minVp,
          maxVp,
          unitType
        );

      const formatted = formatUtilityCSS(size.utilityName, clampFunction);
      marginUtils.push(...formatted.margin);
      paddingUtils.push(...formatted.padding);
      gapUtils.push(...formatted.gap);
    });

    return `/* Tailwind-style Margin utilities */\n${marginUtils.join(
      "\n"
    )}\n\n/* Tailwind-style Padding utilities */\n${paddingUtils.join(
      "\n"
    )}\n\n/* Tailwind-style Gap utilities */\n${gapUtils.join("\n")}`;
  }

  /**
   * Generate CSS for single selected size
   *
   * Used by row selection feature to display CSS for individual sizes.
   * Delegates to appropriate format helper based on tab type.
   *
   * @param {number} sizeId - ID of the size to generate CSS for
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @returns {string} Formatted CSS for the selected size
   * @since 1.0
   */
  function generateSelectedCSS(sizeId, tabType) {
    const settings = fluispfoAjax.data.settings;
    const sizes = getDataArray(tabType);
    const size = sizes.find((s) => s.id === sizeId);

    if (!size) {
      return "/* No size selected */";
    }

    const selectedBaseId = getSelectedBaseId();
    const calc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
      sizeId,
      settings,
      selectedBaseId
    );

    const minVp = settings.minViewport;
    const maxVp = settings.maxViewport;
    const unitType = settings.unitType;

    const clampFunction =
      window.FluidSpaceForge.Calculations.generateClampFunction(
        calc.min,
        calc.max,
        minVp,
        maxVp,
        unitType
      );

    if (tabType === "class") {
      const suffix = size.className.replace("space-", "");
      const prefix = settings.classPrefix || 'space';
      const formatted = formatClassCSS(suffix, clampFunction, prefix);
      return formatted;
    } else if (tabType === "vars") {
      const prefix = settings.variablePrefix || 'sp';
      return formatVariableCSS(size.variableName, clampFunction, prefix);
    } else if (tabType === "utils") {
      const formatted = formatUtilityCSS(size.utilityName, clampFunction);
      return `/* Margin utilities */\n${formatted.margin.join(
        "\n"
      )}\n\n/* Padding utilities */\n${formatted.padding.join(
        "\n"
      )}\n\n/* Gap utilities */\n${formatted.gap.join("\n")}`;
    }

    return "/* Unknown tab type */";
  }

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  /**
   * Handle tab switching
   *
   * Updates active tab state, regenerates panel content, and updates CSS outputs.
   *
   * @param {Event} event - Click event from tab button
   * @since 1.0
   */
  function handleTabSwitch(event) {
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((tab) => tab.classList.remove("active"));
    event.target.classList.add("active");

    // Get tab name FIRST
    const tabName = event.target.getAttribute("data-tab");

    // Clear selected CSS panel when switching tabs
    const codePanel = document.getElementById("class-code");
    const titlePanel = document.getElementById("selected-code-title");

    if (codePanel) {
      codePanel.textContent = "/* Click a row to see its CSS */";
    }

    if (titlePanel) {
      const titles = {
        class: "Selected Class CSS",
        vars: "Selected Variable CSS",
        utils: "Selected Utility CSS",
      };
      titlePanel.textContent = titles[tabName] || "Selected CSS";
    }

    const panelContainer = document.getElementById("sizes-table-container");

    if (panelContainer) {
      panelContainer.innerHTML = generatePanelContent(tabName);

      const generatedCode = document.getElementById("generated-code");
      if (generatedCode) {
        const settings = fluispfoAjax.data.settings;
        const currentSizes = getDataArray(tabName);
        const cssGenerator = getCSSGenerator(tabName);
        const css = cssGenerator(currentSizes, settings, getSelectedBaseId());

        generatedCode.textContent = css;
        generatespacePreview(tabName, currentSizes, getSelectedBaseId());
        attachEventListeners();

        // Update generates text and prefix input value for new tab
        updateGeneratesText();

        const prefixInput = document.getElementById("prefix-input");
        if (prefixInput) {
          const config = TAB_CONFIG[tabName];
          if (tabName === "class") {
            prefixInput.value = fluispfoAjax.data.settings.classPrefix || config.defaultPrefix || "";
          } else if (tabName === "vars") {
            prefixInput.value = fluispfoAjax.data.settings.variablePrefix || config.defaultPrefix || "";
          }
        }
      }
    }

    // Clear row selection highlighting
    document
      .querySelectorAll(".size-row")
      .forEach((r) => r.classList.remove("selected"));

    // Save tab selection immediately (control setting)
    if (window.FluidSpaceForge && window.FluidSpaceForge.AutosaveManager) {
      window.FluidSpaceForge.AutosaveManager.saveControlSettings();
    }
  }


  /**
   * Handle settings change with validation
   *
   * Validates input values on blur, constrains to valid ranges, and updates all displays.
   * Shows error messages for invalid values.
   *
   * @param {Event} event - Input or blur event from settings field
   * @since 1.0
   */

  /**
   * Show validation error message
   *
   * Creates temporary tooltip displaying validation error.
   * Auto-fades after 3 seconds.
   *
   * @param {HTMLElement} input - Input element that had validation error
   * @param {string} message - Error message to display
   * @since 1.0
   */
  function showValidationError(input, message) {
    let tooltip = input.parentElement.querySelector(".validation-error");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "validation-error";
      tooltip.style.cssText = `
        position: absolute;
        background: var(--clr-danger);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        margin-top: 4px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      input.parentElement.style.position = "relative";
      input.parentElement.appendChild(tooltip);
    }

    tooltip.textContent = message;
    tooltip.style.display = "block";

    setTimeout(() => {
      tooltip.style.transition = "opacity 0.3s ease";
      tooltip.style.opacity = "0";
      setTimeout(() => {
        if (tooltip.parentElement) {
          tooltip.parentElement.removeChild(tooltip);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Handle base selection change
   *
   * Regenerates panel and recalculates all values with new base reference.
   *
   * @since 1.0
   */
  function handleBaseChange() {
    const selectedBaseId = getSelectedBaseId();
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";

    // Update settings object with new base ID for current tab
    const baseIdKey =
      currentTab === "class"
        ? "selectedClassSizeId"
        : currentTab === "vars"
        ? "selectedVariableSizeId"
        : "selectedUtilitySizeId";
    fluispfoAjax.data.settings[baseIdKey] = selectedBaseId;

    const panelContainer = document.getElementById("sizes-table-container");

    if (panelContainer) {
      panelContainer.innerHTML = generatePanelContent(currentTab);
      attachEventListeners();

      // Restore prefix input value after regenerating panel (same as handleTabSwitch)
      const prefixInput = document.getElementById("prefix-input");
      if (prefixInput) {
        if (currentTab === "class") {
          prefixInput.value = fluispfoAjax.data.settings.classPrefix || "space";
        } else if (currentTab === "vars") {
          prefixInput.value = fluispfoAjax.data.settings.variablePrefix || "sp";
        }
      }
    }

    updateDataTableValues(selectedBaseId);
    updateCSSOutputs();
  }

  /**
   * Handle prefix input change
   *
   * Updates the classPrefix or variablePrefix in settings when user types.
   * Regenerates the description text and CSS output immediately.
   *
   * @since 1.2.0
   */
  function handlePrefixChange() {
    const prefixInput = document.getElementById("prefix-input");
    if (!prefixInput) return;

    const currentTab = document.querySelector(".tab-button.active")?.getAttribute("data-tab") || "class";
    const prefix = prefixInput.value.trim();

    // Validate prefix doesn't include markers
    if (prefix.includes(".") || prefix.includes("--")) {
      showValidationError(prefixInput, "Markers (. or --) are added automatically");
    }

    // Store prefix in settings
    const settings = fluispfoAjax.data.settings;
    if (currentTab === "class") {
      settings.classPrefix = prefix || "space";
    } else if (currentTab === "vars") {
      settings.variablePrefix = prefix || "sp";
    }

    // Update UI immediately
    updateGeneratesText();
    updateCSSOutputs();

    // Save prefix immediately (like other control settings)
    if (window.FluidSpaceForge && window.FluidSpaceForge.AutosaveManager) {
      window.FluidSpaceForge.AutosaveManager.saveControlSettings();
    }
  }

  /**
   * Handle Enter key on prefix input
   *
   * Moves focus to the "Add Size" button when user presses Enter.
   *
   * @param {KeyboardEvent} event - Keydown event
   * @since 1.2.0
   */
  function handlePrefixKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      // Move focus to Add Size button
      const addButton = document.getElementById("add-size-populated") || document.getElementById("add-size");
      if (addButton) {
        addButton.focus();
      }
    }
  }

  /**
   * Update Generates text based on current tab and prefix
   *
   * Dynamically updates the description paragraph to show the current
   * prefix value in the "Generates: ..." text. Also shows/hides the
   * prefix control for Utilities tab.
   *
   * @since 1.2.0
   */
  function updateGeneratesText() {
    // Get the panel description paragraph
    const descParagraph = document.querySelector('#sizes-table-container > p');
    if (!descParagraph) return;

    const currentTab = document.querySelector(".tab-button.active")?.getAttribute("data-tab") || "class";
    const prefixInput = document.getElementById("prefix-input");
    const prefixControl = document.getElementById("prefix-control");

    // Show/hide prefix control based on tab
    if (prefixControl) {
      if (currentTab === "utils") {
        prefixControl.style.setProperty("display", "none", "important");
      } else {
        prefixControl.style.display = "flex";
      }
    }

    // Get prefix value
    const config = TAB_CONFIG[currentTab];
    let prefix = config.defaultPrefix;
    if (prefixInput && currentTab !== "utils") {
      prefix = prefixInput.value.trim() || config.defaultPrefix;
    }

    // Update description with actual prefix
    let description = "";
    if (currentTab === "class") {
      description = `Generates: <code>.${prefix}-{suffix}</code> (e.g., <code>.${prefix}-md</code>, <code>.${prefix}-xxl</code>). Make any change wanted to the base size and prefix used.`;
    } else if (currentTab === "vars") {
      description = `Generates: <code>--${prefix}-{suffix}</code> (e.g., <code>--${prefix}-md</code>, <code>--${prefix}-xxl</code>). Make any change wanted to the base size and prefix used.`;
    } else if (currentTab === "utils") {
      description = `Generates: <code>.{type}{side}-{suffix}</code> (e.g., <code>.mt-md</code>, <code>.pb-md</code>, <code>.gap-sm</code>).`;
    }

    descParagraph.innerHTML = description;
  }

  /**
   * Handle unit change (PX/REM switch)
   *
   * Updates unit type setting, button states, and recalculates all displays.
   *
   * @param {Event} event - Click event from unit button
   * @since 1.0
   */
  function handleUnitChange(event) {
    const selectedUnit = event.target.getAttribute("data-unit");

    fluispfoAjax.data.settings.unitType = selectedUnit;

    document
      .querySelectorAll(".unit-button")
      .forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");

    updateDataTableValues(getSelectedBaseId());
    updateCSSOutputs();

    if (
      window.FluidSpaceForge &&
      window.FluidSpaceForge.SampleSpaceController
    ) {
      window.FluidSpaceForge.SampleSpaceController.updatePreview();
    }

    // Save unit type immediately (control setting)
    if (window.FluidSpaceForge && window.FluidSpaceForge.AutosaveManager) {
      window.FluidSpaceForge.AutosaveManager.saveControlSettings();
    }
  }

  /**
   * Handle edit button click
   *
   * Opens modal for editing size entry with validation.
   *
   * @param {Event} event - Click event from edit button
   * @since 1.0
   */
  function handleEditClick(event) {
    const row = event.currentTarget.closest("tr");
    const sizeId = parseInt(row.getAttribute("data-id"));
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";

    const currentData = getDataArray(currentTab).find(
      (size) => size.id === sizeId
    );
    const currentValue = currentData
      ? getSizeName(currentData, currentTab)
      : "";

    window.FluidSpaceForge.ModalManager.showEditModal(
      currentTab,
      sizeId,
      currentValue,
      "edit",
      (value) => {
        const propertyName = getPropertyName(currentTab);
        const updateData = { [propertyName]: value };

        const validationError = validateEntryData(
          updateData,
          currentTab,
          "edit",
          sizeId
        );

        if (validationError) {
          return "Validation Error: " + validationError;
        }

        const targetArray = getDataArray(currentTab);
        const itemIndex = targetArray.findIndex((item) => item.id === sizeId);
        if (itemIndex !== -1) {
          Object.assign(targetArray[itemIndex], updateData);
        }

        const panelContainer = document.getElementById("sizes-table-container");
        if (panelContainer) {
          panelContainer.innerHTML = generatePanelContent(currentTab);
          attachEventListeners();
        }

        updateCSSOutputs();
        return true;
      }
    );
  }

  /**
   * Handle add size button click
   *
   * Opens modal for adding new size entry with validation.
   *
   * @since 1.0
   */
  function handleAddSize() {
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";
    const { nextId, customName } = generateNextCustomEntry(currentTab);

    window.FluidSpaceForge.ModalManager.showEditModal(
      currentTab,
      nextId,
      customName,
      "add",
      (value) => {
        const propertyName = getPropertyName(currentTab);
        const updateData = { [propertyName]: value };

        const validationError = validateEntryData(
          updateData,
          currentTab,
          "add",
          nextId
        );

        if (validationError) {
          return "Validation Error: " + validationError;
        }

        const targetArray = getDataArray(currentTab);
        const newEntry = { id: nextId, ...updateData };
        targetArray.push(newEntry);

        const panelContainer = document.getElementById("sizes-table-container");
        if (panelContainer) {
          panelContainer.innerHTML = generatePanelContent(currentTab);
          attachEventListeners();
        }

        updateCSSOutputs();
        return true;
      }
    );
  }

  /**
   * Handle reset button click
   *
   * Shows confirmation modal then restores default sizes for current tab.
   *
   * @since 1.0
   */
  /**
   * Handle Settings Reset button click
   *
   * Resets all settings inputs to their default values.
   *
   * @since 1.2.1
   */
  function handleSettingsReset() {
    window.FluidSpaceForge.ModalManager.showConfirmModal(
      "Reset Settings",
      "Reset all settings to default values?\n\nThis will reset:\n- Min Space Size to 8px\n- Max Space Size to 12px\n- Min Viewport Width to 375px\n- Max Viewport Width to 1620px\n- Min Scale to 1.125 (Major Second)\n- Max Scale to 1.333 (Perfect Fourth)\n\nYour class or variable Base and Prefix will not be affected, but the sizes of your suffix entries could change.",
      () => {
        // Get defaults from PHP constants
        const defaults = window.fluispfoAjax?.defaults || {};

        // Reset Min/Max Base Space
        const minBaseInput = document.getElementById("min-base-space");
        if (minBaseInput) {
          minBaseInput.value = defaults.minBasespace || 8;
        }

        const maxBaseInput = document.getElementById("max-base-space");
        if (maxBaseInput) {
          maxBaseInput.value = defaults.maxBasespace || 12;
        }

        // Reset Min/Max Viewport Width
        const minViewportInput = document.getElementById("min-viewport");
        if (minViewportInput) {
          minViewportInput.value = defaults.minViewport || 375;
        }

        const maxViewportInput = document.getElementById("max-viewport");
        if (maxViewportInput) {
          maxViewportInput.value = defaults.maxViewport || 1620;
        }

        // Reset Min/Max Scale dropdowns
        const minScaleSelect = document.getElementById("min-scale");
        if (minScaleSelect) {
          minScaleSelect.value = "1.125"; // Major Second
        }

        const maxScaleSelect = document.getElementById("max-scale");
        if (maxScaleSelect) {
          maxScaleSelect.value = "1.333"; // Perfect Fourth
        }

        // Trigger recalculation
        handleSettingsChange();

        // Show success notification
        window.FluidSpaceForge.ModalManager.showNotification(
          "Settings reset to defaults",
          "success"
        );
      },
      null,
      { confirmText: "Reset", isDangerous: false }
    );
  }

  function handleReset() {
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";
    const displayName = getDisplayName(currentTab, false);

    window.FluidSpaceForge.ModalManager.showConfirmModal(
      "Confirm Action",
      `Reset ${displayName} to defaults?\n\nThis will replace all current entries with the original default sizes.\n\nAny custom entries will be lost.`,
      () => {
        restoreDefaults(currentTab);

        // Reset base to "md" (id 3) for the current tab
        const baseIdKey =
          currentTab === "class"
            ? "selectedClassSizeId"
            : currentTab === "vars"
            ? "selectedVariableSizeId"
            : "selectedUtilitySizeId";
        fluispfoAjax.data.settings[baseIdKey] = 3; // md is id 3

        // Reset prefix based on tab type
        if (currentTab === "class") {
          fluispfoAjax.data.settings.classPrefix = "space";
        } else if (currentTab === "vars") {
          fluispfoAjax.data.settings.variablePrefix = "sp";
        }
        // Utilities tab has no prefix

        const panelContainer = document.getElementById("sizes-table-container");
        if (panelContainer) {
          panelContainer.innerHTML = generatePanelContent(currentTab);
          attachEventListeners();
        }

        // Update prefix input value after panel regeneration
        const prefixInput = document.getElementById("prefix-input");
        if (prefixInput) {
          if (currentTab === "class") {
            prefixInput.value = "space";
          } else if (currentTab === "vars") {
            prefixInput.value = "sp";
          }
        }

        // Update generates text to reflect new prefix
        updateGeneratesText();

        updateDataTableValues(3); // Use md (id 3) as base
        updateCSSOutputs();
        showResetNotification(displayName);
      },
      null,
      { confirmText: "confirm", isDangerous: false }
    );
  }

  /**
   * Handle delete button click
   *
   * Shows confirmation modal then removes size from data array.
   *
   * @param {Event} event - Click event from delete button
   * @since 1.0
   */
  function handleDelete(event) {
    const sizeId = parseInt(event.currentTarget.getAttribute("data-id"));
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";
    const currentData = getDataArray(currentTab);
    const itemToDelete = currentData.find((item) => item.id === sizeId);

    if (!itemToDelete) return;

    const itemName = getSizeName(itemToDelete, currentTab);

    window.FluidSpaceForge.ModalManager.showConfirmModal(
      "Delete Size",
      `Delete "${itemName}"?\n\nThis action cannot be undone.`,
      () => {
        const itemIndex = currentData.findIndex((item) => item.id === sizeId);
        if (itemIndex !== -1) {
          currentData.splice(itemIndex, 1);
        }

        const panelContainer = document.getElementById("sizes-table-container");
        if (panelContainer) {
          panelContainer.innerHTML = generatePanelContent(currentTab);
          attachEventListeners();
        }

        updateDataTableValues(getSelectedBaseId());
        updateCSSOutputs();
      },
      null,
      { confirmText: "Delete", isDangerous: true }
    );
  }

  /**
   * Handle clear all button click
   *
   * Shows confirmation modal then removes all sizes with undo option.
   *
   * @since 1.0
   */
  function handleClearAll() {
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";
    const currentData = getDataArray(currentTab);
    const displayName = getDisplayName(currentTab, false);

    window.FluidSpaceForge.ModalManager.showConfirmModal(
      "Confirm Action",
      `Are you sure you want to clear all ${displayName}?\n\nThis will remove all ${currentData.length} entries from the current tab.\n\nYou can undo this action immediately after.`,
      () => {
        getDataArray(currentTab).length = 0;

        const panelContainer = document.getElementById("sizes-table-container");
        if (panelContainer) {
          panelContainer.innerHTML = generatePanelContent(currentTab);
          attachEventListeners();
        }

        // Clear Selected Class CSS panel
        const codePanel = document.getElementById("class-code");
        if (codePanel) {
          codePanel.textContent = "";
        }

        updateCSSOutputs();
        showUndoNotification(displayName, currentData, currentTab);
      },
      null,
      { confirmText: "confirm", isDangerous: true }
    );
  }

  /**
   * Handle row selection click
   *
   * Updates visual selection state and displays CSS for selected row.
   * Ignores clicks on edit/delete buttons.
   *
   * @param {Event} event - Click event from table row
   * @since 1.0
   */
  function handleRowSelection(event) {
    if (
      event.target.closest(".edit-size") ||
      event.target.closest(".delete-size")
    ) {
      return;
    }

    const row = event.currentTarget;
    const sizeId = parseInt(row.getAttribute("data-id"));
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";

    document
      .querySelectorAll(".size-row")
      .forEach((r) => r.classList.remove("selected"));
    row.classList.add("selected");

    const css = generateSelectedCSS(sizeId, currentTab);
    const codePanel = document.getElementById("class-code");
    const titlePanel = document.getElementById("selected-code-title");

    if (codePanel) {
      codePanel.textContent = css;
    }

    if (titlePanel) {
      const titles = {
        class: "Selected Class CSS",
        vars: "Selected Variable CSS",
        utils: "Selected Utility CSS",
      };
      titlePanel.textContent = titles[currentTab] || "Selected CSS";
    }
  }

  // ========================================================================
  // VALIDATION
  // ========================================================================

  /**
   * Validate entry data before saving
   *
   * Checks for empty names, placeholder text, and duplicates.
   *
   * @param {Object} updateData - Data to validate
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @param {string} action - Action type: 'add' or 'edit'
   * @param {number} sizeId - ID of the size being edited
   * @returns {string|null} Error message or null if valid
   * @since 1.0
   */
  function validateEntryData(updateData, tabType, action, sizeId) {
    const propertyName = getPropertyName(tabType);
    const targetArray = getDataArray(tabType);
    const name = updateData[propertyName];

    if (!name || name.trim() === "") {
      return "Suffix cannot be empty.";
    }

    const placeholders = ["e.g., space-lg", "e.g., --sp-lg", "e.g., lg"];
    if (placeholders.includes(name.trim())) {
      return "Please enter a real name, not the placeholder text.";
    }

    const isDuplicate = targetArray.some((item) => {
      const isSameEntry = action === "edit" && item.id === sizeId;
      return !isSameEntry && item[propertyName] === name.trim();
    });

    if (isDuplicate) {
      return `A suffix with that value already exists.`;
    }

    return null;
  }

  // ========================================================================
  // DATA OPERATIONS
  // ========================================================================

  /**
   * Generate next custom entry data
   *
   * Calculates next available ID and custom name number.
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @returns {Object} Object with nextId and customName properties
   * @since 1.0
   */
  function generateNextCustomEntry(tabType) {
    const currentData = getDataArray(tabType);

    const maxId =
      currentData.length > 0
        ? Math.max(...currentData.map((item) => item.id))
        : 0;
    const nextId = maxId + 1;

    const customEntries = currentData.filter((item) => {
      const name = getSizeName(item, tabType);
      return name.includes("custom-");
    });

    const nextCustomNumber = customEntries.length + 1;
    const customName = `custom-${nextCustomNumber}`;

    return { nextId, customName };
  }

  /**
   * Restore default entries for specified tab type
   *
   * Uses constants from PHP for single source of truth.
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @since 1.0
   */
  function restoreDefaults(tabType) {
    const constants = fluispfoAjax.constants;
    const propertyName = constants.SIZE_TYPE_PROPERTY_NAMES[tabType];

    if (!propertyName) {
      return;
    }

    const defaults = constants.DEFAULT_SIZE_SUFFIXES.map((suffix, index) => ({
      id: index + 1,
      [propertyName]: suffix,
    }));

    if (tabType === "class") {
      fluispfoAjax.data.classSizes = defaults;
    } else if (tabType === "vars") {
      fluispfoAjax.data.variableSizes = defaults;
    } else if (tabType === "utils") {
      fluispfoAjax.data.utilitySizes = defaults;
    }
  }

  // ========================================================================
  // UI UPDATES
  // ========================================================================

  /**
   * Update data table values
   *
   * Recalculates and displays min/max values for all table rows.
   *
   * @param {number} selectedBaseId - ID of the base reference size
   * @since 1.0
   */
  function updateDataTableValues(selectedBaseId) {
    setTimeout(() => {
      const settings = fluispfoAjax.data.settings;
      const rows = document.querySelectorAll(".space-table tr[data-id]");

      rows.forEach((row) => {
        const sizeId = parseInt(row.getAttribute("data-id"));
        const calc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
          sizeId,
          settings,
          selectedBaseId
        );

        const hasPropertiesColumn = row.querySelector(
          "td:nth-child(3) .utility-properties"
        );

        let minCell, maxCell;
        if (hasPropertiesColumn) {
          minCell = row.querySelector("td:nth-child(4)");
          maxCell = row.querySelector("td:nth-child(5)");
        } else {
          minCell = row.querySelector("td:nth-child(3)");
          maxCell = row.querySelector("td:nth-child(4)");
        }

        if (minCell) {
          minCell.textContent = calc.minUnit;
        }
        if (maxCell) {
          maxCell.textContent = calc.maxUnit;
        }
      });
    }, 10);
  }

  /**
   * Update CSS outputs
   *
   * Regenerates CSS code and preview panels for current tab.
   *
   * @since 1.0
   */
  function updateCSSOutputs() {
    const currentTab =
      document.querySelector(".tab-button.active")?.getAttribute("data-tab") ||
      "class";
    const selectedBaseId = getSelectedBaseId();
    const settings = fluispfoAjax.data.settings;

    const currentSizes = getDataArray(currentTab);
    const cssGenerator = getCSSGenerator(currentTab);
    const css = cssGenerator(currentSizes, settings, selectedBaseId);

    const generatedCode = document.getElementById("generated-code");
    if (generatedCode) {
      generatedCode.textContent = css;
    }

    generatespacePreview(currentTab, currentSizes, selectedBaseId);
  }

  // ========================================================================
  // PREVIEW GENERATION
  // ========================================================================

  /**
   * Generate space preview content
   *
   * Updates both min and max preview containers with visual samples.
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @param {Array} currentSizes - Array of size objects
   * @param {number} selectedBaseId - ID of the base reference size
   * @since 1.0
   */
  function generatespacePreview(tabType, currentSizes, selectedBaseId) {
    const settings = fluispfoAjax.data.settings;

    const minContainer = document.getElementById("preview-min-container");
    if (minContainer) {
      minContainer.innerHTML = generatePreviewContent(
        currentSizes,
        settings,
        "min",
        tabType,
        selectedBaseId
      );
    }

    const maxContainer = document.getElementById("preview-max-container");
    if (maxContainer) {
      maxContainer.innerHTML = generatePreviewContent(
        currentSizes,
        settings,
        "max",
        tabType,
        selectedBaseId
      );
    }
  }

  /**
   * Generate preview content for one container
   *
   * Creates HTML for visual space demonstrations with box model.
   *
   * @param {Array} sizes - Array of size objects
   * @param {Object} settings - Settings object with viewport and unit configuration
   * @param {string} sizeType - Size type: 'min' or 'max'
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @param {number} selectedBaseId - ID of the base reference size
   * @returns {string} HTML string for preview content
   * @since 1.0
   */
  function generatePreviewContent(
    sizes,
    settings,
    sizeType,
    tabType,
    selectedBaseId = 3
  ) {
    const viewportWidth =
      sizeType === "min" ? settings.minViewport : settings.maxViewport;
    const unitType = settings.unitType || "px";

    return `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;">
        ${sizes
          .map((size) => {
            const calc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
              size.id,
              settings,
              selectedBaseId
            );
            const spacePx = sizeType === "min" ? calc.min : calc.max;
            const name = getSizeName(size, tabType);

            const displayValue =
              unitType === "rem"
                ? `${(spacePx / 16).toFixed(3)}rem`
                : `${spacePx}px`;
            const cssValue = `${spacePx}px`;

            return `
                  <div style="margin-bottom: 20px; padding: 12px; background: #var(--clr-sample-container-bg); border-radius: 6px; border: 1px solid #var(--clr-sample-container-border); box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                      <div style="font-size: 32px; color: #var(--clr-sample-title-text); margin-bottom: 12px; font-weight: 600;">${name}</div>
                      
                      <div style="margin-bottom: 12px;">
                          <div style="font-size: 10px; color: #var(--clr-sample-label-text); margin-bottom: 4px; font-weight: 500;">Margin & Padding</div>
                          <div style="background: var(--clr-sample-margin-bg); padding: ${cssValue}; border: 1px dashed var(--clr-sample-margin-border); border-radius: 4px; display: inline-block;">
                              <div style="font-size: 9px; color: var(--clr-sample-margin-text); margin-bottom: 2px;">margin: ${displayValue}</div>
                             <div style="background: var(--clr-sample-padding-bg); padding: ${cssValue}; border: 1px dashed var(--clr-sample-padding-border);">
                           <div style="font-size: 9px; color: var(--clr-sample-padding-text); margin-bottom: 2px;">padding: ${displayValue}</div>
                                 <div style="background: var(--clr-sample-content-bg); padding: 12px 16px; border: 1px solid var(--clr-sample-content-border); color: var(--clr-sample-content-text); font-size: 11px; font-weight: 500;">
                                      Content
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <div>
                          <div style="font-size: 10px; color: #var(--clr-sample-label-text); margin-bottom: 4px; font-weight: 500;">Gap (Flexbox/Grid)</div>
                          <div style="display: flex; gap: ${cssValue}; border: 1px dashed var(--clr-sample-gap-border); padding: 8px; border-radius: 4px; background: var(--clr-sample-gap-bg);">
                              <div style="background: var(--clr-sample-content-bg); padding: 12px 16px; border: 1px solid var(--clr-sample-content-border); color: var(--clr-sample-content-text); font-size: 11px; font-weight: 500;">Item 1</div>
                              <div style="font-size: 9px; color: var(--clr-sample-gap-text); align-self: center; white-space: nowrap;">gap: ${displayValue}</div>
                              <div style="background: var(--clr-sample-content-bg); padding: 12px 16px; border: 1px solid var(--clr-sample-content-border); color: var(--clr-sample-content-text); font-size: 11px; font-weight: 500;">Item 2</div>
                          </div>
                      </div>
                  </div>
              `;
          })
          .join("")}
      </div>
  `;
  }

  // ========================================================================
  // PANEL GENERATION
  // ========================================================================

  /**
   * Generate panel content
   *
   * Wrapper function that maps tab type to size data.
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @returns {string} Complete panel HTML
   * @since 1.0
   */
  function generatePanelContent(tabType) {
    const data = fluispfoAjax.data;

    const sizesMap = {
      class: data.classSizes,
      vars: data.variableSizes,
      utils: data.utilitySizes,
    };

    // Get the selected base ID for this tab type
    const baseIdKey =
      tabType === "class"
        ? "selectedClassSizeId"
        : tabType === "vars"
        ? "selectedVariableSizeId"
        : "selectedUtilitySizeId";
    const selectedBaseId = parseInt(data.settings[baseIdKey]) || 3;

    return generatePanel(tabType, sizesMap[tabType], selectedBaseId);
  }

  /**
   * Generate panel HTML for any tab type
   *
   * Creates complete data table panel using generic template.
   * Handles both empty and populated states.
   *
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @param {Array} sizes - Size data array
   * @param {number} selectedBaseId - ID of the base reference size
   * @returns {string} Complete panel HTML
   * @since 1.0
   */
  function generatePanel(tabType, sizes, selectedBaseId = 3) {
    const cfg = fluispfoAjax.panelConfig[tabType];
    if (!cfg) return "<p>Unknown tab type</p>";

    let html = fluispfoAjax.templates.genericPanel;

    html = html.replace(/{{PANEL_TITLE}}/g, cfg.title);
    html = html.replace(/{{PANEL_DESCRIPTION}}/g, cfg.description);
    html = html.replace(/{{PREFIX_CONTROL_DISPLAY}}/g, tabType === "utils" ? "none" : "flex");

    // Set prefix value based on tab type
    const prefixValue = tabType === "class"
      ? (fluispfoAjax.data.settings.classPrefix || "space")
      : (fluispfoAjax.data.settings.variablePrefix || "sp");
    html = html.replace(/{{PREFIX_VALUE}}/g, prefixValue);

    // Handle empty state
    if (!sizes || sizes.length === 0) {
      html = html.replace("{{EMPTY_CLASS}}", "state-visible");
      html = html.replace("{{POPULATED_CLASS}}", "state-hidden");
      html = html.replace("{{EMPTY_ICON}}", cfg.emptyIcon);
      html = html.replace("{{EMPTY_TITLE}}", cfg.emptyTitle);
      html = html.replace("{{EMPTY_TEXT}}", cfg.emptyText);
      html = html.replace("{{EMPTY_BUTTON_TEXT}}", cfg.emptyButtonText);
      html = html.replace("{{EMPTY_OPTION_TEXT}}", cfg.emptyOptionText);
      html = html.replace("{{BASE_OPTIONS}}", "");
      html = html.replace("{{TABLE_ROWS}}", "");
      return html;
    }

    // Handle populated state
    html = html.replace("{{EMPTY_CLASS}}", "state-hidden");
    html = html.replace("{{POPULATED_CLASS}}", "state-visible");

    const baseOptions = sizes
      .map(
        (size) => `
        <option value="${size.id}" ${
          size.id === selectedBaseId ? "selected" : ""
        }>${size[cfg.nameProperty]}</option>
    `
      )
      .join("");

    const tableRows = sizes
      .map((size) => {
        const baseIdKey =
          tabType === "class"
            ? "selectedClassSizeId"
            : tabType === "vars"
            ? "selectedVariableSizeId"
            : "selectedUtilitySizeId";
        const selectedBase =
          parseInt(fluispfoAjax.data.settings[baseIdKey]) ||
          sizes[0]?.id ||
          3;

        const minCalc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
          size.id,
          fluispfoAjax.data.settings,
          selectedBase,
          tabType
        );

        const maxCalc = window.FluidSpaceForge.Calculations.calculateSpaceSize(
          size.id,
          fluispfoAjax.data.settings,
          selectedBase,
          tabType
        );

        return `
        <tr class="size-row" draggable="true" data-id="${size.id}">
            <td class="drag-handle" style="cursor: grab; user-select: none; text-align: center;">⋮</td>
            <td>
                <span class="size-name">${size[cfg.nameProperty]}</span>
            </td>
            <td>
                <span class="calculated-value">${minCalc.minUnit}</span>
            </td>
     <td>
                <span class="calculated-value">${maxCalc.maxUnit}</span>
            </td>
            <td>
                <button class="edit-size" data-id="${
                  size.id
                }" data-tooltip="Edit this size entry">✎</button>
                <button class="delete-size" data-id="${
                  size.id
                }" data-tooltip="Delete this size entry">🗑️</button>
            </td>
        </tr>
    `;
      })
      .join("");

    html = html.replace("{{BASE_OPTIONS}}", baseOptions);
    html = html.replace("{{TABLE_ROWS}}", tableRows);

    // Clean up remaining empty state markers
    html = html.replace("{{EMPTY_ICON}}", "");
    html = html.replace("{{EMPTY_TITLE}}", "");
    html = html.replace("{{EMPTY_TEXT}}", "");
    html = html.replace("{{EMPTY_BUTTON_TEXT}}", "");
    html = html.replace("{{EMPTY_OPTION_TEXT}}", "");

    return html;
  }

  // ========================================================================
  // NOTIFICATIONS
  // ========================================================================

  /**
   * Show reset success notification
   *
   * Displays temporary notification confirming successful reset operation.
   * Auto-dismisses after 3 seconds with fade animation.
   *
   * @param {string} tabName - Display name of the tab that was reset
   * @since 1.0
   */
  function showResetNotification(tabName) {
    const notification = document.createElement("div");
    notification.id = "reset-notification";
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--jimr-success);
        color: white;
        padding: 16px 20px;
        border-radius: var(--jimr-border-radius-lg);
        box-shadow: var(--clr-shadow-xl);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 2px solid var(--jimr-success-dark);
        animation: slideInUp 0.3s ease;
    `;

    notification.innerHTML = `
        <div style="font-size: 20px;">✅</div>
        <div>
            <div style="font-weight: 600; margin-bottom: 2px;">Reset Complete</div>
            <div style="font-size: 12px; opacity: 0.9;">Restored 6 default ${tabName.toLowerCase()}</div>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transition =
          "transform 0.25s ease-out, opacity 0.25s ease-out";
        notification.style.transform = "translateY(100%)";
        notification.style.opacity = "0";

        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 250);
      }
    }, 3000);
  }

  /**
   * Show undo notification
   *
   * Displays notification with undo button after clearing all sizes.
   * Provides 10-second window to restore deleted data.
   *
   * @param {string} tabName - Display name of the cleared tab
   * @param {Array} backupData - Backup of cleared data for undo operation
   * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
   * @since 1.0
   */
  function showUndoNotification(tabName, backupData, tabType) {
    const notification = document.createElement("div");
    notification.id = "clear-undo-notification";
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--clr-secondary);
        color: #FAF9F6;
        padding: 16px 20px;
        border-radius: var(--jimr-border-radius-lg);
        box-shadow: var(--clr-shadow-xl);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 16px;
        border: 2px solid var(--clr-primary);
        max-width: 400px;
        animation: slideInUp 0.3s ease;
    `;

    notification.innerHTML = `
        <div style="flex-grow: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">Cleared ${backupData.length} ${tabName}</div>
            <div style="font-size: 12px; opacity: 0.9;">This action can be undone</div>
        </div>
        <button id="undo-clear-btn" style="
            background: var(--clr-accent);
            color: var(--clr-btn-txt);
            border: none;
            padding: 8px 16px;
            border-radius: var(--jimr-border-radius);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--jimr-transition);
        ">undo</button>
        <button id="dismiss-clear-btn" style="
            background: none;
            border: none;
            color: #FAF9F6;
            font-size: 18px;
            cursor: pointer;
            padding: 4px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        ">×</button>
    `;

    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    document.getElementById("undo-clear-btn").addEventListener("click", () => {
      const targetArray = getDataArray(tabType);
      targetArray.length = 0;
      targetArray.push(...backupData);

      const panelContainer = document.getElementById("sizes-table-container");
      if (panelContainer) {
        panelContainer.innerHTML = generatePanelContent(tabType);
        attachEventListeners();
      }

      updateDataTableValues(getSelectedBaseId());
      updateCSSOutputs();

      removeNotification(notification);
    });

    document
      .getElementById("dismiss-clear-btn")
      .addEventListener("click", () => {
        removeNotification(notification);
      });

    const handleUndoKeydown = (event) => {
      if (event.key === "Enter") {
        removeNotification(notification);
        document.removeEventListener("keydown", handleUndoKeydown);
      }
    };
    document.addEventListener("keydown", handleUndoKeydown);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        removeNotification(notification);
        document.removeEventListener("keydown", handleUndoKeydown);
      }
    }, 10000);
  }

  /**
   * Remove notification
   *
   * Animates notification removal with slide-down effect.
   * Prevents duplicate removal attempts.
   *
   * @param {HTMLElement} notification - Notification element to remove
   * @since 1.0
   */
  function removeNotification(notification) {
    if (notification.dataset.removing === "true") return;
    notification.dataset.removing = "true";

    notification.style.transition =
      "transform 0.25s ease-out, opacity 0.25s ease-out";
    notification.style.transform = "translateY(100%)";
    notification.style.opacity = "0";

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 250);
  }

  // ========================================================================
  // COPY TO CLIPBOARD
  // ========================================================================

  /**
   * Copy selected CSS to clipboard
   *
   * Copies the CSS from the selected class code element to clipboard.
   * Provides visual feedback via button animation.
   *
   * @since 1.2.1
   */
  function copySelectedCSS() {
    const cssElement = document.getElementById("class-code");
    if (!cssElement) return;

    const cssText = cssElement.textContent || cssElement.innerText;

    // Don't copy placeholder text
    if (!cssText || cssText.includes("Loading CSS")) return;

    const button = document.getElementById("copy-selected-btn");
    copyToClipboard(cssText, button);
  }

  /**
   * Copy all generated CSS to clipboard
   *
   * Copies the CSS from the generated code element to clipboard.
   * Provides visual feedback via button animation.
   *
   * @since 1.2.1
   */
  function copyGeneratedCSS() {
    const cssElement = document.getElementById("generated-code");
    if (!cssElement) return;

    const cssText = cssElement.textContent || cssElement.innerText;

    // Don't copy placeholder text
    if (!cssText || cssText.includes("Loading CSS")) return;

    const button = document.getElementById("copy-all-btn");
    copyToClipboard(cssText, button);
  }

  /**
   * Copy text to clipboard with visual feedback
   *
   * Uses modern Clipboard API with fallback for older browsers.
   * Provides visual success feedback on the button element.
   *
   * @param {string} text - Text to copy to clipboard
   * @param {HTMLElement} button - Button element to show feedback on
   * @since 1.2.1
   */
  function copyToClipboard(text, button) {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      fallbackCopyToClipboard(text, button);
      return;
    }

    navigator.clipboard.writeText(text).then(
      () => {
        showCopySuccess(button);
      },
      (err) => {
        console.error("Failed to copy:", err);
        showCopyError(button);
      }
    );
  }

  /**
   * Fallback copy method for older browsers
   *
   * Creates temporary textarea element to copy text.
   *
   * @param {string} text - Text to copy
   * @param {HTMLElement} button - Button element to show feedback on
   * @since 1.2.1
   */
  function fallbackCopyToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      showCopySuccess(button);
    } catch (err) {
      console.error("Fallback copy failed:", err);
      showCopyError(button);
    }

    document.body.removeChild(textArea);
  }

  /**
   * Show copy success feedback on button
   *
   * Temporarily changes button text and icon to indicate success.
   *
   * @param {HTMLElement} button - Button element to update
   * @since 1.2.1
   */
  function showCopySuccess(button) {
    if (!button) return;

    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="copy-icon">✅</span> copied!';
    button.style.background = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = "";
    }, 2000);
  }

  /**
   * Show copy error feedback on button
   *
   * Temporarily changes button text and icon to indicate error.
   *
   * @param {HTMLElement} button - Button element to update
   * @since 1.2.1
   */
  function showCopyError(button) {
    if (!button) return;

    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="copy-icon">❌</span> error';
    button.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = "";
    }, 2000);
  }

  // ========================================================================
  // GLOBAL EXPORTS
  // ========================================================================

  /**
   * Export functions to global namespace
   *
   * Makes key functions available to other modules (drag-drop, autosave, etc.).
   *
   * @since 1.0
   */
  window.FluidSpaceForge = window.FluidSpaceForge || {};
  window.FluidSpaceForge.generatePanelContent = generatePanelContent;
  window.FluidSpaceForge.attachEventListeners = attachEventListeners;
  window.FluidSpaceForge.updateDataTableValues = updateDataTableValues;
  window.FluidSpaceForge.updateCSSOutputs = updateCSSOutputs;
  window.FluidSpaceForge.getSelectedBaseId = getSelectedBaseId;
})(window, document);
