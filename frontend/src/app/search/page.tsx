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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Arama Sonuçları: "{query}"</h1>

            {loading && <p>Yükleniyor...</p>}

            {!loading && products.length === 0 && (
                <p>Aramanıza uygun ürün bulunamadı.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
