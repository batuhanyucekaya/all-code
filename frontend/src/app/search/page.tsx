"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "../components/products-cards"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("query") || ""

    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query) {
            setProducts([])
            return
        }

        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await fetch(
                    `http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`
                )
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data)
                } else {
                    setProducts([])
                }
            } catch {
                setProducts([])
            }
            setLoading(false)
        }

        fetchProducts()
    }, [query])

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Arama Sonuçları
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        "{query}" için {products.length} sonuç bulundu
                    </p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Aranıyor...</p>
                        </div>
                    </div>
                )}

                {!loading && products.length === 0 && query && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç bulunamadı</h3>
                        <p className="text-gray-600">"{query}" için aramanıza uygun ürün bulunamadı.</p>
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
