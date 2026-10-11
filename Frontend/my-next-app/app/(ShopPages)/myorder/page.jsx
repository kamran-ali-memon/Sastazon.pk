
'use client'

import React, {
    useEffect,
    useState
} from 'react'

import Link from 'next/link'

import api from '../../../src/Utils/Api.js'


export default function MyOrder() {

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)


    const fetchOrders = async () => {

        try {

            const { data } = await api.get(
                '/api/orders/my-orders'
            )

            // Backend returns: data.myOrders
            setOrders(
                Array.isArray(data?.myOrders)
                    ? data.myOrders
                    : []
            )

        } catch (error) {

            console.log(
                error?.response?.data?.message ||
                'Orders Fetch Error'
            )

            setOrders([])

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {

        fetchOrders()

    }, [])


    const getStatusBadge = (
        status = 'Pending'
    ) => {

        const statusLower =
            status.toLowerCase()


        if (statusLower === 'delivered') {

            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'

        }


        if (statusLower === 'cancelled') {

            return 'bg-red-500/10 text-red-400 border-red-500/20'

        }


        if (
            statusLower === 'shipped' ||
            statusLower === 'confirmed'
        ) {

            return 'bg-blue-500/10 text-blue-400 border-blue-500/20'

        }


        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }


    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">

                <div className="flex flex-col items-center gap-3">

                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>

                    <p className="text-sm font-medium text-gray-400">
                        Loading your orders...
                    </p>

                </div>

            </div>

        )
    }


    return (

        <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-gray-100 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-5xl">

                {/* HEADER */}

                <div className="border-b border-zinc-800 pb-6">

                    <h1 className="text-3xl font-extrabold tracking-tight text-white">

                        My Orders{' '}

                        <span className="text-orange-500">
                            ({orders.length})
                        </span>

                    </h1>

                    <p className="mt-1 text-sm text-gray-400">
                        Track and manage your order history
                    </p>

                </div>


                {/* EMPTY ORDERS */}

                {orders.length === 0 ? (

                    <div className="mt-12 rounded-2xl border border-zinc-800/80 bg-[#121212] px-4 py-16 text-center">

                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-orange-500">

                            <svg
                                className="h-10 w-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />

                            </svg>

                        </div>


                        <h2 className="text-xl font-bold text-white">
                            No Orders Placed Yet
                        </h2>


                        <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
                            When you place orders, they will show up here.
                        </p>


                        <Link
                            href="/products"
                            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-black shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600"
                        >
                            Start Shopping
                        </Link>

                    </div>

                ) : (

                    /* ORDERS */

                    <div className="mt-8 space-y-6">

                        {orders.map((order) => {

                            const items =
                                Array.isArray(order.itemDetail)
                                    ? order.itemDetail
                                    : []


                            const orderDate =
                                order.createdAt


                            const shippingAddress =
                                order.shippingAddress?.address ||
                                'No address specified'


                            const phone =
                                order.shippingAddress?.phone


                            return (

                                <div
                                    key={order._id}
                                    className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121212] transition-all hover:border-zinc-700"
                                >

                                    {/* ORDER HEADER */}

                                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5">

                                        <div className="flex flex-wrap items-center gap-3">

                                            <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 font-mono text-xs font-semibold text-orange-400">

                                                ID: #

                                                {order._id
                                                    ? order._id
                                                        .slice(-8)
                                                        .toUpperCase()
                                                    : 'N/A'}

                                            </span>


                                            <span className="text-xs text-gray-400">

                                                {orderDate
                                                    ? new Date(
                                                        orderDate
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }
                                                    )
                                                    : 'Date unavailable'}

                                            </span>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusBadge(
                                                order.orderStatus
                                            )}`}
                                        >

                                            {order.orderStatus ||
                                                'Pending'}

                                        </span>

                                    </div>


                                    {/* ORDER ITEMS */}

                                    <div className="space-y-4 p-4 sm:p-5">

                                        <div className="divide-y divide-zinc-800/60">

                                            {items.map((item, idx) => {

                                                const product =
                                                    item?.product


                                                const productName =
                                                    item?.name ||
                                                    product?.productname ||
                                                    'Unnamed Item'


                                                const productPrice =
                                                    Number(
                                                        item?.price ??
                                                        product?.productPrice ??
                                                        0
                                                    )


                                                const productImage =
                                                    item?.image ||
                                                    product?.productImages?.[0] ||
                                                    ''


                                                const quantity =
                                                    Number(
                                                        item?.quantity || 0
                                                    )


                                                return (

                                                    <div
                                                        key={
                                                            item?._id ||
                                                            idx
                                                        }
                                                        className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                                                    >

                                                        {/* PRODUCT */}

                                                        <div className="flex min-w-0 items-center gap-3">

                                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">

                                                                {productImage ? (

                                                                    <img
                                                                        src={
                                                                            productImage
                                                                        }
                                                                        alt={
                                                                            productName
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

                                                                <h4 className="truncate text-sm font-semibold text-white">

                                                                    {productName}

                                                                </h4>


                                                                <p className="mt-0.5 text-xs text-gray-400">

                                                                    Rs.{' '}

                                                                    {productPrice.toLocaleString()}

                                                                    {' × '}

                                                                    <span className="font-medium text-orange-400">
                                                                        {quantity}
                                                                    </span>

                                                                </p>

                                                            </div>

                                                        </div>


                                                        {/* ITEM TOTAL */}

                                                        <span className="flex-shrink-0 text-sm font-bold text-gray-200">

                                                            Rs.{' '}

                                                            {(
                                                                productPrice *
                                                                quantity
                                                            ).toLocaleString()}

                                                        </span>

                                                    </div>

                                                )

                                            })}

                                        </div>


                                        {/* SHIPPING + TOTAL */}

                                        <div className="flex flex-col justify-between gap-4 border-t border-zinc-800 pt-4 text-sm sm:flex-row sm:items-end">

                                            {/* ADDRESS */}

                                            <div className="max-w-md text-xs text-gray-400">

                                                <span className="mb-1 block font-semibold text-gray-300">
                                                    Delivery Address:
                                                </span>


                                                <p className="line-clamp-2">
                                                    {shippingAddress}
                                                </p>


                                                {phone && (

                                                    <p className="mt-1">
                                                        Phone: {phone}
                                                    </p>

                                                )}

                                            </div>


                                            {/* TOTAL */}

                                            <div className="flex items-center justify-between gap-3 sm:justify-end">

                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                    Total Amount:
                                                </span>


                                                <span className="text-xl font-extrabold text-orange-500">

                                                    Rs.{' '}

                                                    {Number(
                                                        order.totalAmount || 0
                                                    ).toLocaleString()}

                                                </span>

                                            </div>

                                        </div>


                                        {/* PAYMENT */}

                                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/60 pt-3 text-xs">

                                            <span className="text-gray-500">
                                                Payment:
                                            </span>

                                            <span className="font-semibold uppercase text-gray-300">
                                                {order.paymentMethod || 'COD'}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                )}

            </div>

        </div>

    )
}
