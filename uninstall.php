<?php

/**
 * Fluid Font Forge - Plugin Uninstall Handler
 *
 * Complete data removal script executed when plugin is permanently deleted
 * through WordPress admin interface. Ensures clean uninstallation by removing
 * all plugin-related data, options, and cached content from the database.
 *
 * Security Features:
 * - WordPress uninstall constant validation
 * - Proper option key constant loading
 * - Complete data cleanup without orphaned entries
 *
 * Data Removal Operations:
 * - All plugin option entries from wp_options table
 * - Cached transient data and temporary storage
 * - WordPress object cache clearing
 *
 * @package    FluidFontForge
 * @subpackage Uninstall
 * @author     Jim R (JimRWeb)
 * @version    4.1.0
 * @link       https://jimrweb.com
 */

// If uninstall not called from WordPress, then exit
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * Load Plugin Constants
 *
 * Import plugin constants required for proper option key references
 * during uninstall process.
 */
require_once plugin_dir_path(__FILE__) . 'fluid-font-forge.php';

/**
 * Remove Plugin Options from Database
 *
 * Systematically delete all plugin-related options to ensure
 * complete data removal and prevent orphaned database entries.
 */
delete_option(FLUID_FONT_FORGE_OPTION_SETTINGS);
delete_option(FLUID_FONT_FORGE_OPTION_CLASS_SIZES);
delete_option(FLUID_FONT_FORGE_OPTION_VARIABLE_SIZES);
delete_option(FLUID_FONT_FORGE_OPTION_TAG_SIZES);
delete_option(FLUID_FONT_FORGE_OPTION_TAILWIND_SIZES);

// Clear any cached data
wp_cache_flush();

// Clean up any transients (if any were used)
delete_transient('fluid_font_forge_cache');
