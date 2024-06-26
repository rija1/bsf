<?php

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'WC_Payment_Gateway_Stripe_Local_Payment' ) ) {
	return;
}

/**
 *
 * @package Stripe/Gateways
 * @author  PaymentPlugins
 *
 */
class WC_Payment_Gateway_Stripe_Sepa extends WC_Payment_Gateway_Stripe_Local_Payment {

	use WC_Stripe_Local_Payment_Intent_Trait {
		get_payment_intent_confirmation_args as trait_get_payment_intent_confirmation_args;
	}

	protected $payment_method_type = 'sepa_debit';

	public $token_type = 'Stripe_Sepa';

	protected $supports_save_payment_method = true;

	public function __construct() {
		$this->synchronous        = false;
		$this->local_payment_type = 'sepa_debit';
		$this->currencies         = array( 'EUR' );
		$this->id                 = 'stripe_sepa';
		$this->tab_title          = __( 'SEPA', 'woo-stripe-payment' );
		$this->template_name      = 'local-payment.php';
		$this->method_title       = __( 'SEPA (Stripe) by Payment Plugins', 'woo-stripe-payment' );
		$this->method_description = __( 'SEPA gateway that integrates with your Stripe account.', 'woo-stripe-payment' );
		$this->icon               = stripe_wc()->assets_url( 'img/sepa.svg' );
		parent::__construct();

		$this->local_payment_description     = sprintf(
			__(
				'By providing your IBAN and confirming this payment, you are
			authorizing %s and Stripe, our payment service provider, to send instructions to your bank to debit your account
			and your bank to debit your account in accordance with those instructions. You are entitled to a refund from your bank under the
			terms and conditions of your agreement with your bank. A refund must be claimed within 8 weeks starting from the date on which your account was debited.',
				'woo-stripe-payment'
			),
			$this->get_option( 'company_name' )
		);
		$this->settings['save_card_enabled'] = 'yes';
		$this->new_payment_method_label      = __( 'New Account', 'woo-stripe-payment' );
		$this->saved_payment_methods_label   = __( 'Saved Accounts', 'woo-stripe-payment' );
	}

	public function init_supports() {
		parent::init_supports();
		$this->supports[] = 'subscriptions';
		$this->supports[] = 'subscription_cancellation';
		$this->supports[] = 'multiple_subscriptions';
		$this->supports[] = 'subscription_reactivation';
		$this->supports[] = 'subscription_suspension';
		$this->supports[] = 'subscription_date_changes';
		$this->supports[] = 'subscription_payment_method_change_admin';
		$this->supports[] = 'subscription_amount_changes';
		$this->supports[] = 'subscription_payment_method_change_customer';
		$this->supports[] = 'pre-orders';
	}

	public function init_form_fields() {
		parent::init_form_fields();
		$this->form_fields['allowed_countries']['default'] = 'all';
	}

	public function get_element_params() {
		return array_merge( parent::get_element_params(), array( 'supportedCountries' => array( 'SEPA' ) ) );
	}

	public function get_local_payment_settings() {
		return parent::get_local_payment_settings() + array(
				'stripe_mandate' => array(
					'title'       => __( 'Use Stripe Mandate', 'woo-stripe-payment' ),
					'type'        => 'checkbox',
					'default'     => 'yes',
					'desc_tip'    => true,
					'description' => __( 'If enabled, Stripe\'s default mandate text will be used. If disabled, the plugin will use it\'s mandate text.', 'woo-stripe-payment' )
				),
				'company_name'   => array(
					'title'       => __( 'Company Name', 'woo-stripe-payment' ),
					'type'        => 'text',
					'default'     => get_bloginfo( 'name' ),
					'desc_tip'    => true,
					'description' => __( 'The name of your company that will appear in the SEPA mandate.', 'woo-stripe-payment' ),
				),
				'method_format'  => array(
					'title'       => __( 'Payment Method Display', 'woo-stripe-payment' ),
					'type'        => 'select',
					'class'       => 'wc-enhanced-select',
					'options'     => wp_list_pluck( $this->get_payment_method_formats(), 'example' ),
					'default'     => 'type_ending_last4',
					'desc_tip'    => true,
					'description' => __( 'This option allows you to customize how the payment method will display for your customers on orders, subscriptions, etc.' ),
				),
			);
	}

	public function get_payment_description() {
		return parent::get_payment_description() .
		       sprintf( '<p><a target="_blank" href="https://stripe.com/docs/sources/sepa-debit#testing">%s</a></p>', __( 'SEPA Test Accounts', 'woo-stripe-payment' ) );
	}

	public function get_payment_token( $method_id, $method_details = array() ) {
		$token = parent::get_payment_token( $method_id, $method_details );

		$mandate = $token->get_mandate();
		$url     = $token->get_mandate_url();
		if ( $mandate && ! $url ) {
			$mandate = $this->gateway->mode( $token->get_environment() )->mandates->retrieve( $mandate );
			if ( ! is_wp_error( $mandate ) ) {
				if ( isset( $mandate->payment_method_details->sepa_debit->url ) ) {
					$token->set_mandate_url( $mandate->payment_method_details->sepa_debit->url );
				}
			}
		}

		return $token;
	}

	public function get_payment_element_options() {
		return array_merge(
			parent::get_payment_element_options(),
			array(
				'terms'    => array(
					'sepaDebit' => $this->is_active( 'stripe_mandate' ) ? 'auto' : 'never'
				),
				'business' => array(
					'name' => $this->get_option( 'company_name', '' )
				)
			)
		);
	}

	public function get_payment_intent_confirmation_args( $intent, $order ) {
		$args = $this->trait_get_payment_intent_confirmation_args( $intent, $order );
		$this->add_payment_intent_mandate_args( $args, $order );
		if ( isset( $intent->payment_method ) ) {
			if ( is_object( $intent->payment_method ) ) {
				$id = $intent->payment_method->id;
			} else {
				$id = $intent->payment_method;
			}
			if ( strpos( $id, 'src_' ) !== false ) {
				unset( $args['mandate_data'] );
			}
		}

		return $args;
	}

}