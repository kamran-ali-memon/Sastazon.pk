'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'

import api from '../Utils/Api.js'
import { AuthContext } from './AuthContext.jsx'
import toast from 'react-hot-toast'


export const CartContext = createContext({
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    cartCount: 0,
    cartTotal: 0,
    cartLoading: true
})


export function CartProvider({ children }) {

    const {
        user,
        loading: authLoading
    } = useContext(AuthContext)

    const [cart, setCart] = useState([])
    const [cartLoading, setCartLoading] = useState(true)


    async function fetchCart() {

        if (!user) {
            setCart([])
            setCartLoading(false)
            return
        }

        try {

            setCartLoading(true)

            const response = await api.get(
                '/api/carts/get-my-cart'
            )

            const cartItems =
                response.data?.myCart?.cartItems || []

            setCart(cartItems)

        } catch (error) {

            if (error?.response?.status === 401) {
                setCart([])
            } else {
                console.log(
                    'Cart Fetch Error:',
                    error?.response?.data?.message
                )
            }

        } finally {

            setCartLoading(false)

        }
    }


    useEffect(() => {

        if (!authLoading) {
            fetchCart()
        }

    }, [user, authLoading])


  async function addToCart(product, quantity = 1) {
    if (!user) {
        toast.error('Please login first to add products to cart.')
        return false
    }

    if (!product?._id) {
        toast.error('Product information is missing.')
        return false
    }

    const stock = Number(product.productStock ?? 0)

    if (stock <= 0) {
        toast.error('This product is currently out of stock.')
        return false
    }

    const existingItem = cart.find((item) => {
        const existingProductId =
            item?.product?._id || item?.product

        return String(existingProductId) === String(product._id)
    })

    const currentQuantity = Number(existingItem?.quantity || 0)
    const requestedQuantity = Number(quantity)

    if (currentQuantity + requestedQuantity > stock) {
        toast.error(`Only ${stock} items available in stock.`)
        return false
    }

    try {
        const response = await api.post(
            '/api/carts/add-to-cart',
            {
                productId: product._id,
                quantity: requestedQuantity
            }
        )

        const updatedCart =
            response.data?.cart?.cartItems || []

        setCart(updatedCart)

        toast.success('Product added to cart!')

        return true

    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            'Unable to add product to cart.'
        )

        return false
    }
}


    async function removeFromCart(productId) {

        try {

            const response = await api.delete(
                `/api/carts/remove-cart-item/${productId}`
            )

            const updatedCart =
                response.data?.cart?.cartItems || []

            setCart(updatedCart)

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                'Unable to remove product.'
            )
        }
    }


    async function updateQuantity(
        productId,
        quantity
    ) {

        if (quantity < 1) {
            await removeFromCart(productId)
            return
        }

        try {

            const response = await api.put(
                `/api/carts/update-cart/${productId}`,
                {
                    quantity
                }
            )

            const updatedCart =
                response.data?.cart?.cartItems || []

            setCart(updatedCart)

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                'Unable to update quantity.'
            )
        }
    }


    async function clearCart() {

        try {

            await api.delete('/api/carts')

            setCart([])

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                'Unable to clear cart.'
            )
        }
    }


    const cartCount = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    )


    const cartTotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 0),
        0
    )


    return (

        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                cartLoading
            }}
        >
            {children}
        </CartContext.Provider>

    )
}
