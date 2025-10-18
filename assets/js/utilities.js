/**
 * Fluid Font Forge - Utilities Module
 *
 * @file utilities.js
 * @package FluidFontForge
 * @version 4.0.3
 * @since 1.0.0
 *
 * Self-contained utility classes and objects with no external dependencies.
 * Provides tab data management, tooltips, and admin notices.
 *
 * Architecture Overview:
 * 1. Configuration Constants (TabDataMap)
 * 2. Data Access Utilities (TabDataUtils)
 * 3. UI Components (SimpleTooltips)
 * 4. Admin Notifications (WordPressAdminNotices)
 * 5. Module Exports & Global Assignments
 *
 * Dependencies: NONE - This module must remain dependency-free
 * Dependents: admin-script.js, unified-size-access.js
 *
 * Design Principle: Zero external dependencies to serve as foundation layer
 * for other modules without creating circular dependency issues.
 */

/* ==========================================================================
   CONFIGURATION CONSTANTS
   ========================================================================== */

/**
 * Tab Data Configuration Map
 *
 * Defines tab-specific properties and display settings for each output type.
 * Each tab (class, vars, tag, tailwind) has configuration for data keys,
 * property names, display titles, and default values.
 *
 * @type {Object.<string, Object>}
 * @property {Object} class - CSS class configuration
 * @property {string} class.dataKey - Data array key in main data object
 * @property {string} class.nameProperty - Property name for size identification
 * @property {string} class.displayName - Human-readable tab name
 * @property {string} class.tableTitle - Title for sizes table
 * @property {string} class.selectedCSSTitle - Title for selected CSS panel
 * @property {string} class.generatedCSSTitle - Title for generated CSS panel
 * @property {string} class.addButtonText - Text for add button
 * @property {string} class.baseDefaultValue - Default base value
 * @property {number} class.baseDefaultId - Default base ID
 *
 * @example
 * // Access class configuration
 * const classConfig = TabDataMap.class;
 * console.log(classConfig.tableTitle); // "Font Size Classes"
 */
const TabDataMap = {
  class: {
    dataKey: "classSizes",
    nameProperty: "className",
    displayName: "Classes",
    tableTitle: "Font Size Classes",
    selectedCSSTitle: "Selected Class CSS",
    generatedCSSTitle: "Generated CSS (All Classes)",
    addButtonText: "add first class",
    baseDefaultValue: "medium",
    baseDefaultId: 5,
  },
  vars: {
    dataKey: "variableSizes",
    nameProperty: "variableName",
    displayName: "Variables",
    tableTitle: "CSS Variables",
    selectedCSSTitle: "Selected Variable CSS",
    generatedCSSTitle: "Generated CSS (All Variables)",
    addButtonText: "add first variable",
    baseDefaultValue: "--fs-md",
    baseDefaultId: 5,
  },
  tailwind: {
    dataKey: "tailwindSizes",
    nameProperty: "tailwindName",
    displayName: "Tailwind Sizes",
    tableTitle: "Tailwind Font Sizes",
    selectedCSSTitle: "Selected Size Config",
    generatedCSSTitle: "Tailwind Config (fontSize Object)",
    addButtonText: "add first size",
    baseDefaultValue: "base",
    baseDefaultId: 5,
  },
  tag: {
    dataKey: "tagSizes",
    nameProperty: "tagName",
    displayName: "Tags",
    tableTitle: "HTML Tag Styles",
    selectedCSSTitle: "Selected Tag CSS",
    generatedCSSTitle: "Generated CSS (All Tags)",
    addButtonText: "add first tag",
    baseDefaultValue: "p",
    baseDefaultId: 7,
  },
};

/* ==========================================================================
   DATA ACCESS UTILITIES
   ========================================================================== */

/**
 * Tab Data Utilities
 *
 * Provides methods for accessing tab-specific data and properties.
 * Centralizes logic for retrieving configuration and formatting data
 * based on the active tab context.
 *
 * @namespace TabDataUtils
 *
 * @example
 * // Get data for active tab
 * const sizes = TabDataUtils.getDataForTab('class', dataObject);
 *
 * @example
 * // Get display name for a size
 * const displayName = TabDataUtils.getSizeDisplayName(sizeObject, 'vars');
 */
const TabDataUtils = {
  /**
   * Get data array for specified tab
   *
   * @param {string} activeTab - Current active tab identifier ('class', 'vars', 'tag', 'tailwind')
   * @param {Object} data - Data object containing all tab data arrays
   * @returns {Array} Array of size objects for the specified tab, empty array if tab invalid
   *
   * @example
   * const data = { classSizes: [...], variableSizes: [...] };
   * const classSizes = TabDataUtils.getDataForTab('class', data);
   */
  getDataForTab(activeTab, data) {
    const config = TabDataMap[activeTab];
    return config && data ? data[config.dataKey] || [] : [];
  },

  /**
   * Get property name used for size identification
   *
   * @param {string} activeTab - Current active tab identifier
   * @returns {string} Property name (e.g., "className", "variableName", "tagName", "tailwindName")
   *
   * @example
   * const propName = TabDataUtils.getPropertyName('vars');
   * console.log(propName); // "variableName"
   */
  getPropertyName(activeTab) {
    return TabDataMap[activeTab]?.nameProperty || "className";
  },

  /**
   * Get display name for a size object
   *
   * @param {Object} size - Size object containing name property
   * @param {string} activeTab - Current active tab identifier
   * @returns {string} Display name for the size, empty string if not found
   *
   * @example
   * const size = { className: 'large', lineHeight: 1.4 };
   * const name = TabDataUtils.getSizeDisplayName(size, 'class');
   * console.log(name); // "large"
   */
  getSizeDisplayName(size, activeTab) {
    const propertyName = this.getPropertyName(activeTab);
    return size[propertyName] || "";
  },

  /**
   * Get table title for active tab
   *
   * @param {string} activeTab - Current active tab identifier
   * @returns {string} Title text for the sizes table
   *
   * @example
   * const title = TabDataUtils.getTableTitle('vars');
   * console.log(title); // "CSS Variables"
   */
  getTableTitle(activeTab) {
    return TabDataMap[activeTab]?.tableTitle || "Font Sizes";
  },

  /**
   * Get selected CSS panel title
   *
   * @param {string} activeTab - Current active tab identifier
   * @returns {string} Title for selected CSS display panel
   *
   * @example
   * const title = TabDataUtils.getSelectedCSSTitle('class');
   * console.log(title); // "Selected Class CSS"
   */
  getSelectedCSSTitle(activeTab) {
    return TabDataMap[activeTab]?.selectedCSSTitle || "Selected CSS";
  },

  /**
   * Get generated CSS panel title
   *
   * @param {string} activeTab - Current active tab identifier
   * @returns {string} Title for generated CSS display panel
   *
   * @example
   * const title = TabDataUtils.getGeneratedCSSTitle('tailwind');
   * console.log(title); // "Tailwind Config (fontSize Object)"
   */
  getGeneratedCSSTitle(activeTab) {
    return TabDataMap[activeTab]?.generatedCSSTitle || "Generated CSS";
  },

  /**
   * Get default base value for tab
   *
   * @param {string} activeTab - Current active tab identifier
   * @returns {string} Default base value identifier
   *
   * @example
   * const defaultBase = TabDataUtils.getBaseDefaultValue('tag');
   * console.log(defaultBase); // "p"
   */
  getBaseDefaultValue(activeTab) {
    return TabDataMap[activeTab]?.baseDefaultValue || "medium";
  },
};

/* ==========================================================================
   UI COMPONENTS
   ========================================================================== */

/**
 * Simple JavaScript Tooltips
 *
 * Lightweight tooltip system for elements with data-tooltip attribute.
 * Automatically positions tooltips and handles viewport boundary detection.
 * Uses event delegation for performance with dynamically added elements.
 *
 * @class SimpleTooltips
 *
 * @example
 * // Initialize tooltip system (auto-initializes on instantiation)
 * const tooltips = new SimpleTooltips();
 *
 * @example
 * // Add tooltip to HTML element
 * <button data-tooltip="Click to save">Save</button>
 */
class SimpleTooltips {
  /**
   * Create tooltip system
   *
   * Initializes tooltip element reference and binds document-level events.
   * Auto-initializes on instantiation - no manual init() call needed.
   */
  constructor() {
    this.tooltip = null;
    this.init();
  }

  /**
   * Initialize tooltip event listeners
   *
   * Uses event delegation on document for performance.
   * Listens for mouseover/mouseout on elements with data-tooltip attribute.
   *
   * @private
   */
  init() {
    document.addEventListener("mouseover", (e) => {
      if (e.target.dataset.tooltip) {
        this.showTooltip(e.target, e.target.dataset.tooltip);
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.dataset.tooltip) {
        this.hideTooltip();
      }
    });
  }

  /**
   * Display tooltip near element
   *
   * Positions tooltip above element by default, adjusts for viewport boundaries.
   * Automatically handles positioning logic to keep tooltip visible.
   *
   * @param {HTMLElement} element - Element to attach tooltip to
   * @param {string} text - Tooltip text content
   *
   * @example
   * const button = document.querySelector('#save-btn');
   * tooltips.showTooltip(button, 'Save your changes');
   */
  showTooltip(element, text) {
    this.hideTooltip();

    this.tooltip = document.createElement("div");
    this.tooltip.style.cssText = `
      position: absolute;
      background: #8B4513;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 99999;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 1px solid #654321;
    `;
    this.tooltip.textContent = text;
    document.body.appendChild(this.tooltip);

    const rect = element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();

    let left =
      rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top + window.scrollY - tooltipRect.height - 8;

    // Adjust for viewport boundaries
    if (left < 5) left = 5;
    if (left + tooltipRect.width > window.innerWidth - 5) {
      left = window.innerWidth - tooltipRect.width - 5;
    }
    if (top < window.scrollY + 5) {
      top = rect.bottom + window.scrollY + 8;
    }

    this.tooltip.style.left = left + "px";
    this.tooltip.style.top = top + "px";
  }

  /**
   * Hide and remove tooltip
   *
   * Removes tooltip element from DOM if it exists.
   * Safe to call multiple times - checks for existence before removal.
   */
  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }
}

/* ==========================================================================
   ADMIN NOTIFICATIONS
   ========================================================================== */

/**
 * WordPress Admin Notice System
 *
 * Manages display of administrative notifications within WordPress admin area.
 * Provides methods for success, error, warning, and info messages with
 * automatic dismissal and modal confirmation dialogs.
 *
 * Requires WordPress admin context to function properly.
 *
 * @class WordPressAdminNotices
 *
 * @example
 * // Initialize notice system
 * const notices = new WordPressAdminNotices();
 *
 * @example
 * // Show success message
 * notices.success('Settings saved successfully!');
 *
 * @example
 * // Show confirmation dialog (modal/blocking)
 * notices.confirm(
 *   'Delete this item?',
 *   () => { console.log('Confirmed'); },
 *   () => { console.log('Cancelled'); }
 * );
 */
class WordPressAdminNotices {
  /**
   * Create notice system
   *
   * Initializes notice container and empty notices array.
   * Creates container at top of WordPress admin wrap area.
   */
  constructor() {
    this.notices = [];
    this.container = null;
    this.init();
  }

  /**
   * Initialize notice container
   *
   * Creates container element at top of WordPress admin wrap area.
   *
   * @private
   */
  init() {
    this.createContainer();
  }

  /**
   * Create or recreate notices container
   *
   * Ensures container exists and is properly positioned at top of admin area.
   * Removes any existing container first to prevent duplicates.
   *
   * @private
   */
  createContainer() {
    const wrap = document.querySelector(".wrap");
    if (wrap) {
      const existing = document.getElementById("fcc-admin-notices");
      if (existing) {
        existing.remove();
      }

      this.container = document.createElement("div");
      this.container.id = "fcc-admin-notices";
      this.container.style.cssText =
        "margin: 0 0 20px 0; position: relative; z-index: 1000;";

      const firstChild = wrap.querySelector("h1") || wrap.firstChild;
      if (firstChild && firstChild.parentNode === wrap) {
        wrap.insertBefore(this.container, firstChild);
      } else {
        wrap.appendChild(this.container);
      }
    }
  }

  /**
   * Display admin notice
   *
   * Creates and displays a WordPress-style admin notice with optional
   * auto-dismiss and manual dismiss button.
   *
   * @param {string} message - HTML message content to display
   * @param {string} [type='info'] - Notice type: 'success', 'error', 'warning', 'info'
   * @param {boolean} [dismissible=true] - Whether notice can be manually dismissed
   * @param {boolean} [autoHide=true] - Whether notice auto-dismisses after delay
   * @returns {string} Notice ID for programmatic dismissal
   *
   * @example
   * // Show success notice that auto-dismisses
   * const id = notices.show('Saved!', 'success', true, true);
   *
   * @example
   * // Show persistent error notice
   * notices.show('Error occurred', 'error', true, false);
   */
  show(message, type = "info", dismissible = true, autoHide = true) {
    if (!this.container) {
      console.error("Admin notices container not available");
      return;
    }

    const notice = document.createElement("div");
    const noticeId =
      "notice-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    notice.id = noticeId;

    let classes = ["notice"];
    switch (type) {
      case "success":
        classes.push("notice-success");
        break;
      case "error":
        classes.push("notice-error");
        break;
      case "warning":
        classes.push("notice-warning");
        break;
      default:
        classes.push("notice-info");
        break;
    }

    if (dismissible) classes.push("is-dismissible");
    notice.className = classes.join(" ");

    notice.innerHTML = `
      <p style="margin: 0.5em 0;">${message}</p>
      ${
        dismissible
          ? '<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>'
          : ""
      }
    `;

    this.container.appendChild(notice);

    if (dismissible) {
      const dismissBtn = notice.querySelector(".notice-dismiss");
      if (dismissBtn) {
        dismissBtn.addEventListener("click", () => {
          this.dismiss(noticeId);
        });
      }
    }

    if (autoHide && type !== "error") {
      setTimeout(
        () => {
          this.dismiss(noticeId);
        },
        type === "success" ? 4000 : 6000
      );
    }

    notice.scrollIntoView({ behavior: "smooth", block: "nearest" });

    return noticeId;
  }

  /**
   * Dismiss notice by ID
   *
   * Animates notice removal with fade out and slide effect.
   *
   * @param {string} noticeId - Notice identifier to dismiss
   *
   * @example
   * const id = notices.show('Message', 'info');
   * // Later...
   * notices.dismiss(id);
   */
  dismiss(noticeId) {
    const notice = document.getElementById(noticeId);
    if (notice) {
      notice.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      notice.style.opacity = "0";
      notice.style.transform = "translateX(-10px)";

      setTimeout(() => {
        if (notice.parentNode) {
          notice.parentNode.removeChild(notice);
        }
      }, 300);
    }
  }

  /**
   * Show success notice
   *
   * @param {string} message - Success message
   * @param {boolean} [dismissible=true] - Whether dismissible
   * @returns {string} Notice ID
   *
   * @example
   * notices.success('Data saved successfully!');
   */
  success(message, dismissible = true) {
    return this.show(message, "success", dismissible);
  }

  /**
   * Show error notice
   *
   * Error notices do not auto-hide by default to ensure user sees critical messages.
   *
   * @param {string} message - Error message
   * @param {boolean} [dismissible=true] - Whether dismissible
   * @returns {string} Notice ID
   *
   * @example
   * notices.error('Failed to save data. Please try again.');
   */
  error(message, dismissible = true) {
    return this.show(message, "error", dismissible, false);
  }

  /**
   * Show warning notice
   *
   * @param {string} message - Warning message
   * @param {boolean} [dismissible=true] - Whether dismissible
   * @returns {string} Notice ID
   *
   * @example
   * notices.warning('This action cannot be undone.');
   */
  warning(message, dismissible = true) {
    return this.show(message, "warning", dismissible);
  }

  /**
   * Show info notice
   *
   * @param {string} message - Info message
   * @param {boolean} [dismissible=true] - Whether dismissible
   * @returns {string} Notice ID
   *
   * @example
   * notices.info('New features are available.');
   */
  info(message, dismissible = true) {
    return this.show(message, "info", dismissible);
  }

  /**
   * Show confirmation dialog
   *
   * Displays modal confirmation dialog with confirm/cancel buttons.
   * Blocks user interaction until choice is made - this is a modal/blocking operation.
   *
   * @param {string} message - Confirmation message (HTML allowed)
   * @param {Function} onConfirm - Callback function when user confirms
   * @param {Function|null} [onCancel=null] - Callback function when user cancels
   *
   * @example
   * notices.confirm(
   *   'Are you sure you want to delete this?',
   *   () => { deleteItem(); },
   *   () => { console.log('Cancelled'); }
   * );
   */
  confirm(message, onConfirm, onCancel = null) {
    const existing = document.getElementById("confirm-dialog-modal");
    if (existing) existing.remove();

    const confirmModal = document.createElement("div");
    confirmModal.id = "confirm-dialog-modal";
    confirmModal.className = "fcc-modal";
    confirmModal.innerHTML = `
      <div class="fcc-modal-dialog" style="max-width: 500px;">
        <div class="fcc-modal-header" style="background: var(--clr-secondary); color: var(--clr-txt-light);">
          <span>Confirm Action</span>
        </div>
        <div class="fcc-modal-content">
          <p style="margin: 0 0 20px 0; line-height: 1.5; color: var(--clr-txt);">${message}</p>
          <div class="fcc-btn-group">
            <button type="button" class="fcc-btn fcc-btn-ghost" id="confirm-cancel">Cancel</button>
            <button type="button" class="fcc-btn" id="confirm-ok">Confirm</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(confirmModal);

    setTimeout(() => {
      confirmModal.classList.add("show");
    }, 10);

    const cancelBtn = confirmModal.querySelector("#confirm-cancel");
    const confirmBtn = confirmModal.querySelector("#confirm-ok");

    const cleanup = () => {
      document.body.removeChild(confirmModal);
    };

    cancelBtn.addEventListener("click", () => {
      cleanup();
      if (onCancel) onCancel();
    });

    confirmBtn.addEventListener("click", () => {
      cleanup();
      if (onConfirm) onConfirm();
    });

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        cleanup();
        if (onCancel) onCancel();
        document.removeEventListener("keydown", handleKeydown);
      }
    };
    document.addEventListener("keydown", handleKeydown);

    setTimeout(() => confirmBtn.focus(), 100);
  }
}

/* ==========================================================================
   MODULE EXPORTS & GLOBAL ASSIGNMENTS
   ========================================================================== */

/**
 * CommonJS Module Export
 *
 * Export for CommonJS environments (Node.js testing, build tools).
 * This check exists for future compatibility and testing environments,
 * not for runtime browser execution.
 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TabDataMap,
    TabDataUtils,
    SimpleTooltips,
    WordPressAdminNotices,
  };
}

/**
 * Global Window Assignments
 *
 * Expose utilities globally for WordPress environment compatibility.
 * WordPress admin doesn't use module systems, so global assignment
 * is necessary for cross-file access.
 */
window.TabDataMap = TabDataMap;
window.TabDataUtils = TabDataUtils;
window.SimpleTooltips = SimpleTooltips;
window.WordPressAdminNotices = WordPressAdminNotices;
