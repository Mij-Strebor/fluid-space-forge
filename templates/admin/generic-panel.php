<?php

/**
 * Generic Data Table Panel Template
 * 
 * Reusable panel for all tab types (Classes, Variables, Utilities).
 * Supports both populated and empty states.
 * Configuration passed via JavaScript template replacement.
 * 
 * @package FluidSpaceForge
 * @subpackage Templates/Admin/Panels
 * @since 1.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<!-- Empty State Template -->
<div id="empty-state" class="{{EMPTY_CLASS}}">
    <h2 style="margin-bottom: 8px;" id="table-title">{{PANEL_TITLE}}</h2>
    <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--clr-txt); opacity: 0.85; line-height: 1.4;">
        {{PANEL_DESCRIPTION}}
    </p>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label class="component-label" style="margin-bottom: 0; white-space: nowrap; opacity: 0.5;">Base</label>
            <select class="component-select" style="width: 120px; height: 32px;" disabled>
                <option>{{EMPTY_OPTION_TEXT}}</option>
            </select>
        </div>

        <div class="fcc-table-buttons">
            <button id="add-size" class="fcc-btn">add size</button>
            <button id="reset-defaults" class="fcc-btn">reset</button>
            <button id="clear-sizes" class="fcc-btn fcc-btn-danger" disabled style="opacity: 0.5;">clear all</button>
        </div>
    </div>

    <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 6px; border: 2px dashed #cbd5e1; margin-top: 16px;">
        <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">{{EMPTY_ICON}}</div>
        <h3 style="color: #475569; margin: 0 0 8px 0; font-size: 18px;">{{EMPTY_TITLE}}</h3>
        <p style="color: #64748b; margin: 0 0 20px 0; font-size: 14px;">{{EMPTY_TEXT}}</p>
        <button id="add-first-size" class="fcc-btn" style="margin-right: 12px;">{{EMPTY_BUTTON_TEXT}}</button>
        <button id="reset-to-defaults" class="fcc-btn">reset to defaults</button>
    </div>
</div>

<!-- Populated State Template -->
<div id="populated-state" class="{{POPULATED_CLASS}}">
    <h2 style="margin-bottom: 8px;" id="table-title">{{PANEL_TITLE}}</h2>
    <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--clr-txt); opacity: 0.85; line-height: 1.4;">
        {{PANEL_DESCRIPTION}}
    </p>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label class="component-label" for="base-value" style="margin-bottom: 0; white-space: nowrap;">Base</label>
            <div class="fcc-input-wrapper" data-tooltip="Reference size used for calculating other sizes - this will be your base space">
                <select id="base-value" class="component-select" style="width: 120px; height: 32px;">
                    {{BASE_OPTIONS}}
                </select>
            </div>
        </div>

        <div class="fcc-table-buttons">
            <button id="add-size-populated" class="fcc-btn">add size</button>
            <button id="reset-defaults-populated" class="fcc-btn">reset</button>
            <button id="clear-sizes-populated" class="fcc-btn fcc-btn-danger">clear all</button>
        </div>
    </div>

    <div id="sizes-table-wrapper">
        <table class="space-table">
            <thead>
                <tr id="table-header">
                    <th style="width: 10%; text-align: center;">⋮</th>
                    <th style="width: 18%; text-align: left;">Suffix</th>
                    <th style="width: 24%; text-align: left;">Min Size</th>
                    <th style="width: 24%; text-align: left;">Max Size</th>
                    <th style="width: 24%; text-align: center;">Action</th>
                </tr>
            </thead>
            <tbody id="sizes-table">
                {{TABLE_ROWS}}
            </tbody>
        </table>
    </div>
</div>