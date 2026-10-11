
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '../../../src/Utils/Api.js'
import toast from 'react-hot-toast'

export default function Register() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const router = useRouter()

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const { data } = await api.post(
                '/api/auth/register',
                userData
            )

            toast.success(data.message)

            router.push(
                `/verifyotp?email=${encodeURIComponent(userData.email)}`
            )
        } catch (error) {
            console.log(
                error?.response?.data?.message ||
                'Registration failed'
            )
        }
    }

    return (
     <main className="min-h-screen bg-[#111111e3] px-4 py-10 sm:py-16">

    <div className="mx-auto max-w-6xl">

        {/* Brand */}
        <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5">

            <Link
                href="/"
                className="text-xl font-bold tracking-tight text-white"
            >
                Sastazon<span className="text-[#e85d04]">.pk</span>
            </Link>

            <Link
                href="/"
                className="text-sm text-[#999] transition-colors duration-300 hover:text-[#e85d04]"
            >
                Back to shop
            </Link>

        </div>


        {/* Register Card */}
        <div className="grid min-h-600px overflow-hidden rounded-2rem border border-white/10 bg-[#1a1a1a] shadow-[0_15px_50px_rgba(0,0,0,0.35)] lg:grid-cols-2">


            {/* Left Section */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-[#e85d04] p-8 text-white sm:p-12 lg:p-14">

                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/20" />

                <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/10" />

                <div className="relative">

                    <span className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-white/80">
                        <span className="h-2 w-2 rounded-full bg-white" />
                        WELCOME DEAR CUSTOMER
                    </span>

                    <h1 className="max-w-md text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                        Good finds.
                        <br />
                        Right where you left them.
                    </h1>

                    <p className="mt-6 max-w-sm text-sm leading-6 text-white/80">
                        Join us today and create your account in just a few steps.
                    </p>

                </div>


                <div className="relative mt-16">

                    <div className="mb-5 h-px w-16 bg-white/50" />

                    <p className="max-w-xs text-sm leading-6 text-white/75">
                        Everyday upgrades, little luxuries,
                        and good finds — all in one place.
                    </p>

                </div>

            </div>


            {/* Right Section */}
            <div className="flex items-center bg-[#1a1a1a] p-6 sm:p-10 lg:p-14">

                <div className="mx-auto w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-8">

                        <span className="text-xs font-semibold tracking-[0.2em] text-[#e85d04]">
                            REGISTER
                        </span>

                        <p className="mt-3 text-xl leading-6 text-[#999]">
                            Enter your details to create your
                            Sastazon account.
                        </p>

                    </div>


                    {/* Form */}
                    <form
                        onSubmit={handleRegister}
                        className="space-y-5"
                    >

                        {/* Username */}
                        <div>

                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-[#d0d0d0]"
                            >
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={userData.username}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        username: e.target.value
                                    })
                                }
                                required
                                className="w-full rounded-xl border border-white/10 bg-[#252525] px-4 py-3.5 text-sm text-white outline-none placeholder:text-[#777] transition-all duration-300 hover:border-white/20 focus:border-[#e85d04] focus:bg-[#292929] focus:ring-2 focus:ring-[#e85d04]/10"
                            />

                        </div>


                        {/* Email */}
                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-[#d0d0d0]"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={userData.email}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        email: e.target.value
                                    })
                                }
                                required
                                className="w-full rounded-xl border border-white/10 bg-[#252525] px-4 py-3.5 text-sm text-white outline-none placeholder:text-[#777] transition-all duration-300 hover:border-white/20 focus:border-[#e85d04] focus:bg-[#292929] focus:ring-2 focus:ring-[#e85d04]/10"
                            />

                        </div>


                        {/* Password */}
                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-[#d0d0d0]"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={userData.password}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        password: e.target.value
                                    })
                                }
                                required
                                className="w-full rounded-xl border border-white/10 bg-[#252525] px-4 py-3.5 text-sm text-white outline-none placeholder:text-[#777] transition-all duration-300 hover:border-white/20 focus:border-[#e85d04] focus:bg-[#292929] focus:ring-2 focus:ring-[#e85d04]/10"
                            />

                        </div>


                        {/* Button */}
                        <button
                            type="submit"
                            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff6b0a] hover:shadow-lg hover:shadow-[#e85d04]/20 active:translate-y-0"
                        >

                            <span>Register Account</span>

                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>

                        </button>

                    </form>


                    {/* Login */}
                    <div className="mt-8 border-t border-white/10 pt-6 text-center">

                        <p className="text-sm text-[#888]">
                            Already have an account?

                            <Link
                                href="/login"
                                className="ml-2 font-semibold text-white transition-colors duration-300 hover:text-[#e85d04]"
                            >
                                Login
                            </Link>
                        </p>

                    </div>

                </div>

            </div>

        </div>


        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#666]">
            © 2026 Sastazon.pk. Good finds, better prices.
        </p>

    </div>

</main>
    )
}
