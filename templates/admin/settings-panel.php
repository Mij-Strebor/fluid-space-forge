<?php

/**
 * Settings Panel Template
 * 
 * Displays the left column settings panel with unit selector,
 * viewport settings, base space settings, and scale ratios.
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

<div class="fcc-panel" style="margin-bottom: 8px;">
    <h2 class="settings-title">Settings</h2>

    <!-- space Units Selector -->
    <div class="font-units-section">
        <label class="font-units-label">Select Space Units to Use:</label>
        <div class="font-units-buttons">
            <button id="px-tab" class="unit-button <?php echo $settings['unitType'] === 'px' ? 'active' : ''; ?>" data-unit="px"
                aria-label="Use pixel units for space - more predictable but less accessible"
                aria-pressed="<?php echo $settings['unitType'] === 'px' ? 'true' : 'false'; ?>"
                data-tooltip="Use pixel units for space - more predictable but less accessible">PX</button>
            <button id="rem-tab" class="unit-button <?php echo $settings['unitType'] === 'rem' ? 'active' : ''; ?>" data-unit="rem"
                aria-label="Use rem units for space - scales with user's browser settings"
                aria-pressed="<?php echo $settings['unitType'] === 'rem' ? 'true' : 'false'; ?>"
                data-tooltip="Use rem units for space - scales with user's browser settings">REM</button>
        </div>
    </div>

    <p class="divider">What is the base space size at the viewport limits and the viewport range?</p>

    <!-- Row 1: Min Base and Min Width -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
        <div class="grid-item">
            <label class="component-label" for="min-base-space">Min Viewport Space Size (px)</label>
            <div class="fcc-input-wrapper" data-tooltip="Base space size at minimum viewport width">
                <input type="number" id="min-base-space" value="<?php echo esc_attr($settings['minBasespace'] ?? self::DEFAULT_MIN_BASE_space); ?>"
                    class="component-input" style="width: 100%;"
                    min="<?php echo esc_attr(self::MIN_BASE_SPACE_RANGE[0]); ?>"
                    max="<?php echo esc_attr(self::MIN_BASE_SPACE_RANGE[1]); ?>"
                    step="1"
                    aria-label="Minimum base space in pixels - base space at minimum viewport width">
            </div>
        </div>

        <div class="grid-item">
            <label class="component-label" for="min-viewport">Min Viewport Width (px)</label>
            <div class="fcc-input-wrapper" data-tooltip="Screen width where minimum space applies">
                <input type="number" id="min-viewport" value="<?php echo esc_attr($settings['minViewport']); ?>"
                    class="component-input" style="width: 100%;"
                    min="<?php echo esc_attr(self::VIEWPORT_RANGE[0]); ?>"
                    max="<?php echo esc_attr(self::VIEWPORT_RANGE[1]); ?>"
                    step="1"
                    aria-label="Minimum viewport width in pixels - screen width where minimum space applies">
            </div>
        </div>
    </div>

    <!-- Row 2: Max Base and Max Width -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
        <div class="grid-item">
            <label class="component-label" for="max-base-space">Max Viewport Space Size (px)</label>
            <div class="fcc-input-wrapper" data-tooltip="Base space size at maximum viewport width">
                <input type="number" id="max-base-space" value="<?php echo esc_attr($settings['maxBasespace'] ?? self::DEFAULT_MAX_BASE_space); ?>"
                    class="component-input" style="width: 100%;"
                    min="<?php echo esc_attr(self::MAX_BASE_SPACE_RANGE[0]); ?>"
                    max="<?php echo esc_attr(self::MAX_BASE_SPACE_RANGE[1]); ?>"
                    step="1"
                    aria-label="Maximum base space in pixels - base space at maximum viewport width">
            </div>
        </div>
        <div class="grid-item">
            <label class="component-label" for="max-viewport">Max Viewport Width (px)</label>
            <div class="fcc-input-wrapper" data-tooltip="Screen width where maximum space applies">
                <input type="number" id="max-viewport" value="<?php echo esc_attr($settings['maxViewport']); ?>"
                    class="component-input" style="width: 100%;"
                    min="<?php echo esc_attr(self::VIEWPORT_RANGE[0]); ?>"
                    max="<?php echo esc_attr(self::VIEWPORT_RANGE[1]); ?>"
                    step="1"
                    aria-label="Maximum viewport width in pixels - screen width where maximum space applies">
            </div>
        </div>
    </div>

    <p class="divider">How should your spacing scale? Set the ratio at both viewport limits.</p>

    <!-- Row 3: Min Scale -->
    <div class="grid-item">
        <label class="component-label" for="min-scale">Min Viewport Space Scaling</label>
        <div class="fcc-input-wrapper" data-tooltip="Space scale ratio for smaller screens - how much size difference between space levels">
            <select id="min-scale" class="component-select" style="width: 100%;"
                aria-label="Minimum scale ratio for space on smaller screens - controls size differences between space levels">
                <option value="1.067" <?php selected($settings['minScale'], '1.067'); ?>>1.067 Minor Second</option>
                <option value="1.125" <?php selected($settings['minScale'], '1.125'); ?>>1.125 Major Second</option>
                <option value="1.200" <?php selected($settings['minScale'], '1.200'); ?>>1.200 Minor Third</option>
                <option value="1.250" <?php selected($settings['minScale'], '1.250'); ?>>1.250 Major Third</option>
                <option value="1.333" <?php selected($settings['minScale'], '1.333'); ?>>1.333 Perfect Fourth</option>
            </select>
        </div>
    </div>

    <!-- Row 4: Max Scale -->
    <div class="grid-item">
        <label class="component-label" for="max-scale">Max Viewport Space Scaling</label>
        <div class="fcc-input-wrapper" data-tooltip="Space scale ratio for larger screens - how dramatic the size differences should be on big screens">
            <select id="max-scale" class="component-select" style="width: 100%;"
                aria-label="Maximum scale ratio for space on larger screens - controls how dramatic size differences are on big screens">
                <option value="1.067" <?php selected($settings['maxScale'], '1.067'); ?>>1.067 Minor Second</option>
                <option value="1.125" <?php selected($settings['maxScale'], '1.125'); ?>>1.125 Major Second</option>
                <option value="1.200" <?php selected($settings['maxScale'], '1.200'); ?>>1.200 Minor Third</option>
                <option value="1.250" <?php selected($settings['maxScale'], '1.250'); ?>>1.250 Major Third</option>
                <option value="1.333" <?php selected($settings['maxScale'], '1.333'); ?>>1.333 Perfect Fourth</option>
            </select>
        </div>
    </div>
</div>