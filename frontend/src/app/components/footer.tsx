"use client"

import React from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Şirket Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400">TechStore</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              300 TL altı kaliteli teknoloji ürünleri ile müşterilerimize en iyi hizmeti sunuyoruz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Sepet
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Favoriler
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategoriler */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Kategoriler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/?kategoriId=1" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  PC Hardware
                </Link>
              </li>
              <li>
                <Link href="/?kategoriId=2" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Headphones
                </Link>
              </li>
              <li>
                <Link href="/?kategoriId=3" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Phones & Accessories
                </Link>
              </li>
              <li>
                <Link href="/?kategoriId=4" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Computers & Accessories
                </Link>
              </li>
              <li>
                <Link href="/?kategoriId=5" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  TV, Sound & Monitor
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">İletişim</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <a href="mailto:info@techstore.com" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  info@techstore.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-400" />
                <a href="tel:+902121234567" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  +90 (212) 123 45 67
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-yellow-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  İstanbul, Türkiye<br />
                  Teknoloji Mahallesi, No:123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 TechStore. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                İletişim
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
