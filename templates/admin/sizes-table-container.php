<?php

/**
 * Sizes Table Container Template
 * 
 * Displays the right column data table panel with base selector,
 * action buttons, and the sizes table structure. Content is 
 * dynamically populated by JavaScript.
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

<div class="fcc-panel" id="sizes-table-container">
    <h2 style="margin-bottom: 8px;" id="table-title">Space Classes</h2>


    <!-- Base Value and Action Buttons Row -->

    <!-- Base Value and Prefix Controls Row -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px;">
        <!-- Left: Base and Prefix Controls -->
        <div style="display: flex; gap: 16px;">
            <!-- Base Value -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="component-label" for="base-value" style="margin-bottom: 0; font-size: 12px;">Base</label>
                <select id="base-value" class="component-select" style="width: 120px; height: 32px;"
                    aria-label="Base reference size - used for calculating all other space sizes in the scale">
                    <option value="3" selected>space-md</option>
                </select>
            </div>
            <!-- Prefix Input (hidden for Utilities tab) -->
            <div id="prefix-control" style="display: flex; flex-direction: column; gap: 4px;">
                <label class="component-label" for="prefix-input" style="margin-bottom: 0; font-size: 12px;">Prefix</label>
                <input type="text" id="prefix-input" class="component-input" style="width: 100px; height: 32px; padding: 4px 8px;"
                    value="space"
                    aria-label="Prefix for generated CSS (without . or -- markers)">
            </div>
        </div>









        <!-- Right: Action Buttons -->
        <div class="fcc-table-buttons" id="table-action-buttons">
            <button id="add-size" class="fcc-btn">Add Size</button>
            <button id="reset-defaults" class="fcc-btn">Reset</button>
            <button id="clear-sizes" class="fcc-btn">Clear All</button>
        </div>
    </div>

    <div id="sizes-table-wrapper">
        <table class="font-table">
            <thead>
                <tr id="table-header">
                    <th style="width: 24px;">⋮</th>
                    <th style="width: 75px;">Name</th>
                    <th style="width: 70px;">Min Size</th>
                    <th style="width: 70px;">Max Size</th>
                    <th style="width: 20px;">Action</th>
                </tr>
            </thead>
            <tbody id="sizes-table">
                <tr>
                    <td colspan="5" style="text-align: center; color: #6b7280; font-style: italic; padding: 40px 20px;">
                        Loading space data...
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>