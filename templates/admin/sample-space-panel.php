<?php

/**
 * Sample Space Preview Panel
 * 
 * Interactive preview showing how selected spacing scales
 * across viewport widths with real-time interpolation.
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

<!-- Sample Space Preview Section -->
<div class="fcc-info-toggle-section" style="margin-top: 20px;">
    <button class="fcc-info-toggle <?php echo $settings['viewportTestExpanded'] ? 'expanded' : ''; ?>" data-toggle-target="sample-space-content">
        <span style="color: #FAF9F6 !important;">🎯 Viewport Test Preview</span>
        <span class="fcc-toggle-icon" style="color: #FAF9F6 !important;">▼</span>
    </button>

    <div class="fcc-info-content <?php echo $settings['viewportTestExpanded'] ? 'expanded' : ''; ?>" id="sample-space-content">
        <div class="fcc-sample-space-container">

            <!-- Sample Displays -->
            <div class="fcc-sample-displays">

                <!-- Margin Sample -->
                <div class="fcc-sample-group">
                    <div class="fcc-sample-label">Margin Preview</div>
                    <div class="fcc-sample-box-wrapper">
                        <!-- Invisible container, pink margin area moves, blue content stays fixed -->
                        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                            <div id="margin-sample" class="fcc-margin-sample">
                                <div class="fcc-sample-inner">Content</div>
                            </div>
                        </div>
                        <div class="fcc-sample-value" id="margin-value">12px</div>
                    </div>
                </div>

                <!-- Padding Sample -->
                <div class="fcc-sample-group">
                    <div class="fcc-sample-label">Padding Preview</div>
                    <div class="fcc-sample-box-wrapper">
                        <!-- Fixed container, padding grows inward, content shrinks -->
                        <div id="padding-sample" class="fcc-padding-sample">
                            <div class="fcc-sample-inner">Content</div>
                        </div>
                        <div class="fcc-sample-value" id="padding-value">12px</div>
                    </div>
                </div>

                <!-- Gap Sample -->
                <div class="fcc-sample-group">
                    <div class="fcc-sample-label">Gap Preview</div>
                    <div class="fcc-sample-box-wrapper">
                        <div id="gap-sample" class="fcc-gap-sample">
                            <div class="fcc-sample-item">Content</div>
                            <div class="fcc-sample-item">Content</div>
                            <div class="fcc-sample-item">Content</div>
                            <div class="fcc-sample-item">Content</div>
                        </div>
                        <div class="fcc-sample-value" id="gap-value">12px</div>
                    </div>
                </div>
            </div>

            <!-- Controls Row -->
            <div class="fcc-sample-controls">
                <div class="fcc-sample-selector">
                    <label class="component-label" for="sample-space-size">Space Size:</label>
                    <select id="sample-space-size" class="component-select" style="width: 150px;">
                        <option value="3" selected>md</option>
                    </select>
                </div>
            </div>

            <!-- Viewport Slider -->
            <div class="fcc-viewport-slider-section">
                <div class="fcc-viewport-info">
                    <label for="sample-viewport-slider" style="font-size: 14px; color: var(--clr-txt); font-weight: 500;">Viewport Size:</label>
                    <span id="sample-viewport-display" style="font-size: 14px; color: var(--clr-primary); font-weight: 600;">
                        768px • Tablet (portrait)
                    </span>
                </div>
                <div class="fcc-viewport-slider-container">
                    <input type="range"
                        id="sample-viewport-slider"
                        min="375"
                        max="1620"
                        value="768"
                        step="1"
                        aria-label="Viewport width slider">
                    <div class="fcc-slider-labels">
                        <span>375px</span>
                        <span>1620px</span>
                    </div>
                </div>
            </div>

            <!-- Info Box -->
            <div style="background: rgba(255, 215, 0, 0.15); padding: 12px 16px; border-radius: 6px; border-left: 4px solid var(--clr-accent); margin-top: 20px;">
                <p style="margin: 0; font-size: 13px; color: var(--clr-txt); line-height: 1.5;">
                    <strong>Interactive Preview:</strong> The <strong>Space Size</strong> dropdown lets you select which size from your data table controls the preview.
                    The viewport slider shows real-time interpolation between your minimum and maximum settings as you drag across different screen sizes.
                </p>
            </div>
        </div>
    </div>
</div>