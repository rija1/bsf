<?php
function my_theme_enqueue_styles() {
    $parent_style = 'twentytwentyfour-style';
    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
}
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );

function my_theme_scripts() {
    wp_enqueue_script( 'bsf', get_stylesheet_directory_uri() . '/js/bsf.js');
}
add_action( 'wp_enqueue_scripts', 'my_theme_scripts' );

// Remove Add Coupon Block
remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 ); 

add_action('woocommerce_after_order_notes', 'custom_checkout_field');

function custom_checkout_field($checkout)

{

echo '<div id="custom_checkout_field"><h3>' . __('Increase your donation by 25% at no extra cost for you') . '</h3>';

woocommerce_form_field('gift_aid_checkbox', array(

'type' => 'checkbox',


'class' => array(

'my-field-class form-row-wide'

) ,

'label' => __("I am a taxpayer in the UK and I wish for the Buddhist Support Fund to reclaim tax on any donations I've made in the past four years, as well as on any future donations, until I advise otherwise. I acknowledge that if my Income Tax and/or Capital Gains Tax payments are less than the total Gift Aid claimed on all my donations in a tax year, it is my responsibility to cover the shortfall. Please be aware that Gift Aid applies only to personal donations and cannot be applied to donations collected from others or made on behalf of a company.") ,

'description' => __('') ,

) 			   ,

$checkout->get_value('gift_aid_checkbox'));

echo '</div>';

}

// TODO - REMOVE ON LIVE
function no_index_cpt()
{  
    print '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">';
}
add_action('wp_head', 'no_index_cpt');