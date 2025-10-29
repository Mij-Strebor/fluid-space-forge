<?php

/**
 * Jim R Forge Community Panel Template
 *
 * Displays community links, related plugins, and support options.
 *
 * @package FluidSpaceForge
 * @since 1.1.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="fcc-panel" style="margin-top: 40px;">
    <div class="fcc-css-header">
        <h2 style="flex-grow: 1;">Jim R Forge Community & Tools</h2>
    </div>
    <div style="padding: 20px; background: var(--clr-light); border-radius: 0 0 6px 6px;">
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: var(--clr-txt);">
            Fluid Space Forge is part of the Jim R Forge ecosystem - a growing collection of professional WordPress tools for designers and developers.
        </p>

        <h3 style="color: var(--clr-primary); font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">Related Tools & Plugins</h3>
        <ul style="margin: 0 0 20px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: var(--clr-txt);">
            <li>
                <strong><a href="https://wordpress.org/plugins/fluid-font-forge/" target="_blank" style="color: var(--clr-link); text-decoration: underline;">Fluid Font Forge</a></strong> - Responsive typography with CSS clamp() functions (Available on WordPress.org)
            </li>
            <li>
                <strong><a href="https://github.com/Mij-Strebor/media-inventory-forge" target="_blank" style="color: var(--clr-link); text-decoration: underline;">Media Inventory Forge</a></strong> - Comprehensive media file management and organization (Coming to WordPress.org)
            </li>
            <li>
                <strong>Fluid Button Forge</strong> - Advanced button customization with fluid sizing (In Development)
            </li>
            <li>
                <strong>Elementor Color Inventory</strong> - Color palette management for Elementor (In Development)
            </li>
        </ul>

        <h3 style="color: var(--clr-primary); font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">Project Hub</h3>
        <p style="margin: 0 0 16px 0 0 20px; padding-left: 20px; font-size: 16px; line-height: 1.6; color: var(--clr-txt);">
            Visit the <a href="https://github.com/Mij-Strebor/jim-r-forge" target="_blank" style="color: var(--clr-link); text-decoration: underline; font-weight: 600;">Jim R Forge GitHub</a> for documentation, updates, and the complete plugin ecosystem.
        </p>

        <h3 style="color: var(--clr-primary); font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">Support Development</h3>
        <p style="margin: 0 0 16px 0; padding-left: 20px; font-size: 16px; line-height: 1.6; color: var(--clr-txt);">
            All Jim R Forge tools are free and open source. If you find them useful, please consider supporting development:
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; padding-left: 20px;">
            <a href="https://www.buymeacoffee.com/jimrweb" target="_blank" class="button button-secondary">
                ☕ Buy Me a Coffee
            </a>
            <a href="https://github.com/Mij-Strebor/jim-r-forge" target="_blank" class="button button-secondary">
                ⭐ Star on GitHub
            </a>
            <a href="https://wordpress.org/support/plugin/fluid-space-forge/" target="_blank" class="button button-secondary">
                💬 Suggestions & Feedback
            </a>
        </div>
    </div>
</div>
