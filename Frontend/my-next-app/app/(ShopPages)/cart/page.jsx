'use client'

import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { CartContext } from '../../../src/Context/CartContext.jsx'


export default function CartPage() {

    const {
        cart,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useContext(CartContext)

    const [error, setError] = useState('')


    function getProductId(item) {

        return item?.product?._id || item?.product
    }


    async function handleQuantityChange(
        item,
        newQuantity
    ) {

        const productId = getProductId(item)

        if (!productId) {
            setError('Product ID not found.')
            return
        }


        if (newQuantity < 1) {

            await removeFromCart(productId)

            setError('')

            return
        }


        const stock = Number(
            item?.product?.productStock ??
            item?.productStock ??
            0
        )


        if (
            stock > 0 &&
            newQuantity > stock
        ) {

            setError(
                `Only ${stock} items available in stock.`
            )

            return
        }


        setError('')

        await updateQuantity(
            productId,
            newQuantity
        )
    }


    async function handleRemove(item) {

        const productId = getProductId(item)

        if (!productId) {
            setError('Product ID not found.')
            return
        }

        setError('')

        await removeFromCart(productId)
    }


    if (cart.length === 0) {

        return (

            <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-white">

                <div className="text-center">

                    <h1 className="text-3xl font-bold">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-3 text-gray-400">
                        Add some products to your cart.
                    </p>

                    <Link
                        href="/products"
                        className="mt-6 inline-block rounded-xl bg-[#e85d04] px-6 py-3 text-sm font-semibold hover:bg-[#ff6b0a]"
                    >
                        Start Shopping
                    </Link>

                </div>

            </main>
        )
    }


    return (

        <main className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white">

            <div className="mx-auto max-w-5xl">

                <Link
                    href="/products"
                    className="text-sm text-gray-400 hover:text-[#e85d04]"
                >
                    ← Continue Shopping
                </Link>


                <h1 className="mt-5 text-3xl font-bold">
                    Shopping Cart
                </h1>


                {error && (

                    <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
                    </div>

                )}


                <div className="mt-8 space-y-4">

                    {cart.map((item) => {

                        const product = item?.product

                        const productId =
                            product?._id || product

                        const name =
                            item?.name ||
                            product?.productname ||
                            'Unnamed Product'

                        const price =
                            Number(
                                item?.price ??
                                product?.productPrice ??
                                0
                            )

                        const image =
                            item?.image ||
                            product?.productImages?.[0] ||
                            '/product-placeholder.svg'

                        const stock =
                            Number(
                                product?.productStock ??
                                item?.productStock ??
                                0
                            )

                        const quantity =
                            Number(item?.quantity || 1)


                        return (

                            <div
                                key={item._id}
                                className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#151515] p-5 sm:flex-row sm:items-center"
                            >

                                {/* PRODUCT IMAGE */}

                                <img
                                    src={image}
                                    alt={name}
                                    className="h-24 w-24 rounded-xl bg-[#202020] object-cover"
                                />


                                {/* PRODUCT DETAILS */}

                                <div className="flex-1">

                                    <h2 className="font-semibold">
                                        {name}
                                    </h2>

                                    <p className="mt-1 text-[#e85d04]">
                                        Rs. {price.toLocaleString()}
                                    </p>

                                    {stock > 0 && (

                                        <p className="mt-1 text-xs text-gray-500">
                                            Stock: {stock}
                                        </p>

                                    )}

                                </div>


                                {/* QUANTITY */}

                                <div className="flex items-center gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(
                                                item,
                                                quantity - 1
                                            )
                                        }
                                        className="rounded-lg bg-[#252525] px-3 py-2 transition hover:bg-[#333]"
                                    >
                                        -
                                    </button>


                                    <span className="min-w-[25px] text-center font-medium">
                                        {quantity}
                                    </span>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(
                                                item,
                                                quantity + 1
                                            )
                                        }
                                        disabled={
                                            stock > 0 &&
                                            quantity >= stock
                                        }
                                        className="rounded-lg bg-[#252525] px-3 py-2 transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        +
                                    </button>

                                </div>


                                {/* ITEM TOTAL */}

                                <div className="min-w-[110px] text-right">

                                    <p className="font-semibold text-white">
                                        Rs. {(price * quantity).toLocaleString()}
                                    </p>

                                </div>


                                {/* REMOVE */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemove(item)
                                    }
                                    className="text-sm text-red-400 transition hover:text-red-300"
                                >
                                    Remove
                                </button>

                            </div>

                        )
                    })}

                </div>


                {/* CART TOTAL */}

                <div className="mt-8 rounded-2xl border border-white/10 bg-[#151515] p-6">

                    <div className="flex items-center justify-between">

                        <span className="text-gray-400">
                            Total
                        </span>

                        <span className="text-2xl font-bold text-[#e85d04]">
                            Rs. {Number(cartTotal || 0).toLocaleString()}
                        </span>

                    </div>


                    <Link
                        href="/checkout"
                        className="mt-6 block w-full rounded-xl bg-[#e85d04] py-4 text-center font-semibold transition hover:bg-[#ff6b0a]"
                    >
                        Proceed to Checkout
                    </Link>

                </div>

            </div>

        </main>
    )
}
