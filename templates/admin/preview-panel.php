<?php

/**
 * Preview Panel Template
 * 
 * Displays the collapsible full-width preview section showing space sizes
 * at minimum and maximum viewport widths side-by-side.
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

<!-- Collapsible Preview Section -->
<div class="fcc-info-toggle-section" style="clear: both; margin: 20px 0;">
    <button class="fcc-info-toggle <?php echo $settings['spaceSizeExpanded'] ? 'expanded' : ''; ?>" data-toggle-target="preview-content">
        <span style="color: #FAF9F6 !important;">👁️ Space Size Preview</span>
        <span class="fcc-toggle-icon" style="color: #FAF9F6 !important;">▼</span>
    </button>

    <div class="fcc-info-content <?php echo $settings['spaceSizeExpanded'] ? 'expanded' : ''; ?>" id="preview-content">
        <div class="fcc-preview-enhanced">
            <div class="fcc-preview-grid">
                <div class="fcc-preview-column">
                    <div class="fcc-preview-column-header">
                        <h3>Min Size (Small Screens)</h3>
                        <div class="fcc-scale-indicator" id="min-viewport-display"><?php echo esc_html($settings['minViewport']); ?>px</div>
                    </div>
                    <div id="preview-min-container" style="background: white; border-radius: 8px; padding: 20px; border: 2px solid var(--clr-secondary); min-height: 320px; box-shadow: inset 0 2px 4px var(--clr-shadow);">
                        <div style="text-align: center; color: var(--clr-txt); font-style: italic; padding: 60px 20px;">
                            <div class="fcc-loading-spinner" style="width: 25px; height: 25px; margin: 0 auto 10px;"></div>
                            <div>Generating space previews...</div>
                        </div>
                    </div>
                </div>

                <div class="fcc-preview-column">
                    <div class="fcc-preview-column-header">
                        <h3>Max Size (Large Screens)</h3>
                        <div class="fcc-scale-indicator" id="max-viewport-display"><?php echo esc_html($settings['maxViewport']); ?>px</div>
                    </div>
                    <div id="preview-max-container" style="background: white; border-radius: 8px; padding: 20px; border: 2px solid var(--clr-secondary); min-height: 320px; box-shadow: inset 0 2px 4px var(--clr-shadow);">
                        <div style="text-align: center; color: var(--clr-txt); font-style: italic; padding: 60px 20px;">
                            <div class="fcc-loading-spinner" style="width: 25px; height: 25px; margin: 0 auto 10px;"></div>
                            <div>Generating space previews...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>