/**
 * Fluid Space Forge - Autosave Manager
 *
 * Manages automatic and manual saving of plugin settings and size data
 * to WordPress database via AJAX. Provides visual feedback during save
 * operations and handles timer-based autosave functionality.
 *
 * @version 1.0
 */

(function (window) {
  "use strict";

  /**
   * Autosave Manager Module
   *
   * Singleton object managing save operations, autosave timer,
   * and UI feedback for save status.
   */
  const AutosaveManager = {
    // ========================================================================
    // STATE PROPERTIES
    // ========================================================================

    /**
     * Timer reference for autosave interval
     * @type {number|null}
     */
    timer: null,

    /**
     * Autosave interval in milliseconds (30 seconds)
     * @type {number}
     */
    interval: 30000,

    // ========================================================================
    // PUBLIC API - INITIALIZATION
    // ========================================================================

    /**
     * Initialize autosave on page load if enabled
     *
     * Checks autosave toggle state and starts timer if enabled.
     * Should be called after DOM is ready.
     */
    initialize() {
      const autosaveToggle = document.getElementById("autosave-toggle");
      if (autosaveToggle && autosaveToggle.checked) {
        this.startTimer();
      }
    },

    // ========================================================================
    // PUBLIC API - EVENT HANDLERS
    // ========================================================================

    /**
     * Handle save button click
     *
     * Collects all current settings and size data from DOM,
     * sends AJAX request to WordPress, and provides visual feedback
     * throughout the save operation.
     */
    handleSaveButton() {
      // Get UI elements
      const saveBtn = document.getElementById("save-btn");
      const autosaveStatus = document.getElementById("autosave-status");
      const autosaveIcon = document.getElementById("autosave-icon");
      const autosaveText = document.getElementById("autosave-text");

      // Update UI to saving state
      this._updateSaveStatus(
        "saving",
        saveBtn,
        autosaveStatus,
        autosaveIcon,
        autosaveText
      );

      // Collect data from DOM
      const settings = this._collectSettings();
      const allSizes = this._collectSizes();

      // Prepare AJAX request
      const data = {
        action: "save_fluispfo_settings",
        nonce: window.fluispfoAjax.nonce,
        settings: JSON.stringify(settings),
        sizes: JSON.stringify(allSizes),
      };

      // Send request
      fetch(window.fluispfoAjax.ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      })
        .then((response) => response.json())
        .then((result) => {
          // Success feedback
          this._updateSaveStatus(
            "saved",
            saveBtn,
            autosaveStatus,
            autosaveIcon,
            autosaveText
          );

          // Reset to ready after delay
          setTimeout(() => {
            this._updateSaveStatus(
              "idle",
              saveBtn,
              autosaveStatus,
              autosaveIcon,
              autosaveText
            );
          }, 2000);
        })
        .catch((error) => {
          console.error("Save error:", error);

          // Error feedback
          this._updateSaveStatus(
            "error",
            saveBtn,
            autosaveStatus,
            autosaveIcon,
            autosaveText
          );

          // Reset to ready after delay
          setTimeout(() => {
            this._updateSaveStatus(
              "idle",
              saveBtn,
              autosaveStatus,
              autosaveIcon,
              autosaveText
            );
          }, 3000);

          alert("Error saving data");
        });
    },

    /**
     * Handle autosave toggle change
     *
     * Starts or stops autosave timer based on toggle state.
     * Also saves the toggle state immediately (control setting).
     */
    handleAutosaveToggle() {
      const isEnabled = document.getElementById("autosave-toggle")?.checked;

      if (isEnabled) {
        this.startTimer();
      } else {
        this.stopTimer();
      }

      // Save autosave toggle state immediately (control setting)
      this.saveControlSettings();
    },

    /**
     * Save only control/UI settings (immediate persistence)
     *
     * Saves UI state settings that should persist immediately without
     * requiring Save button click. This allows refresh-to-undo for
     * data settings while preserving UI preferences.
     *
     * Control settings:
     * - Panel expand/collapse states (all 4 panels)
     * - Autosave toggle state
     * - Active tab selection
     * - Unit type (PX/REM)
     */
    saveControlSettings() {
      // Collect only control settings
      const controlSettings = {
        autosaveEnabled: document.getElementById("autosave-toggle")?.checked,
        activeTab: document
          .querySelector(".tab-button.active")
          ?.getAttribute("data-tab"),
        unitType: document
          .querySelector(".unit-button.active")
          ?.getAttribute("data-unit"),
        aboutExpanded:
          document
            .getElementById("about-content")
            ?.classList.contains("expanded") ?? true,
        howToUseExpanded:
          document
            .getElementById("info-content")
            ?.classList.contains("expanded") ?? true,
        viewportTestExpanded:
          document
            .getElementById("sample-space-content")
            ?.classList.contains("expanded") ?? true,
        spaceSizeExpanded:
          document
            .getElementById("preview-content")
            ?.classList.contains("expanded") ?? true,
      };

      // Prepare AJAX request - send only control settings
      const data = {
        action: "save_fluispfo_settings",
        nonce: window.fluispfoAjax.nonce,
        settings: JSON.stringify(controlSettings),
        sizes: JSON.stringify({
          classSizes: window.fluispfoAjax?.data?.classSizes || [],
          variableSizes: window.fluispfoAjax?.data?.variableSizes || [],
          utilitySizes: window.fluispfoAjax?.data?.utilitySizes || [],
        }),
      };

      // Send silently (no UI feedback)
      fetch(window.fluispfoAjax.ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      });
    },

    // ========================================================================
    // PUBLIC API - TIMER MANAGEMENT
    // ========================================================================

    /**
     * Start autosave timer
     *
     * Clears any existing timer and starts new interval timer
     * that triggers autosave at configured interval.
     */
    startTimer() {
      this.stopTimer(); // Clear any existing timer

      this.timer = setInterval(() => {
        this.performSave(true);
      }, this.interval);
    },

    /**
     * Stop autosave timer
     *
     * Clears the interval timer and resets timer reference.
     */
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    /**
     * Perform save operation
     *
     * Triggers save operation programmatically. Can be called
     * by timer for autosave or manually for user-initiated saves.
     *
     * @param {boolean} isAutosave - Whether this is an automatic save
     */
    performSave(isAutosave = false) {
      const saveBtn = document.getElementById("save-btn");
      if (saveBtn) {
        this.handleSaveButton();
      }
    },

    // ========================================================================
    // PRIVATE - DATA COLLECTION
    // ========================================================================

    /**
     * Collect current settings from DOM
     *
     * Reads all settings input values and returns structured object
     * ready for serialization and database storage.
     *
     * @returns {Object} Settings object with all current values
     * @private
     */
    _collectSettings() {
      return {
        minBasespace: document.getElementById("min-base-space")?.value,
        maxBasespace: document.getElementById("max-base-space")?.value,
        minViewport: document.getElementById("min-viewport")?.value,
        maxViewport: document.getElementById("max-viewport")?.value,
        minScale: document.getElementById("min-scale")?.value,
        maxScale: document.getElementById("max-scale")?.value,
        unitType: document
          .querySelector(".unit-button.active")
          ?.getAttribute("data-unit"),
        activeTab: document
          .querySelector(".tab-button.active")
          ?.getAttribute("data-tab"),
        autosaveEnabled: document.getElementById("autosave-toggle")?.checked,
        classPrefix: window.fluispfoAjax?.data?.settings?.classPrefix || "space",
        variablePrefix: window.fluispfoAjax?.data?.settings?.variablePrefix || "sp",
        selectedClassSizeId: document.getElementById("base-value")?.value || 3,
        selectedVariableSizeId:
          document.getElementById("base-value")?.value || 3,
        selectedUtilitySizeId:
          document.getElementById("base-value")?.value || 3,
        viewportTestExpanded:
          document
            .getElementById("sample-space-content")
            ?.classList.contains("expanded") ?? true,
        spaceSizeExpanded:
          document
            .getElementById("preview-content")
            ?.classList.contains("expanded") ?? true,
      };
    },

    /**
     * Collect current sizes from global data
     *
     * Retrieves size arrays for all tabs from global state.
     *
     * @returns {Object} Object containing all size arrays
     * @private
     */
    _collectSizes() {
      return {
        classSizes: window.fluispfoAjax?.data?.classSizes || [],
        variableSizes: window.fluispfoAjax?.data?.variableSizes || [],
        utilitySizes: window.fluispfoAjax?.data?.utilitySizes || [],
      };
    },

    // ========================================================================
    // PRIVATE - UI FEEDBACK
    // ========================================================================

    /**
     * Update save status UI elements
     *
     * Updates button text, status indicator class, icon, and text
     * based on current save operation state.
     *
     * @param {string} state - Current state: 'idle', 'saving', 'saved', 'error'
     * @param {HTMLElement} saveBtn - Save button element
     * @param {HTMLElement} autosaveStatus - Status container element
     * @param {HTMLElement} autosaveIcon - Icon element
     * @param {HTMLElement} autosaveText - Text element
     * @private
     */
    _updateSaveStatus(
      state,
      saveBtn,
      autosaveStatus,
      autosaveIcon,
      autosaveText
    ) {
      const states = {
        idle: {
          statusClass: "autosave-status idle",
          icon: "💾",
          text: "Ready",
          btnText: "Save",
          btnDisabled: false,
        },
        saving: {
          statusClass: "autosave-status saving",
          icon: "⏳",
          text: "Saving...",
          btnText: "Saving...",
          btnDisabled: true,
        },
        saved: {
          statusClass: "autosave-status saved",
          icon: "✅",
          text: "Saved!",
          btnText: "Save",
          btnDisabled: false,
        },
        error: {
          statusClass: "autosave-status error",
          icon: "❌",
          text: "Error",
          btnText: "Save",
          btnDisabled: false,
        },
      };

      const config = states[state];
      if (!config) return;

      // Update status indicator
      if (autosaveStatus && autosaveIcon && autosaveText) {
        autosaveStatus.className = config.statusClass;
        autosaveIcon.textContent = config.icon;
        autosaveText.textContent = config.text;
      }

      // Update save button
      if (saveBtn) {
        saveBtn.disabled = config.btnDisabled;
        saveBtn.textContent = config.btnText;
      }
    },
  };

  // ========================================================================
  // MODULE EXPORT
  // ========================================================================

  // Export to global namespace
  window.FluidSpaceForge = window.FluidSpaceForge || {};
  window.FluidSpaceForge.AutosaveManager = AutosaveManager;
})(window);
