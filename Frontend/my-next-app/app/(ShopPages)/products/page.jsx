
'use client'

import React, {
    useEffect,
    useState
} from 'react'

import { useSearchParams } from 'next/navigation'

import ProductCard from '../../../src/Components/ProductCard.jsx'
import api from '../../../src/Utils/Api.js'

export default function ProductsPage() {

    const searchParams = useSearchParams()

    const [products, setProducts] = useState([])

    const [categories, setCategories] = useState(['All'])

    const [search, setSearch] = useState('')

    const [category, setCategory] = useState('All')

    const [sort, setSort] = useState('default')

    const [currentPage, setCurrentPage] = useState(1)

    const [pagination, setPagination] = useState(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState('')


    // Get search and category from URL
    useEffect(() => {

        const searchFromUrl =
            searchParams.get('search') || ''

        const categoryFromUrl =
            searchParams.get('category') || ''

        setSearch(searchFromUrl)

        if (categoryFromUrl) {
            setCategory(categoryFromUrl)
        }

        setCurrentPage(1)

    }, [searchParams])


    // Fetch products
    useEffect(() => {

        let isActive = true

        const fetchProducts = async () => {

            try {

                setLoading(true)
                setError('')

                const response = await api.get(
                    '/api/products/all-products',
                    {
                        params: {
                            paginate: 'true',
                            page: currentPage,
                            search: search,
                            category: category,
                            sort: sort
                        }
                    }
                )

                if (!isActive) return

                if (response.data?.status) {

                    setProducts(
                        response.data.allProducts || []
                    )

                    setCategories([
                        'All',
                        ...(response.data.categories || [])
                    ])

                    setPagination(
                        response.data.pagination
                    )

                } else {

                    setProducts([])
                    setPagination(null)

                }

            } catch (err) {

                if (!isActive) return

                console.error(
                    'Products Fetch Error:',
                    err
                )

                setError(
                    err?.response?.data?.message ||
                    'Unable to load products.'
                )

            } finally {

                if (isActive) {
                    setLoading(false)
                }

            }

        }

        fetchProducts()

        return () => {
            isActive = false
        }

    }, [
        currentPage,
        search,
        category,
        sort
    ])


    return (

        <main className="min-h-screen bg-[#0b0b0b] px-4 py-10 text-white sm:px-6 lg:px-10">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-8">

                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#e85d04]">
                        Sastazon.pk
                    </p>

                    <h1 className="text-3xl font-bold sm:text-4xl">
                        All Products
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-gray-400 sm:text-base">
                        Explore our latest products and find something you love at a great price.
                    </p>

                </div>


                {/* FILTERS */}

                <div className="mb-8 rounded-2xl border border-white/10 bg-[#151515] p-4">

                    <div className="grid gap-4 md:grid-cols-[1fr_200px_200px]">

                        {/* SEARCH */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Search
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setCurrentPage(1)
                                }}
                                placeholder="Search products..."
                                className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#e85d04]"
                            />

                        </div>


                        {/* CATEGORY */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-[#e85d04]"
                            >

                                {categories.map((item) => (

                                    <option
                                        key={item}
                                        value={item}
                                        className="bg-[#202020]"
                                    >
                                        {item}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* SORT */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Sort By
                            </label>

                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-[#e85d04]"
                            >

                                <option value="default">
                                    Default
                                </option>

                                <option value="low">
                                    Price: Low to High
                                </option>

                                <option value="high">
                                    Price: High to Low
                                </option>

                                <option value="name">
                                    Name: A-Z
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (

                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-[#151515]"
                            >

                                <div className="h-56 animate-pulse bg-[#202020]" />

                                <div className="space-y-3 p-5">

                                    <div className="h-3 w-20 animate-pulse rounded bg-[#252525]" />

                                    <div className="h-5 w-full animate-pulse rounded bg-[#252525]" />

                                    <div className="h-5 w-2/3 animate-pulse rounded bg-[#252525]" />

                                    <div className="mt-5 h-10 animate-pulse rounded bg-[#252525]" />

                                </div>

                            </div>

                        ))}

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-10 text-center">

                        <h2 className="text-lg font-semibold text-white">
                            Products could not be loaded
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-lg bg-[#e85d04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff6b0a]"
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* PRODUCTS */}

                {!loading && !error && (

                    <>

                        {/* RESULT COUNT */}

                        <div className="mb-5 flex items-center justify-between">

                            <p className="text-sm text-gray-400">

                                Showing{' '}

                                <span className="font-semibold text-white">
                                    {products.length}
                                </span>{' '}

                                of{' '}

                                <span className="font-semibold text-white">
                                    {pagination?.totalProducts || 0}
                                </span>{' '}

                                products

                            </p>

                        </div>


                        {/* PRODUCT GRID */}

                        {products.length > 0 ? (

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                                {products.map((product) => (

                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />

                                ))}

                            </div>

                        ) : (

                            /* EMPTY STATE */

                            <div className="rounded-2xl border border-white/10 bg-[#151515] px-6 py-16 text-center">

                                <div className="mb-4 text-4xl">
                                    🛍️
                                </div>

                                <h2 className="text-xl font-semibold text-white">
                                    No Products Found
                                </h2>

                                <p className="mt-2 text-sm text-gray-400">
                                    Try changing your search or category filter.
                                </p>

                                {search && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('')
                                            setCurrentPage(1)
                                        }}
                                        className="mt-5 rounded-lg bg-[#e85d04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff6b0a]"
                                    >
                                        Clear Search
                                    </button>

                                )}

                            </div>

                        )}


                        {/* PAGINATION */}

                        {pagination?.totalProducts > 20 && pagination?.totalPages > 1 && (

                            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="rounded-lg border border-white/10 bg-[#151515] px-5 py-2.5 text-sm font-medium text-white transition hover:border-[#e85d04] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <p className="text-sm text-gray-400">
                                    Page{' '}
                                    <span className="font-semibold text-white">
                                        {pagination.currentPage}
                                    </span>
                                    {' '}of{' '}
                                    <span className="font-semibold text-white">
                                        {pagination.totalPages}
                                    </span>
                                </p>

                                <button
                                    type="button"
                                    disabled={currentPage >= pagination.totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="rounded-lg border border-white/10 bg-[#151515] px-5 py-2.5 text-sm font-medium text-white transition hover:border-[#e85d04] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>

                            </div>

                        )}

                    </>

                )}

            </div>

        </main>

    )

}
