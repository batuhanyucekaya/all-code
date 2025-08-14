"use client"

import React, { useState, useEffect } from "react"
import { User, Mail, Phone, Calendar, Star, Heart, Package, Settings, Lock, Eye, EyeOff, Save } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  joinDate: string
  avatar: string
  stats: {
    totalOrders: number
    totalSpent: number
    reviews: number
    favorites: number
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('profile')
  
  // Şifre güncelleme state'leri
  const [mevcutSifre, setMevcutSifre] = useState("")
  const [yeniSifre, setYeniSifre] = useState("")
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState("")
  const [showMevcutSifre, setShowMevcutSifre] = useState(false)
  const [showYeniSifre, setShowYeniSifre] = useState(false)
  const [showYeniSifreTekrar, setShowYeniSifreTekrar] = useState(false)
  const [sifreLoading, setSifreLoading] = useState(false)
  const [sifreMessage, setSifreMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Kullanıcı bilgilerini al
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const res = await fetch(`${API_URL}/api/musteri/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
        })

        if (res.status === 401) {
          setError("Oturum bulunamadı. Lütfen giriş yap.")
          setLoading(false)
          return
        }

        if (!res.ok) {
          const t = await res.text()
          throw new Error(t || "Profil yüklenemedi")
        }

        const data = await res.json()
        const mapped: UserProfile = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          joinDate: data.joinDate,
          avatar: data.avatar ?? "https://via.placeholder.com/150x150",
          stats: {
            totalOrders: data.stats?.totalOrders ?? 0,
            totalSpent: data.stats?.totalSpent ?? 0,
            reviews: data.stats?.reviews ?? 0,
            favorites: data.stats?.favorites ?? 0
          }
        }
        setProfile(mapped)
      } catch (e: any) {
        setError(e?.message || "Bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSifreGuncelle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setSifreMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor' })
      return
    }

    // Validasyonlar
    if (!mevcutSifre || !yeniSifre || !yeniSifreTekrar) {
      setSifreMessage({ type: 'error', text: 'Tüm alanları doldurun' })
      return
    }

    if (yeniSifre.length < 6) {
      setSifreMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır' })
      return
    }

    if (yeniSifre !== yeniSifreTekrar) {
      setSifreMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' })
      return
    }

    setSifreLoading(true)
    setSifreMessage(null)

    try {
      console.log('API URL:', `${API_URL}/api/musteri/sifre-guncelle`)
      console.log('Request body:', {
        musteriId: user.id,
        mevcutSifre: mevcutSifre,
        yeniSifre: yeniSifre
      })
      
      const response = await fetch(`${API_URL}/api/musteri/sifre-guncelle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          musteriId: user.id,
          mevcutSifre: mevcutSifre,
          yeniSifre: yeniSifre
        })
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        setSifreMessage({ type: 'success', text: data.message })
        setMevcutSifre("")
        setYeniSifre("")
        setYeniSifreTekrar("")
      } else {
        setSifreMessage({ type: 'error', text: data.message || 'Şifre güncellenemedi' })
      }
    } catch (error) {
      setSifreMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setSifreLoading(false)
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-4 animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 mx-auto mb-2 animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 mx-auto animate-pulse" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-5 w-48 bg-gray-200 mb-4 animate-pulse" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded mb-3 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error view
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  // Profile null safety
  if (!profile) {
    return null
  }

  // ----- RENDER -----
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hesap Ayarları</h1>
          <p className="text-gray-600">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profil Bilgileri</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Güvenlik</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Bildirimler</span>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'privacy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Gizlilik</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil Bilgileri</h2>
              {profile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                      <input
                        type="email"
                        value={profile.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Güvenlik</h2>
              
              <form onSubmit={handleSifreGuncelle} className="max-w-md space-y-6">
                {/* Mevcut Şifre */}
                <div>
                  <label htmlFor="mevcutSifre" className="block text-sm font-medium text-gray-700 mb-2">
                    Mevcut Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showMevcutSifre ? "text" : "password"}
                      id="mevcutSifre"
                      value={mevcutSifre}
                      onChange={(e) => setMevcutSifre(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mevcut şifrenizi girin"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowMevcutSifre(!showMevcutSifre)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showMevcutSifre ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Yeni Şifre */}
                <div>
                  <label htmlFor="yeniSifre" className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showYeniSifre ? "text" : "password"}
                      id="yeniSifre"
                      value={yeniSifre}
                      onChange={(e) => setYeniSifre(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Yeni şifrenizi girin (en az 6 karakter)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowYeniSifre(!showYeniSifre)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showYeniSifre ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Yeni Şifre Tekrar */}
                <div>
                  <label htmlFor="yeniSifreTekrar" className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre (Tekrar)
                  </label>
                  <div className="relative">
                    <input
                      type={showYeniSifreTekrar ? "text" : "password"}
                      id="yeniSifreTekrar"
                      value={yeniSifreTekrar}
                      onChange={(e) => setYeniSifreTekrar(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Yeni şifrenizi tekrar girin"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowYeniSifreTekrar(!showYeniSifreTekrar)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showYeniSifreTekrar ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Mesaj */}
                {sifreMessage && (
                  <div className={`p-4 rounded-lg ${
                    sifreMessage.type === 'success' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {sifreMessage.text}
                  </div>
                )}

                {/* Güncelle Butonu */}
                <button
                  type="submit"
                  disabled={sifreLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2 ${
                    sifreLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                  }`}
                >
                  <Save className="h-5 w-5" />
                  <span>{sifreLoading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}</span>
                </button>
              </form>

              {/* Güvenlik İpuçları */}
              <div className="mt-8 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Güvenlik İpuçları:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• En az 6 karakter kullanın</li>
                  <li>• Büyük ve küçük harfler kullanın</li>
                  <li>• Sayılar ve özel karakterler ekleyin</li>
                  <li>• Kişisel bilgilerinizi kullanmayın</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Bildirimler</h2>
              <p className="text-gray-600">Bildirim ayarları yakında eklenecek...</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gizlilik</h2>
              <p className="text-gray-600">Gizlilik ayarları yakında eklenecek...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
