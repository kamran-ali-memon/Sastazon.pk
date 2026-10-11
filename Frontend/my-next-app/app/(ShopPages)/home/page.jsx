'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import api from '../../../src/Utils/Api.js'
import ProductCard from '../../../src/Components/ProductCard.jsx'


const categories = [
    'Fashion',
    'Electronics',
    'Home & Living',
    'Beauty',
    'Accessories',
]

const banners = [
    {
        label: 'GOOD FINDS. BETTER PRICES.',
        title: 'Find something',
        highlight: "you'll love.",
        description:
            'Discover everyday essentials, stylish finds, smart gadgets and more — all in one place.',
        image:
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85',
        button: 'Explore Products',
    },
    {
        label: 'DISCOVER SOMETHING NEW',
        title: 'Your next',
        highlight: 'favourite awaits.',
        description:
            'Explore our collection of everyday products and find something that suits your style.',
        image:
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
        button: 'Shop Now',
    },
    {
        label: 'SMARTER EVERYDAY SHOPPING',
        title: 'Shop more.',
        highlight: 'Enjoy more.',
        description:
            'From everyday essentials to stylish finds, discover products worth exploring.',
        image:
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=85',
        button: 'View Collection',
    },
]

export default function Home() {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [activeBanner, setActiveBanner] = useState(0)
    const [activeProductSlide, setActiveProductSlide] = useState(0)

    const productSliderRef = useRef(null)
    const currentBanner = banners[activeBanner]

    const slideshowProducts = products
        .filter((product) => {
            return Boolean(
                product.productImages?.[0] ||
                product.productImage ||
                product.image
            )
        })
        .slice(0, 7)

    useEffect(() => {
        async function getProducts() {
            try {
                const response = await api.get('/api/products/all-products')

                if (response.data?.allProducts) {
                    setProducts(response.data.allProducts)
                }
            } catch (error) {
                console.error(
                    'Home Products Error:',
                    error?.response?.data || error.message
                )
            } finally {
                setLoading(false)
            }
        }

        getProducts()
    }, [])

    // Main hero slideshow
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveBanner((current) => (current + 1) % banners.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [])

    // Existing Featured Products slider
    useEffect(() => {
        const slider = productSliderRef.current

        if (!slider || products.length < 2) return

        const interval = setInterval(() => {
            const firstCard = slider.querySelector('.product-slide')

            if (!firstCard) return

            const cardWidth = firstCard.getBoundingClientRect().width + 20
            const maxScroll = slider.scrollWidth - slider.clientWidth

            if (slider.scrollLeft >= maxScroll - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' })
            } else {
                slider.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth',
                })
            }
        }, 3500)

        return () => clearInterval(interval)
    }, [products])

    // New large product slideshow
    useEffect(() => {
        if (slideshowProducts.length < 2) return

        const timer = setInterval(() => {
            setActiveProductSlide(
                (current) => (current + 1) % slideshowProducts.length
            )
        }, 4000)

        return () => clearInterval(timer)
    }, [slideshowProducts.length])

    function handleSearch(e) {
        e.preventDefault()

        const value = search.trim()

        window.location.href = value
            ? `/products?search=${encodeURIComponent(value)}`
            : '/products'
    }

    function slideProducts(direction) {
        const slider = productSliderRef.current

        if (!slider) return

        const firstCard = slider.querySelector('.product-slide')
        const cardWidth = firstCard
            ? firstCard.getBoundingClientRect().width + 20
            : 300

        slider.scrollBy({
            left: direction * cardWidth,
            behavior: 'smooth',
        })
    }

    function getProductName(product) {
        return (
            product.productname ||
            product.productName ||
            product.name ||
            'Explore this product'
        )
    }

    function getProductImage(product) {
        return (
            product.productImages?.[0] ||
            product.productImage ||
            product.image ||
            ''
        )
    }

    function getProductPrice(product) {
        return product.productPrice ?? product.price
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white">


            {/* HERO SLIDESHOW */}

            <section className="relative border-b border-white/[0.06]">
                <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#e85d04]/10 blur-[120px]" />

                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-16">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#e85d04]/25 bg-[#e85d04]/[0.08] px-4 py-2">
                            <span className="h-2 w-2 rounded-full bg-[#e85d04]" />

                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff7929]">
                                {currentBanner.label}
                            </span>
                        </div>

                        <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-[68px]">
                            {currentBanner.title}
                            <br />
                            <span className="text-[#e85d04]">
                                {currentBanner.highlight}
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
                            {currentBanner.description}
                        </p>

                        <form
                            onSubmit={handleSearch}
                            className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-[#151515] p-2 transition focus-within:border-[#e85d04]/60"
                        >
                            <span className="pl-3 text-xl text-gray-500">
                                ⌕
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="What are you looking for?"
                                aria-label="Search products"
                                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-500"
                            />

                            <button
                                type="submit"
                                className="rounded-xl bg-[#e85d04] px-5 py-3 text-sm font-bold transition hover:bg-[#ff7929]"
                            >
                                Search
                            </button>
                        </form>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/products"
                                className="rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-[#ff7929]"
                            >
                                {currentBanner.button} →
                            </Link>

                            <Link
                                href="/products"
                                className="rounded-xl border border-white/15 px-6 py-4 text-sm font-semibold text-gray-300 transition hover:border-[#e85d04] hover:text-[#ff7929]"
                            >
                                View Collection
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center gap-3">
                            {banners.map((banner, index) => (
                                <button
                                    key={banner.label}
                                    onClick={() => setActiveBanner(index)}
                                    aria-label={`Show banner ${index + 1}`}
                                    aria-pressed={activeBanner === index}
                                    className={`h-2 rounded-full transition-all ${activeBanner === index
                                            ? 'w-9 bg-[#e85d04]'
                                            : 'w-2 bg-white/25 hover:bg-white/50'
                                        }`}
                                />
                            ))}

                            <span className="ml-2 text-xs text-gray-500">
                                0{activeBanner + 1} / 0{banners.length}
                            </span>
                        </div>
                    </div>

                    {/* Hero image */}

                    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                        <div className="absolute inset-8 rounded-[40px] bg-[#e85d04]/20 blur-3xl" />

                        <div className="relative rounded-[30px] border border-white/[0.08] bg-[#171717] p-3 sm:p-4">
                            <div className="relative h-[340px] overflow-hidden rounded-[23px] sm:h-[430px] lg:h-[450px]">
                                <img
                                    key={currentBanner.image}
                                    src={currentBanner.image}
                                    alt="Discover products at Sastazon.pk"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />

                                <div className="absolute right-4 top-4 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff7929]">
                                        Sastazon
                                    </p>
                                    <p className="mt-1 text-lg font-extrabold">
                                        Good finds
                                    </p>
                                    <p className="text-xs text-gray-300">
                                        All in one place
                                    </p>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8a45]">
                                        Discover more
                                    </p>

                                    <h2 className="mt-3 max-w-sm text-3xl font-extrabold leading-tight sm:text-4xl">
                                        Your next favourite could be here.
                                    </h2>

                                    <Link
                                        href="/products"
                                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#ff8a45]"
                                    >
                                        Find your favourite →
                                    </Link>
                                </div>

                                <button
                                    onClick={() =>
                                        setActiveBanner(
                                            (activeBanner + banners.length - 1) %
                                            banners.length
                                        )
                                    }
                                    aria-label="Previous banner"
                                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur transition hover:bg-[#e85d04]"
                                >
                                    ←
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveBanner(
                                            (activeBanner + 1) % banners.length
                                        )
                                    }
                                    aria-label="Next banner"
                                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur transition hover:bg-[#e85d04]"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SHOPPING BENEFITS */}

            <section className="border-b border-white/[0.07] bg-[#111111]">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-7 sm:px-6 md:grid-cols-4 lg:px-8">
                    {[
                        ['🚚', 'Delivery', 'Check delivery options'],
                        ['💵', 'Cash on Delivery', 'Pay when your order arrives'],
                        ['↻', 'Order Updates', 'Follow your order status'],
                        ['🔒', 'Secure Shopping', 'Shop with confidence'],
                    ].map(([icon, title, description]) => (
                        <div key={title} className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e85d04]/20 bg-[#e85d04]/10 text-xl">
                                {icon}
                            </div>

                            <div>
                                <h3 className="text-sm font-bold">{title}</h3>
                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATEGORIES */}

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
                            Find your style
                        </p>

                        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                            Shop by category
                        </h2>

                        <p className="mt-3 text-sm text-gray-500">
                            Find the things you need in just a few clicks.
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="text-sm font-semibold text-gray-400 transition hover:text-[#e85d04]"
                    >
                        View all →
                    </Link>
                </div>

                <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {categories.map((category, index) => (
                        <Link
                            key={category}
                            href={`/products?category=${encodeURIComponent(category)}`}
                            className="group rounded-2xl border border-white/[0.08] bg-[#121212] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#e85d04]/50 hover:bg-[#17120f] sm:p-6"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e85d04]/20 bg-[#e85d04]/10 text-2xl text-[#ff7929] transition group-hover:bg-[#e85d04] group-hover:text-white">
                                {['✦', '⌘', '⌂', '✧', '◇'][index]}
                            </div>

                            <h3 className="mt-5 text-sm font-bold sm:text-base">
                                {category}
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                Browse products
                            </p>

                            <div className="mt-4 text-sm text-[#e85d04] transition group-hover:translate-x-1">
                                Explore →
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* NEW LARGE PRODUCT IMAGE SLIDESHOW */}

            {!loading && slideshowProducts.length > 0 && (
                <section className="bg-[#0a0a0a] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
                                    Discover your next favourite
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                                    Featured Collections
                                </h2>

                                <p className="mt-3 text-sm text-gray-400">
                                    Explore products picked from our collection.
                                </p>
                            </div>

                            <Link
                                href="/products"
                                className="text-sm font-semibold text-gray-400 transition hover:text-[#e85d04]"
                            >
                                View all products →
                            </Link>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#151515]">
                            {slideshowProducts.map((product, index) => {
                                const image = getProductImage(product)
                                const name = getProductName(product)
                                const price = getProductPrice(product)

                                return (
                                    <div
                                        key={product._id}
                                        className={
                                            index === activeProductSlide
                                                ? 'relative'
                                                : 'hidden'
                                        }
                                    >
                                        <div className="relative h-[390px] sm:h-[480px] lg:h-[540px]">
                                            <img
                                                src={image}
                                                alt={name}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />

                                            <div className="absolute inset-0 flex items-end p-6 sm:p-10 lg:p-14">
                                                <div className="max-w-xl">
                                                    <span className="inline-flex rounded-full border border-[#e85d04]/40 bg-[#e85d04]/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ff8a45]">
                                                        Sastazon.pk Collection
                                                    </span>

                                                    <h3 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                                                        {name}
                                                    </h3>

                                                    {price !== undefined &&
                                                        price !== null && (
                                                            <p className="mt-4 text-xl font-bold text-[#ff7929] sm:text-2xl">
                                                                Rs.{' '}
                                                                {Number(
                                                                    price
                                                                ).toLocaleString(
                                                                    'en-PK'
                                                                )}
                                                            </p>
                                                        )}

                                                    <Link
                                                        href={`/productdetail/${product._id}`}
                                                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-[#ff7929]"
                                                    >
                                                        View Product →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {slideshowProducts.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setActiveProductSlide(
                                                (current) =>
                                                    (current -
                                                        1 +
                                                        slideshowProducts.length) %
                                                    slideshowProducts.length
                                            )
                                        }
                                        aria-label="Previous product"
                                        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xl backdrop-blur transition hover:bg-[#e85d04] sm:left-6 sm:h-14 sm:w-14"
                                    >
                                        ←
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveProductSlide(
                                                (current) =>
                                                    (current + 1) % slideshowProducts.length
                                            )
                                        }
                                        aria-label="Next product"
                                        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xl backdrop-blur transition hover:bg-[#e85d04] sm:right-6 sm:h-14 sm:w-14"
                                    >
                                        →
                                    </button>

                                    <div className="absolute bottom-5 right-6 z-10 flex items-center gap-2 sm:bottom-7 sm:right-10">
                                        {slideshowProducts.map(
                                            (product, index) => (
                                                <button
                                                    key={product._id}
                                                    onClick={() =>
                                                        setActiveProductSlide(
                                                            index
                                                        )
                                                    }
                                                    aria-label={`Show product ${index + 1}`}
                                                    aria-pressed={
                                                        activeProductSlide ===
                                                        index
                                                    }
                                                    className={`h-2 rounded-full transition-all ${activeProductSlide ===
                                                            index
                                                            ? 'w-8 bg-[#e85d04]'
                                                            : 'w-2 bg-white/60 hover:bg-white'
                                                        }`}
                                                />
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* EXISTING FEATURED PRODUCTS SLIDESHOW */}

            <section className="border-y border-white/[0.06] bg-[#101010]">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
                                Handpicked for you
                            </p>

                            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                                Featured Products
                            </h2>

                            <p className="mt-3 text-sm text-gray-500">
                                Discover something you will love.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => slideProducts(-1)}
                                aria-label="Previous products"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#191919] text-lg transition hover:border-[#e85d04] hover:bg-[#e85d04]"
                            >
                                ←
                            </button>

                            <button
                                onClick={() => slideProducts(1)}
                                aria-label="Next products"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#191919] text-lg transition hover:border-[#e85d04] hover:bg-[#e85d04]"
                            >
                                →
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e85d04] border-t-transparent" />
                        </div>
                    ) : products.length === 0 ? (
                        <p className="py-16 text-center text-gray-500">
                            No products available yet.
                        </p>
                    ) : (
                        <div
                            ref={productSliderRef}
                            className="mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {products.slice(0, 7).map((product, index) => (
                                <div
                                    key={product._id}
                                    className="product-slide w-[245px] shrink-0 snap-start sm:w-[280px] lg:w-[290px]"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="rounded-full border border-[#e85d04]/30 bg-[#e85d04]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff7929]">
                                            Featured
                                        </span>

                                        <span className="text-xs text-gray-600">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <div className="h-full overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1">
                                        <ProductCard product={product} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <Link
                            href="/products"
                            className="inline-flex rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#e85d04] hover:text-[#ff7929]"
                        >
                            Explore All Products →
                        </Link>
                    </div>
                </div>
            </section>

            {/* PROMOTIONAL BANNER */}

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#151515]">
                    <img
                        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=85"
                        alt="Electronics and technology products"
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/30" />

                    <div className="relative max-w-2xl px-6 py-14 sm:px-12 sm:py-16">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff7929]">
                            Discover more
                        </p>

                        <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
                            Upgrade your everyday.
                        </h2>

                        <p className="mt-4 max-w-lg text-sm leading-7 text-gray-300 sm:text-base">
                            Explore useful gadgets, everyday essentials and
                            products that make life a little easier.
                        </p>

                        <Link
                            href="/products?category=Electronics"
                            className="mt-7 inline-flex rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-bold transition hover:bg-[#ff7929]"
                        >
                            Explore Electronics →
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    )
}
