"use client"

import React, { useState, useEffect } from "react"
import { User, Mail, Phone, Save } from "lucide-react"

interface UserSettings {
  firstName: string
  lastName: string
  email: string
  phone: string
}

// Backend API endpoint'leri
const API_BASE_URL = 'http://localhost:5000/api'

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })
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

      // Müşteri bilgilerini al
      const musteriResponse = await fetch(`${API_BASE_URL}/musteri/${userId}`)
      
      if (musteriResponse.ok) {
        const musteriData = await musteriResponse.json()
        setSettings({
          firstName: musteriData.ad || "",
          lastName: musteriData.soyad || "",
          email: musteriData.email || "",
          phone: musteriData.telefon || ""
        })
      } else {
        console.error('Müşteri bilgileri alınamadı')
        setMessage({ type: 'error', text: 'Müşteri bilgileri alınamadı' })
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error)
      setMessage({ type: 'error', text: 'Ayarlar yüklenirken bir hata oluştu' })
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
      
      // Müşteri bilgilerini güncelle
      const musteriData = {
        ad: settings.firstName,
        soyad: settings.lastName,
        email: settings.email,
        telefon: settings.phone
      }

      const musteriResponse = await fetch(`${API_BASE_URL}/musteri/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(musteriData)
      })

      if (musteriResponse.ok) {
        setMessage({ type: 'success', text: 'Profil bilgileri başarıyla güncellendi!' })
        
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
        const errorText = await musteriResponse.text()
        console.error('Musteri API Error Response:', errorText)
        setMessage({ type: 'error', text: 'Profil bilgileri güncellenirken hata oluştu' })
      }
    } catch (error) {
      console.error('Profil bilgileri kaydedilirken hata:', error)
      setMessage({ type: 'error', text: 'Bağlantı hatası oluştu' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Bilgileri</h1>
          <p className="text-gray-600">Kişisel bilgilerinizi güncelleyin</p>
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Kişisel Bilgiler</h2>
            </div>
            
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
                  placeholder="Adınızı girin"
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
                  placeholder="Soyadınızı girin"
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
                    placeholder="ornek@email.com"
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
                    placeholder="+90 555 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200">
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
