<?php

/**
 * How to Use Panel Template
 * 
 * Displays collapsible instructions panel with 4-step guide
 * and pro tip for using the plugin.
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

<!-- How to Use Panel -->
<div class="fcc-info-toggle-section">
    <button class="fcc-info-toggle expanded" data-toggle-target="info-content">
        <span style="color: #FAF9F6 !important;">ℹ️ How to Use Fluid Space Forge</span>
        <span class="fcc-toggle-icon" style="color: #FAF9F6 !important;">▼</span>
    </button>
    <div class="fcc-info-content expanded" id="info-content">
        <div style="color: var(--clr-txt); font-size: 14px; line-height: 1.6;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px;">
                <div>
                    <h2 style="color: var(--clr-secondary); font-size: 15px; font-weight: 600; margin: 0 0 8px 0;">1. Configure Settings</h2>
                    <p style="margin: 0; font-size: 13px; line-height: 1.5;">Set your space units, viewport range, and scaling ratios. Choose a base value that represents your base space size.</p>
                </div>
                <div>
                    <h2 style="color: var(--clr-secondary); font-size: 15px; font-weight: 600; margin: 0 0 8px 0;">2. Manage Space Sizes</h2>
                    <p style="margin: 0; font-size: 13px; line-height: 1.5;">Use the enhanced table to add, edit, delete, or reorder your space sizes. Drag rows to reorder them in the table.</p>
                </div>
                <div>
                    <h2 style="color: var(--clr-secondary); font-size: 15px; font-weight: 600; margin: 0 0 8px 0;">3. Preview Results</h2>
                    <p style="margin: 0; font-size: 13px; line-height: 1.5;">Use the enhanced preview with controls to see how your space will look at different screen sizes. The displays show scaled results at your Min Width and Max Width.</p>
                </div>
                <div>
                    <h2 style="color: var(--clr-secondary); font-size: 15px; font-weight: 600; margin: 0 0 8px 0;">4. Copy CSS</h2>
                    <p style="margin: 0; font-size: 13px; line-height: 1.5;">Generate clamp() CSS functions ready to use in your projects. Available as classes, variables, or utility styles with enhanced copy functionality.</p>
                </div>
            </div>

            <div style="background: #F0E6DA; padding: 12px 16px; border-radius: 8px; border: 1px solid #5C3324; margin: 16px 0 0 0; text-align: center;">
                <h3 style="color: #3C2017; font-size: 14px; font-weight: 600; margin: 0 0 6px 0;">💡 Pro Tip</h2>
                    <p style="margin: 0; font-size: 13px; color: var(--clr-txt);">Use consistent space scales to create harmonious layouts that maintain their proportions across all device sizes.</p>
            </div>
        </div>
    </div>
</div>