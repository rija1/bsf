import {BaseGateway, CheckoutGateway} from '@paymentplugins/wc-stripe';
import $ from 'jquery';
import debounce from 'debounce';

function Gateway(params) {
    BaseGateway.call(this, params);
    CheckoutGateway.call(this);
};

Gateway.prototype = Object.assign(Gateway.prototype, BaseGateway.prototype, CheckoutGateway.prototype);

class UPMCheckoutGateway extends Gateway {

    constructor(params) {
        super(params);
        this.setupIntent = null;
        this.paymentMethodType = null;
        this.paymentElementComplete = false;
    }

    initialize() {
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
        $(document.body).on('click', '#place_order', this.handlePlaceOrder.bind(this));
        $(document.body).on('change', `[name="${this.gateway_id}_saved_method_key"]`, debounce(this.maybeInitializeInstallments.bind(this), 250));
        $(document.body).on(`wc_stripe_saved_method_${this.gateway_id}`, debounce(this.maybeInitializeInstallments.bind(this), 250));
        $(document.body).on('change', '[name="billing_email"], [name="billing_phone"], [name="billing_first_name"], [name="billing_last_name"]', this.onFieldChange.bind(this));
        this.createPaymentElement();
        this.mountPaymentElement();
        this.initializeSetupIntent();
    }

    disable_payment_button() {
        $('#place_order').prop('disabled', true);
    }

    enable_payment_button() {
        $('#place_order').prop('disabled', false);
    }

    createPaymentElement() {
        this.paymentElement = this.elements.create('payment', {
            fields: {
                billingDetails: this.is_current_page('checkout') ?
                    {

                        address: 'never',
                        name: $('#billing_first_name').length ? 'never' : 'auto',
                        email: $('#billing_email').length ? 'never' : 'auto',
                        phone: $('#billing_phone').length ? 'never' : 'auto',
                    } : 'auto'
            },
            wallets: {applePay: 'never', googlePay: 'never'},
            defaultValues: {
                billingDetails: {
                    name: this.fields.get('billing_first_name') + ' ' + this.fields.get('billing_last_name'),
                    email: this.fields.get('billing_email'),
                    phone: this.fields.get('billing_phone')
                }
            },
            ...this.params.paymentElementOptions
        });
        this.paymentElement.on('change', this.onPaymentElementChange.bind(this));
    }

    mountPaymentElement() {
        this.paymentElement.mount('#wc-stripe-upm-element');
    }

    /**
     * Return true if the mode is 'payment'.
     * @returns {boolean}
     */
    isPaymentMode() {
        return this.params.elementOptions.mode === 'payment';
    }

    isSubscriptionMode() {
        return this.params.elementOptions.mode === 'subscription';
    }

    isSetupMode() {
        return this.params.elementOptions.mode === 'setup';
    }

    shouldCreatePaymentMethod() {
        return !['blik', 'boleto'].includes(this.paymentMethodType);
    }

    get_element_options() {
        let options = {
            ...((this.isPaymentMode() || this.isSubscriptionMode()) && {
                amount: 100,
            }),
            currency: this.params.currency.toLowerCase(),
            ...this.params.elementOptions,
        };
        let data = {};
        if (this.has_gateway_data()) {
            data.currency = this.get_currency().toLowerCase();
            if (this.isPaymentMode() || this.isSubscriptionMode()) {
                data.amount = this.get_total_price_cents();
                // precaution to prevent any JS validation errors
                if (data.amount <= 0) {
                    data.amount = 100;
                }
            }
        }
        return {
            ...options,
            ...data
        }
    }

    updated_checkout(e, data) {
        this.updatePaymentElement(data);
        this.mountPaymentElement();
        this.handleInstallments();
        this.initializeSetupIntent();
    }

    onPaymentElementChange(event) {
        const {value = null, complete = false} = event;
        this.paymentElementComplete = complete;
        if (value?.type) {
            this.paymentMethodType = value.type;
            this.setPaymentMethodType(value.type);
        }
        this.handleInstallments();
    }

    updatePaymentElement(data = null) {
        if (data && data?.fragments?.['.wc-stripe-element-options']) {
            try {
                const options = JSON.parse(window.atob(decodeURIComponent(data.fragments['.wc-stripe-element-options'])));
                if (this.params.elementOptions.mode !== options.mode) {
                    this.params.elementOptions = {
                        ...this.params.elementOptions,
                        ...options
                    };
                    this.elements.update(this.get_element_options());
                }
            } catch (error) {
            }
        }
    }

    handleHashChange(e) {
        const match = window.location.hash.match(/response=(.*)/);
        if (match) {
            try {
                const obj = JSON.parse(window.atob(decodeURIComponent(match[1])));
                if (obj && obj.hasOwnProperty('client_secret') && obj.stripe_upm) {
                    history.pushState({}, '', window.location.pathname);
                    if (obj.type === 'payment_intent') {
                        this.processPaymentIntent(obj);
                    } else {
                        this.processSetupIntent(obj);
                    }
                }
            } catch (err) {

            }
        }
        return true;
    }

    handlePlaceOrder(e) {
        if (this.is_gateway_selected()) {
            if (!this.is_saved_method_selected()) {
                e.preventDefault();
                this.disable_payment_button();
                this.elements.submit().then(response => {
                    if (response.error) {
                        return this.submit_error(response.error);
                    }
                    if (this.isPaymentMode() && this.shouldCreatePaymentMethod()) {
                        return this.stripe.createPaymentMethod({
                            elements: this.elements,
                            params: {
                                billing_details: this.get_billing_details()
                            }
                        }).then(response => {
                            if (response.error) {
                                return this.submit_error(response.error);
                            }
                            if (this.is_current_page('order_pay')) {
                                this.set_nonce(response.paymentMethod.id);
                                this.process_order_pay();
                            } else {
                                this.on_token_received(response.paymentMethod);
                            }
                        }).catch((error) => {
                            return this.submit_error(error);
                        });
                    } else {
                        if (this.isSetupMode() && this.setupIntent) {
                            this.block();
                            return this.processSetupIntent({
                                client_secret: this.setupIntent.client_secret,
                                confirmParams: this.params.confirmParams
                            }).finally(() => {
                                this.unblock();
                            });
                        }
                        this.payment_token_received = true;
                        this.get_form().trigger('submit');
                    }
                }).catch(error => {
                    this.enable_payment_button();
                    return this.submit_error(error);
                }).finally(() => {
                    this.enable_payment_button();
                });
            }
        }
    }

    on_token_received(paymentMethod) {
        this.payment_token_received = true;
        this.set_nonce(paymentMethod.id);
        this.setPaymentMethodType(paymentMethod.type);
        this.get_form().trigger('submit');
    }

    setPaymentMethodType(type) {
        $('#_stripe_payment_method_type').val(type);
    }

    handle_next_action(data) {
        if (data.type === 'payment_intent') {
            this.processPaymentIntent(data);
        } else {
            this.processSetupIntent(data);
        }
    }

    processPaymentIntent(data) {
        this.stripe.confirmPayment({
            ...(!this.is_saved_method_selected() && {
                elements: this.elements
            }),
            clientSecret: data.client_secret,
            redirect: 'if_required',
            confirmParams: {
                return_url: data.return_url,
                payment_method_data: {
                    billing_details: data.billing_details || this.get_billing_details()
                },
            }
        }).then(response => {
            if (response.error) {
                this.payment_token_received = false;
                return this.submit_error(response.error);
            }
            let redirect = decodeURI(data.return_url);
            redirect += '&' + $.param({
                '_stripe_local_payment': this.gateway_id,
                payment_intent: response.paymentIntent.id,
                payment_intent_client_secret: response.paymentIntent.client_secret
            });

            if (['promptpay', 'swish', 'paynow', 'cashapp'].includes(this.paymentMethodType)) {
                if (response.paymentIntent.status === 'requires_action') {
                    return this.get_form().unblock().removeClass('processing');
                }
                if (response.paymentIntent.status === 'requires_payment_method') {
                    this.get_form().unblock().removeClass('processing');
                    return this.submit_error({code: response.paymentIntent.last_payment_error.code});
                }
            }

            window.location.href = redirect;
        }).catch(error => {
            return this.submit_error(error);
        })
    }

    processSetupIntent(data = null) {
        return this.stripe.confirmSetup({
            elements: this.elements,
            clientSecret: data.client_secret,
            redirect: 'if_required',
            ...(data && {
                confirmParams: {
                    ...(data.return_url && {
                        return_url: data.return_url
                    }),
                    payment_method_data: {
                        billing_details: this.get_billing_details()
                    },
                    ...(data.confirmParams && data.confirmParams)
                }
            })
        }).then(response => {
            if (response.error) {
                this.payment_token_received = false;
                return this.submit_error(response.error);
            }
            this.payment_token_received = true;
            this.set_nonce(response.setupIntent.payment_method);
            this.set_intent(response.setupIntent.id);

            this.get_form().trigger('submit');
        }).catch(error => {
            return this.submit_error(error);
        });
    }

    handleInstallments() {
        if (this.installmentsEnabled()) {
            this.maybeShowInstallments();
            if (this.paymentElementComplete && this.isCardPaymentType()) {
                this.initializeInstallments();
            }
        }
    }

    isCardPaymentType() {
        return this.paymentMethodType === 'card';
    }

    maybeShowInstallments() {
        if (this.is_saved_method_selected()) {
            if (this.savedPaymentTokenGatewayId === 'stripe_cc') {
                this.showInstallments();
            } else {
                this.hideInstallments();
            }
        } else {
            if (this.isCardPaymentType()) {
                this.showInstallments();
            } else {
                this.hideInstallments();
            }
        }
    }

    showInstallments() {
        $(this.container).find('.wc-stripe-installment-container').show();
    }

    hideInstallments() {
        $(this.container).find('.wc-stripe-installment-container').hide();
    }

    installmentsEnabled() {
        if (this.has_gateway_data()) {
            const data = this.get_gateway_data();
            return !!data?.installments?.enabled;
        }
        return false;
    }

    maybeInitializeInstallments() {
        if (this.installmentsEnabled() && this.is_saved_method_selected()) {
            this.savedPaymentTokenGatewayId = $(`${this.saved_method_selector} option:selected`).data('gateway');
            if (this.savedPaymentTokenGatewayId === 'stripe_cc') {
                this.initializeInstallments(this.get_selected_payment_method());
            }
            this.maybeShowInstallments();
        }
    }

    async initializeInstallments(paymentMethodId = null) {
        if (paymentMethodId) {
            this.showInstallmentLoader();
            try {
                await this.fetchInstallmentPlans(paymentMethodId);
            } catch (error) {
                console.log(error);
            } finally {
                this.hideInstallmentLoader();
            }
        } else {
            try {
                await this.elements.submit();
                const response = await this.stripe.createPaymentMethod({
                    elements: this.elements,
                    params: {
                        billing_details: this.get_billing_details()
                    }
                });
                if (!response.error) {
                    await this.initializeInstallments(response.paymentMethod.id);
                }
            } catch (error) {
                this.hideInstallmentLoader();
            } finally {
            }
        }
    }

    fetchPaymentIntent(paymentMethodId) {
        return new Promise((resolve, reject) => {
            let url = this.params.routes.create_payment_intent;
            let order_pay = false;
            if (this.is_current_page('order_pay')) {
                url = this.params.routes.order_create_payment_intent;
                order_pay = true;
            }
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: !order_pay ? {
                    ...this.serialize_fields(),
                    payment_method_id: paymentMethodId,
                    payment_method: 'stripe_cc',
                    page_id: this.get_page()
                } : {
                    payment_method_id: paymentMethodId,
                    payment_method: 'stripe_cc',
                    order_id: this.get_gateway_data().order.id,
                    order_key: this.get_gateway_data().order.key
                },
                beforeSend: this.ajax_before_send.bind(this)
            }).done((response) => {
                if (response.code) {
                    reject(response);
                } else {
                    resolve(response);
                }
            }).fail((xhr) => {
                reject()
            });
        })
    }

    async fetchInstallmentPlans(paymentMethodId) {
        try {
            const response = await this.fetchPaymentIntent(paymentMethodId);
            if (response.installments_html) {
                $('.wc-stripe-installment-container').replaceWith(response.installments_html);
            }
        } catch (error) {
            return this.submit_error(error);
        }
    }

    showInstallmentLoader() {
        $('.wc-stripe-installment-options').addClass('loading-installments');
        const $option = $('[name="_stripe_installment_plan"] option:selected').eq(0);
        $option.text(this.params.installments.loading);
        $('.wc-stripe-installment-loader').show();
    }

    hideInstallmentLoader() {
        $('.wc-stripe-installment-options').removeClass('loading-installments');
        $('.wc-stripe-installment-loader').hide();
    }

    initializeSetupIntent() {
        if (this.isSetupMode() && !this.setupIntent) {
            this.create_setup_intent({context: this.get_page()}).then(response => {
                if (response.intent) {
                    this.setupIntent = response.intent;
                }
            }).catch(error => {
                //silently catch setup intent failure
            });
        }
    }

    show_payment_button() {
        this.show_place_order();
    }

    hide_place_order() {
    }

    onFieldChange(e) {
        this.paymentElement.update({
            defaultValues: {
                billingDetails: {
                    name: $('#billing_first_name').val() + ' ' + $('#billing_last_name').val(),
                    email: $('#billing_email').val(),
                    phone: $('#billing_phone').val()
                }
            }
        })
    }

}

export default UPMCheckoutGateway;