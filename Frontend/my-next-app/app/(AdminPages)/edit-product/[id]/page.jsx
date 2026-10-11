'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import api from '../../../../src/Utils/Api.js'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id // URL se product ki ID uthayi

  // 1. Form ki simple state
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // 2. Page khulte hi purana product fetch karke inputs mein bharna
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await api.get(`/api/products/${productId}`)
        const item = res.data.product || res.data

        if (item) {
          setTitle(item.productname || '')
          setPrice(item.productPrice || '')
          setStock(item.productStock || '')
          setCategory(item.productCategory || '')
          setDescription(item.productDesc || '')
        }
      } catch (error) {
        console.log('Data fetch error:', error)
        setMessage('Product details load nahi ho sakain.')
      } finally {
        setLoading(false)
      }
    }

    if (productId) getProduct()
  }, [productId])

  // 3. Form submit hone par backend par update request bhejna
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('Updating...')

    try {
      const productSlug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')

      const dataToUpdate = {
        productname: title,
        productSlug: productSlug,
        productPrice: Number(price),
        productStock: Number(stock),
        productCategory: category,
        productDesc: description,
      }
      const res = await api.put(`/api/products/update-product/${productId}`, dataToUpdate)

      if (res.data?.status) {
        setMessage('Product Update Ho Gaya!')
        setTimeout(() => {
          router.push('/admin-products') // Wapas products page par redirect
        }, 1200)
      }
    } catch (error) {
      console.log('Update error:', error)
      setMessage('Update fail ho gaya. Dobara try karein.')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <p>Loading Product Data...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white p-6 sm:p-10">
      <div className="max-w-2xl mx-auto border border-white/10 bg-[#151515] p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Edit Product</h1>
          <Link href="/admin-products" className="text-xs text-gray-400 hover:text-white">
            ← Back to Products
          </Link>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-white/10 text-sm rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0b0b0b] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#e85d04]"
            />
          </div>

          {/* Price, Stock, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Price (PKR)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#e85d04]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Stock</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#e85d04]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#e85d04]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              rows="4"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0b0b0b] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#e85d04]"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#e85d04] hover:bg-[#ff7a22] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Save Changes
            </button>
            <Link
              href="/admin-products"
              className="bg-white/5 hover:bg-white/10 text-gray-300 px-5 py-2.5 rounded-lg text-sm transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}