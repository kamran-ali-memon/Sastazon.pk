'use client'

import React, { useContext, useState } from 'react'
import Link from 'next/link'

import { AuthContext } from '../Context/AuthContext.jsx'
import { CartContext } from '../Context/CartContext.jsx'

export default function Navbar() {

    const { user, logout } = useContext(AuthContext)
    const { cartCount } = useContext(CartContext)

    const [menuOpen, setMenuOpen] = useState(false)

    const initials = user?.username
        ? user.username.substring(0, 2).toUpperCase()
        : ''

    const closeMenu = () => {
        setMenuOpen(false)
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                {/* LOGO */}

                <Link
                    href="/"
                    onClick={closeMenu}
                    className="text-xl font-bold text-white"
                >
                    Sastazon
                    <span className="text-[#e85d04]">
                        .pk
                    </span>
                </Link>


                {/* DESKTOP NAV */}

                <div className="hidden items-center gap-7 md:flex">

                    <Link
                        href="/"
                        className="text-sm text-white transition hover:text-[#e85d04]"
                    >
                        Home
                    </Link>

                    <Link
                        href="/products"
                        className="text-sm text-gray-400 transition hover:text-[#e85d04]"
                    >
                        Shop
                    </Link>


                    {/* ONLY LOGGED-IN USERS */}

                    {user && (
                        <Link
                            href="/myorder"
                            className="text-sm text-gray-400 transition hover:text-[#e85d04]"
                        >
                            My Orders
                        </Link>
                    )}


                    <Link
                        href="/cart"
                        className="text-sm text-gray-400 transition hover:text-[#e85d04]"
                    >
                        Cart ({cartCount})
                    </Link>

                </div>


                {/* RIGHT SIDE */}

                <div className="hidden items-center gap-3 md:flex">

                    {user ? (

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e85d04] text-xs font-bold">
                                {initials}
                            </div>

                            <span className="hidden text-sm text-gray-300 lg:block">
                                {user.username}
                            </span>

                            <button
                                onClick={logout}
                                className="text-xs text-gray-500 transition hover:text-white"
                            >
                                Logout
                            </button>

                        </div>

                    ) : (

                        <Link
                            href="/login"
                            className="rounded-lg border border-[#e85d04] px-4 py-2 text-sm font-medium text-[#e85d04] transition hover:bg-[#e85d04] hover:text-white"
                        >
                            Login
                        </Link>

                    )}

                </div>


                {/* MOBILE MENU BUTTON */}

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-300 md:hidden"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>

            </div>


            {/* MOBILE MENU */}

            {menuOpen && (

                <div className="border-t border-white/10 bg-[#0a0a0a] px-4 py-4 md:hidden">

                    <div className="mx-auto flex max-w-7xl flex-col gap-2">

                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-[#151515] hover:text-[#e85d04]"
                        >
                            Home
                        </Link>

                        <Link
                            href="/products"
                            onClick={closeMenu}
                            className="rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-[#151515] hover:text-[#e85d04]"
                        >
                            Shop
                        </Link>


                        {user && (
                            <Link
                                href="/myorder"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-[#151515] hover:text-[#e85d04]"
                            >
                                My Orders
                            </Link>
                        )}


                        <Link
                            href="/cart"
                            onClick={closeMenu}
                            className="rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-[#151515] hover:text-[#e85d04]"
                        >
                            Cart ({cartCount})
                        </Link>


                        {user ? (

                            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e85d04] text-xs font-bold">
                                        {initials}
                                    </div>

                                    <span className="text-sm text-gray-300">
                                        {user.username}
                                    </span>

                                </div>

                                <button
                                    onClick={() => {
                                        logout()
                                        closeMenu()
                                    }}
                                    className="text-xs text-gray-500 hover:text-white"
                                >
                                    Logout
                                </button>

                            </div>

                        ) : (

                            <Link
                                href="/login"
                                onClick={closeMenu}
                                className="mt-2 rounded-lg border border-[#e85d04] px-4 py-3 text-center text-sm font-medium text-[#e85d04] transition hover:bg-[#e85d04] hover:text-white"
                            >
                                Login
                            </Link>

                        )}

                    </div>

                </div>

            )}

        </nav>
    )
}
