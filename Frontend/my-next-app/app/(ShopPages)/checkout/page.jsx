'use client'

import React, { useContext, useEffect, useState } from 'react'
import api from '../../../src/Utils/Api.js'
import { useRouter } from 'next/navigation'
import { CartContext } from '../../../src/Context/CartContext.jsx'
import toast from 'react-hot-toast'

export default function Checkout() {

    const [cartItemsData, setCartItemsData] = useState([])
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    const { clearCart } = useContext(CartContext)


    const fetchCart = async () => {

        try {

            const { data } = await api.get(
                '/api/carts/get-my-cart'
            )

            setCartItemsData(
                data?.myCart?.cartItems || []
            )

        } catch (error) {

            console.log(
                error?.response?.data?.message ||
                'Cart Fetch Error'
            )

            setCartItemsData([])

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {
        fetchCart()
    }, [])


    const totalPrice = cartItemsData.reduce(
        (total, item) => {

            const price =
                Number(item?.price || 0)

            const quantity =
                Number(item?.quantity || 0)

            return total + price * quantity

        },
        0
    )


    const orderPlacing = async (e) => {

        e.preventDefault()

        if (!address.trim()) {
            toast('Please enter your delivery address.')
            return
        }

        if (!phone.trim()) {
            toast('Please enter your phone number.')
            return
        }

        if (cartItemsData.length === 0) {
            toast('Your cart is empty.')
            return
        }


        const orderItems = cartItemsData.map((item) => {

            return {
                product: item.product?._id || item.product,
                name: item.name,
                quantity: Number(item.quantity),
                price: Number(item.price),
                image: item.image || ''
            }

        })


        try {

            setSubmitting(true)

            const response = await api.post(
                '/api/orders/createorder',
                {
                    orderItems,
                    shippingAddress: {
                        address: address.trim(),
                        phone: Number(phone)
                    },
                    paymentMethod: 'cod'
                }
            )


            if (response.data?.status) {

                await clearCart()

                toast.success('Order Placed Successfully!')

                router.push('/myorder')

            } else {

                toast.error(
                    response.data?.message ||
                    'Order Placement Failed'
                )
            }

        } catch (error) {

            console.log(
                error?.response?.data?.message ||
                'Order Placement Failed'
            )

            toast.error(
                error?.response?.data?.message ||
                'Order Placement Failed'
            )

        } finally {

            setSubmitting(false)

        }
    }


    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">

                <div className="flex flex-col items-center gap-3">

                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>

                    <p className="text-sm font-medium text-gray-400">
                        Preparing checkout...
                    </p>

                </div>

            </div>
        )
    }


    return (

        <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-gray-100 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-6xl">

                <div className="border-b border-zinc-800 pb-6">

                    <h1 className="text-3xl font-extrabold tracking-tight text-white">

                        Checkout{' '}

                        <span className="text-orange-500">
                            Details
                        </span>

                    </h1>

                    <p className="mt-1 text-sm text-gray-400">
                        Provide your delivery details to complete your order
                    </p>

                </div>


                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">


                    {/* SHIPPING INFORMATION */}

                    <div className="rounded-2xl border border-zinc-800/80 bg-[#121212] p-6 sm:p-8 lg:col-span-7">

                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">

                            <svg
                                className="h-5 w-5 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />

                            </svg>

                            Shipping Information

                        </h2>


                        <form
                            onSubmit={orderPlacing}
                            className="space-y-6"
                        >


                            {/* ADDRESS */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-300">

                                    Full Delivery Address{' '}

                                    <span className="text-orange-500">
                                        *
                                    </span>

                                </label>

                                <textarea
                                    value={address}
                                    required
                                    rows={4}
                                    placeholder="House/Apartment #, Street, Area, City..."
                                    onChange={(e) =>
                                        setAddress(e.target.value)
                                    }
                                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/80 p-4 text-sm text-white outline-none placeholder:text-zinc-500 transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                />

                            </div>


                            {/* PHONE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-300">

                                    Phone Number{' '}

                                    <span className="text-orange-500">
                                        *
                                    </span>

                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    required
                                    placeholder="03XXXXXXXXX"
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 p-4 text-sm text-white outline-none placeholder:text-zinc-500 transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                />

                            </div>


                            {/* PAYMENT METHOD */}

                            <div>

                                <label className="mb-3 block text-sm font-medium text-gray-300">

                                    Payment Method

                                </label>

                                <div className="rounded-xl border border-orange-500/40 bg-orange-500/10 p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-black">

                                            💵

                                        </div>

                                        <div>

                                            <p className="font-semibold text-white">
                                                Cash on Delivery
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                Pay when you receive your package
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* INFO */}

                            <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-gray-400">

                                <svg
                                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />

                                </svg>

                                <span>
                                    Currently accepting Cash on Delivery (COD). Pay when you receive your package.
                                </span>

                            </div>


                            {/* PLACE ORDER */}

                            <button
                                type="submit"
                                disabled={
                                    submitting ||
                                    cartItemsData.length === 0
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-extrabold text-black shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {submitting
                                    ? 'Placing Order...'
                                    : `Place Order — Rs. ${totalPrice.toLocaleString()}`
                                }

                            </button>

                        </form>

                    </div>


                    {/* ORDER SUMMARY */}

                    <div className="lg:col-span-5">

                        <div className="sticky top-6 rounded-2xl border border-zinc-800/80 bg-[#121212] p-6">

                            <h2 className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3 text-xl font-bold text-white">

                                <span>
                                    Order Summary
                                </span>

                                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-orange-400">
                                    {cartItemsData.length} items
                                </span>

                            </h2>


                            <div className="max-h-72 space-y-4 overflow-y-auto pr-1">

                                {cartItemsData.map((item) => {

                                    const product =
                                        item?.product

                                    const productPrice =
                                        Number(item?.price || 0)

                                    const quantity =
                                        Number(item?.quantity || 0)

                                    const productTotal =
                                        productPrice * quantity


                                    return (

                                        <div
                                            key={item._id}
                                            className="flex items-center justify-between gap-3 text-sm"
                                        >

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">

                                                    {item?.image ? (

                                                        <img
                                                            src={item.image}
                                                            alt={
                                                                item?.name ||
                                                                'Product'
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />

                                                    ) : (

                                                        <span className="text-[10px] text-zinc-500">
                                                            Item
                                                        </span>

                                                    )}

                                                </div>


                                                <div className="min-w-0">

                                                    <p className="truncate font-medium text-white">
                                                        {item?.name ||
                                                            product?.productname ||
                                                            'Unnamed Product'}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        Qty: {quantity}
                                                    </p>

                                                </div>

                                            </div>


                                            <span className="flex-shrink-0 font-semibold text-gray-200">

                                                Rs. {productTotal.toLocaleString()}

                                            </span>

                                        </div>

                                    )
                                })}

                            </div>


                            <div className="my-5 border-t border-zinc-800"></div>


                            <div className="space-y-2.5 text-sm">

                                <div className="flex justify-between text-gray-400">

                                    <span>
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-white">
                                        Rs. {totalPrice.toLocaleString()}
                                    </span>

                                </div>


                                <div className="flex justify-between text-gray-400">

                                    <span>
                                        Shipping
                                    </span>

                                    <span className="font-medium text-green-400">
                                        Free
                                    </span>

                                </div>

                            </div>


                            <div className="my-4 border-t border-zinc-800"></div>


                            <div className="flex items-center justify-between text-lg font-bold">

                                <span className="text-white">
                                    Total Amount
                                </span>

                                <span className="text-xl text-orange-500">
                                    Rs. {totalPrice.toLocaleString()}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}
