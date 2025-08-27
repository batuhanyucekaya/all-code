"use client"

import React from "react"
import { useCart } from "../lib/cart-context"
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } = useCart()
  const router = useRouter()

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      await updateCartItemQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = async (productId: number) => {
    await removeFromCart(productId)
    
    // Başarı mesajı göster
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg z-50 text-sm sm:text-base'
    toast.textContent = 'Ürün sepetten kaldırıldı'
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 2000)
  }

  const handleClearCart = async () => {
    if (confirm("Sepeti temizlemek istediğinizden emin misiniz?")) {
      await clearCart()
      
      // Başarı mesajı göster
      const toast = document.createElement('div')
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg z-50 text-sm sm:text-base'
      toast.textContent = 'Sepet temizlendi'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Geri Dön</span>
            </button>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Sepetiniz Boş</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Sepetinizde henüz ürün bulunmuyor.</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">Geri Dön</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Sepetim ({cartItems.length} ürün)
              </h1>
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm"
              >
                Sepeti Temizle
              </button>
            </div>
          </div>

          {/* Product List */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 flex justify-center sm:justify-start">
                    <img
                      src={item.resim_url}
                      alt={item.isim}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-gray-50 rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate mb-1">
                      {item.isim}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-blue-600">
                      {item.fiyat} ₺
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 sm:p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <span className="w-8 sm:w-12 text-center font-semibold text-sm sm:text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 sm:p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-center sm:text-right">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                      {(item.fiyat * item.quantity).toFixed(2)} ₺
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors self-center sm:self-start"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Toplam</p>
                <p className="text-xs sm:text-sm text-gray-600">{cartItems.length} ürün</p>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {getCartTotal().toFixed(2)} ₺
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <button className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base md:text-lg">
              Ödemeye Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
