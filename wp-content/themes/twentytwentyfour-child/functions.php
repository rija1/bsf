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
    wp_enqueue_script('chartjs', get_stylesheet_directory_uri() . '/js/chart.js');
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

            case 'We have finished processing your order.':
                $translated = 'Your donation to Buddhist Support Fund has now been processed.';
                break;

            case 'Footer text':
                $translated = '';
                break;
        }
    }

    return $translated;
}


add_filter('comment_form_default_fields', 'website_remove');
function website_remove($fields)
{
   if(isset($fields['url']))
   unset($fields['url']);
   return $fields;
}

add_filter( 'comment_form_default_fields', 'wc_comment_form_change_cookies' );
function wc_comment_form_change_cookies( $fields ) {
	$commenter = wp_get_current_commenter();

	$consent   = empty( $commenter['comment_author_email'] ) ? '' : ' checked="checked"';

	$fields['cookies'] = '<p class="comment-form-cookies-consent"><input id="wp-comment-cookies-consent" name="wp-comment-cookies-consent" type="checkbox" value="yes"' . $consent . ' />' .
					 '<label for="wp-comment-cookies-consent">'.__('Save my name and email in this browser for the next time I comment.

', 'textdomain').'</label></p>';
	return $fields;
}