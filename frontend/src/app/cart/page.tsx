"use client"

import React from "react"
import { useCart } from "../lib/cart-context"
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } = useCart()
  const router = useRouter()

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateCartItemQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId)
    
    // Başarı mesajı göster
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    toast.textContent = 'Ürün sepetten kaldırıldı'
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 2000)
  }



  const handleClearCart = () => {
    if (confirm("Sepeti temizlemek istediğinizden emin misiniz?")) {
      clearCart()
      
      // Başarı mesajı göster
      const toast = document.createElement('div')
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      toast.textContent = 'Sepet temizlendi'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    }
  }

  if (cartItems.length === 0) {
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

          {/* Boş Sepet */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-600 mb-8">Sepetinizde henüz ürün bulunmuyor.</p>
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
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Sepetim ({cartItems.length} ürün)</h1>
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Sepeti Temizle
              </button>
            </div>
          </div>

          {/* Ürün Listesi */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
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

                  {/* Miktar Kontrolü */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Toplam Fiyat */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{(item.fiyat * item.quantity).toFixed(2)} ₺</p>
                  </div>

                  {/* Sil Butonu */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Özet */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">Toplam</p>
                <p className="text-sm text-gray-600">{cartItems.length} ürün</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{getCartTotal().toFixed(2)} ₺</p>
              </div>
            </div>
          </div>

          {/* Ödeme Butonu */}
          <div className="px-6 py-4">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg">
              Ödemeye Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
