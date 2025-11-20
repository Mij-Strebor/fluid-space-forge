<?php

/**
 * Fluid Space Forge - Plugin Uninstall Handler
 *
 * Complete data removal script executed when plugin is permanently deleted
 * through WordPress admin interface. Ensures clean uninstallation by removing
 * all plugin-related data, options, and cached content from the database.
 *
 * Security Features:
 * - WordPress uninstall constant validation
 * - Complete data cleanup without orphaned entries
 *
 * Data Removal Operations:
 * - All plugin option entries from wp_options table
 * - Cached transient data and temporary storage
 * - User meta (migration notice dismissal)
 * - WordPress object cache clearing
 *
 * @package    FluidSpaceForge
 * @subpackage Uninstall
 * @author     Jim R (JimRForge)
 * @version    1.2.3
 * @link       https://jimrforge.com
 */

// If uninstall not called from WordPress, then exit
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * Remove Plugin Options from Database
 *
 * Systematically delete all plugin-related options to ensure
 * complete data removal and prevent orphaned database entries.
 *
 * Option Keys (from FluidSpaceForge class constants):
 * - fluispfo_settings: Main settings (viewports, ratios, units, UI state)
 * - fluispfo_class_sizes: Space size data for Classes output format
 * - fluispfo_variable_sizes: Space size data for Variables output format
 * - fluispfo_utility_sizes: Space size data for Utilities output format
 */
delete_option('fluispfo_settings');
delete_option('fluispfo_class_sizes');
delete_option('fluispfo_variable_sizes');
delete_option('fluispfo_utility_sizes');

/**
 * Remove Migration Transients
 *
 * Clean up any transient data related to CSS Snippet migration.
 */
delete_transient('fluispfo_snippet_migrated');

/**
 * Remove User Meta
 *
 * Clean up user meta entries (migration notice dismissal).
 * Direct database query is appropriate here as we're deleting
 * meta from all users during uninstall. Caching is not needed
 * for deletion operations during plugin removal.
 */
global $wpdb;
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query("DELETE FROM {$wpdb->usermeta} WHERE meta_key = 'fluispfo_snippet_notice_dismissed'");

/**
 * Clear WordPress Object Cache
 *
 * Flush the cache to ensure all plugin data is completely removed
 * from memory and any persistent caching layers.
 */
wp_cache_flush();
