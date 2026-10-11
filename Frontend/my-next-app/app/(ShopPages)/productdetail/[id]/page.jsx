'use client'

import React, {
    useEffect,
    useState,
    useContext
} from 'react'

import { useParams, useRouter } from 'next/navigation'

import api from '../../../../src/Utils/Api.js'

import { CartContext } from '../../../../src/Context/CartContext.jsx'

import toast from 'react-hot-toast'

import {
    getProductName,
    getProductPrice,
    getProductImage
} from '../../../../src/Utils/product.js'

export default function ProductDetail() {

    const params = useParams()
    const router = useRouter()

    const { addToCart } =
        useContext(CartContext)

    const id = params?.id

    const [product, setProduct] =
        useState(null)

    const [quantity, setQuantity] =
        useState(1)

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {

        if (!id) return

        async function getProduct() {

            try {

                const response =
                    await api.get(
                        `/api/products/${id}`
                    )

                setProduct(
                    response.data?.product ||
                    response.data
                )

            } catch (error) {

                console.error(
                    'Product Detail Error:',
                    error?.response?.data ||
                    error.message
                )

                setProduct(null)

            } finally {

                setLoading(false)

            }
        }

        getProduct()

    }, [id])

async function handleAddToCart() {
    if (!product) return

    if (isOutOfStock) {
        toast.error('This product is currently out of stock.')
        return
    }

    await addToCart(product, quantity)
}

    function increaseQuantity() {

        const stock =
            Number(product?.productStock || 0)

        if (quantity < stock) {
            setQuantity(quantity + 1)
        }
    }

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">

                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e85d04] border-t-transparent"></div>

            </div>
        )
    }

    if (!product) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-white">

                <div className="text-center">

                    <h1 className="text-2xl font-bold">
                        Product Not Found
                    </h1>

                    <p className="mt-2 text-gray-400">
                        This product does not exist.
                    </p>

                    <button
                        onClick={() =>
                            router.push('/products')
                        }
                        className="mt-6 rounded-xl bg-[#e85d04] px-6 py-3 text-sm font-semibold"
                    >
                        Back to Shop
                    </button>

                </div>

            </div>
        )
    }

    const name =
        getProductName(product)

    const price =
        Number(getProductPrice(product) || 0)

    const image =
        getProductImage(product)

    const description =
        product?.productDesc ||
        'No description available.'

    const stock =
        Number(product?.productStock || 0)

    const isOutOfStock =
        stock <= 0

    return (

        <main className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white">

            <div className="mx-auto max-w-6xl">

                <button
                    onClick={() =>
                        router.push('/products')
                    }
                    className="mb-6 text-sm text-gray-400 hover:text-[#e85d04]"
                >
                    ← Back to Shop
                </button>

                <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#151515] md:grid-cols-2">

                    <div className="flex min-h-[400px] items-center justify-center bg-[#202020] p-6">

                        <img
                            src={
                                image ||
                                '/product-placeholder.svg'
                            }
                            alt={name}
                            className="max-h-[500px] w-full object-contain"
                        />

                    </div>

                    <div className="p-6 sm:p-10">

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e85d04]">
                            {product.productCategory ||
                                'Product'}
                        </p>

                        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                            {name}
                        </h1>

                        <p className="mt-5 text-3xl font-bold text-[#e85d04]">
                            Rs. {price.toLocaleString()}
                        </p>

                        <div className="my-6 border-t border-white/10"></div>

                        <p className="text-sm leading-7 text-gray-400">
                            {description}
                        </p>

                        <p className="mt-5 text-sm text-gray-400">

                            Available Stock:{' '}

                            <span
                                className={
                                    stock > 0
                                        ? 'text-white'
                                        : 'text-red-400'
                                }
                            >
                                {stock}
                            </span>

                        </p>

                        <div className="mt-8">

                            <p className="mb-3 text-sm font-medium">
                                Quantity
                            </p>

                            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-white/10 bg-[#202020]">

                                <button
                                    onClick={() =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                quantity - 1
                                            )
                                        )
                                    }
                                    disabled={
                                        isOutOfStock ||
                                        quantity <= 1
                                    }
                                    className="px-5 py-3 text-lg hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    -
                                </button>

                                <span className="min-w-[50px] text-center">
                                    {quantity}
                                </span>

                                <button
                                    onClick={increaseQuantity}
                                    disabled={
                                        isOutOfStock ||
                                        quantity >= stock
                                    }
                                    className="px-5 py-3 text-lg hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className="mt-6 w-full rounded-xl bg-[#e85d04] px-6 py-4 font-semibold transition hover:bg-[#ff6b0a] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isOutOfStock
                                ? 'Out of Stock'
                                : 'Add To Cart'}
                        </button>

                    </div>

                </div>

            </div>

        </main>
    )
}