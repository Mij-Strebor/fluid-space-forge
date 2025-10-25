<?php

/**
 * Header Section Template
 * 
 * Displays the plugin title and collapsible "About" section with
 * project description and credits.
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

<div class="fcc-header-section">
    <h1 class="text-2xl font-bold mb-4">Fluid Space Forge (<?php echo esc_html(\JimRWeb\FluidSpaceForge\FluidSpaceForge::VERSION); ?>)</h1><br>

    <!-- About Section -->
    <div class="fcc-info-toggle-section">
        <button class="fcc-info-toggle expanded" data-toggle-target="about-content">
            <span style="color: #FAF9F6 !important;">🔍 About Fluid Space Forge</span>
            <span class="fcc-toggle-icon" style="color: #FAF9F6 !important;">▼</span>
        </button>
        <div class="fcc-info-content expanded" id="about-content">
            <div style="color: var(--clr-txt); font-size: 14px; line-height: 1.6;">
                <p style="margin: 0 0 16px 0; color: var(--clr-txt);">
                    Perfect companion to the Font Clamp Calculator! While typography scales smoothly across devices, your space should too. This tool generates responsive margins, padding, and gaps using CSS clamp() functions. Create consistent space systems that adapt beautifully from mobile to desktop.
                </p>
                <div style="background: rgba(60, 32, 23, 0.1); padding: 12px 16px; border-radius: 6px; border-left: 4px solid var(--clr-accent); margin-top: 20px;">
                    <p style="margin: 0; font-size: 13px; opacity: 0.95; line-height: 1.5; color: var(--clr-txt);">
                        Fluid Space Forge by Jim R. (<a href="https://jimrweb.com" target="_blank" style="color: var(--clr-link); text-decoration: underline; font-weight: 600;">JimRWeb</a>), part of the CSS Tools series developed with Claude AI (<a href="https://anthropic.com" target="_blank" style="color: var(--clr-link); text-decoration: underline; font-weight: 600;">Anthropic</a>).
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>