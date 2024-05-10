import {useState, useEffect, useRef, useCallback} from '@wordpress/element';
import {useElements, useStripe} from "@stripe/react-stripe-js";
import {ensureErrorResponse, ensureSuccessResponse, getBillingDetailsFromAddress} from "../util";

export const useCreatePaymentMethod = (
    {
        name,
        emitResponse,
        billingAddress,
        eventRegistration,
        shouldSavePayment,
        shouldCreatePaymentMethod = true
    }) => {
    const [paymentMethodType, setPaymentMethodType] = useState('');
    const {onPaymentSetup, onCheckoutSuccess} = eventRegistration;
    const stripe = useStripe();
    const elements = useElements();
    const currentData = useRef({billingAddress, paymentMethodData: {}});

    const addPaymentMethodData = useCallback((key, value) => {
        currentData.current.paymentMethodData = {...currentData.current.paymentMethodData, [key]: value};
    }, []);

    const createPaymentMethod = useCallback(async () => {
        const {billingAddress} = currentData.current;
        try {
            let result = await elements.submit();
            if (result.error) {
                throw result.error;
            }

            if (shouldCreatePaymentMethod) {
                result = await stripe.createPaymentMethod({
                    elements,
                    params: {
                        billing_details: getBillingDetailsFromAddress(billingAddress)
                    }
                });
                if (result.error) {
                    throw result.error;
                }
                return result.paymentMethod;
            }
            return {};
        } catch (error) {
            throw error;
        }
    }, [
        stripe,
        elements,
        shouldCreatePaymentMethod
    ]);

    useEffect(() => {
        currentData.current = {...currentData.current, billingAddress, paymentMethodType};
    }, [billingAddress, paymentMethodType]);

    useEffect(() => {
        const unsubscribe = onPaymentSetup((async () => {
            const {paymentMethodType} = currentData.current;
            try {
                const paymentMethod = await createPaymentMethod();
                return ensureSuccessResponse(emitResponse.responseTypes, {
                    meta: {
                        paymentMethodData: {
                            [`${name}_token_key`]: paymentMethod.id,
                            [`${name}_save_source_key`]: shouldSavePayment,
                            _stripe_payment_method_type: paymentMethodType,
                            ...currentData.current.paymentMethodData
                        }
                    }
                });
            } catch (error) {
                return ensureErrorResponse(
                    emitResponse.responseTypes,
                    error,
                    {
                        messageContext: emitResponse.noticeContexts.PAYMENTS
                    }
                );
            }
        }));
        return unsubscribe;
    }, [
        stripe,
        elements,
        onPaymentSetup,
        shouldSavePayment,
        createPaymentMethod
    ]);

    useEffect(() => {
        const unsubscribe = onCheckoutSuccess((async () => {

        }));
        return unsubscribe;
    }, [onCheckoutSuccess]);

    return {
        paymentMethodType,
        createPaymentMethod,
        setPaymentMethodType,
        addPaymentMethodData
    }
}