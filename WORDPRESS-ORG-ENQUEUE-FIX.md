# WordPress.org Enqueue Fix for FSF

**Issue:** WordPress plugin review found inline `<script>` tag at line 837 in `fluid-space-forge.php`

**WordPress Requirement:** All JavaScript must be enqueued using `wp_enqueue_script()` or `wp_add_inline_script()`. Inline `<script>` tags are not allowed.

---

## Required Changes

### Change 1: Add Hook for Notice Scripts

**File:** `fluid-space-forge.php`
**Line:** 137 (in `init_hooks()` method)

**Add this line:**
```php
add_action('admin_enqueue_scripts', [$this, 'enqueue_notice_scripts']);
```

**Result - the init_hooks() method should look like:**
```php
private function init_hooks()
{
    add_action('admin_menu', [$this, 'add_admin_menu']);
    add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    add_action('admin_enqueue_scripts', [$this, 'enqueue_notice_scripts']); // ← ADD THIS LINE
    add_action('wp_ajax_save_fluispfo_settings', [$this, 'save_settings']);
    add_action('admin_notices', [$this, 'show_snippet_migration_notice']);
    add_action('wp_ajax_fluispfo_dismiss_snippet_notice', [$this, 'dismiss_snippet_notice']);
}
```

---

### Change 2: Add New Method

**File:** `fluid-space-forge.php`
**Location:** After the `enqueue_assets()` method (around line 380, before `get_all_constants()`)

**Add this complete method:**
```php
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
```

---

### Change 3: Remove Inline Script Tag

**File:** `fluid-space-forge.php`
**Lines:** 837-846

**DELETE these lines:**
```php
<script type="text/javascript">
jQuery(document).ready(function($) {
    $('.fluispfo-snippet-notice').on('click', '.notice-dismiss', function() {
        $.post(ajaxurl, {
            action: 'fluispfo_dismiss_snippet_notice',
            nonce: '<?php echo esc_js(wp_create_nonce('fluispfo_dismiss_notice')); ?>'
        });
    });
});
</script>
```

**The end of `show_snippet_migration_notice()` should now look like:**
```php
        <p><em>After deactivating the snippet, refresh this page to see the updated plugin interface.</em></p>
    </div>
    <?php
}
```

---

## Summary

This fix moves the inline JavaScript to a properly enqueued script using WordPress standard functions:

1. **`wp_register_script()`** - Registers the script handle
2. **`wp_enqueue_script()`** - Enqueues it with jQuery dependency
3. **`wp_add_inline_script()`** - Attaches the inline code to the registered handle

This satisfies WordPress.org's requirement that all scripts use the enqueueing system.

---

## Testing

After making these changes:

1. Deactivate and reactivate the plugin in WordPress
2. Check for PHP errors in debug.log
3. Verify the notice still appears if old snippet is active
4. Verify the dismiss button still works
5. Check browser console for JavaScript errors

---

## Files to Clean Up After Fix

These temporary files can be deleted after the fix is applied:
- `apply-wp-enqueue-fix.py`
- `enqueue-notice-fix.php`
- `fluid-space-forge.php.backup` (if you want)
- `WORDPRESS-ORG-ENQUEUE-FIX.md` (this file, after fix is complete)
