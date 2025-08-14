"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, AlertTriangle } from 'lucide-react'

interface AdminProtectedLayoutProps {
  children: React.ReactNode
}

export default function AdminProtectedLayout({ children }: AdminProtectedLayoutProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = () => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn')
    const loginTime = localStorage.getItem('adminLoginTime')
    
    if (isAdminLoggedIn === 'true' && loginTime) {
      // 8 saat (28800000 ms) sonra otomatik çıkış
      const currentTime = Date.now()
      const loginTimestamp = parseInt(loginTime)
      const sessionDuration = 8 * 60 * 60 * 1000 // 8 saat
      
      if (currentTime - loginTimestamp < sessionDuration) {
        setIsAuthorized(true)
      } else {
        // Oturum süresi dolmuş
        localStorage.removeItem('adminLoggedIn')
        localStorage.removeItem('adminLoginTime')
        setIsAuthorized(false)
      }
    } else {
      setIsAuthorized(false)
    }
    
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin/login')
  }

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Güvenlik kontrolü yapılıyor...</p>
        </div>
      </div>
    )
  }

  // Yetkisiz erişim
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 backdrop-blur-sm rounded-full mb-6">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Erişim Reddedildi</h1>
          <p className="text-white/70 mb-8">
            Bu sayfaya erişmek için admin yetkisine sahip olmanız gerekiyor.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Admin Girişi
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Yetkili erişim - Admin layout'u göster
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-red-600 via-purple-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-white" />
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/80 text-sm">
                Hoşgeldin, Admin
              </span>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Lock className="h-4 w-4" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main>
        {children}
      </main>
    </div>
  )
}
