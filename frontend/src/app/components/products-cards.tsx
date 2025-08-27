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
  const { addToCart, addToFavorites, removeFromFavorites, isInFavorites, currentMusteriId } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const button = e.currentTarget as HTMLButtonElement
    const originalText = button.innerHTML
    
    try {
      await addToCart(product)
      
      // Başarılı olduktan sonra UI'ı güncelle
      if (button) {
        button.innerHTML = '<span class="text-green-300 text-xs sm:text-sm">✓ Eklendi!</span>'
        button.classList.add('bg-green-600')
        button.classList.remove('bg-blue-600', 'hover:bg-blue-700')

        setTimeout(() => {
          if (button) {
            button.innerHTML = originalText
            button.classList.remove('bg-green-600')
            button.classList.add('bg-blue-600', 'hover:bg-blue-700')
          }
        }, 1500)
      }
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
      // Hata durumunda orijinal metni geri yükle
      if (button) {
        button.innerHTML = originalText
      }
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const button = e.currentTarget as HTMLButtonElement
    
    try {
      if (isInFavorites(product.id)) {
        await removeFromFavorites(product.id)
      } else {
        await addToFavorites(product)
        
        // Başarılı olduktan sonra animasyon ekle
        if (button) {
          button.classList.add('animate-pulse')
          setTimeout(() => {
            if (button) {
              button.classList.remove('animate-pulse')
            }
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col">

      {/* Image Container */}
      <div className="relative overflow-hidden flex-shrink-0">
        <Link href={`/product/${product.id}`} className="block">
          <img
            src={product.resim_url}
            alt={product.isim}
            className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-contain bg-gray-50 p-2 sm:p-3 md:p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Favorite Button - Sadece giriş yapmış kullanıcılar için */}
        {currentMusteriId && (
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 p-1 sm:p-1.5 md:p-2 backdrop-blur-sm rounded-full transition-all duration-200 shadow-lg touch-manipulation ${
              isInFavorites(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/80 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        )}

        {/* View Button */}
        <Link 
          href={`/product/${product.id}`} 
          className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 p-1 sm:p-1.5 md:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 touch-manipulation"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
        </Link>

        {/* Discount Badge */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
          %25 İndirim
        </div>
      </div>

      {/* Content Container */}
      <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
        {/* Product Title */}
        <Link href={`/product/${product.id}`} className="flex-1">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200 leading-tight">
            {product.isim}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-tight flex-1">
          {product.aciklama}
        </p>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
            <span className="text-xs sm:text-sm text-gray-600">4.5</span>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-500 line-through">{(product.fiyat * 1.25).toFixed(0)} ₺</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-red-600">{product.fiyat} ₺</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 sm:space-x-3 mt-auto">
          {currentMusteriId ? (
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Sepete Ekle</span>
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-400 text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 cursor-not-allowed"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Giriş Yapın</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
