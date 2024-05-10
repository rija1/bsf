import {useState, useEffect} from '@wordpress/element';
import {registerPaymentMethod} from '@woocommerce/blocks-registry';
import {getSettings, initStripe} from "../util";
import {LocalPaymentIntentContent} from './local-payment-method';
import {OffsiteNotice, PaymentMethod, PaymentMethodLabel} from "../../components/checkout";
import {canMakePayment} from "./local-payment-method";
import {PaymentMethodMessagingElement, Elements} from "@stripe/react-stripe-js";
import {SilentErrorBoundary} from "../../components/shared";

const getData = getSettings('stripe_klarna_data');

const dispatchKlarnaChange = (options) => {
    document.dispatchEvent(new CustomEvent('stripeKlarnaChange', {
        detail: {options}
    }));
}

const KlarnaPaymentMethodLabel = ({title, paymentMethod, icons, components}) => {
    const {PaymentMethodLabel: Label} = components;
    const [options, setOptions] = useState({
        amount: getData('cartTotals')?.value,
        currency: getData('currency'),
        paymentMethodTypes: ['klarna'],
        ...getData('messageOptions')
    });

    useEffect(() => {
        const updateOptions = (e) => {
            setOptions(e.detail.options);
        }
        document.addEventListener('stripeKlarnaChange', updateOptions);

        return () => document.removeEventListener('stripeKlarnaChange', updateOptions);
    }, []);

    if (!getData('paymentSections').includes('checkout')) {
        return (
            <PaymentMethodLabel
                paymentMethod={paymentMethod}
                title={title}
                icons={icons}
                components={components}/>
        )
    }

    return (
        <div className={'wc-stripe-label-container'}>
            <Label text={title}/>
            <div className={'wc-stripe-klarna-message-container'}>
                <SilentErrorBoundary>
                    <Elements stripe={initStripe} options={getData('elementOptions')}>
                        <PaymentMethodMessagingElement options={options}/>
                    </Elements>
                </SilentErrorBoundary>
            </div>
        </div>
    )
}

if (getData()) {
    registerPaymentMethod({
        name: getData('name'),
        label: <KlarnaPaymentMethodLabel
            title={getData('title')}
            paymentMethod={getData('name')}
            icons={getData('icon')}/>,
        ariaLabel: 'Klarna',
        placeOrderButtonLabel: getData('placeOrderButtonLabel'),
        canMakePayment: canMakePayment(getData, ({settings, billingAddress, cartTotals}) => {
            const {country} = billingAddress;
            const {currency_code: currency} = cartTotals;
            const requiredParams = settings('requiredParams');
            const amount = parseInt(cartTotals.total_price);
            const {currency_code} = cartTotals;

            dispatchKlarnaChange({
                amount: amount,
                currency: currency_code,
                countryCode: country
            });

            return [currency] in requiredParams && requiredParams[currency].includes(country);
        }),
        content: <PaymentMethod content={LocalPaymentIntentContent} getData={getData}/>,
        edit: <PaymentMethod content={LocalPaymentIntentContent} getData={getData}/>,
        supports: {
            showSavedCards: false,
            showSaveOption: false,
            features: getData('features')
        }
    })
}