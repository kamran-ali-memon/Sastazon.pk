'use client'

import React, { useContext } from 'react'
import Link from 'next/link'

import { CartContext } from '../Context/CartContext.jsx'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {

    const { addToCart } = useContext(CartContext)

    const id = product?._id

    const name =
        product?.productname ||
        'Unnamed Product'

    const price =
        Number(product?.productPrice || 0)

    const category =
        product?.productCategory ||
        'Product'

    const image =
        product?.productImages?.[0]

    const stock =
        Number(product?.productStock || 0)

    const isOutOfStock = stock <= 0


    async function handleAddToCart() {

        if (!product) {
            return
        }

        if (isOutOfStock) {
            toast.error('This product is currently out of stock.')
            return
        }

        await addToCart(product, 1)
    }


    return (

        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151515] shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#e85d04]/50">

            <Link href={`/productdetail/${id}`}>

                <div className="relative h-56 overflow-hidden bg-[#202020]">

                    {image ? (

                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                    ) : (

                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                            No Image
                        </div>

                    )}

                </div>

            </Link>


            <div className="p-5">

                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#888]">
                    {category}
                </p>


                <Link href={`/productdetail/${id}`}>

                    <h3 className="min-h-[48px] line-clamp-2 text-lg font-semibold text-white transition hover:text-[#e85d04]">
                        {name}
                    </h3>

                </Link>


                <div className="mt-5 flex items-center justify-between gap-3">

                    <div>

                        <p className="text-xl font-bold text-[#e85d04]">
                            Rs. {price.toLocaleString()}
                        </p>

                        {isOutOfStock && (
                            <p className="mt-1 text-xs text-red-400">
                                Out of Stock
                            </p>
                        )}

                    </div>


                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="rounded-lg bg-[#e85d04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff6b0a] active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-600"
                    >
                        {isOutOfStock
                            ? 'Out of Stock'
                            : 'Add'
                        }
                    </button>

                </div>

            </div>

        </div>
    )
}
