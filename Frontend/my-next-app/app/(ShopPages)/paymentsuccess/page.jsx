'use client'

import Link from 'next/link'

export default function PaymentSuccess() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-[#121212] border border-zinc-800/80 p-8 rounded-2xl shadow-xl">
        
        {/* Checkmark Icon */}
        <div className="text-6xl text-green-500 mb-6 font-light">
          ✓
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-400 mb-8">
          Thank you for your order. Your payment has been
          completed successfully.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/myorder"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] text-sm"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-gray-200 font-semibold rounded-xl transition-all active:scale-[0.98] text-sm"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  )
}
