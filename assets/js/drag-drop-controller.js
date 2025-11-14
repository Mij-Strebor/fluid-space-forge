/**
 * Fluid Space Forge - Drag & Drop Manager
 *
 * Handles drag and drop functionality for reordering table rows across
 * different tab types (classes, variables, utilities). Provides visual
 * feedback during drag operations and manages data reordering.
 *
 * @version 1.0
 */

(function (window) {
  "use strict";

  /**
   * Modular Drag & Drop Manager
   *
   * Manages drag and drop interactions for table row reordering with
   * visual feedback and placeholder positioning. Designed for easy
   * enhancement from moderate to complete implementation phases.
   */
  class DragDropManager {
    /**
     * Initialize the Drag & Drop Manager
     *
     * Sets up initial state and configuration for drag operations.
     * All properties are instance-specific to support multiple tables.
     */
    constructor() {
      // Drag state management
      this.draggedElement = null;
      this.draggedData = null;
      this.currentTabType = null;
      this.placeholder = null;

      // Configuration options (extension points)
      this.animationDuration = 200;
      this.visualFeedbackEnabled = true;
      this.dropZoneClass = "drag-drop-zone";
    }

    // ========================================================================
    // PUBLIC API - INITIALIZATION
    // ========================================================================

    /**
     * Initialize drag & drop for a table
     *
     * Sets up drag and drop listeners for all rows in the specified tab's
     * table. Must be called after table DOM is rendered.
     *
     * @param {string} tabType - Tab identifier: 'class', 'vars', or 'utils'
     * @throws {Error} Logs error if table body not found
     */
    initializeTable(tabType) {
      this.currentTabType = tabType;
      const tableBody = document.querySelector("#sizes-table");

      if (!tableBody) {
        return;
      }

      // Setup drag listeners for all data rows
      const rows = tableBody.querySelectorAll("tr[data-id]");
      rows.forEach((row) => this.makeRowDraggable(row));

      // Enable table body as drop target
      this.makeDropZone(tableBody);
    }

    // ========================================================================
    // PUBLIC API - CONFIGURATION
    // ========================================================================

    /**
     * Enable enhanced animations (extension point)
     *
     * Increases animation duration for smoother transitions.
     * Future versions may add ghost images and advanced transitions.
     */
    enableEnhancedAnimations() {
      this.animationDuration = 300;
      // Future: Add smooth transitions, ghost images, etc.
    }

    /**
     * Set custom visual feedback options (extension point)
     *
     * Allows customization of drag and drop visual behavior.
     * Future versions may support custom drop zones and insertion indicators.
     *
     * @param {Object} options - Configuration options to merge
     */
    setCustomFeedback(options) {
      Object.assign(this, options);
      // Future: Custom drop zones, insertion indicators, etc.
    }

    // ========================================================================
    // PRIVATE - ELEMENT SETUP
    // ========================================================================

    /**
     * Make a table row draggable
     *
     * Attaches drag event listeners to a row and configures cursor
     * behavior for the drag handle.
     *
     * @param {HTMLElement} row - Table row element to make draggable
     * @private
     */
    makeRowDraggable(row) {
      const handle = row.querySelector(".drag-handle");
      if (!handle) return;

      // Enable HTML5 drag API
      row.draggable = true;

      // Attach drag lifecycle events
      row.addEventListener("dragstart", (e) => this.handleDragStart(e, row));
      row.addEventListener("dragend", (e) => this.handleDragEnd(e, row));

      // Visual cursor feedback for drag handle
      handle.addEventListener("mousedown", () => {
        handle.style.cursor = "grabbing";
      });

      handle.addEventListener("mouseup", () => {
        handle.style.cursor = "grab";
      });
    }

    /**
     * Make an element a drop zone
     *
     * Attaches necessary event listeners to enable an element to
     * receive dropped items.
     *
     * @param {HTMLElement} element - Element to configure as drop zone
     * @private
     */
    makeDropZone(element) {
      element.addEventListener("dragover", (e) => this.handleDragOver(e));
      element.addEventListener("drop", (e) => this.handleDrop(e));
      element.addEventListener("dragenter", (e) => this.handleDragEnter(e));
      element.addEventListener("dragleave", (e) => this.handleDragLeave(e));
    }

    // ========================================================================
    // PRIVATE - DRAG LIFECYCLE HANDLERS
    // ========================================================================

    /**
     * Handle drag start event
     *
     * Stores dragged element reference, applies visual feedback,
     * creates placeholder, and configures drag transfer data.
     *
     * @param {DragEvent} event - Native drag start event
     * @param {HTMLElement} row - Row being dragged
     * @private
     */
    handleDragStart(event, row) {
      this.draggedElement = row;

      // Store data for drop validation
      const sizeId = parseInt(row.getAttribute("data-id"));
      this.draggedData = this.getSizeData(sizeId);

      // Apply visual feedback
      if (this.visualFeedbackEnabled) {
        row.classList.add("dragging");
        row.style.opacity = "0.5";
      }

      // Create visual placeholder
      this.createPlaceholder(row);

      // Configure drag transfer
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/html", row.outerHTML);
    }

    /**
     * Handle drag end event
     *
     * Cleans up visual feedback, removes placeholder, and
     * clears stored drag state.
     *
     * @param {DragEvent} event - Native drag end event
     * @param {HTMLElement} row - Row that was dragged
     * @private
     */
    handleDragEnd(event, row) {
      // Remove visual feedback
      row.classList.remove("dragging");
      row.style.opacity = "";

      // Clean up placeholder
      this.removePlaceholder();

      // Clear stored state
      this.draggedElement = null;
      this.draggedData = null;
    }

    /**
     * Handle drag over event
     *
     * Allows drop operation and updates placeholder position
     * based on mouse location relative to target row.
     *
     * @param {DragEvent} event - Native drag over event
     * @private
     */
    handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      // Update placeholder position dynamically
      const targetRow = this.findNearestRow(event.target);
      if (targetRow && targetRow !== this.draggedElement) {
        this.updatePlaceholderPosition(targetRow, event.clientY);
      }
    }

    /**
     * Handle drop event
     *
     * Validates drop target, calculates insertion position,
     * reorders data array, and regenerates table.
     *
     * @param {DragEvent} event - Native drop event
     * @private
     */
    handleDrop(event) {
      event.preventDefault();

      if (!this.draggedElement || !this.draggedData) return;

      // Validate drop target
      const targetRow = this.findNearestRow(event.target);
      if (!targetRow || targetRow === this.draggedElement) {
        return;
      }

      // Extract IDs for reordering
      const draggedId = parseInt(this.draggedElement.getAttribute("data-id"));
      const targetId = parseInt(targetRow.getAttribute("data-id"));

      // Determine insertion position (above or below target)
      const rect = targetRow.getBoundingClientRect();
      const dropAbove = event.clientY < rect.top + rect.height / 2;

      // Perform reorder and refresh UI
      this.reorderData(draggedId, targetId, dropAbove);
      this.regenerateTable();
    }

    /**
     * Handle drag enter event
     *
     * Adds visual feedback class when dragging over drop zone.
     *
     * @param {DragEvent} event - Native drag enter event
     * @private
     */
    handleDragEnter(event) {
      if (this.visualFeedbackEnabled) {
        event.currentTarget.classList.add(this.dropZoneClass);
      }
    }

    /**
     * Handle drag leave event
     *
     * Removes visual feedback class when leaving drop zone.
     * Only triggers when actually leaving the zone (not child elements).
     *
     * @param {DragEvent} event - Native drag leave event
     * @private
     */
    handleDragLeave(event) {
      // Only remove if truly leaving the drop zone
      if (!event.currentTarget.contains(event.relatedTarget)) {
        event.currentTarget.classList.remove(this.dropZoneClass);
      }
    }

    // ========================================================================
    // PRIVATE - PLACEHOLDER MANAGEMENT
    // ========================================================================

    /**
     * Create visual placeholder
     *
     * Clones the source row to create a visual indicator of where
     * the dragged item will be inserted.
     *
     * @param {HTMLElement} sourceRow - Row being dragged
     * @private
     */
    createPlaceholder(sourceRow) {
      this.placeholder = sourceRow.cloneNode(true);
      this.placeholder.classList.add("drag-placeholder");
      this.placeholder.style.opacity = "0.3";
      this.placeholder.style.backgroundColor = "#e3f2fd";
      this.placeholder.style.border = "2px dashed #1976d2";

      // Insert placeholder after source row initially
      sourceRow.parentNode.insertBefore(
        this.placeholder,
        sourceRow.nextSibling
      );
    }

    /**
     * Update placeholder position during drag
     *
     * Repositions the placeholder above or below the target row
     * based on mouse Y position.
     *
     * @param {HTMLElement} targetRow - Row being hovered over
     * @param {number} mouseY - Current mouse Y coordinate
     * @private
     */
    updatePlaceholderPosition(targetRow, mouseY) {
      if (!this.placeholder) return;

      const rect = targetRow.getBoundingClientRect();
      const dropAbove = mouseY < rect.top + rect.height / 2;

      if (dropAbove) {
        targetRow.parentNode.insertBefore(this.placeholder, targetRow);
      } else {
        targetRow.parentNode.insertBefore(
          this.placeholder,
          targetRow.nextSibling
        );
      }
    }

    /**
     * Remove placeholder from DOM
     *
     * Cleans up the visual placeholder element when drag ends.
     *
     * @private
     */
    removePlaceholder() {
      if (this.placeholder) {
        this.placeholder.remove();
        this.placeholder = null;
      }
    }

    // ========================================================================
    // PRIVATE - DATA MANAGEMENT
    // ========================================================================

    /**
     * Get size data for the current tab type
     *
     * Retrieves the data object associated with a size ID from
     * the appropriate data array based on current tab.
     *
     * @param {number} sizeId - Unique identifier for the size
     * @returns {Object|null} Size data object or null if not found
     * @private
     */
    getSizeData(sizeId) {
      let dataArray;
      if (this.currentTabType === "class") {
        dataArray = window.fluispfoAjax.data.classSizes;
      } else if (this.currentTabType === "vars") {
        dataArray = window.fluispfoAjax.data.variableSizes;
      } else if (this.currentTabType === "utils") {
        dataArray = window.fluispfoAjax.data.utilitySizes;
      }

      return dataArray ? dataArray.find((item) => item.id === sizeId) : null;
    }

    /**
     * Reorder data arrays based on drag & drop
     *
     * Removes item from original position and inserts at new position
     * calculated relative to target row and drop direction.
     *
     * @param {number} draggedId - ID of dragged item
     * @param {number} targetId - ID of drop target item
     * @param {boolean} dropAbove - True if dropping above target
     * @private
     */
    reorderData(draggedId, targetId, dropAbove) {
      let dataArray;
      if (this.currentTabType === "class") {
        dataArray = window.fluispfoAjax.data.classSizes;
      } else if (this.currentTabType === "vars") {
        dataArray = window.fluispfoAjax.data.variableSizes;
      } else if (this.currentTabType === "utils") {
        dataArray = window.fluispfoAjax.data.utilitySizes;
      }

      if (!dataArray) return;

      // Find current array positions
      const draggedIndex = dataArray.findIndex((item) => item.id === draggedId);
      const targetIndex = dataArray.findIndex((item) => item.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      // Remove dragged item from array
      const [draggedItem] = dataArray.splice(draggedIndex, 1);

      // Calculate new insertion position
      let newIndex = targetIndex;
      if (draggedIndex < targetIndex) {
        newIndex--; // Adjust for removed item shifting indices
      }

      if (!dropAbove) {
        newIndex++; // Drop after target
      }

      // Insert at calculated position
      dataArray.splice(newIndex, 0, draggedItem);
    }

    /**
     * Get current data array for active tab
     *
     * Helper method to retrieve the appropriate data array
     * based on currently active tab type.
     *
     * @returns {Array} Data array for current tab
     * @private
     */
    getCurrentDataArray() {
      if (this.currentTabType === "class") {
        return window.fluispfoAjax.data.classSizes;
      } else if (this.currentTabType === "vars") {
        return window.fluispfoAjax.data.variableSizes;
      } else if (this.currentTabType === "utils") {
        return window.fluispfoAjax.data.utilitySizes;
      }
      return [];
    }

    // ========================================================================
    // PRIVATE - UI REGENERATION
    // ========================================================================

    /**
     * Regenerate table after reorder
     *
     * Rebuilds table HTML, reattaches event listeners, reinitializes
     * drag & drop, and updates calculated values and CSS output.
     * Requires global FluidSpaceForge functions to be available.
     *
     * @private
     */
    regenerateTable() {
      const panelContainer = document.getElementById("sizes-table-container");
      if (panelContainer && window.FluidSpaceForge) {
        // Regenerate table HTML
        panelContainer.innerHTML = window.FluidSpaceForge.generatePanelContent(
          this.currentTabType
        );

        // Reattach all event listeners
        if (window.FluidSpaceForge.attachEventListeners) {
          window.FluidSpaceForge.attachEventListeners();
        }

        // Reinitialize drag & drop for new table
        this.initializeTable(this.currentTabType);

        // Update calculated values
        if (window.FluidSpaceForge.updateDataTableValues) {
          window.FluidSpaceForge.updateDataTableValues(
            window.FluidSpaceForge.getSelectedBaseId()
          );
        }

        // Update CSS output
        if (window.FluidSpaceForge.updateCSSOutputs) {
          window.FluidSpaceForge.updateCSSOutputs();
        }
      }
    }

    // ========================================================================
    // PRIVATE - UTILITY METHODS
    // ========================================================================

    /**
     * Find the nearest table row to the given element
     *
     * Traverses up the DOM tree to find the nearest TR element.
     * Handles placeholder rows by finding valid sibling rows.
     *
     * @param {HTMLElement} element - Starting element for search
     * @returns {HTMLElement|null} Nearest valid table row or null
     * @private
     */
    findNearestRow(element) {
      // Traverse up to find TR element
      while (element && element.tagName !== "TR") {
        element = element.parentElement;
      }

      // Validate and handle placeholder rows
      if (element && element.hasAttribute("data-id")) {
        // Skip placeholder and find valid sibling
        if (element.classList.contains("drag-placeholder")) {
          // Try next sibling first
          let sibling = element.nextElementSibling;
          while (
            sibling &&
            (!sibling.hasAttribute("data-id") ||
              sibling.classList.contains("drag-placeholder"))
          ) {
            sibling = sibling.nextElementSibling;
          }

          // Try previous sibling if next not found
          if (!sibling) {
            sibling = element.previousElementSibling;
            while (
              sibling &&
              (!sibling.hasAttribute("data-id") ||
                sibling.classList.contains("drag-placeholder"))
            ) {
              sibling = sibling.previousElementSibling;
            }
          }

          if (sibling && sibling.hasAttribute("data-id")) {
            return sibling;
          }
        } else {
          return element;
        }
      }

      return null;
    }

    /**
     * Get item name for debugging
     *
     * Extracts the display name from a data item based on
     * current tab type for logging purposes.
     *
     * @param {Object} item - Data item object
     * @returns {string} Display name or 'unknown'
     * @private
     */
    getItemName(item) {
      if (this.currentTabType === "class") return item.className;
      if (this.currentTabType === "vars") return item.variableName;
      if (this.currentTabType === "utils") return item.utilityName;
      return "unknown";
    }
  }

  // Export to global namespace
  window.DragDropManager = DragDropManager;
})(window);
