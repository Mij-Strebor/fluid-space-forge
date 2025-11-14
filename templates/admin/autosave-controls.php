<?php

/**
 * Autosave Controls Template
 * 
 * Displays the autosave toggle, manual save button, and status indicator.
 * 
 * @package FluidSpaceForge
 * @subpackage Templates/Admin
 * @since 1.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<!-- Enhanced Header Section -->
<div style="margin-bottom: 16px;">
    <!-- Top Row: Autosave Status -->
    <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 20px;">
            <div class="fcc-autosave-flex">
                <label>
                    <input type="checkbox" id="autosave-toggle" <?php echo $settings['autosaveEnabled'] ? 'checked' : ''; ?>>
                    <span>Autosave</span>
                </label>
                <button id="save-btn" class="fcc-btn" data-tooltip="Save all current settings and sizes to database">
                    save
                </button>
                <div id="autosave-status" class="autosave-status idle">
                    <span id="autosave-icon">💾</span>
                    <span id="autosave-text">Ready</span>
                </div>
            </div>
        </div>
    </div>
</div>