'use client'

import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../../../src/Context/AuthContext.jsx'
import api from '../../../src/Utils/Api.js'


export default function Login() {

    const router = useRouter()

    const { login } =
        useContext(AuthContext)


    const [userData, setUserData] = useState({
        email: '',
        password: ''
    })


    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')


    
async function handleLogin(e) {

    e.preventDefault()

    setError('')
    setLoading(true)

    try {

        const response = await api.post(
            '/api/auth/login',
            userData
        )

        const data = response.data


        // =========================
        // ACCOUNT NOT VERIFIED
        // =========================

        if (data?.requiresVerification) {

            router.push(
                `/verifyotp?email=${encodeURIComponent(data.email)}`
            )

            return
        }


        // =========================
        // SAVE USER IN AUTH CONTEXT
        // =========================

        login(data.user)


        // =========================
        // ADMIN / NORMAL USER
        // =========================

        if (data.user.role === 'admin') {

            router.push('/admindashboard')

        } else {

            router.push('/')
        }


    } catch (error) {

        setError(
            error?.response?.data?.message ||
            'Login failed. Please check your email and password.'
        )

    } finally {

        setLoading(false)
    }
}




    return (

        <main className="min-h-screen bg-[#111111] px-4 py-10 text-white">

            <div className="mx-auto max-w-5xl">

                {/* Brand */}

                <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">

                    <Link
                        href="/"
                        className="text-xl font-bold"
                    >
                        Sastazon
                        <span className="text-[#e85d04]">
                            .pk
                        </span>
                    </Link>


                    <Link
                        href="/"
                        className="text-sm text-gray-400 hover:text-[#e85d04]"
                    >
                        Back to Shop
                    </Link>

                </div>


                <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] lg:grid-cols-2">

                    {/* Left */}

                    <div className="bg-[#e85d04] p-8 sm:p-12">

                        <p className="text-xs font-semibold tracking-[0.2em] text-white/80">
                            WELCOME BACK
                        </p>

                        <h1 className="mt-5 text-4xl font-semibold leading-tight">
                            Good finds.
                            <br />
                            Right where you left them.
                        </h1>

                        <p className="mt-6 max-w-sm text-sm leading-6 text-white/80">
                            Log in to continue shopping,
                            check your orders and discover
                            something you will love.
                        </p>

                    </div>


                    {/* Right */}

                    <div className="p-6 sm:p-10 lg:p-14">

                        <div className="mx-auto max-w-md">

                            <p className="text-xs font-semibold tracking-[0.2em] text-[#e85d04]">
                                LOGIN
                            </p>

                            <h2 className="mt-3 text-3xl font-bold">
                                Welcome back
                            </h2>

                            <p className="mt-3 text-sm text-gray-400">
                                Enter your details to access your account.
                            </p>


                            {error && (

                                <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                                    {error}
                                </div>

                            )}


                            <form
                                onSubmit={handleLogin}
                                className="mt-8 space-y-5"
                            >

                                <div>

                                    <label className="mb-2 block text-sm text-gray-300">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                email: e.target.value
                                            })
                                        }
                                        placeholder="Enter your email"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-[#252525] px-4 py-3.5 text-sm outline-none placeholder:text-gray-600 focus:border-[#e85d04]"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm text-gray-300">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        value={userData.password}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                password: e.target.value
                                            })
                                        }
                                        placeholder="Enter your password"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-[#252525] px-4 py-3.5 text-sm outline-none placeholder:text-gray-600 focus:border-[#e85d04]"
                                    />

                                </div>


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-[#e85d04] py-3.5 text-sm font-semibold transition hover:bg-[#ff6b0a] disabled:opacity-50"
                                >
                                    {loading
                                        ? 'Logging in...'
                                        : 'Login'
                                    }
                                </button>

                            </form>


                            <div className="mt-8 border-t border-white/10 pt-6 text-center">

                                <p className="text-sm text-gray-500">

                                    Don't have an account?

                                    <Link
                                        href="/register"
                                        className="ml-2 font-semibold text-white hover:text-[#e85d04]"
                                    >
                                        Sign Up
                                    </Link>

                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                <p className="mt-6 text-center text-xs text-gray-600">
                    © 2026 Sastazon.pk. Good finds, better prices.
                </p>

            </div>

        </main>

    )

}
