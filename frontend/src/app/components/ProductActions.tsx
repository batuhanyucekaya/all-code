"use client"
import React from "react"
import { FaHeart, FaShoppingCart } from "react-icons/fa"

type Props = {
    onAddToCart: () => void
    onAddToFavorites: () => void
}

export default function ProductActions({ onAddToCart, onAddToFavorites }: Props) {
    return (
        <div className="space-y-4 text-center bg-[#002f3f] p-6 rounded shadow-md text-white">
            <button
                className="w-full bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-400 focus:outline-none rounded py-3 flex items-center justify-center gap-2 font-semibold"
                onClick={onAddToCart}
                aria-label="Sepete Ekle"
            >
                <FaShoppingCart size={20} /> Sepete Ekle
            </button>

            <button
                className="w-full bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400 focus:outline-none rounded py-3 flex items-center justify-center gap-2 font-semibold"
                onClick={onAddToFavorites}
                aria-label="Favorilere Ekle"
            >
                <FaHeart size={20} /> Favorilere Ekle
            </button>
        </div>
    )
}
