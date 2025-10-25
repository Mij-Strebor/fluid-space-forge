/**
 * Fluid Space Forge - Modal Manager
 *
 * Manages all modal dialogs: edit, confirmation, and alert modals.
 * Follows FFF pattern of dynamic modal creation via JavaScript.
 *
 * @version 1.0
 */

(function (window) {
  "use strict";

  /**
   * Modal Manager Module
   *
   * Creates and manages different modal types dynamically.
   */
  const ModalManager = {
    // ========================================================================
    // STATE PROPERTIES
    // ========================================================================

    currentModal: null,
    confirmCallback: null,
    cancelCallback: null,
    modalStack: [], // Stack of previous modals

    // ========================================================================
    // PUBLIC API - EDIT MODAL
    // ========================================================================

    /**
     * Show edit modal for size entry
     *
     * @param {string} tabType - Tab type: 'class', 'vars', 'utils'
     * @param {number} sizeId - ID of size to edit
     * @param {string} currentValue - Current name/value
     * @param {string} action - 'add' or 'edit'
     * @param {Function} saveCallback - Function to call on save
     */
    showEditModal(tabType, sizeId, currentValue, action, saveCallback) {
      this.removeCurrentModal();

      const config = this._getTabConfig(tabType);
      const title =
        action === "add" ? config.modalAddTitle : config.modalEditTitle;

      const modal = document.createElement("div");
      modal.id = "edit-modal";
      modal.className = "fcc-modal show";
      // Build title with suffix name
      const displayTitle =
        action === "add"
          ? title
          : `${title.replace("Edit", "Edit")} ${currentValue}`;

      modal.innerHTML = `
                <div class="fcc-modal-dialog">
                    <div class="fcc-modal-header">
                        ${displayTitle}
                        <button type="button" class="fcc-modal-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="fcc-modal-content">
                        <div id="modal-error-banner" class="fcc-modal-error" style="display: none;">
                            <span class="error-icon">⚠</span>
                            <span id="modal-error-text"></span>
                        </div>
                        <div class="fcc-form-group">
                            <label class="fcc-label" for="edit-suffix">Suffix</label>
                            <input type="text" id="edit-suffix" class="fcc-input" 
                                   value="${currentValue}" 
                                   placeholder="e.g., lg" required>
                        </div>
                        <div class="fcc-btn-group">
                            <button type="button" class="fcc-btn fcc-btn-ghost" id="modal-cancel">Cancel</button>
                            <button type="button" class="fcc-btn" id="modal-save">Save</button>
                        </div>
                    </div>
                </div>
            `;
      document.body.appendChild(modal);
      this.currentModal = modal;

      // Bind events
      modal
        .querySelector(".fcc-modal-close")
        .addEventListener("click", () => this.closeCurrentModal());
      modal
        .querySelector("#modal-cancel")
        .addEventListener("click", () => this.closeCurrentModal());
      modal.querySelector("#modal-save").addEventListener("click", () => {
        const value = document.getElementById("edit-suffix").value.trim();
        const result = saveCallback(value);

        if (result === true) {
          // Success - close modal
          this.closeCurrentModal();
        } else if (typeof result === "string") {
          // Error message - show inline banner
          this.showInlineError(result);
        }
      });
      // Focus and select input
      setTimeout(() => {
        const input = document.getElementById("edit-suffix");
        input.focus();
        input.select();

        // Enter key saves
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            modal.querySelector("#modal-save").click();
          }
        });
      }, 100);

      // ESC key closes
      this._bindEscapeKey();
    },

    /**
     * Show inline error in current modal
     *
     * @param {string} errorMessage - Error message to display
     */
    showInlineError(errorMessage) {
      const banner = document.getElementById("modal-error-banner");
      const text = document.getElementById("modal-error-text");

      if (banner && text) {
        text.textContent = errorMessage;
        banner.style.display = "flex";

        // Auto-hide after 5 seconds
        setTimeout(() => {
          banner.style.display = "none";
        }, 5000);
      }
    },

    // ========================================================================
    // PUBLIC API - CONFIRMATION MODAL
    // ========================================================================

    /**
     * Show confirmation modal
     *
     * @param {string} title - Modal title
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback if user confirms
     * @param {Function} onCancel - Optional callback if user cancels
     * @param {Object} options - Optional config: { confirmText, cancelText, isDangerous }
     */
    showConfirmModal(title, message, onConfirm, onCancel = null, options = {}) {
      this.removeCurrentModal();

      const confirmText = options.confirmText || "Confirm";
      const cancelText = options.cancelText || "Cancel";
      const isDangerous = options.isDangerous || false;

      const modal = document.createElement("div");
      modal.id = "confirm-modal";
      modal.className = "fcc-modal show";
      modal.innerHTML = `
                <div class="fcc-modal-dialog">
                    <div class="fcc-modal-header">
                        ${title}
                        <button type="button" class="fcc-modal-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="fcc-modal-content">
                        <p style="margin: 0 0 20px 0; line-height: 1.6; white-space: pre-line;">${message}</p>
                        <div class="fcc-btn-group">
                            <button type="button" class="fcc-btn fcc-btn-ghost" id="modal-cancel">${cancelText}</button>
                            <button type="button" class="fcc-btn ${
                              isDangerous ? "fcc-btn-danger" : ""
                            }" id="modal-confirm">${confirmText}</button>
                        </div>
                    </div>
                </div>
            `;

      document.body.appendChild(modal);
      this.currentModal = modal;
      this.confirmCallback = onConfirm;
      this.cancelCallback = onCancel;

      // Bind events
      modal
        .querySelector(".fcc-modal-close")
        .addEventListener("click", () => this._handleCancel());
      modal
        .querySelector("#modal-cancel")
        .addEventListener("click", () => this._handleCancel());
      modal
        .querySelector("#modal-confirm")
        .addEventListener("click", () => this._handleConfirm());

      // ESC key cancels
      this._bindEscapeKey();

      // Focus confirm button
      setTimeout(() => {
        modal.querySelector("#modal-confirm").focus();
      }, 100);
    },

    // ========================================================================
    // PUBLIC API - ALERT MODAL
    // ========================================================================

    /**
     * Show alert modal
     *
     * @param {string} title - Modal title
     * @param {string} message - Alert message
     * @param {Function} onClose - Optional callback when closed
     * @param {Object} options - Optional config: { type: 'error'|'warning'|'info'|'success' }
     */
    showAlertModal(title, message, onClose = null, options = {}) {
      this.removeCurrentModal(true); // Push current modal to stack;

      const type = options.type || "info";
      const icons = {
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
        success: "✅",
      };
      const icon = icons[type] || icons.info;

      const modal = document.createElement("div");
      modal.id = "alert-modal";
      modal.className = "fcc-modal show";
      modal.innerHTML = `
                <div class="fcc-modal-dialog">
                    <div class="fcc-modal-header">
                        <span>${icon} ${title}</span>
                        <button type="button" class="fcc-modal-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="fcc-modal-content">
                        <p style="margin: 0 0 20px 0; line-height: 1.6; white-space: pre-line;">${message}</p>
                        <div class="fcc-btn-group">
                            <button type="button" class="fcc-btn" id="modal-ok">OK</button>
                        </div>
                    </div>
                </div>
            `;

      document.body.appendChild(modal);
      this.currentModal = modal;

      // Bind events
      const closeHandler = () => {
        this.closeCurrentModal();
        // Restore previous modal from stack if exists
        if (this.modalStack.length > 0) {
          this.currentModal = this.modalStack.pop();
          this.currentModal.style.display = "flex";
        }
        if (onClose) onClose();
      };

      modal
        .querySelector(".fcc-modal-close")
        .addEventListener("click", closeHandler);
      modal.querySelector("#modal-ok").addEventListener("click", closeHandler);

      // ESC and Enter close
      this._bindEscapeKey();
      const enterHandler = (e) => {
        if (e.key === "Enter") {
          closeHandler();
          document.removeEventListener("keydown", enterHandler);
        }
      };
      document.addEventListener("keydown", enterHandler);

      // Focus OK button
      setTimeout(() => {
        modal.querySelector("#modal-ok").focus();
      }, 100);
    },

    // ========================================================================
    // PUBLIC API - MODAL MANAGEMENT
    // ========================================================================

    /**
     * Close and remove current modal
     */
    closeCurrentModal() {
      if (this.currentModal) {
        this.currentModal.classList.remove("show");
        setTimeout(() => {
          if (this.currentModal && this.currentModal.parentNode) {
            this.currentModal.parentNode.removeChild(this.currentModal);
          }
          this.currentModal = null;
          this.confirmCallback = null;
          this.cancelCallback = null;
        }, 200);
      }
    },

    /**
     * Remove current modal immediately (for replacing)
     */
    /**
     * Remove current modal immediately (for replacing)
     * @param {boolean} pushToStack - If true, save current modal to stack instead of destroying
     */
    removeCurrentModal(pushToStack = false) {
      if (this.currentModal && this.currentModal.parentNode) {
        if (pushToStack) {
          // Hide but don't destroy - save to stack
          this.currentModal.style.display = "none";
          this.modalStack.push(this.currentModal);
        } else {
          // Destroy completely
          this.currentModal.parentNode.removeChild(this.currentModal);
        }
        this.currentModal = null;
        this.confirmCallback = null;
        this.cancelCallback = null;
      }
    },

    // ========================================================================
    // PRIVATE - EVENT HANDLERS
    // ========================================================================

    /**
     * Handle confirmation
     * @private
     */
    _handleConfirm() {
      const callback = this.confirmCallback;
      this.closeCurrentModal();
      // Execute callback after modal starts closing
      if (callback) {
        setTimeout(() => callback(), 100);
      }
    },

    /**
     * Handle cancellation
     * @private
     */
    _handleCancel() {
      if (this.cancelCallback) {
        this.cancelCallback();
      }
      this.closeCurrentModal();
    },

    /**
     * Bind ESC key to close modal
     * @private
     */
    _bindEscapeKey() {
      const escHandler = (e) => {
        if (e.key === "Escape") {
          this.closeCurrentModal();
          document.removeEventListener("keydown", escHandler);
        }
      };
      document.addEventListener("keydown", escHandler);
    },

    // ========================================================================
    // PRIVATE - UTILITIES
    // ========================================================================

    /**
     * Get tab configuration
     * @private
     */
    _getTabConfig(tabType) {
      const TAB_CONFIG = {
        class: {
          modalAddTitle: "Add Class Size",
          modalEditTitle: "Edit Class Size",
        },
        vars: {
          modalAddTitle: "Add Variable Size",
          modalEditTitle: "Edit Variable Size",
        },
        utils: {
          modalAddTitle: "Add Utility Size",
          modalEditTitle: "Edit Utility Size",
        },
      };
      return TAB_CONFIG[tabType] || TAB_CONFIG.class;
    },
  };

  // ========================================================================
  // MODULE EXPORT
  // ========================================================================

  window.FluidSpaceForge = window.FluidSpaceForge || {};
  window.FluidSpaceForge.ModalManager = ModalManager;
})(window);
