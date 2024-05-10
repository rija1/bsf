import {useEffect, useCallback, useRef} from '@wordpress/element';
import {useProcessCheckoutError} from './hooks';
import {handleCardAction, handleNextAction, isNextActionRequired, initStripe} from "./util";

const SavedCardComponent = (
    {
        eventRegistration,
        emitResponse,
        billing,
        getData,
        confirmation_method = 'automatic'
    }) => {
    const {onCheckoutSuccess, onCheckoutFail} = eventRegistration;
    const {billingAddress} = billing;
    const currentData = useRef({emitResponse, billingAddress});

    useEffect(() => {
        currentData.current = {...currentData.current, emitResponse, billingAddress};
    }, [
        emitResponse,
        billingAddress
    ]);

    useProcessCheckoutError({
        emitResponse,
        subscriber: onCheckoutFail,
        messageContext: emitResponse.noticeContexts.PAYMENTS
    })
    const handleSuccessResult = useCallback(async ({redirectUrl}) => {
        const {emitResponse, billingAddress} = currentData.current;
        if (confirmation_method === 'automatic') {
            let args;
            if ((args = isNextActionRequired(redirectUrl))) {
                const stripe = await initStripe;
                return await handleNextAction({
                    args,
                    stripe,
                    emitResponse,
                    billingAddress
                });
            }
        } else {
            return await handleCardAction({
                redirectUrl,
                getData,
                emitResponse
            });
        }
    }, [
        confirmation_method
    ]);

    useEffect(() => {
        const unsubscribe = onCheckoutSuccess(handleSuccessResult);
        return () => unsubscribe();
    }, [onCheckoutSuccess, handleSuccessResult]);
    return null;
}

export default SavedCardComponent;
