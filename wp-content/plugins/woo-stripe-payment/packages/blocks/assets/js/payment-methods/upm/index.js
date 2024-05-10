import {useEffect, useState, useCallback} from '@wordpress/element';
import {registerPaymentMethod} from '@woocommerce/blocks-registry';
import {Elements, PaymentElement, useStripe} from "@stripe/react-stripe-js";
import {Installments, PaymentMethod, PaymentMethodLabel} from "../../components/checkout";
import {getSettings, initStripe as loadStripe} from "../util";
import SavedCardComponent from "../saved-card-component";
import {useProcessCheckoutError} from "../hooks";
import {useCreatePaymentMethod, useProcessCheckoutSuccess} from "../hooks";

const getData = getSettings('stripe_upm_data');
const i18n = getData('i18n');

const PaymentMethodContent = (
    {
        billing,
        emitResponse,
        shouldSavePayment,
        eventRegistration,
        activePaymentMethod
    }) => {
    const name = getData('name');
    const installmentsActive = getData('installmentsActive');
    const stripe = useStripe();
    const [installmentData, setInstallmentData] = useState({complete: false, paymentMethodType: ''});
    const [shouldCreatePaymentMethod, setShouldCreatePaymentMethod] = useState(true);
    const {billingAddress} = billing;
    const {onCheckoutSuccess, onCheckoutFail} = eventRegistration;
    const {noticeContexts} = emitResponse;

    useProcessCheckoutError({
        emitResponse,
        subscriber: onCheckoutFail,
        messageContext: noticeContexts.PAYMENTS
    });

    const {
        paymentMethodType,
        createPaymentMethod,
        setPaymentMethodType,
        addPaymentMethodData
    } = useCreatePaymentMethod({
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

    const onPaymentElementChange = useCallback((event) => {
        const {value = null, complete = false} = event;
        if (value?.type) {
            setPaymentMethodType(value.type);
            setShouldCreatePaymentMethod(!['blik', 'boleto'].includes(value.type));
        }
        setInstallmentData({
            complete,
            paymentMethodType: value.type
        });
    }, []);

    const options = {
        defaultValues: {
            billingDetails: {
                phone: billingAddress.phone,
                email: billingAddress.email,
                name: `${billingAddress.first_name} ${billingAddress.last_name}`,
            }
        },
        fields: {
            billingDetails: {address: 'never', name: 'never', email: 'never'}
        },
        wallets: {applePay: 'never', googlePay: 'never'},
        ...getData('paymentElementOptions')
    }

    return (
        <>
            <PaymentElement options={options} onChange={onPaymentElementChange}/>
            <Installments
                active={installmentsActive}
                i18n={i18n}
                paymentMethodType={installmentData.paymentMethodType}
                stripe={stripe}
                cardFormComplete={installmentData.complete}
                createPaymentMethod={createPaymentMethod}
                onChange={(value) => addPaymentMethodData('_stripe_installment_plan', value)}/>
        </>
    )
}

const UniversalPaymentMethod = ({getData, ...props}) => {
    const {billing, cartData, shouldSavePayment} = props;
    const {extensions} = cartData;
    const {cartTotal, currency} = billing;
    let options = {
        mode: 'payment',
        currency: currency?.code?.toLowerCase(),
        ...extensions.stripe_upm.elementOptions
    }
    if (shouldSavePayment) {
        options.mode = 'subscription';
    }
    if (['payment', 'subscription'].includes(options.mode)) {
        options.amount = cartTotal.value;
    }

    return (
        <Elements stripe={loadStripe} options={options}>
            <PaymentMethodContent {...props}/>
        </Elements>
    )
}

registerPaymentMethod({
    name: getData('name'),
    label: <PaymentMethodLabel
        title={getData('title')}
        paymentMethod={getData('name')}
        icons={getData('icons')}/>,
    ariaLabel: 'Credit Cards',
    canMakePayment: () => loadStripe,
    content: <PaymentMethod content={UniversalPaymentMethod} getData={getData}/>,
    savedTokenComponent: <SavedCardComponent getData={getData} confirmation_method={'automatic'}/>,
    edit: <PaymentMethod content={UniversalPaymentMethod} getData={getData}/>,
    supports: {
        showSavedCards: getData('showSavedCards'),
        showSaveOption: getData('showSaveOption'),
        features: getData('features')
    }
})