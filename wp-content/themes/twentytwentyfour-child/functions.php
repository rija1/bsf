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

echo '<div id="custom_checkout_field"><h3>' . __('Boost your donation at no extra cost for you') . '</h3>';

woocommerce_form_field('gift_aid_checkbox', array(

'type' => 'checkbox',


'class' => array(

'my-field-class form-row-wide'

) ,

'label' => __('I can confirm that I am a UK tax payer and I want to Gift Aid this donation and any donations I make in the future or have made in the past 4 years to International Justice Mission UK. I understand that if I pay less Income Tax and/or Capital Gains Tax than the amount of Gift Aid claimed on my donations in that tax year it is my responsibility to pay any difference. I agree to notify International Justice Mission UK if I want to cancel this declaration, change my name or home address or no longer pay sufficient tax on my income and/or capital gains.') ,

'description' => __('*This is my own money, I am a UK taxpayer and understand that if I pay less income tax in the current tax year than the amount of Gift Aid claimed on my donations it is my responsibility to pay any difference. Gift Aid is claimed by WWF-UK from the tax you pay for the current tax year. The money that we claim back from HMRC as part of the Gift Aid scheme will be treated as unrestricted funds and used to support our general work, even if your original donation was made towards a specific project.') ,

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