"use client"

import React from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { useCart } from "../lib/cart-context"

interface ProductCardProps {
  product: {
    id: number
    isim: string
    aciklama: string
    fiyat: number
    resim_url: string
  }
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToFavorites, removeFromFavorites, isInFavorites } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)


    const button = e.currentTarget as HTMLButtonElement
    const originalText = button.innerHTML
    button.innerHTML = '<span class="text-green-300">✓ Eklendi!</span>'
    button.classList.add('bg-green-600')
    button.classList.remove('bg-blue-600', 'hover:bg-blue-700')

    setTimeout(() => {
      button.innerHTML = originalText
      button.classList.remove('bg-green-600')
      button.classList.add('bg-blue-600', 'hover:bg-blue-700')
    }, 1500)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)


      const button = e.currentTarget as HTMLButtonElement
      const originalClass = button.className
      button.classList.add('animate-pulse')

      setTimeout(() => {
        button.classList.remove('animate-pulse')
      }, 1000)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">

      <div className="relative overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.resim_url}
            alt={product.isim}
            className="w-full h-32 sm:h-40 md:h-48 object-contain bg-gray-50 p-2 sm:p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>


        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 backdrop-blur-sm rounded-full transition-all duration-200 shadow-lg touch-manipulation ${isInFavorites(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/80 hover:bg-red-500 hover:text-white'
            }`}
        >
          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <Link href={`/product/${product.id}`} className="absolute top-2 left-2 sm:top-3 sm:left-3 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 touch-manipulation">
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
        </Link>


        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
          %25 İndirim
        </div>
      </div>


      <div className="p-3 sm:p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {product.isim}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
          {product.aciklama}
        </p>


        <div className="flex items-center mb-2 sm:mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1 sm:ml-2">(24)</span>
        </div>

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <span className="text-base sm:text-lg font-bold text-gray-900">{product.fiyat} ₺</span>
            <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2">{(product.fiyat * 1.33).toFixed(0)} ₺</span>
          </div>
          <span className="text-xs text-green-600 font-semibold bg-green-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
            %25 Tasarruf
          </span>
        </div>


        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1 sm:space-x-2 group/btn touch-manipulation text-sm sm:text-base"
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Sepete Ekle</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
