'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '../../../src/Utils/Api.js' // Apne API utility path ke mutabiq check karein

export default function AddProductPage() {
  const router = useRouter()

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  })

  // File Upload State (Max 5 images as per Multer backend upload.array('images', 5))
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  // UI States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle Input Text Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle File Inputs
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files)

    if (selectedFiles.length > 5) {
      setError('Aap Maximum 5 images upload kar sakte hain.')
      return
    }

    setImages(selectedFiles)
    setError('')

    // Generate preview URLs
    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews(previewUrls)
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (!formData.title || !formData.price || !formData.category) {
      setError('Please fill in all required fields (Title, Price, Category).')
      setLoading(false)
      return
    }

    if (images.length === 0) {
      setError('Select atleast one image.')
      setLoading(false)
      return
    }

    try {
      // Multipart Form Data for File Upload
      const data = new FormData()
      data.append('productname', formData.title)
      data.append('productDesc', formData.description)
      data.append('productPrice', formData.price)
      data.append('productCategory', formData.category)
      data.append('productStock', formData.stock)

       
      const productSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')

      data.append('productSlug', productSlug)



      // Append Images
      images.forEach((image) => {
        data.append('images', image)
      })

      // Hit Backend Route: POST /add-products
      const response = await api.post('/api/products/add-product', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 201 || response.status === 200) {
        setSuccess('Product Added successfully!')
        setTimeout(() => {
          router.push('/admin-products')
        }, 1500)
      }
    } catch (err) {
      console.error('Error adding product:', err)
      setError(
        err?.response?.data?.message || 'Something Went Wrong. Try Again.'
      )
    } finally {
      setLoading(false)
    }
  }

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
            <Link
              href="/admindashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              <span>▣</span> Dashboard
            </Link>

            <Link
              href="/admin-products"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              <span>◈</span> Products
            </Link>

            <Link
              href="/add-product"
              className="flex items-center gap-3 rounded-xl bg-[#e85d04] px-4 py-3 text-sm font-medium"
            >
              <span>＋</span> Add Product
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              <span>□</span> Orders
            </Link>

            <Link
              href="/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              <span>◎</span> Customers
            </Link>
          </nav>
        </aside>

        {/* Main Section */}
        <section className="flex-1 min-w-0">
          <header className="border-b border-white/10 bg-[#0f0f0f] px-5 sm:px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#e85d04] uppercase">Catalog</p>
                <h1 className="text-2xl sm:text-3xl font-bold mt-1">Add New Product</h1>
              </div>
              <Link
                href="/admin-products"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                ← Back to Products
              </Link>
            </div>
          </header>

          <div className="p-5 sm:p-8 max-w-4xl">
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Product Info */}
              <div className="rounded-xl border border-white/10 bg-[#151515] p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white mb-4">General Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                    className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white focus:border-[#e85d04] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write detailed product features and specifications..."
                    className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white focus:border-[#e85d04] focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="rounded-xl border border-white/10 bg-[#151515] p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2500"
                    className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white focus:border-[#e85d04] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Electronics, Fashion, etc."
                    className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white focus:border-[#e85d04] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="50"
                    className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white focus:border-[#e85d04] focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Images Upload */}
              <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
                <h2 className="text-lg font-semibold text-white mb-2">Product Images (Max 5)</h2>
                <p className="text-xs text-gray-500 mb-4">JPG, PNG, WEBP files supported.</p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#e85d04]/20 file:text-[#e85d04] hover:file:bg-[#e85d04]/30 cursor-pointer"
                />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative h-20 w-20 rounded-lg border border-white/10 overflow-hidden bg-black">
                        <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin-products')}
                  className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#e85d04] px-8 py-3 text-sm font-medium text-white hover:bg-[#ff7a22] transition disabled:opacity-50"
                >
                  {loading ? 'Adding Product...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
