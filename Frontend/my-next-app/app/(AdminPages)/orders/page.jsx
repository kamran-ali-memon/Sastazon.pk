'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '../../../src/Utils/Api.js'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [message, setMessage] = useState('')

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true)

      const res = await api.get('/api/orders/admin/all-orders')

      if (res.data?.status) {
        setOrders(
          Array.isArray(res.data?.myAllOrders)
            ? res.data.myAllOrders
            : []
        )
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      setMessage('')

      // IMPORTANT:
      // Backend endpoint:
      // /api/orders/admin/update-order-status/:orderId
      const res = await api.put(
        `/api/orders/admin/update-order-status/${orderId}`,
        {
          status: newStatus
        }
      )

      if (res.data?.status) {
        setMessage('Order Status update ho gaya!')

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  orderStatus: newStatus
                }
              : order
          )
        )

        setTimeout(() => {
          setMessage('')
        }, 3000)
      } else {
        toast.error(
          res.data?.message ||
            'Status Could not be Updated.'
        )
      }
    } catch (error) {
      console.error('Status update error:', error)

      toast.error(
        error?.response?.data?.message ||
          'Status Could not be Updated.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-[#111111] p-5">

          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight">
              Sastazon
              <span className="text-[#e85d04]">.pk</span>
            </h2>

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">
              Admin Panel
            </p>
          </div>

          <nav className="space-y-2">

            <Link
              href="/admindashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              <span>▣</span>
              Dashboard
            </Link>

            <Link
              href="/admin-products"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              <span>◈</span>
              Products
            </Link>

            <Link
              href="/add-product"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              <span>＋</span>
              Add Product
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-3 rounded-xl bg-[#e85d04] px-4 py-3 text-sm font-medium"
            >
              <span>□</span>
              Orders
            </Link>

            <Link
              href="/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              <span>◎</span>
              Customers
            </Link>

          </nav>
        </aside>

        {/* Main Section */}
        <section className="flex-1 min-w-0">

          {/* Header */}
          <header className="border-b border-white/10 bg-[#0f0f0f] px-5 sm:px-8 py-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#e85d04] uppercase">
              Sales
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              Order Management
            </h1>
          </header>

          <div className="p-5 sm:p-8">

            {/* Success Message */}
            {message && (
              <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                {message}
              </div>
            )}

            {/* Orders Table */}
            <div className="rounded-xl border border-white/10 bg-[#151515] overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full text-left min-w-[750px]">

                  <thead className="bg-[#101010]">
                    <tr>

                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">
                        Order ID
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">
                        Total Amount
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 text-right">
                        Update Status
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">

                    {/* Loading */}
                    {loading ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-gray-500 text-sm"
                        >
                          Orders loading...
                        </td>
                      </tr>

                    ) : orders.length > 0 ? (

                      orders.map((ord) => (

                        <tr
                          key={ord._id}
                          className="hover:bg-white/[0.02]"
                        >

                          {/* Order ID */}
                          <td className="px-6 py-4 font-medium text-white">
                            #{ord._id?.substring(0, 8)}
                          </td>

                          {/* Payment */}
                          <td className="px-6 py-4 text-sm text-gray-400 uppercase">
                            {ord.paymentMethod || 'COD'}
                          </td>

                          {/* Total */}
                          <td className="px-6 py-4 text-sm font-semibold text-[#e85d04]">
                            Rs. {ord.totalAmount}
                          </td>

                          {/* Current Status */}
                          <td className="px-6 py-4 text-sm">

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-green-500/10 text-green-400'
                                  : ord.orderStatus === 'Cancelled'
                                  ? 'bg-red-500/10 text-red-400'
                                  : ord.orderStatus === 'Shipped'
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : ord.orderStatus === 'Confirmed'
                                  ? 'bg-purple-500/10 text-purple-400'
                                  : 'bg-orange-500/10 text-[#e85d04]'
                              }`}
                            >
                              {ord.orderStatus || 'Pending'}
                            </span>

                          </td>

                          {/* Update Status */}
                          <td className="px-6 py-4 text-right">

                            <select
                              value={ord.orderStatus || 'Pending'}
                              disabled={updatingId === ord._id}
                              onChange={(e) =>
                                handleStatusChange(
                                  ord._id,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-1.5 text-xs text-white focus:border-[#e85d04] focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="Confirmed">
                                Confirmed
                              </option>

                              <option value="Shipped">
                                Shipped
                              </option>

                              <option value="Delivered">
                                Delivered
                              </option>

                              <option value="Cancelled">
                                Cancelled
                              </option>

                            </select>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-gray-500 text-sm"
                        >
                          Koi orders nahi mile.
                        </td>
                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  )
}
