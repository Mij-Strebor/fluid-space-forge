<?php

/**
 * Tab Navigation Template
 * 
 * Displays the three main tabs for Classes, Variables, and Utilities.
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

<!-- Bottom Row: Large Tabs (FFF standard sizing: 64px height) -->
<div style="display: flex; justify-content: center;">
    <div class="fcc-tabs" style="width: 100%; max-width: 600px;">
        <button id="class-tab" class="tab-button <?php echo $settings['activeTab'] === 'class' ? 'active' : ''; ?>" style="flex: 1; height: 64px; border-radius: 6px; font-size: 16px; font-weight: 600;" data-tab="class" data-tooltip="Generate space classes like .space-lg, .space-md for use in HTML">Classes</button>
        <button id="vars-tab" class="tab-button <?php echo $settings['activeTab'] === 'vars' ? 'active' : ''; ?>" style="flex: 1; height: 64px; border-radius: 6px; font-size: 16px; font-weight: 600;" data-tab="vars" data-tooltip="Generate CSS custom properties like --sp-lg for use with var() in CSS">Variables</button>
        <button id="utils-tab" class="tab-button <?php echo $settings['activeTab'] === 'utils' ? 'active' : ''; ?>" style="flex: 1; height: 64px; border-radius: 6px; font-size: 16px; font-weight: 600;" data-tab="utils" data-tooltip="Generate Tailwind-style utility classes like .mt-lg, .gap-x-md for margins, padding, and gaps">Utilities (Tailwind)</button>
    </div>
</div>