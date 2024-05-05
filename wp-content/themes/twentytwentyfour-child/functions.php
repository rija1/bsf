<?php
function my_theme_enqueue_styles()
{
    $parent_style = 'twentytwentyfour-style';
    wp_enqueue_style($parent_style, get_template_directory_uri() . '/style.css');
    wp_enqueue_style(
        'child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array($parent_style),
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_styles');

function my_theme_scripts()
{
    wp_enqueue_script('bsf', get_stylesheet_directory_uri() . '/js/bsf.js');
}
add_action('wp_enqueue_scripts', 'my_theme_scripts');

// Remove Add Coupon Block
remove_action('woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10);

/**
 * Snippet Name:     Remove the Order Notes field section from the WooCommerce checkout.
 */

add_filter('woocommerce_enable_order_notes_field', '__return_false', 9999);
add_filter('woocommerce_checkout_fields', 'remove_order_notes');

function remove_order_notes($fields)
{
    unset($fields['order']['order_comments']);
    return $fields;
}

// Increase donation step to 1
add_filter('wcdp_donation_amount_decimals', function () {
    return 1; //return increment here (e.g. 0.01, 0.1, 1, 2, 5 etc.)
});

// Change default text strings
add_filter('gettext', 'change_woocommerce_strings', 999, 3);

function change_woocommerce_strings($translated, $untranslated, $domain)
{

    if (!is_admin() && 'woocommerce' === $domain) {

        switch ($translated) {

            case 'Thanks for shopping with us.':
                $translated = 'Thank you for your support.';
                break;
        }
    }

    return $translated;
}


// TODO - REMOVE ON LIVE
function no_index_cpt()
{
    print '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">';
}
add_action('wp_head', 'no_index_cpt');
