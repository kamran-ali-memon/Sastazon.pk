'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '../../../src/Utils/Api.js'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch all users using admin endpoint
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/dashboard/all-users') 
      if (res.data?.users) {
        setUsers(res.data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setErrorMsg(error?.response?.data?.message || 'Users load nahi ho sake.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
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
            <Link href="/admindashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition">
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
            <Link href="/users" className="flex items-center gap-3 rounded-xl bg-[#e85d04] px-4 py-3 text-sm font-medium">
              <span>◎</span> Customers
            </Link>
          </nav>
        </aside>

        {/* Main Section */}
        <section className="flex-1 min-w-0">
          <header className="border-b border-white/10 bg-[#0f0f0f] px-5 sm:px-8 py-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#e85d04] uppercase">User Base</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">All Registered Users</h1>
          </header>

          <div className="p-5 sm:p-8">
            {errorMsg && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {errorMsg}
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-[#151515] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-[#101010]">
                    <tr>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Username</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Email</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Role</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-500 text-sm">Users loading...</td>
                      </tr>
                    ) : users.length > 0 ? (
                      users.map((usr) => (
                        <tr key={usr._id} className="hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-[#e85d04]/20 text-[#e85d04] flex items-center justify-center font-bold text-sm uppercase">
                                {usr.username ? usr.username[0] : 'U'}
                              </div>
                              <span className="font-medium text-white">{usr.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{usr.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium uppercase ${usr.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-gray-500/10 text-gray-400'}`}>
                              {usr.role || 'user'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {usr.isVerified ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Unverified
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-500 text-sm">
                          Koi users nahi mile.
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
