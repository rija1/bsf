import {Elements, PaymentElement} from "@stripe/react-stripe-js";
import {initStripe as loadStripe, cartContainsSubscription, cartContainsPreOrder} from '../util'
import {useCreateSource} from "./hooks";
import {useCreatePaymentMethod, useProcessCheckoutError, useProcessCheckoutSuccess} from "../hooks";

/**
 * Return true if the local payment method can be used.
 * @param settings
 * @returns {function({billingAddress: *, [p: string]: *}): *}
 */
export const canMakePayment = (settings, callback = false) => ({billingAddress, cartTotals, ...props}) => {
    const {currency_code} = cartTotals;
    const {country} = billingAddress;
    const countries = settings('countries');
    const type = settings('allowedCountries');
    const supports = settings('features');
    let canMakePayment = false;
    if (settings('isAdmin')) {
        canMakePayment = true;
    } else {
        // Check if there are any subscriptions or pre-orders in the cart.
        if (cartContainsSubscription() && !supports.includes('subscriptions')) {
            return false;
        } else if (cartContainsPreOrder() && !supports.includes('pre-orders')) {
            return false;
        }
        if (settings('currencies').includes(currency_code)) {
            if (type === 'all_except') {
                canMakePayment = !settings('exceptCountries').includes(country);
            } else if (type === 'specific') {
                canMakePayment = settings('specificCountries').includes(country);
            } else {
                canMakePayment = countries.length > 0 ? countries.includes(country) : true;
            }
        }
        if (callback && canMakePayment) {
            canMakePayment = callback({settings, billingAddress, cartTotals, ...props});
        }
    }
    return canMakePayment;
}

export const LocalPaymentIntentContent = (props) => {
    const {getData, billing, cartData} = props;
    const name = getData('name');
    const {extensions} = cartData;
    const {cartTotal, currency} = billing;

    let ELEMENT_OPTIONS = {
        mode: 'payment',
        currency: currency?.code?.toLowerCase(),
        ...extensions[name].elementOptions
    }

    if (['payment', 'subscription'].includes(ELEMENT_OPTIONS.mode)) {
        ELEMENT_OPTIONS.amount = cartTotal.value;
    }

    return (
        <Elements stripe={loadStripe} options={ELEMENT_OPTIONS}>
            <PaymentMethodContent {...props}/>
        </Elements>
    )
}

export const LocalPaymentSourceContent = (props) => {
    return (
        <Elements stripe={loadStripe}>
            <LocalPaymentSourceMethod {...props}/>
        </Elements>
    )
}

const LocalPaymentSourceMethod = (
    {
        getData,
        billing,
        shippingData,
        emitResponse,
        eventRegistration,
        getSourceArgs = false,
        element = false
    }) => {
    const {shippingAddress} = shippingData;
    const {onPaymentSetup, onCheckoutFail} = eventRegistration;
    const onChange = (event) => {
        setIsValid(event.complete);
    }
    const {setIsValid} = useCreateSource({
        getData,
        billing,
        shippingAddress,
        onPaymentSetup,
        emitResponse,
        getSourceArgs,
        element
    });

    if (element) {
        return (
            <LocalPaymentElementContainer
                name={getData('name')}
                options={getData('paymentElementOptions')}
                onChange={onChange}
                element={element}/>
        )
    }
    return null;
}

const PaymentMethodContent = (
    {
        getData,
        billing,
        emitResponse,
        shouldSavePayment,
        eventRegistration,
        activePaymentMethod,
        shouldCreatePaymentMethod = true
    }) => {
    const name = getData('name');
    const displayName = '';
    const {billingAddress} = billing;
    const {onCheckoutSuccess, onCheckoutFail} = eventRegistration;

    const PAYMENT_ELEMENT_OPTIONS = {
        defaultValues: {
            billingDetails: {
                phone: billingAddress.phone,
                email: billingAddress.email,
                name: `${billingAddress.first_name} ${billingAddress.last_name}`,
                address: {
                    country: billingAddress.country,
                    state: billingAddress.state
                }
            }
        },
        fields: {
            billingDetails: {address: 'never', name: 'never', email: 'never'}
        },
        wallets: {applePay: 'never', googlePay: 'never'},
        ...getData('paymentElementOptions')
    }


    useProcessCheckoutError({
        emitResponse,
        subscriber: onCheckoutFail,
        messageContext: emitResponse.noticeContexts.PAYMENTS
    });

    useCreatePaymentMethod({
        name,
        emitResponse,
        billingAddress,
        shouldSavePayment,
        eventRegistration,
        shouldCreatePaymentMethod
    });

    useProcessCheckoutSuccess({
        name,
        emitResponse,
        billingAddress,
        onCheckoutSuccess,
        activePaymentMethod,
    });

    const onChange = (event) => {
    };

    return (
        <PaymentElement options={PAYMENT_ELEMENT_OPTIONS} onChange={onChange}/>
    )
}