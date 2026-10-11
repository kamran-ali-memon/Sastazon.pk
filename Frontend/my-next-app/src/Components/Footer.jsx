'use client'

import React, { useContext } from 'react'
import Link from 'next/link'

import { AuthContext } from '../Context/AuthContext.jsx'

export default function Footer() {

    const { user } = useContext(AuthContext)

    return (

        <footer className="border-t border-white/10 bg-[#111111]">

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* BRAND */}

                    <div>

                        <Link
                            href="/"
                            className="text-xl font-bold text-white"
                        >
                            Sastazon
                            <span className="text-[#e85d04]">
                                .pk
                            </span>
                        </Link>

                        <p className="mt-3 max-w-xs text-sm leading-6 text-gray-500">
                            Good finds, better prices. Discover
                            everyday products in one place.
                        </p>

                    </div>


                    {/* SHOP */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            Shop
                        </h3>

                        <div className="mt-4 flex flex-col gap-3">

                            <Link
                                href="/products"
                                className="text-sm text-gray-500 transition hover:text-[#e85d04]"
                            >
                                All Products
                            </Link>

                            <Link
                                href="/products?category=Fashion"
                                className="text-sm text-gray-500 transition hover:text-[#e85d04]"
                            >
                                Fashion
                            </Link>

                            <Link
                                href="/products?category=Electronics"
                                className="text-sm text-gray-500 transition hover:text-[#e85d04]"
                            >
                                Electronics
                            </Link>

                            <Link
                                href="/products?category=Home%20%26%20Living"
                                className="text-sm text-gray-500 transition hover:text-[#e85d04]"
                            >
                                Home & Living
                            </Link>

                        </div>

                    </div>


                    {/* ACCOUNT */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            Account
                        </h3>

                        <div className="mt-4 flex flex-col gap-3">

                            {user && (
                                <Link
                                    href="/myorder"
                                    className="text-sm text-gray-500 transition hover:text-[#e85d04]"
                                >
                                    My Orders
                                </Link>
                            )}

                            <Link
                                href="/cart"
                                className="text-sm text-gray-500 transition hover:text-[#e85d04]"
                            >
                                Cart
                            </Link>

                            {!user && (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm text-gray-500 transition hover:text-[#e85d04]"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="text-sm text-gray-500 transition hover:text-[#e85d04]"
                                    >
                                        Create Account
                                    </Link>
                                </>
                            )}

                        </div>

                    </div>


                    {/* INFORMATION */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            Sastazon.pk
                        </h3>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            Shop smart, discover more and enjoy
                            a simple shopping experience.
                        </p>

                    </div>

                </div>


                {/* BOTTOM */}

                <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">

                    <p>
                        © 2026 Sastazon.pk. All rights reserved.
                    </p>

                    <p>
                        Built for a better shopping experience.
                    </p>

                </div>

            </div>

        </footer>
    )
}
