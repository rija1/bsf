import {useEffect, useRef} from '@wordpress/element';
import {useElements, useStripe} from "@stripe/react-stripe-js";
import {handleNextAction, isNextActionRequired} from "../util";

export const useProcessCheckoutSuccess = (
    {
        name,
        emitResponse,
        billingAddress,
        onCheckoutSuccess,
        activePaymentMethod,
    }) => {

    const currentData = useRef({emitResponse, billingAddress});
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        currentData.current = {...currentData.current, billingAddress, emitResponse};
    }, [emitResponse, billingAddress]);

    useEffect(() => {
        const unsubscribe = onCheckoutSuccess(async ({redirectUrl}) => {
            let args;
            if (activePaymentMethod === name) {
                if ((args = isNextActionRequired(redirectUrl))) {
                    const {billingAddress, emitResponse} = currentData.current;
                    return await handleNextAction({
                        args,
                        stripe,
                        elements,
                        emitResponse,
                        billingAddress
                    })
                }
            }
        });
        return unsubscribe;
    }, [
        stripe,
        elements,
        onCheckoutSuccess,
        activePaymentMethod
    ]);
}