"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Shield, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Admin zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (isAdminLoggedIn === 'true') {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Admin şifresini kontrol et (gerçek uygulamada backend'den kontrol edilir)
      const adminPassword = 'admin123' // Bu şifreyi değiştirin!
      
      if (password === adminPassword) {
        // Admin giriş başarılı
        setSuccess('🎉 Giriş başarılı! Yönlendiriliyorsunuz...')
        localStorage.setItem('adminLoggedIn', 'true')
        localStorage.setItem('adminLoginTime', Date.now().toString())
        
        // Başarılı giriş animasyonu
        setTimeout(() => {
          router.push('/admin')
        }, 2000)
      } else {
        setError('❌ Yanlış şifre! Lütfen tekrar deneyin.')
        setPassword('')
      }
    } catch (error) {
      setError('🌐 Bağlantı hatası! Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6 shadow-2xl">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Admin Panel</h1>
          <p className="text-purple-200 text-lg">Güvenli yönetim paneline erişim</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Şifre Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                Admin Şifresi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Şifrenizi girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-300 mr-2" />
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Başarı Mesajı */}
            {success && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                  <p className="text-green-200 text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Giriş Yapılıyor...
                </div>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Güvenlik Uyarısı */}
          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
              <p className="text-yellow-200 text-xs">
                ⚠️ Bu alan sadece yetkili personel içindir. Yetkisiz erişim yasaktır.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">
            © 2024 TechStore Admin Panel
          </p>
        </div>
      </div>
    </div>
  )
}

