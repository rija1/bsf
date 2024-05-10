<?php


namespace PaymentPlugins\Blocks\Stripe\Payments\Gateways;


use Automattic\WooCommerce\StoreApi\Schemas\V1\CartSchema;
use PaymentPlugins\Blocks\Stripe\Payments\AbstractStripePayment;
use PaymentPlugins\Blocks\Stripe\StoreApi\EndpointData;
use PaymentPlugins\Stripe\Controllers\PaymentIntent;
use PaymentPlugins\Stripe\RequestContext;

class ACHPayment extends AbstractStripePayment {

	protected $name = 'stripe_ach';

	public function get_payment_method_script_handles() {
		$this->assets_api->register_script( 'wc-stripe-blocks-ach', 'build/wc-stripe-ach.js' );

		return array( 'wc-stripe-blocks-ach' );
	}

	public function get_payment_method_icon() {
		return array(
			'id'  => $this->get_name(),
			'alt' => 'ACH Payment',
			'src' => $this->payment_method->icon
		);
	}

	public function get_payment_method_data() {
		return wp_parse_args( array(
			'businessName'   => $this->payment_method->get_option( 'business_name' ),
			'mandateText'    => $this->payment_method->get_mandate_text(),
			'accountCountry' => stripe_wc()->account_settings->get_account_country( wc_stripe_mode() )
		), parent::get_payment_method_data() );
	}

	protected function get_script_translations() {
		return array_merge(
			parent::get_script_translations(),
			[
				'ach_payment_cancelled' => __( 'ACH payment has been cancelled', 'woo-stripe-payment' ),
				'mandate_text'          => $this->payment_method->get_mandate_text()
			]
		);
	}

	public function get_endpoint_data() {
		$endpoint_data = new EndpointData();
		$endpoint_data->set_namespace( $this->get_name() );
		$endpoint_data->set_endpoint( CartSchema::IDENTIFIER );
		$endpoint_data->set_schema_type( ARRAY_A );
		$endpoint_data->set_data_callback( [ $this, 'get_cart_extension_data' ] );

		return $endpoint_data;
	}

	public function get_cart_extension_data() {
		$payment_intent_ctrl = PaymentIntent::instance();
		$payment_intent_ctrl->set_request_context( new RequestContext( RequestContext::CHECKOUT ) );
		if ( method_exists( $this->payment_method, 'get_payment_method_type' ) ) {
			return [
				'elementOptions' => array_merge(
					$payment_intent_ctrl->get_element_options(),
					[
						'paymentMethodTypes' => [ $this->payment_method->get_payment_method_type() ]
					]
				)
			];
		}

		return [];
	}

}