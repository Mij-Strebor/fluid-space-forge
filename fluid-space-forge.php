<?php

/**
 * Plugin Name: Fluid Space Forge
 * Plugin URI: https://github.com/Mij-Strebor/fluid-space-forge
 * Description: Generate responsive spacing using CSS clamp() functions. Perfect companion to Font Clamp Calculator for creating fluid design systems.
 * Version: 1.2.2
 * Author: Jim R.
 * Author URI: https://jimrforge.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: fluid-space-forge
 * Requires at least: 5.0
 * Tested up to: 6.8
 * Requires PHP: 7.4
 * 
 */

namespace JimRForge\FluidSpaceForge;

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
    const VERSION = '1.2.2';
    const PLUGIN_SLUG = 'fluid-space-forge';
    const NONCE_ACTION = 'fluispfo_nonce';

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
    const OPTION_SETTINGS = 'fluispfo_settings';
    const OPTION_CLASS_SIZES = 'fluispfo_class_sizes';
    const OPTION_VARIABLE_SIZES = 'fluispfo_variable_sizes';
    const OPTION_UTILITY_SIZES = 'fluispfo_utility_sizes';

    // Migration Keys
    const MIGRATION_TRANSIENT = 'fluispfo_snippet_migrated';
    const MIGRATION_NOTICE_DISMISSED = 'fluispfo_snippet_notice_dismissed';

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
        add_action('admin_enqueue_scripts', [$this, 'enqueue_notice_scripts']);
        add_action('wp_ajax_save_fluispfo_settings', [$this, 'save_settings']);
        add_action('admin_notices', [$this, 'show_snippet_migration_notice']);
        add_action('wp_ajax_fluispfo_dismiss_snippet_notice', [$this, 'dismiss_snippet_notice']);
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
            'aboutExpanded' => true,
            'howToUseExpanded' => true,
            'viewportTestExpanded' => true,
            'spaceSizeExpanded' => true,
            'classPrefix' => 'space',
            'variablePrefix' => 'sp',
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

        // Enqueue Design System Tokens
        wp_enqueue_style(
            'fluispfo-design-tokens',
            plugins_url('assets/css/design-tokens.css', __FILE__),
            [],
            self::VERSION
        );

        // Enqueue Forge Header
        wp_enqueue_style(
            'fluispfo-forge-header',
            plugins_url('assets/css/forge-header.css', __FILE__),
            ['fluispfo-design-tokens'],
            self::VERSION
        );

        // Enqueue Admin Styles
        wp_enqueue_style(
            'fluispfo-admin-styles',
            plugins_url('assets/css/admin-styles.css', __FILE__),
            ['fluispfo-forge-header'],
            self::VERSION
        );

        // Enqueue drag-drop controller
        wp_enqueue_script(
            'fluispfo-drag-drop',
            plugins_url('assets/js/drag-drop-controller.js', __FILE__),
            ['wp-util'],
            self::VERSION,
            true
        );

        // Enqueue calculations module
        wp_enqueue_script(
            'fluispfo-calculations',
            plugins_url('assets/js/calculations.js', __FILE__),
            ['wp-util'],
            self::VERSION,
            true
        );

        // Enqueue autosave manager
        wp_enqueue_script(
            'fluispfo-autosave',
            plugins_url('assets/js/autosave-manager.js', __FILE__),
            ['wp-util'],
            self::VERSION,
            true
        );

        // Enqueue sample space controller        
        wp_enqueue_script(
            'fluispfo-sample-space',
            plugins_url('assets/js/sample-space-controller.js', __FILE__),
            ['wp-util', 'fluispfo-calculations'],
            self::VERSION,
            true
        );

        // Enqueue modal manager
        wp_enqueue_script(
            'fluispfo-modal',
            plugins_url('assets/js/modal-manager.js', __FILE__),
            ['wp-util'],
            self::VERSION,
            true
        );

        // Enqueue main admin script
        wp_enqueue_script(
            'fluispfo-admin-script',
            plugins_url('assets/js/admin-script.js', __FILE__),
            ['wp-util', 'fluispfo-calculations', 'fluispfo-autosave', 'fluispfo-drag-drop', 'fluispfo-sample-space'],
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
                'settings' => $this->get_fluispfo_settings(),
                'classSizes' => $this->get_fluispfo_class_sizes(),
                'variableSizes' => $this->get_fluispfo_variable_sizes(),
                'utilitySizes' => $this->get_fluispfo_utility_sizes()
            ],
            'templates' => [
                'genericPanel' => $this->load_panel_template('generic-panel.php')
            ],
            'panelConfig' => [
                'class' => [
                    'title' => 'Space Size Classes',
                    'description' => 'Generates: <code>.{prefix}-{suffix}</code> (e.g., <code>.space-md</code>, <code>.space-xxl</code>). Make any change wanted to the base size and prefix used.',
                    'nameProperty' => 'className',
                    'emptyIcon' => '🔭',
                    'emptyTitle' => 'No Space Classes',
                    'emptyText' => 'Get started by adding your first space class or reset to defaults.',
                    'emptyButtonText' => 'add first class',
                    'emptyOptionText' => 'No classes'
                ],
                'vars' => [
                    'title' => 'CSS Custom Properties',
                    'description' => 'Generates: <code>--{prefix}-{suffix}</code> (e.g., <code>--sp-md</code>, <code>--sp-xxl</code>). Make any change wanted to the base size and prefix used.',
                    'nameProperty' => 'variableName',
                    'emptyIcon' => '📦',
                    'emptyTitle' => 'No CSS Variables',
                    'emptyText' => 'Get started by adding your first variable or reset to defaults.',
                    'emptyButtonText' => 'add first variable',
                    'emptyOptionText' => 'No variables'
                ],
                'utils' => [
                    'title' => 'Utility Classes (Tailwind)',
                    'description' => 'Generates: <code>.{type}{side}-{suffix}</code> (e.g., <code>.mt-lg</code>, <code>.pb-md</code>, <code>.gap-sm</code>).',
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

        wp_localize_script('wp-util', 'fluispfoAjax', $localized_data);
    }
    /**
     * Enqueue scripts for migration notice dismiss functionality
     * WordPress.org requires all scripts to be properly enqueued (no inline scripts)
     */
    public function enqueue_notice_scripts()
    {
        // Only enqueue if the notice would be shown
        if (get_user_meta(get_current_user_id(), self::MIGRATION_NOTICE_DISMISSED, true)) {
            return;
        }

        // Check if old snippet functions exist
        $old_snippet_active = function_exists('space_clamp_admin_page') ||
            function_exists('render_space_clamp_page') ||
            function_exists('space_clamp_register_menu');

        if (!$old_snippet_active) {
            return;
        }

        // Enqueue jQuery (dependency)
        wp_enqueue_script('jquery');

        // Create a unique handle for the notice dismiss script
        $handle = 'fluispfo-notice-dismiss';

        // Register an empty script (we'll add inline code to it)
        wp_register_script($handle, false, ['jquery'], self::VERSION, true);
        wp_enqueue_script($handle);

        // Add the inline script using wp_add_inline_script (WordPress 4.5+)
        $inline_script = "
        jQuery(document).ready(function($) {
            $('.fluispfo-snippet-notice').on('click', '.notice-dismiss', function() {
                $.post(ajaxurl, {
                    action: 'fluispfo_dismiss_snippet_notice',
                    nonce: '" . esc_js(wp_create_nonce('fluispfo_dismiss_notice')) . "'
                });
            });
        });
        ";

        wp_add_inline_script($handle, $inline_script);
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
            'MAX_BASE_SPACE_RANGE' => self::MAX_BASE_SPACE_RANGE,
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

    public function get_fluispfo_settings()
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

    public function get_fluispfo_class_sizes()
    {
        static $cached_sizes = null;
        if ($cached_sizes === null) {
            $cached_sizes = get_option(self::OPTION_CLASS_SIZES, $this->default_class_sizes);
            // AUTO-FIX: Add missing IDs if they don't exist
            $cached_sizes = $this->ensure_sizes_have_ids($cached_sizes);
        }
        return $cached_sizes;
    }

    public function get_fluispfo_variable_sizes()
    {
        static $cached_sizes = null;
        if ($cached_sizes === null) {
            $cached_sizes = get_option(self::OPTION_VARIABLE_SIZES, $this->default_variable_sizes);
            // AUTO-FIX: Add missing IDs if they don't exist
            $cached_sizes = $this->ensure_sizes_have_ids($cached_sizes);
        }
        return $cached_sizes;
    }

    public function get_fluispfo_utility_sizes()
    {
        static $cached_sizes = null;
        if ($cached_sizes === null) {
            $cached_sizes = get_option(self::OPTION_UTILITY_SIZES, $this->default_utility_sizes);
            // AUTO-FIX: Add missing IDs if they don't exist
            $cached_sizes = $this->ensure_sizes_have_ids($cached_sizes);
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
            'settings' => $this->get_fluispfo_settings(),
            'class_sizes' => $this->get_fluispfo_class_sizes(),
            'variable_sizes' => $this->get_fluispfo_variable_sizes(),
            'utility_sizes' => $this->get_fluispfo_utility_sizes()
        ];

        // Hide admin bar on this page for cleaner interface
        add_filter('show_admin_bar', '__return_false');

        // Output admin interface HTML
        // Security Note: This outputs static HTML structure with included template files.
        // All dynamic user data within templates is properly escaped using WordPress functions:
        // - esc_attr() for all HTML attribute values (line 45, 57, 72, 83 in settings-panel.php)
        // - esc_html() for text content where applicable
        // - selected() for dropdown options (lines 101-120 in settings-panel.php)
        // - Only controlled strings ('checked', 'active', 'expanded') in conditional outputs
        // The $data array passed contains sanitized database values (see sanitize_settings_array()
        // and sanitize_sizes_array() methods). All output reaching the browser is escaped.
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- HTML structure is static, all dynamic data escaped in templates
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
                </div> <!-- JimRForge Community Panel -->
                <div class="all-container"> <?php include plugin_dir_path(__FILE__) . 'templates/admin/community-panel.php'; ?>
                </div>
            </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Check if we're on the plugin page
     */
    private function fluispfo_is_plugin_page()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
        return $page === self::PLUGIN_SLUG;
    }

    // ========================================================================
    // SANITIZATION HELPERS
    // ========================================================================

    /**
     * Sanitize settings array from JSON input
     *
     * WordPress.org requires proper sanitization of all input data.
     * This method sanitizes each field in the settings array individually.
     *
     * @param array $settings Raw settings array from JSON
     * @return array Sanitized settings array
     */
    private function sanitize_settings_array($settings)
    {
        if (!is_array($settings)) {
            return [];
        }

        $sanitized = [];

        // Sanitize base space values (must be positive integers)
        if (isset($settings['minBasespace'])) {
            $sanitized['minBasespace'] = absint($settings['minBasespace']);
        }
        if (isset($settings['maxBasespace'])) {
            $sanitized['maxBasespace'] = absint($settings['maxBasespace']);
        }

        // Sanitize viewport values (must be positive integers)
        if (isset($settings['minViewport'])) {
            $sanitized['minViewport'] = absint($settings['minViewport']);
        }
        if (isset($settings['maxViewport'])) {
            $sanitized['maxViewport'] = absint($settings['maxViewport']);
        }

        // Sanitize scale values (must be valid floats)
        if (isset($settings['minScale'])) {
            $sanitized['minScale'] = floatval($settings['minScale']);
        }
        if (isset($settings['maxScale'])) {
            $sanitized['maxScale'] = floatval($settings['maxScale']);
        }

        // Sanitize unit type (must be 'px' or 'rem')
        if (isset($settings['unitType'])) {
            $sanitized['unitType'] = in_array($settings['unitType'], ['px', 'rem'], true) ? $settings['unitType'] : 'px';
        }
        // Legacy 'unit' field support
        if (isset($settings['unit'])) {
            $sanitized['unit'] = in_array($settings['unit'], ['px', 'rem'], true) ? $settings['unit'] : 'rem';
        }

        // Sanitize selected size IDs (must be positive integers)
        if (isset($settings['selectedClassSizeId'])) {
            $sanitized['selectedClassSizeId'] = absint($settings['selectedClassSizeId']);
        }
        if (isset($settings['selectedVariableSizeId'])) {
            $sanitized['selectedVariableSizeId'] = absint($settings['selectedVariableSizeId']);
        }
        if (isset($settings['selectedUtilitySizeId'])) {
            $sanitized['selectedUtilitySizeId'] = absint($settings['selectedUtilitySizeId']);
        }

        // Sanitize active tab (must be valid tab name)
        if (isset($settings['activeTab'])) {
            $sanitized['activeTab'] = in_array($settings['activeTab'], self::VALID_TABS, true) ? $settings['activeTab'] : 'class';
        }

        // Sanitize boolean flags
        if (isset($settings['autosaveEnabled'])) {
            $sanitized['autosaveEnabled'] = (bool) $settings['autosaveEnabled'];
        }
        if (isset($settings['aboutExpanded'])) {
            $sanitized['aboutExpanded'] = (bool) $settings['aboutExpanded'];
        }
        if (isset($settings['howToUseExpanded'])) {
            $sanitized['howToUseExpanded'] = (bool) $settings['howToUseExpanded'];
        }
        if (isset($settings['viewportTestExpanded'])) {
            $sanitized['viewportTestExpanded'] = (bool) $settings['viewportTestExpanded'];
        }
        if (isset($settings['spaceSizeExpanded'])) {
            $sanitized['spaceSizeExpanded'] = (bool) $settings['spaceSizeExpanded'];
        }

        // Sanitize baseSize (alphanumeric with hyphens for size names like 'md')
        if (isset($settings['baseSize'])) {
            $sanitized['baseSize'] = sanitize_text_field($settings['baseSize']);
        }

        // Sanitize ratio (must be a valid float) - legacy field
        if (isset($settings['ratio'])) {
            $sanitized['ratio'] = floatval($settings['ratio']);
        }

        // Sanitize prefix values (alphanumeric with hyphens)
        if (isset($settings['classPrefix'])) {
            $sanitized['classPrefix'] = sanitize_text_field($settings['classPrefix']);
        }
        if (isset($settings['variablePrefix'])) {
            $sanitized['variablePrefix'] = sanitize_text_field($settings['variablePrefix']);
        }

        return $sanitized;
    }

    /**
     * Ensure all sizes have IDs (auto-fix for corrupted data)
     *
     * @param array $sizes Sizes array that may be missing IDs
     * @return array Sizes array with IDs guaranteed
     */
    private function ensure_sizes_have_ids($sizes)
    {
        if (!is_array($sizes)) {
            return [];
        }

        $fixed_sizes = [];
        foreach ($sizes as $index => $size) {
            if (!is_array($size)) {
                continue;
            }
            // If ID is missing, add it based on array index
            if (!isset($size['id']) || empty($size['id'])) {
                $size['id'] = $index + 1;
            }
            $fixed_sizes[] = $size;
        }

        return $fixed_sizes;
    }

    /**
     * Sanitize sizes array from JSON input
     *
     * WordPress.org requires proper sanitization of all input data.
     * This method sanitizes each size object in the array.
     *
     * @param array $sizes Raw sizes array from JSON
     * @return array Sanitized sizes array
     */
    private function sanitize_sizes_array($sizes)
    {
        if (!is_array($sizes)) {
            return [];
        }

        $sanitized = [];

        foreach ($sizes as $size) {
            if (!is_array($size)) {
                continue;
            }

            $sanitized_size = [];

            // Sanitize ID (required for calculations)
            if (isset($size['id'])) {
                $sanitized_size['id'] = intval($size['id']);
            }

            // Sanitize name (alphanumeric with hyphens/underscores)
            if (isset($size['name'])) {
                $sanitized_size['name'] = sanitize_text_field($size['name']);
            }

            // Sanitize numeric values
            if (isset($size['min'])) {
                $sanitized_size['min'] = floatval($size['min']);
            }
            if (isset($size['max'])) {
                $sanitized_size['max'] = floatval($size['max']);
            }

            // Sanitize preferred (CSS clamp formula string)
            if (isset($size['preferred'])) {
                $sanitized_size['preferred'] = sanitize_text_field($size['preferred']);
            }

            // Sanitize optional class-specific fields
            if (isset($size['className'])) {
                $sanitized_size['className'] = sanitize_text_field($size['className']);
            }
            if (isset($size['variableName'])) {
                $sanitized_size['variableName'] = sanitize_text_field($size['variableName']);
            }
            if (isset($size['utilityName'])) {
                $sanitized_size['utilityName'] = sanitize_text_field($size['utilityName']);
            }

            $sanitized[] = $sanitized_size;
        }

        return $sanitized;
    }

    // ========================================================================
    // SNIPPET MIGRATION & DETECTION
    // ========================================================================

    /**
     * Show admin notice if old code snippet version is detected
     */
    public function show_snippet_migration_notice()
    {
        // Don't show if user already dismissed it
        if (get_user_meta(get_current_user_id(), self::MIGRATION_NOTICE_DISMISSED, true)) {
            return;
        }

        // Check if old snippet functions exist in global namespace
        // These functions would exist if the old code snippet is active
        $old_snippet_active = function_exists('space_clamp_admin_page') ||
            function_exists('render_space_clamp_page') ||
            function_exists('space_clamp_register_menu');

        if (!$old_snippet_active) {
            return; // No old snippet detected, don't show notice
        }

        // Check if we've already migrated settings
        $migrated = get_transient(self::MIGRATION_TRANSIENT);

        ?>
            <div class="notice notice-info is-dismissible fluispfo-snippet-notice">
                <h3>🔄 Fluid Space Forge: Migration Available</h3>

                <?php if ($migrated): ?>
                    <p><strong>✅ Your settings have been automatically imported from the code snippet version!</strong></p>
                <?php else: ?>
                    <p>We detected you're running the older code snippet version of Fluid Space Forge.</p>
                <?php endif; ?>

                <p><strong>To complete the upgrade:</strong></p>
                <ol style="margin-left: 20px;">
                    <li>Go to <strong>Code Snippets</strong> in your admin menu</li>
                    <li>Find and <strong>deactivate</strong> the "Fluid Space Forge" or "Space Clamp Calculator" snippet</li>
                    <li>You can safely delete it<?php echo $migrated ? ' - all your settings are preserved' : ''; ?></li>
                </ol>

                <p><em>After deactivating the snippet, refresh this page to see the updated plugin interface.</em></p>
            </div>
    <?php
    }

    /**
     * Handle AJAX request to dismiss the snippet migration notice
     */
    public function dismiss_snippet_notice()
    {
        check_ajax_referer('fluispfo_dismiss_notice', 'nonce');

        update_user_meta(get_current_user_id(), self::MIGRATION_NOTICE_DISMISSED, true);

        wp_send_json_success();
    }

    /**
     * Attempt to migrate settings from old code snippet version
     * Called on plugin activation
     */
    public static function migrate_from_snippet()
    {
        // Check if we already have plugin settings
        if (get_option(self::OPTION_SETTINGS)) {
            return; // Plugin already configured, don't overwrite
        }

        // Try to find old snippet settings
        // Common option names the snippet might have used
        $old_option_names = [
            'space_clamp_settings',
            'fluid_space_settings',
            'space_calculator_settings'
        ];

        foreach ($old_option_names as $old_name) {
            $old_settings = get_option($old_name);

            if ($old_settings && is_array($old_settings)) {
                // Found old settings! Migrate them
                update_option(self::OPTION_SETTINGS, $old_settings);

                // Set transient to show success message
                set_transient(self::MIGRATION_TRANSIENT, true, WEEK_IN_SECONDS);

                break;
            }
        }
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

        // Get JSON string input (wp_unslash removes WordPress's automatic slashing)
        // Note: We do NOT use sanitize_text_field() on JSON strings as it corrupts the data
        // Instead, we validate JSON structure and sanitize individual fields after decoding
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- JSON sanitized after decode
        $settings_json = isset($_POST['settings']) ? wp_unslash($_POST['settings']) : '';
        $settings_raw = json_decode($settings_json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            wp_send_json_error(['message' => 'Invalid settings JSON']);
            return;
        }

        // Load existing settings and merge with incoming (preserves fields not sent)
        // This allows partial updates (e.g., control settings) without losing data settings
        $existing_settings = get_option(self::OPTION_SETTINGS, $this->default_settings);

        // Sanitize the decoded settings array (individual field sanitization)
        $sanitized_incoming = $this->sanitize_settings_array($settings_raw);

        // Merge: incoming settings override existing, but existing are preserved
        $settings = array_merge($existing_settings, $sanitized_incoming);

        // Get sizes JSON string (wp_unslash removes WordPress's automatic slashing)
        // Note: We do NOT use sanitize_text_field() on JSON strings as it corrupts the data
        // Instead, we validate JSON structure and sanitize individual fields after decoding
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- JSON sanitized after decode
        $sizes_json = isset($_POST['sizes']) ? wp_unslash($_POST['sizes']) : '';
        $sizes_raw = json_decode($sizes_json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            wp_send_json_error(['message' => 'Invalid sizes JSON']);
            return;
        }

        // Sanitize each sizes array individually
        $class_sizes = $this->sanitize_sizes_array($sizes_raw['classSizes'] ?? []);
        $variable_sizes = $this->sanitize_sizes_array($sizes_raw['variableSizes'] ?? []);
        $utility_sizes = $this->sanitize_sizes_array($sizes_raw['utilitySizes'] ?? []);

        // Save sanitized data to database
        $result1 = update_option(self::OPTION_SETTINGS, $settings);
        $result2 = update_option(self::OPTION_CLASS_SIZES, $class_sizes);
        $result3 = update_option(self::OPTION_VARIABLE_SIZES, $variable_sizes);
        $result4 = update_option(self::OPTION_UTILITY_SIZES, $utility_sizes);

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
    }
}

// ========================================================================
// INITIALIZATION
// ========================================================================

// Register activation hook for migration
register_activation_hook(__FILE__, ['JimRForge\FluidSpaceForge\FluidSpaceForge', 'migrate_from_snippet']);

// Initialize the Fluid Space Forge
if (is_admin()) {
    new FluidSpaceForge();
}
