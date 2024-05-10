import {registerPaymentMethod} from '@woocommerce/blocks-registry';
import {getSettings} from '../util';
import {PaymentMethodLabel, PaymentMethod} from '../../components/checkout';
import SavedCardComponent from '../saved-card-component';
import {LocalPaymentIntentContent} from "../local-payment/local-payment-method";

const getData = getSettings('stripe_ach_data');

registerPaymentMethod({
    name: getData('name'),
    label: <PaymentMethodLabel
        title={getData('title')}
        paymentMethod={getData('name')}
        icons={getData('icons')}/>,
    ariaLabel: 'ACH Payment',
    canMakePayment: ({cartTotals}) => cartTotals.currency_code === 'USD' && getData('accountCountry') === 'US',
    content: <PaymentMethod content={LocalPaymentIntentContent} getData={getData}/>,
    edit: <PaymentMethod content={LocalPaymentIntentContent} getData={getData}/>,
    savedTokenComponent: <SavedCardComponent getData={getData}/>,
    placeOrderButtonLabel: getData('placeOrderButtonLabel'),
    supports: {
        showSavedCards: getData('showSavedCards'),
        showSaveOption: getData('showSaveOption'),
        features: getData('features')
    }
})