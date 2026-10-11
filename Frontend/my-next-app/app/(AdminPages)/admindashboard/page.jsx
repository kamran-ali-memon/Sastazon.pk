'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '../../../src/Utils/Api.js'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    allUsers: 0,
    allProducts: 0,
    allOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        const res = await api.get('/api/admin/dashboard') 
        if (res.data?.status) {
          setStats({
            allUsers: res.data.allUsers || 0,
            allProducts: res.data.allProducts || 0,
            allOrders: res.data.allOrders || 0,
            totalRevenue: res.data.totalRevenue || 0,
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-[#111111] p-5">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight">
              Sastazon<span className="text-[#e85d04]">.pk</span>
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">Admin Panel</p>
          </div>

          <nav className="space-y-2">
            <Link href="/admindashboard" className="flex items-center gap-3 rounded-xl bg-[#e85d04] px-4 py-3 text-sm font-medium">
              <span>▣</span> Dashboard
            </Link>
            <Link href="/admin-products" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition">
              <span>◈</span> Products
            </Link>
            <Link href="/add-product" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition">
              <span>＋</span> Add Product
            </Link>
            <Link href="/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition">
              <span>□</span> Orders
            </Link>
            <Link href="/users" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition">
              <span>◎</span> Customers
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 min-w-0">
          <header className="border-b border-white/10 bg-[#0f0f0f] px-5 sm:px-8 py-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#e85d04] uppercase">Overview</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">Dashboard Overview</h1>
          </header>

          <div className="p-5 sm:p-8 space-y-8">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Total Revenue */}
              <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total Revenue</p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-[#e85d04]">
                  {loading ? '...' : `Rs. ${stats.totalRevenue.toLocaleString()}`}
                </h3>
                <p className="text-xs text-gray-500 mt-2">Calculated from total orders</p>
              </div>

              {/* Card 2: Total Orders */}
              <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total Orders</p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-white">
                  {loading ? '...' : stats.allOrders}
                </h3>
                <p className="text-xs text-gray-500 mt-2">Placed orders count</p>
              </div>

              {/* Card 3: Total Products */}
              <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total Products</p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-white">
                  {loading ? '...' : stats.allProducts}
                </h3>
                <p className="text-xs text-gray-500 mt-2">Active inventory items</p>
              </div>

              {/* Card 4: Customers */}
              <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Customers</p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-white">
                  {loading ? '...' : stats.allUsers}
                </h3>
                <p className="text-xs text-gray-500 mt-2">Registered users with 'user' role</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="rounded-xl border border-white/10 bg-[#151515] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <p className="text-xs text-gray-400 mt-1">Manage products and check incoming orders instantly.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/add-product" className="rounded-xl bg-[#e85d04] px-4 py-2 text-sm font-medium hover:bg-[#ff7a22] transition">
                  ＋ Add Product
                </Link>
                <Link href="/orders" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition">
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
