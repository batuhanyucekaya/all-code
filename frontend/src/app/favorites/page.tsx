"use client"

import React from "react"
import { useCart } from "../lib/cart-context"
import { Heart, Trash2, ArrowLeft, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function FavoritesPage() {
  const { favoriteItems, removeFromFavorites, addToCart } = useCart()
  const router = useRouter()

  const handleRemoveFromFavorites = (productId: number) => {
    removeFromFavorites(productId)
    
    // Başarı mesajı göster
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    toast.textContent = 'Favorilerden kaldırıldı'
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 2000)
  }

  const handleAddToCart = (product: any, event: React.MouseEvent) => {
    addToCart(product)
    
    // Başarı mesajı göster
    const button = event.currentTarget as HTMLButtonElement
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

  if (favoriteItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Geri Tuşu */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Geri Dön</span>
            </button>
          </div>

          {/* Boş Favoriler */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Favorileriniz Boş</h1>
            <p className="text-gray-600 mb-8">Henüz favori ürününüz bulunmuyor.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Geri Tuşu */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Geri Dön</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Başlık */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
            <h1 className="text-2xl font-bold text-gray-900">Favorilerim ({favoriteItems.length} ürün)</h1>
          </div>

          {/* Ürün Listesi */}
          <div className="divide-y divide-gray-200">
            {favoriteItems.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Ürün Resmi */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.resim_url}
                      alt={item.isim}
                      className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                    />
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{item.isim}</h3>
                    <p className="text-lg font-bold text-blue-600">{item.fiyat} ₺</p>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Sepete Ekle
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromFavorites(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Alt Bilgi */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Favori ürünlerinizi sepetinize ekleyebilir veya favorilerden çıkarabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
