
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '../../../src/Utils/Api.js'
import toast from 'react-hot-toast'

function VerifyOtpForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const email = searchParams.get('email')

    const [otp, setOtp] = useState('')
    const [timer, setTimer] = useState(120)
    const [canResend, setCanResend] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)

            return () => clearInterval(interval)
        } else {
            setCanResend(true)
        }
    }, [timer])

    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    const handleVerify = async (e) => {
        e.preventDefault()

        if (!email) {
            setMessage('Email not found. Please register again.')
            return
        }

        if (!otp) {
            setMessage('Please enter the OTP code.')
            return
        }

        try {
            setLoading(true)
            setMessage('')

            const res = await api.post('/api/auth/verify-otp', {
                email,
                otp
            })

            toast.success(res.data?.message || 'OTP Verified! Please Login.')
            router.push('/login')
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Invalid OTP code.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (!email) {
            setMessage('Email not found. Please register again.')
            return
        }

        try {
            setLoading(true)
            setMessage('')

            const res = await api.post('/api/auth/resend-otp', {
                email
            })

            toast.success(res.data?.message || 'New OTP sent to your email!')

            setTimer(120)
            setCanResend(false)
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Failed to resend OTP.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#151515] border border-white/10 rounded-2xl p-6 space-y-6">

                <div className="text-center">
                    <h1 className="text-xl font-bold">Verify Email</h1>

                    <p className="text-xs text-gray-400 mt-1">
                        OTP sent to:{' '}
                        <span className="text-[#e85d04]">
                            {email || 'Email not found'}
                        </span>
                    </p>
                </div>

                {message && (
                    <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-2">
                            Enter 6-Digit OTP
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                setOtp(value.slice(0, 6))
                            }}
                            className="w-full text-center tracking-[0.5em] text-lg bg-[#0b0b0b] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e85d04]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#e85d04] hover:bg-[#ff7a22] text-white py-3 rounded-xl text-sm font-medium transition disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Verify OTP'}
                    </button>
                </form>

                <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/5">
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={loading}
                            className="text-[#e85d04] font-medium hover:underline disabled:opacity-50"
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <p>
                            Resend available in{' '}
                            <span className="text-white font-mono">
                                {formattedTime}
                            </span>
                        </p>
                    )}
                </div>

            </div>
        </main>
    )
}

export default function VerifyOtp() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center p-4">
                    <p className="text-sm text-gray-400">
                        Loading verification page...
                    </p>
                </main>
            }
        >
            <VerifyOtpForm />
        </Suspense>
    )
}