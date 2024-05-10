import {registerPaymentMethod} from '@woocommerce/blocks-registry';
import {PaymentMethod, PaymentMethodLabel} from "../../components/checkout";
import {canMakePayment, LocalPaymentIntentContent} from "./local-payment-method";
import {getSettings} from "../util";

const getData = getSettings('stripe_paynow_data');

if (getData()) {
    registerPaymentMethod({
        name: getData('name'),
        label: <PaymentMethodLabel
            title={getData('title')}
            paymentMethod={getData('name')}
            icons={getData('icon')}/>,
        ariaLabel: 'PayNow',
        placeOrderButtonLabel: getData('placeOrderButtonLabel'),
        canMakePayment: canMakePayment(getData),
        content: <PaymentMethod content={LocalPaymentIntentContent} getData={getData}/>,
        edit: <PaymentMethod content={LocalPaymentIntentContent} getData={getData}/>,
        supports: {
            showSavedCards: false,
            showSaveOption: false,
            features: getData('features')
        }
    })
}