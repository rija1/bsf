import {getSetting} from '@woocommerce/settings';
import {AfterpayClearpayMessageElement, Elements} from "@stripe/react-stripe-js";
import {registerPlugin} from '@wordpress/plugins';
import {ExperimentalOrderMeta, TotalsWrapper} from '@woocommerce/blocks-checkout';
import {initStripe, isCartPage} from "../../../payment-methods/util";
import {SilentErrorBoundary} from "../../../components/shared";

const data = getSetting('stripeBNPLCart_data').stripe_afterpay;

const isAvailable = ({total, currency, country}) => {
    let available = false;
    const billingCountry = country;
    const requiredParams = data.requiredParams;
    const accountCountry = data.accountCountry;
    const requiredParamObj = requiredParams.hasOwnProperty(currency) ? requiredParams[currency] : false;
    if (requiredParamObj) {
        let countries = requiredParamObj?.[0];
        if (!Array.isArray(countries)) {
            countries = [countries];
        }
        available = countries.indexOf(accountCountry) > -1
            && (currency !== 'EUR' || !billingCountry || accountCountry === billingCountry)
            && (total > requiredParamObj?.[1] && total < requiredParamObj?.[2]);
    }
    return available;
}

if (isCartPage() && data && data.cartEnabled) {

    const AfterpayCartMessage = ({cart}) => {
        const {billingAddress} = cart;
        const {currency_code: currency, currency_minor_unit, total_price} = cart.cartTotals;
        const {country} = billingAddress;
        const total = parseInt(total_price) / (10 ** currency_minor_unit);
        const available = isAvailable({total, currency, country});
        if (available) {
            return (
                <SilentErrorBoundary>
                    <TotalsWrapper>
                        <div className={'wc-block-components-totals-item wc-stripe-cart-message-container stripe_afterpay'}>
                            <AfterpayClearpayMessageElement options={{
                                ...data.cartMessageOptions,
                                ...{amount: parseInt(total_price), currency, isCartEligible: true}
                            }}/>
                        </div>
                    </TotalsWrapper>
                </SilentErrorBoundary>
            )
        }
    }

    const render = (props) => {
        const Component = (props) => (
            <Elements stripe={initStripe} options={data.elementOptions}>
                <AfterpayCartMessage {...props}/>
            </Elements>
        );
        return (
            <ExperimentalOrderMeta>
                <Component/>
            </ExperimentalOrderMeta>
        )
    }
    registerPlugin('wc-stripe-blocks-afterpay', {render, scope: 'woocommerce-checkout'});
}