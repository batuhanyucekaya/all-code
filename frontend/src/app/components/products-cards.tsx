"use client"

import React from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"

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
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Ürün Resmi */}
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.resim_url}
            alt={product.isim}
            className="w-full h-48 object-contain bg-gray-50 p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Favori Butonu */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg">
          <Heart className="h-4 w-4" />
        </button>

        {/* Hızlı Görüntüleme */}
        <button className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100">
          <Eye className="h-4 w-4" />
        </button>

        {/* İndirim Badge */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          %25 İndirim
        </div>
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {product.isim}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.aciklama}
        </p>

        {/* Yıldız Değerlendirmesi */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">(24 değerlendirme)</span>
        </div>

        {/* Fiyat */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900">{product.fiyat} ₺</span>
            <span className="text-sm text-gray-500 line-through ml-2">{(product.fiyat * 1.33).toFixed(0)} ₺</span>
          </div>
          <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
            %25 Tasarruf
          </span>
        </div>

        {/* Sepete Ekle Butonu */}
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 group/btn">
          <ShoppingCart className="h-4 w-4" />
          <span>Sepete Ekle</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
