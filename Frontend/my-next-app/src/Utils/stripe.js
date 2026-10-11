import api from './Api.js'

/**
 * Starts Stripe-hosted Checkout through the trusted application server.
 * The Stripe secret key must only exist on the server.
 */

export async function createStripeCheckoutSession({
    shippingAddress
} = {}) {

    const { data } = await api.post(
        '/api/payments/checkout-session',
        {
            shippingAddress
        }
    )

    const checkoutUrl =
        data?.url ||
        data?.checkoutUrl

    if (
        !checkoutUrl ||
        !/^https:\/\/.+/i.test(checkoutUrl)
    ) {
        throw new Error(
            'The payment service did not return a secure Stripe Checkout URL.'
        )
    }

    return checkoutUrl
}
