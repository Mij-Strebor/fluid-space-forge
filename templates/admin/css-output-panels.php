<?php

/**
 * CSS Output Panels Template
 * 
 * Displays two CSS output containers: one for selected CSS
 * and one for all generated CSS with copy buttons.
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

<!-- Enhanced CSS Output Containers -->
<div class="fcc-panel" style="margin-top: 8px;" id="selected-css-container">
    <div class="fcc-css-header">
        <h2 style="flex-grow: 1;" id="selected-code-title">Selected Class CSS</h2>
        <div id="selected-copy-button">
            <button id="copy-selected-btn" class="fcc-copy-btn"
                data-tooltip="Copy selected CSS to clipboard"
                aria-label="Copy selected CSS to clipboard"
                title="Copy CSS">
                <span class="copy-icon">📋</span> copy
            </button>
        </div>
    </div>
    <div style="background: white; border-radius: 6px; padding: 8px; border: 1px solid #d1d5db;">
        <pre id="class-code" style="font-size: 12px; white-space: pre-wrap; color: #111827; margin: 0;">/* Loading CSS output... */</pre>
    </div>
</div>

<div class="fcc-panel" style="margin-top: 8px;" id="generated-css-container">
    <div class="fcc-css-header">
        <h2 style="flex-grow: 1;" id="generated-code-title">Generated CSS (All Classes)</h2>
        <div class="fcc-css-buttons" id="generated-copy-buttons">
            <button id="copy-all-btn" class="fcc-copy-btn"
                data-tooltip="Copy all generated CSS to clipboard"
                aria-label="Copy all generated CSS to clipboard"
                title="Copy All CSS">
                <span class="copy-icon">📋</span> copy all
            </button>
        </div>
    </div>
    <div style="background: white; border-radius: 6px; padding: 8px; border: 1px solid #d1d5db; overflow: auto; max-height: 300px;">
        <pre id="generated-code" style="font-size: 12px; white-space: pre-wrap; color: #111827; margin: 0;">/* Loading CSS output... */</pre>
    </div>
</div>