import {getSetting} from '@woocommerce/settings';
import {PaymentMethodMessagingElement, Elements} from "@stripe/react-stripe-js";
import {registerPlugin} from '@wordpress/plugins';
import {ExperimentalOrderMeta, TotalsWrapper} from '@woocommerce/blocks-checkout';
import {initStripe, isCartPage} from "../../../payment-methods/util";
import {SilentErrorBoundary} from "../../../components/shared";

const data = getSetting('stripeBNPLCart_data').stripe_klarna;

if (isCartPage() && data && data.cartEnabled) {
    const KlarnaCartMessage = ({cart}) => {
        const {cartTotals} = cart;
        const options = {
            amount: parseInt(cartTotals.total_price),
            currency: cartTotals.currency_code,
            paymentMethodTypes: ['klarna'],
            ...data.messageOptions
        };

        if (options.currency?.length) {
            return (
                <SilentErrorBoundary>
                    <TotalsWrapper>
                        <div className={'wc-block-components-totals-item wc-stripe-cart-message-container stripe_klarna'}>
                            <PaymentMethodMessagingElement options={options}/>
                        </div>
                    </TotalsWrapper>
                </SilentErrorBoundary>
            )
        }
        return null;
    }
    const render = () => {
        const Component = (props) => (
            <Elements stripe={initStripe} options={data.elementOptions}>
                <KlarnaCartMessage {...props}/>
            </Elements>
        );

        return (
            <ExperimentalOrderMeta>
                <Component/>
            </ExperimentalOrderMeta>
        )
    }
    registerPlugin('wc-stripe-blocks-klarna', {render, scope: 'woocommerce-checkout'});
}