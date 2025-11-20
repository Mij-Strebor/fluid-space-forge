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
    <button class="fcc-info-toggle <?php echo $settings['howToUseExpanded'] ? 'expanded' : ''; ?>" data-toggle-target="info-content">
        <span style="color: #FAF9F6 !important;">How to Use Fluid Space Forge</span>
        <span class="fcc-toggle-icon" style="color: #FAF9F6 !important;">▼</span>
    </button>
    <div class="fcc-info-content <?php echo $settings['howToUseExpanded'] ? 'expanded' : ''; ?>" id="info-content">
        <div style="color: var(--clr-txt); font-size: 16px; line-height: 1.6; padding-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px;">
                <div>
                    <h2 style="color: var(--clr-secondary); font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">1. Configure Settings</h2>
                    <p style="margin: 0; font-size: 16px; line-height: 1.5;">Set your space units, viewport range, and scaling ratios. Choose a base value that represents your base space size.</p>
                </div>
                <div>
                    <h2 style="color: var(--clr-secondary); font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">2. Manage Space Sizes</h2>
                    <p style="margin: 0; font-size: 16px; line-height: 1.5;">Use the enhanced table to add, edit, delete, or reorder your space sizes. Drag rows to reorder them in the table.</p>
                </div>
                <div>
                    <h2 style="color: var(--clr-secondary); font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">3. Preview Results</h2>
                    <p style="margin: 0; font-size: 16px; line-height: 1.5;">Use the enhanced preview with controls to see how your space will look at different screen sizes. The displays show scaled results at your Min Width and Max Width.</p>
                </div>
                <div>
                    <h2 style="color: var(--clr-secondary); font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">4. Copy CSS</h2>
                    <p style="margin: 0; font-size: 16px; line-height: 1.5;">Generate clamp() CSS functions ready to use in your projects. Available as classes, variables, or utility styles with enhanced copy functionality.</p>
                </div>
            </div>

            <div style="background: #e7e3df; padding: 16px 20px; margin: 16px 80px 0 80px; border-radius: 8px; border-left: 4px solid var(--clr-accent); text-align: center;">
                <h3 style="color: #3C2017; font-size: 16px; font-weight: 600; margin: 0 0 6px 0;">💡 Pro Tip</h3>
                    <p style="margin: 0; font-size: 16px; color: var(--clr-txt);">Use consistent space scales to create harmonious layouts that maintain their proportions across all device sizes.</p>
            </div>
            <div style="background: #e7e3df; padding: 16px 20px; border-radius: 8px; border-left: 4px solid var(--clr-accent); margin: 20px 80px 20px 80px;">
                <h3 style="color: var(--clr-primary); font-size: 16px; font-weight: 600; margin: 0 0 12px 0; text-align: center;">✨ Best Practices</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8; color: var(--clr-txt);">
                    <li><strong>Collapse panels for focus:</strong> Hide the About, How to Use, and Preview panels to create a streamlined workspace when you know what you are doing.</li>
                    <li><strong>Start simple:</strong> Begin with 4-5 spacing sizes (xs, sm, md, lg, xl) and add more only if needed for your design system.</li>
                    <li><strong>Test key viewports:</strong> Always check your spacing at mobile (375px), tablet (768px), and desktop (1440px) widths.</li>
                    <li><strong>Use preview panels wisely:</strong> The Space Size Preview shows individual sizes scaling, while Viewport Test Preview lets you compare all sizes at once.</li>
                </ul>
            </div>
        </div>
    </div>
</div>