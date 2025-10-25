<?php

/**
 * Plugin Name: Fluid Space Forge
 * Plugin URI: https://github.com/Mij-Strebor/fluid-space-forge
 * Description: Generate responsive spacing using CSS clamp() functions. Perfect companion to Font Clamp Calculator for creating fluid design systems.
 * Version: 1.0.4
 * Author: Jim R.
 * Author URI: https://jimrweb.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: fluid-space-forge
 * Requires at least: 5.0
 * Tested up to: 6.8
 * Requires PHP: 7.4
 * 
 */

namespace JimRWeb\FluidSpaceForge;

use Exception;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Fluid Space Forge - Complete Unified Class
 */
class FluidSpaceForge
{
    // ========================================================================
    // CORE CONSTANTS SYSTEM
    // ========================================================================

    // Configuration Constants
    const VERSION = '1.0.3';
    const PLUGIN_SLUG = 'fluid-space-forge';
    const NONCE_ACTION = 'fluid-space_nonce';

    // Validation Ranges
    // Why 1-16px: Prevents unusably small (<1px) or absurdly large (>16px) min base space
    const MIN_BASE_SPACE_RANGE = [1, 16];
    // Why 1-80px: Prevents unusably small (<1px) or absurdly large (>80) max base space
    const MAX_BASE_SPACE_RANGE = [1, 80];
    // Why 200-5000px: Covers feature phones to ultra-wide displays safely
    const VIEWPORT_RANGE = [200, 5000];
    // Why 1.0-3.0: Below 1.0 shrinks space, above 3.0 creates extreme jumps
    const SCALE_RANGE = [1.0, 3.0];

    // Default Values - PRIMARY CONSTANTS
    // Why 8px: Common design system base unit - divisible by 2, 4, 8
    const DEFAULT_MIN_BASE_space = 8;
    // Why 12px: 50% larger than default - provides good scaling contrast
    const DEFAULT_MAX_BASE_space = 12;
    // Why 375px: iPhone SE width - covers smallest modern mobile devices
    const DEFAULT_MIN_VIEWPORT = 375;
    // Why 1620px: Laptop/desktop sweet spot - before ultra-wide displays
    const DEFAULT_MAX_VIEWPORT = 1620;
    // Why 1.125: Major Second ratio - subtle but noticeable space differences
    const DEFAULT_MIN_SCALE = 1.125;
    // Why 1.25: Major Third ratio - creates clear space hierarchy
    const DEFAULT_MAX_SCALE = 1.25;

    // Browser and system constants
    // Why 16px: Universal browser default - foundation for rem calculations
    const BROWSER_DEFAULT_FONT_SIZE = 16;
    // Why 16px base: 1rem = 16px by default - critical for rem/px conversions
    const CSS_UNIT_CONVERSION_BASE = 16;

    // Valid Options
    const VALID_UNITS = ['px', 'rem'];
    const VALID_TABS = ['class', 'vars', 'utils'];

    // Default Size Suffixes - SINGLE SOURCE OF TRUTH
    // Users work only with these suffix names in the data tables
    const DEFAULT_SIZE_SUFFIXES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    // Size Type Property Mapping
    // Maps each tab type to its data structure field name
    const SIZE_TYPE_PROPERTY_NAMES = [
        'class' => 'className',
        'vars' => 'variableName',
        'utils' => 'utilityName'
    ];

    // WordPress Options Keys
    const OPTION_SETTINGS = 'space_clamp_settings';
    const OPTION_CLASS_SIZES = 'space_clamp_class_sizes';
    const OPTION_VARIABLE_SIZES = 'space_clamp_variable_sizes';
    const OPTION_UTILITY_SIZES = 'space_clamp_utility_sizes';

    // ========================================================================
    // CLASS PROPERTIES
    // ========================================================================

    private $default_settings;
    private $default_class_sizes;
    private $default_variable_sizes;
    private $default_utility_sizes;
    private $assets_loaded = false;

    // ========================================================================
    // CORE INITIALIZATION
    // ========================================================================

    /**
     * Constructor - Initialize the complete system
     */
    public function __construct()
    {
        $this->init_defaults();
        $this->init_hooks();
    }

    /**
     * Initialize default values using factory methods
     */
    private function init_defaults()
    {
        $this->default_settings = $this->create_default_settings();
        $this->default_class_sizes = $this->create_default_sizes('class');
        $this->default_variable_sizes = $this->create_default_sizes('vars');
        $this->default_utility_sizes = $this->create_default_sizes('utils');
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks()
    {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('wp_ajax_save_space_clamp_settings', [$this, 'save_settings']);
    }

    // ========================================================================
    // DATA MANAGEMENT METHODS
    // ========================================================================

    /**
     * Create default settings array using constants
     */
    private function create_default_settings()
    {
        return [
            'minBasespace' => self::DEFAULT_MIN_BASE_space,
            'maxBasespace' => self::DEFAULT_MAX_BASE_space,
            'minViewport' => self::DEFAULT_MIN_VIEWPORT,
            'maxViewport' => self::DEFAULT_MAX_VIEWPORT,
            'unitType' => 'px',
            'selectedClassSizeId' => 3,
            'selectedVariableSizeId' => 3,
            'selectedUtilitySizeId' => 3,
            'activeTab' => 'class',
            'minScale' => self::DEFAULT_MIN_SCALE,
            'maxScale' => self::DEFAULT_MAX_SCALE,
            'autosaveEnabled' => true,
            'viewportTestExpanded' => true,
            'spaceSizeExpanded' => true
        ];
    }

    /**
     * Create default sizes array for specified type using constants
     * 
     * @param string $type Size type: 'class', 'vars', or 'utils'
     * @return array Array of default size entries
     * @since 1.0
     */
    private function create_default_sizes($type)
    {
        if (!isset(self::SIZE_TYPE_PROPERTY_NAMES[$type])) {
            return [];
        }

        $property_name = self::SIZE_TYPE_PROPERTY_NAMES[$type];
        $sizes = [];

        foreach (self::DEFAULT_SIZE_SUFFIXES as $index => $suffix) {
            $sizes[] = [
                'id' => $index + 1,
                $property_name => $suffix
            ];
        }

        return $sizes;
    }

    /**
     * Get the property name for a size type
     */
    private function get_size_property_name($type)
    {
        $property_map = [
            'class' => 'className',
            'vars' => 'variableName',
            'utils' => 'utilityName'
        ];

        return $property_map[$type] ?? 'className';
    }

    // ========================================================================
    // ADMIN INTERFACE
    // ========================================================================

    /**
     * Add admin menu page
     */
    public function add_admin_menu()
    {
        // Add to WordPress Tools menu
        add_management_page(
            'Fluid Space Forge',              // Page title
            'Fluid Space Forge',              // Menu title
            'manage_options',                 // Capability
            self::PLUGIN_SLUG,                // Menu slug
            [$this, 'render_admin_page']      // Callback
        );
    }

    /**
     * Unified asset enqueuing
     */
    public function enqueue_assets()
    {
        $screen = get_current_screen();

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
        if (!$screen || $page !== self::PLUGIN_SLUG) {
            return;
        }

        wp_enqueue_style(
            'space-clamp-admin-styles',
            plugins_url('assets/css/admin-styles.css', __FILE__),
            [],
            self::VERSION
        );

        // Enqueue drag-drop controller
        wp_enqueue_script(
            'space-clamp-drag-drop',
            plugins_url('assets/js/drag-drop-controller.js', __FILE__),
            ['wp-util'],
            self::VERSION,
            true
        );

        // Enqueue calculations module
        wp_enqueue_script(
            'space-clamp-calculations',
            plugins_url('assets/js/calculations.js', __FILE__),
            ['wp-util'],
            self::VERSION,
            true
        );

        // Enqueue autosave manager
        wp_enqueue_script(
            'space-clamp-autosave',
            plugins_url('assets/js/autosave-manager.js', __FILE__),
            ['wp-util'],
            self::VERSION,
            true
        );

        // Enqueue sample space controller        
        wp_enqueue_script(
            'space-clamp-sample-space',
            plugins_url('assets/js/sample-space-controller.js', __FILE__),
            ['wp-util', 'space-clamp-calculations'],
            self::VERSION,
            true
        );

        // Enqueue modal manager
        wp_enqueue_script(
            'space-clamp-modal',
            plugins_url('assets/js/modal-manager.js', __FILE__),
            ['wp-util'],
            self::VERSION,
            true
        );

        // Enqueue main admin script
        wp_enqueue_script(
            'space-clamp-admin-script',
            plugins_url('assets/js/admin-script.js', __FILE__),
            ['wp-util', 'space-clamp-calculations', 'space-clamp-autosave', 'space-clamp-drag-drop', 'space-clamp-sample-space'],
            self::VERSION,
            true
        );

        wp_enqueue_script('wp-util');

        $localized_data = [
            'nonce' => wp_create_nonce(self::NONCE_ACTION),
            'ajaxurl' => admin_url('admin-ajax.php'),
            'defaults' => [
                'minBasespace' => self::DEFAULT_MIN_BASE_space,
                'maxBasespace' => self::DEFAULT_MAX_BASE_space,
                'minViewport' => self::DEFAULT_MIN_VIEWPORT,
                'maxViewport' => self::DEFAULT_MAX_VIEWPORT,
            ],
            'data' => [
                'settings' => $this->get_space_clamp_settings(),
                'classSizes' => $this->get_space_clamp_class_sizes(),
                'variableSizes' => $this->get_space_clamp_variable_sizes(),
                'utilitySizes' => $this->get_space_clamp_utility_sizes()
            ],
            'templates' => [
                'genericPanel' => $this->load_panel_template('generic-panel.php')
            ],
            'panelConfig' => [
                'class' => [
                    'title' => 'Space Size Classes',
                    'description' => 'Generates: <code>.space-{m|p|g}-{suffix}</code><br>(e.g., <code>.space-m-lg</code>, <code>.space-p-md</code>, <code>.space-g-sm</code>)',
                    'nameProperty' => 'className',
                    'emptyIcon' => '🔭',
                    'emptyTitle' => 'No Space Classes',
                    'emptyText' => 'Get started by adding your first space class or reset to defaults.',
                    'emptyButtonText' => 'add first class',
                    'emptyOptionText' => 'No classes'
                ],
                'vars' => [
                    'title' => 'CSS Custom Properties',
                    'description' => 'Generates: <code>--sp-{suffix}</code><br>(e.g., <code>--sp-lg</code>, <code>--sp-md</code>, <code>--sp-sm</code>)',
                    'nameProperty' => 'variableName',
                    'emptyIcon' => '📦',
                    'emptyTitle' => 'No CSS Variables',
                    'emptyText' => 'Get started by adding your first variable or reset to defaults.',
                    'emptyButtonText' => 'add first variable',
                    'emptyOptionText' => 'No variables'
                ],
                'utils' => [
                    'title' => 'Utility Classes (Tailwind)',
                    'description' => 'Generates: <code>.{type}{side}-{suffix}</code><br>(e.g., <code>.mt-lg</code>, <code>.pb-md</code>, <code>.gap-sm</code>)',
                    'nameProperty' => 'utilityName',
                    'emptyIcon' => '🛠️',
                    'emptyTitle' => 'No Utility Classes',
                    'emptyText' => 'Get started by adding your first utility or reset to defaults.',
                    'emptyButtonText' => 'add first utility',
                    'emptyOptionText' => 'No utilities'
                ]
            ],
            'constants' => $this->get_all_constants(),
            'version' => self::VERSION,
            'debug' => defined('WP_DEBUG') && WP_DEBUG
        ];

        wp_localize_script('wp-util', 'spaceClampAjax', $localized_data);
    }

    /**
     * Get all constants for JavaScript access
     */
    public function get_all_constants()
    {
        return [
            'DEFAULT_MIN_BASE_space' => self::DEFAULT_MIN_BASE_space,
            'DEFAULT_MAX_BASE_space' => self::DEFAULT_MAX_BASE_space,
            'DEFAULT_MIN_VIEWPORT' => self::DEFAULT_MIN_VIEWPORT,
            'DEFAULT_MAX_VIEWPORT' => self::DEFAULT_MAX_VIEWPORT,
            'DEFAULT_MIN_SCALE' => self::DEFAULT_MIN_SCALE,
            'DEFAULT_MAX_SCALE' => self::DEFAULT_MAX_SCALE,
            'BROWSER_DEFAULT_FONT_SIZE' => self::BROWSER_DEFAULT_FONT_SIZE,
            'CSS_UNIT_CONVERSION_BASE' => self::CSS_UNIT_CONVERSION_BASE,
            'MIN_BASE_SPACE_RANGE' => self::MIN_BASE_SPACE_RANGE,
            'VIEWPORT_RANGE' => self::VIEWPORT_RANGE,
            'SCALE_RANGE' => self::SCALE_RANGE,
            'VALID_UNITS' => self::VALID_UNITS,
            'VALID_TABS' => self::VALID_TABS,
            'DEFAULT_SIZE_SUFFIXES' => self::DEFAULT_SIZE_SUFFIXES,
            'SIZE_TYPE_PROPERTY_NAMES' => self::SIZE_TYPE_PROPERTY_NAMES
        ];
    }

    /**
     * Load panel template file
     * 
     * @param string $template_name Template filename
     * @return string Template HTML content
     * @throws Exception If template file not found
     * @since 1.0
     */
    private function load_panel_template($template_name)
    {
        // All tabs now use the generic panel
        $template_path = plugin_dir_path(__FILE__) . 'templates/admin/generic-panel.php';

        if (!file_exists($template_path)) {
            return "<!-- Template not found: {$template_name} -->";
        }

        ob_start();
        include $template_path;
        return ob_get_clean();
    }

    // ========================================================================
    // DATA GETTERS
    // ========================================================================

    public function get_space_clamp_settings()
    {
        static $cached_settings = null;

        if ($cached_settings === null) {
            $settings = wp_parse_args(
                get_option(self::OPTION_SETTINGS, []),
                $this->default_settings
            );
            if (!in_array($settings['activeTab'], self::VALID_TABS)) {
                $settings['activeTab'] = 'class';
                update_option(self::OPTION_SETTINGS, $settings);
            }

            $cached_settings = $settings;
        }

        return $cached_settings;
    }

    public function get_space_clamp_class_sizes()
    {
        static $cached_sizes = null;
        if ($cached_sizes === null) {
            $cached_sizes = get_option(self::OPTION_CLASS_SIZES, $this->default_class_sizes);
        }
        return $cached_sizes;
    }

    public function get_space_clamp_variable_sizes()
    {
        static $cached_sizes = null;
        if ($cached_sizes === null) {
            $cached_sizes = get_option(self::OPTION_VARIABLE_SIZES, $this->default_variable_sizes);
        }
        return $cached_sizes;
    }

    public function get_space_clamp_utility_sizes()
    {
        static $cached_sizes = null;
        if ($cached_sizes === null) {
            $cached_sizes = get_option(self::OPTION_UTILITY_SIZES, $this->default_utility_sizes);
        }
        return $cached_sizes;
    }

    // ========================================================================
    // MAIN ADMIN PAGE RENDERER
    // ========================================================================

    /**
     * Main Admin Page Renderer - Complete Interface
     */
    public function render_admin_page()
    {

        $data = [
            'settings' => $this->get_space_clamp_settings(),
            'class_sizes' => $this->get_space_clamp_class_sizes(),
            'variable_sizes' => $this->get_space_clamp_variable_sizes(),
            'utility_sizes' => $this->get_space_clamp_utility_sizes()
        ];

        // Hide admin bar on this page for cleaner interface
        add_filter('show_admin_bar', '__return_false');

        // SAFETY: get_complete_interface() returns pre-escaped HTML from template files
        // All template files use esc_html(), esc_attr(), etc. for proper escaping
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $this->get_complete_interface($data);
    }

    /**
     * Complete interface HTML
     */
    private function get_complete_interface($data)
    {
        $settings = $data['settings'];

        ob_start();
?>
        <div class="wrap" style="background: var(--clr-page-bg); padding: 20px; min-height: 100vh;">

            <!-- About Section -->
            <div class="all-container">
                <?php include plugin_dir_path(__FILE__) . 'templates/admin/about-section.php'; ?>

                <!-- Main Section -->
                <div class="space-clamp-container" id="scc-main-container">
                    <div style="padding: 20px;">
                        <!-- How to Use Panel -->
                        <?php include plugin_dir_path(__FILE__) . 'templates/admin/how-to-use-panel.php'; ?>

                        <!-- Autosave Controls -->
                        <?php include  plugin_dir_path(__FILE__) . 'templates/admin/autosave-controls.php'; ?>

                        <!-- Tab Navigation -->
                        <?php include  plugin_dir_path(__FILE__) . 'templates/admin/tab-navigation.php'; ?>
                    </div>

                    <!-- Settings and Data Table - Side by Side -->
                    <div class="fcc-main-grid" style="margin: 20px;">
                        <!-- Column 1: Settings Panel -->
                        <div>
                            <?php include plugin_dir_path(__FILE__) . 'templates/admin/settings-panel.php'; ?>
                        </div>

                        <!-- Column 2: Space Size Classes (Data Table Panel) -->
                        <div>
                            <?php include plugin_dir_path(__FILE__) . 'templates/admin/sizes-table-container.php'; ?>
                        </div>
                    </div>
                </div>
                <!-- Sample Space Preview Panel -->
                <div class="all-container">
                    <?php include plugin_dir_path(__FILE__) . 'templates/admin/sample-space-panel.php'; ?>
                </div>

                <!-- Live Preview Panel -->
                <div class="all-container">
                    <?php include plugin_dir_path(__FILE__) . 'templates/admin/preview-panel.php'; ?>
                </div>

                <!-- Enhanced CSS Output Containers -->
                <div class="all-container">
                    <?php include plugin_dir_path(__FILE__) . 'templates/admin/css-output-panels.php'; ?>
                </div>
            </div>
    <?php
        return ob_get_clean();
    }

    /**
     * Check if we're on the plugin page
     */
    private function is_space_clamp_page()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
        return $page === self::PLUGIN_SLUG;
    }

    // ========================================================================
    // AJAX HANDLERS
    // ========================================================================

    public function save_settings()
    {
        // Verify nonce for security
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        if (!wp_verify_nonce($nonce, self::NONCE_ACTION)) {
            wp_send_json_error(['message' => 'Security check failed']);
            return;
        }

        // Verify user permissions
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
            return;
        }

        try {
            // Decode and validate settings data
            // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            $settings_json = isset($_POST['settings']) ? wp_unslash($_POST['settings']) : '';
            // phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            $settings = json_decode($settings_json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                wp_send_json_error(['message' => 'Invalid settings data']);
                return;
            }

            // Decode and validate sizes data
            // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            $sizes_json = isset($_POST['sizes']) ? wp_unslash($_POST['sizes']) : '';
            // phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized   
            $sizes = json_decode($sizes_json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                wp_send_json_error(['message' => 'Invalid sizes data']);
                return;
            }

            // Save settings
            $result1 = update_option(self::OPTION_SETTINGS, $settings);
            $result2 = update_option(self::OPTION_CLASS_SIZES, $sizes['classSizes'] ?? []);
            $result3 = update_option(self::OPTION_VARIABLE_SIZES, $sizes['variableSizes'] ?? []);
            $result4 = update_option(self::OPTION_UTILITY_SIZES, $sizes['utilitySizes'] ?? []);

            // Clear cached data
            wp_cache_delete(self::OPTION_SETTINGS, 'options');
            wp_cache_delete(self::OPTION_CLASS_SIZES, 'options');
            wp_cache_delete(self::OPTION_VARIABLE_SIZES, 'options');
            wp_cache_delete(self::OPTION_UTILITY_SIZES, 'options');

            wp_send_json_success([
                'message' => 'All space data saved to database successfully',
                'saved_settings' => $result1,
                'saved_sizes' => $result2 && $result3 && $result4
            ]);
        } catch (Exception $e) {
            wp_send_json_error(['message' => 'Save failed: ' . $e->getMessage()]);
        }
    }
}

// ========================================================================
// INITIALIZATION
// ========================================================================

// Initialize the Fluid Space Forge
if (is_admin()) {
    global $fluidSpaceForge;
    $fluidSpaceForge = new FluidSpaceForge();
}
