import UPECheckoutGateway from './checkout-gateway';

class UniversalPaymentMethod {

    constructor(gateway, params) {
        this.gateway = gateway;
        this.params = params;
    }
}

new UniversalPaymentMethod(new UPECheckoutGateway(wc_stripe_upm_checkout_params), wc_stripe_upm_checkout_params);
