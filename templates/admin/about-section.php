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
    <h1>Fluid Space Forge</h1>
</div>

<!-- Version Info (positioned between header and About) -->
<div class="fsf-version-info" style="position: relative; z-index: 2; font-size: 14px; color: rgba(109, 76, 47, 0.7); font-style: italic; font-weight: 400; margin: 20px 0 40px 0; text-align: left;">
    Version <?php echo esc_html(\JimRForge\FluidSpaceForge\FluidSpaceForge::VERSION); ?>
</div>

<!-- About Section -->
<div class="fcc-info-toggle-section">
    <button class="fcc-info-toggle <?php echo $settings['aboutExpanded'] ? 'expanded' : ''; ?>" data-toggle-target="about-content">
        <span style="color: #FAF9F6 !important;">About Fluid Space Forge</span>
        <span class="fcc-toggle-icon" style="color: #FAF9F6 !important;">▼</span>
    </button>
    <div class="fcc-info-content <?php echo $settings['aboutExpanded'] ? 'expanded' : ''; ?>" id="about-content">
        <div style="color: var(--clr-txt); font-size: 16px; line-height: 1.6;">
            <p style="margin: 0 0 16px 0; color: var(--clr-txt); font-size: 16px;">
                Perfect companion to the Font Clamp Calculator! While typography scales smoothly across devices, your space should too. This tool generates responsive margins, padding, and gaps using CSS clamp() functions. Create consistent space systems that adapt beautifully from mobile to desktop.
            </p>
            <div style="background: #e7e3df; padding: 16px 20px; border-radius: 6px; border-left: 4px solid var(--clr-accent); margin: 20px 80px 0 80px;">
                <p style="margin: 0; text-align: center; font-size: 16px; opacity: 0.95; line-height: 1.5; color: var(--clr-txt);">
                    Fluid Space Forge by Jim R. (<a href="https://jimrforge.com" target="_blank" style="color: #ce6565; text-decoration: underline; font-weight: 600;">JimRForge</a>), part of the CSS Tools series developed with Claude AI (<a href="https://anthropic.com" target="_blank" style="color: #ce6565; text-decoration: underline; font-weight: 600;">Anthropic</a>).
                </p>
            </div>
        </div>
    </div>
</div>
