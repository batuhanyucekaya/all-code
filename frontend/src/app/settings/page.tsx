"use client"

import React, { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, Bell, Shield, CreditCard, MapPin } from "lucide-react"

interface UserSettings {
  firstName: string
  lastName: string
  email: string
  phone: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    profileVisible: boolean
    orderHistory: boolean
    reviews: boolean
  }
  addresses: Address[]
}

interface Address {
  id: string
  type: "home" | "work" | "other"
  title: string
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
  isDefault: boolean
}

// Backend API endpoint'leri
const API_BASE_URL = 'http://localhost:5000/api'

const mockUserSettings: UserSettings = {
  firstName: "Ahmet",
  lastName: "Yılmaz",
  email: "ahmet.yilmaz@email.com",
  phone: "+90 555 123 4567",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  notifications: {
    email: true,
    sms: false,
    push: true
  },
  privacy: {
    profileVisible: true,
    orderHistory: false,
    reviews: true
  },
  addresses: [
    {
      id: "1",
      type: "home",
      title: "Ev Adresi",
      fullName: "Ahmet Yılmaz",
      phone: "+90 555 123 4567",
      address: "Atatürk Mahallesi, Cumhuriyet Caddesi No:123",
      city: "İstanbul",
      postalCode: "34000",
      isDefault: true
    },
    {
      id: "2",
      type: "work",
      title: "İş Adresi",
      fullName: "Ahmet Yılmaz",
      phone: "+90 555 123 4567",
      address: "Levent Mahallesi, Büyükdere Caddesi No:456",
      city: "İstanbul",
      postalCode: "34330",
      isDefault: false
    }
  ]
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(mockUserSettings)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Ayarları backend'den yükle
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // localStorage'dan kullanıcı bilgilerini al
      const userData = localStorage.getItem('user')
      if (!userData) {
        setMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor' })
        return
      }

      const user = JSON.parse(userData)
      const userId = user.id

      // Basit endpoint: /api/settings/{userId}
      const response = await fetch(`${API_BASE_URL}/settings/${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({
          ...prev,
          firstName: data.ad || "",
          lastName: data.soyad || "",
          email: data.email || "",
          phone: data.telefon || ""
        }))
      } else if (response.status === 404) {
        console.log('Müşteri bulunamadı, test verisi ekleniyor...')
        await seedTestData()
      } else {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        setMessage({ type: 'error', text: 'Ayarlar yüklenirken bir hata oluştu' })
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error)
      setMessage({ type: 'error', text: 'Ayarlar yüklenirken bir hata oluştu' })
    }
  }

  const seedTestData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Test verisi eklendi:', data)
        await loadSettings() // Reload settings after seeding
      } else {
        const errorText = await response.text()
        console.error('Test verisi eklenirken hata:', errorText)
      }
    } catch (error) {
      console.error('Test verisi eklenirken hata:', error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      // localStorage'dan kullanıcı bilgilerini al
      const userData = localStorage.getItem('user')
      if (!userData) {
        setMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor' })
        setIsLoading(false)
        return
      }

      const user = JSON.parse(userData)
      const userId = user.id
      
      const backendData = {
        ad: settings.firstName,
        soyad: settings.lastName,
        email: settings.email,
        telefon: settings.phone
      }

      // Basit endpoint: /api/settings/{userId}
      const response = await fetch(`${API_BASE_URL}/settings/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      })

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: 'success', text: result.message || 'Ayarlar başarıyla kaydedildi!' })
        
        // localStorage'daki kullanıcı bilgilerini güncelle
        const updatedUser = {
          ...user,
          ad: settings.firstName,
          soyad: settings.lastName,
          email: settings.email,
          name: `${settings.firstName} ${settings.lastName}`.trim()
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Navbar'ı güncelle
        window.dispatchEvent(new CustomEvent('userLogin', { 
          detail: { name: updatedUser.name } 
        }))
      } else {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        try {
          const errorData = JSON.parse(errorText)
          setMessage({ type: 'error', text: errorData.message || 'Ayarlar kaydedilirken bir hata oluştu' })
        } catch {
          setMessage({ type: 'error', text: 'Ayarlar kaydedilirken bir hata oluştu' })
        }
      }
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error)
      setMessage({ type: 'error', text: 'Bağlantı hatası oluştu' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationChange = (type: keyof UserSettings["notifications"]) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const handlePrivacyChange = (type: keyof UserSettings["privacy"]) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type]
      }
    }))
  }

  const tabs = [
    { id: "profile", name: "Profil Bilgileri", icon: User },
    { id: "security", name: "Güvenlik", icon: Lock },
    { id: "notifications", name: "Bildirimler", icon: Bell },
    { id: "privacy", name: "Gizlilik", icon: Shield },
    { id: "addresses", name: "Adresler", icon: MapPin },
    { id: "payment", name: "Ödeme Yöntemleri", icon: CreditCard }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hesap Ayarları</h1>
          <p className="text-gray-600">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil Bilgileri</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      value={settings.firstName}
                      onChange={(e) => setSettings(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      value={settings.lastName}
                      onChange={(e) => setSettings(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Güvenlik</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mevcut Şifre
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={settings.currentPassword}
                        onChange={(e) => setSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      value={settings.newPassword}
                      onChange={(e) => setSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      value={settings.confirmPassword}
                      onChange={(e) => setSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Bildirim Tercihleri</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">E-posta Bildirimleri</h3>
                      <p className="text-sm text-gray-600">Sipariş durumu ve kampanyalar hakkında e-posta al</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange("email")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.email ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.email ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">SMS Bildirimleri</h3>
                      <p className="text-sm text-gray-600">Kargo durumu hakkında SMS al</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange("sms")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.sms ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.sms ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Push Bildirimleri</h3>
                      <p className="text-sm text-gray-600">Web sitesi üzerinden anlık bildirimler al</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange("push")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.push ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.push ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gizlilik Ayarları</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Profil Görünürlüğü</h3>
                      <p className="text-sm text-gray-600">Profilinizi diğer kullanıcılar görebilsin</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange("profileVisible")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.privacy.profileVisible ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.privacy.profileVisible ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Sipariş Geçmişi</h3>
                      <p className="text-sm text-gray-600">Sipariş geçmişinizi paylaş</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange("orderHistory")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.privacy.orderHistory ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.privacy.orderHistory ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Değerlendirmeler</h3>
                      <p className="text-sm text-gray-600">Ürün değerlendirmelerinizi paylaş</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange("reviews")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.privacy.reviews ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.privacy.reviews ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Adreslerim</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Yeni Adres Ekle
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{address.title}</h3>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Varsayılan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{address.fullName}</p>
                      <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                      <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                      <p className="text-sm text-gray-600">{address.city} {address.postalCode}</p>
                      <div className="mt-3 flex space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-800">Düzenle</button>
                        <button className="text-sm text-red-600 hover:text-red-800">Sil</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Ödeme Yöntemleri</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Yeni Kart Ekle
                  </button>
                </div>
                
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kayıtlı kartınız yok</h3>
                  <p className="text-gray-600 mb-6">Hızlı ödeme için kart bilgilerinizi kaydedin</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    İlk Kartınızı Ekleyin
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
