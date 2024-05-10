import {getSetting} from '@woocommerce/settings';
import {AffirmMessageElement, Elements} from "@stripe/react-stripe-js";
import {registerPlugin} from '@wordpress/plugins';
import {ExperimentalOrderMeta, TotalsWrapper} from '@woocommerce/blocks-checkout';
import {initStripe, isCartPage} from "../../../payment-methods/util";
import {SilentErrorBoundary} from "../../../components/shared";

const data = getSetting('stripeBNPLCart_data').stripe_affirm;

const isAvailable = ({amount, billingCountry = null, currency}) => {
    const requirements = data.requirements;
    const accountCountry = data.accountCountry;

    if (!billingCountry) {
        return currency in requirements
            && 5000 <= amount && amount <= 3000000;
    }

    return currency in requirements
        && accountCountry === billingCountry
        && 5000 <= amount && amount <= 3000000;
}

if (isCartPage() && data && data.cartEnabled) {
    const AffirmCartMessage = ({cart}) => {
        const {cartTotals} = cart;
        const options = {
            amount: parseInt(cartTotals.total_price),
            currency: cartTotals.currency_code,
            ...data.cartMessageOptions
        };
        if (isAvailable({amount: parseInt(cartTotals.total_price), currency: cartTotals.currency_code})) {
            return (
                <SilentErrorBoundary>
                    <TotalsWrapper>
                        <div className={'wc-block-components-totals-item wc-stripe-cart-message-container stripe_affirm'}>
                            <AffirmMessageElement options={options}/>
                        </div>
                    </TotalsWrapper>
                </SilentErrorBoundary>
            )
        }
        return null;
    }
    const render = () => {
        const Component = (props) => {
            return (
                <Elements stripe={initStripe} options={data.elementOptions}>
                    <AffirmCartMessage {...props}/>
                </Elements>
            )
        }
        return (
            <ExperimentalOrderMeta>
                <Component/>
            </ExperimentalOrderMeta>
        )
    }
    registerPlugin('wc-stripe-blocks-affirm', {render, scope: 'woocommerce-checkout'});
}