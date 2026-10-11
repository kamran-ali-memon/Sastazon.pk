'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '../../../src/Utils/Api.js'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deletingId, setDeletingId] = useState(null)

    const fetchProducts = async () => {

        try {

            setLoading(true)
            setError('')

            const response =
                await api.get('/api/products/all-products')

            if (response.data?.status) {

                setProducts(response.data.allProducts || [])

            } else {

                setProducts([])

            }

        } catch (err) {

            console.error('Admin Products Error:', err)

            setError(
                err?.response?.data?.message ||
                'Unable to load products.'
            )

        } finally {

            setLoading(false)

        }

    }

    useEffect(() => {

        fetchProducts()

    }, [])

    const handleDelete = async (productId) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this product?'
        )

        if (!confirmed) return

        try {

            setDeletingId(productId)

            await api.delete(
                `/api/products/delete-product/${productId}`
            )

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) =>
                        product._id !== productId
                )
            )

            toast.success('Product deleted successfully!')
        } catch (err) {

            console.error('Delete Product Error:', err)

            toast.error(
                err?.response?.data?.message ||
                'Unable to delete product.'
            )

        } finally {

            setDeletingId(null)

        }

    }

    return (

        <main className="min-h-screen bg-[#0b0b0b] px-4 py-8 text-white sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#e85d04]">
                            Sastazon.pk Admin
                        </p>

                        <h1 className="text-3xl font-bold">
                            Products
                        </h1>

                        <p className="mt-1 text-sm text-gray-400">
                            Manage your product inventory.
                        </p>

                    </div>


                    <Link
                        href="/add-product"
                        className="inline-flex items-center justify-center rounded-xl bg-[#e85d04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6b0a]"
                    >
                        + Add Product
                    </Link>

                </div>

                {/* Error */}

                {error && (

                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

                        <p className="text-sm text-red-300">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={fetchProducts}
                            className="mt-3 rounded-lg bg-[#e85d04] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff6b0a]"
                        >
                            Try Again
                        </button>

                    </div>

                )}

                {/* Stats */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">

                        <p className="text-sm text-gray-400">
                            Total Products
                        </p>

                        <p className="mt-2 text-3xl font-bold text-white">
                            {products.length}
                        </p>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">

                        <p className="text-sm text-gray-400">
                            In Stock
                        </p>

                        <p className="mt-2 text-3xl font-bold text-[#e85d04]">
                            {
                                products.filter(
                                    (product) =>
                                        Number(product.productStock) > 0
                                ).length
                            }
                        </p>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">

                        <p className="text-sm text-gray-400">
                            Out of Stock
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-400">
                            {
                                products.filter(
                                    (product) =>
                                        Number(product.productStock) <= 0
                                ).length
                            }
                        </p>

                    </div>

                </div>

                {/* Products */}

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">

                    <div className="border-b border-white/10 px-5 py-4">

                        <h2 className="font-semibold text-white">
                            Product Inventory
                        </h2>

                    </div>

                    {loading ? (

                        <div className="p-8 text-center text-sm text-gray-400">
                            Loading products...
                        </div>

                    ) : products.length === 0 ? (

                        <div className="px-6 py-16 text-center">

                            <div className="mb-4 text-4xl">
                                📦
                            </div>

                            <h3 className="text-lg font-semibold">
                                No Products Yet
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                Add your first product to start
                                managing your inventory.
                            </p>

                            <Link
                                href="/add-product"
                                className="mt-5 inline-flex rounded-lg bg-[#e85d04] px-5 py-2.5 text-sm font-semibold hover:bg-[#ff6b0a]"
                            >
                                Add Product
                            </Link>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px] text-left">

                                <thead className="border-b border-white/10 bg-[#111111]">

                                    <tr>

                                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Product
                                        </th>

                                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Category
                                        </th>

                                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Price
                                        </th>

                                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Stock
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-white/10">

                                    {products.map((product) => {

                                        const image =
                                            product?.productImages?.[0]

                                        const stock =
                                            Number(
                                                product?.productStock || 0
                                            )

                                        return (

                                            <tr
                                                key={product._id}
                                                className="transition hover:bg-white/[0.02]"
                                            >

                                                {/* Product */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-4">

                                                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#202020]">

                                                            {image ? (

                                                                <img
                                                                    src={image}
                                                                    alt={product.productname}
                                                                    className="h-full w-full object-cover"
                                                                />

                                                            ) : (

                                                                <div className="flex h-full items-center justify-center text-xs text-gray-500">
                                                                    No image
                                                                </div>

                                                            )}

                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="max-w-[280px] truncate font-semibold text-white">
                                                                {product.productname}
                                                            </p>

                                                            <p className="mt-1 max-w-[280px] truncate text-xs text-gray-500">
                                                                {product.productSlug}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Category */}

                                                <td className="px-5 py-4">

                                                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
                                                        {product.productCategory || '—'}
                                                    </span>

                                                </td>

                                                {/* Price */}

                                                <td className="px-5 py-4">

                                                    <span className="font-semibold text-[#e85d04]">
                                                        Rs. {Number(
                                                            product.productPrice || 0
                                                        ).toLocaleString()}
                                                    </span>

                                                </td>

                                                {/* Stock */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={
                                                            stock > 0
                                                                ? 'rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400'
                                                                : 'rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400'
                                                        }
                                                    >
                                                        {stock > 0
                                                            ? `${stock} in stock`
                                                            : 'Out of stock'}
                                                    </span>

                                                </td>

                                                {/* Actions */}

                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        <Link
                                                            href={`/edit-product/${product._id}`}
                                                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-200 transition hover:border-[#e85d04]/40 hover:text-[#e85d04]"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                deletingId === product._id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(product._id)
                                                            }
                                                            className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {deletingId === product._id
                                                                ? 'Deleting...'
                                                                : 'Delete'}
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </main>

    )


}
