"use client"

import React from "react"
import { Users, Target, Award, Heart, Shield, Truck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Hakkımızda
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            TechStore olarak teknoloji dünyasında kaliteli ve uygun fiyatlı ürünler sunmaya odaklanıyoruz.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hikayemiz */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hikayemiz</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              2020 yılında kurulan TechStore, teknoloji tutkunları için kaliteli ve uygun fiyatlı ürünler sunma vizyonuyla yola çıktı.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Misyonumuz</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Müşterilerimize en kaliteli teknoloji ürünlerini en uygun fiyatlarla sunmak ve 
                teknoloji dünyasının kapılarını herkes için açmak. 300 TL altı ürünlerimizle 
                bütçe dostu çözümler sunarak, herkesin teknolojinin nimetlerinden faydalanmasını sağlıyoruz.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Sadece ürün satmak değil, müşterilerimizin teknoloji yolculuğunda güvenilir bir 
                partner olmak için çalışıyoruz. Her ürünümüzü özenle seçiyor, kalite kontrolünden 
                geçiriyor ve müşteri memnuniyetini en üst düzeyde tutuyoruz.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">10,000+</h4>
                  <p className="text-sm text-gray-600">Mutlu Müşteri</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">500+</h4>
                  <p className="text-sm text-gray-600">Ürün Çeşidi</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">24 Saat</h4>
                  <p className="text-sm text-gray-600">Hızlı Teslimat</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">%99</h4>
                  <p className="text-sm text-gray-600">Müşteri Memnuniyeti</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Değerlerimiz */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              TechStore olarak benimsediğimiz temel değerler, her kararımızın ve eylemimizin temelini oluşturur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kalite</h3>
              <p className="text-gray-600">
                Her ürünümüzü özenle seçiyor, kalite kontrolünden geçiriyor ve müşterilerimize 
                sadece en iyi ürünleri sunuyoruz.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Güven</h3>
              <p className="text-gray-600">
                Müşterilerimizin güvenini kazanmak ve korumak bizim için en önemli önceliktir. 
                Şeffaf ve dürüst iş yapma prensibimizden asla taviz vermeyiz.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Müşteri Odaklılık</h3>
              <p className="text-gray-600">
                Müşterilerimizin ihtiyaçlarını anlıyor, onların memnuniyeti için sürekli 
                kendimizi geliştiriyor ve en iyi hizmeti sunuyoruz.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hız</h3>
              <p className="text-gray-600">
                Siparişlerinizi en hızlı şekilde işliyor, güvenli kargo ile kapınıza kadar 
                getiriyor ve zamanınızı değerli tutuyoruz.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Yenilikçilik</h3>
              <p className="text-gray-600">
                Teknoloji dünyasındaki en son gelişmeleri takip ediyor, müşterilerimize 
                en güncel ve yenilikçi ürünleri sunuyoruz.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Topluluk</h3>
              <p className="text-gray-600">
                Teknoloji tutkunlarından oluşan bir topluluk yaratıyor, bilgi paylaşımını 
                destekliyor ve birlikte büyüyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Ekibimiz */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              TechStore'un başarısının arkasında, teknoloji tutkusu ve müşteri odaklı yaklaşımı 
              benimseyen deneyimli ekibimiz bulunuyor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ahmet Yılmaz</h3>
              <p className="text-purple-600 font-medium mb-4">Kurucu & CEO</p>
              <p className="text-gray-600 text-sm">
                10+ yıl teknoloji sektörü deneyimi ile TechStore'u kurdu ve büyüttü.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">F</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fatma Demir</h3>
              <p className="text-purple-600 font-medium mb-4">Operasyon Müdürü</p>
              <p className="text-gray-600 text-sm">
                Müşteri deneyimi ve operasyonel mükemmellik konusunda uzman.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mehmet Kaya</h3>
              <p className="text-purple-600 font-medium mb-4">Teknoloji Uzmanı</p>
              <p className="text-gray-600 text-sm">
                Ürün seçimi ve teknoloji danışmanlığı konusunda uzman.
              </p>
            </div>
          </div>
        </div>

        {/* İletişim CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Bizimle İletişime Geçin</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Sorularınız mı var? Önerileriniz mi? Bizimle iletişime geçin, 
            size yardımcı olmaktan mutluluk duyarız.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            İletişime Geç
          </a>
        </div>
      </div>
    </div>
  )
}
