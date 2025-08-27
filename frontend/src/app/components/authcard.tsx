"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { useCart } from "../lib/cart-context"
import { toast } from "sonner"

const API_URL = "http://localhost:5000/api/musteri"

export default function AuthCard() {
    const router = useRouter()
    const { loadUserData } = useCart()
    const [isLogin, setIsLogin] = useState(true)

    // Form verileri için state
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [telephone, setTelephone] = useState("")
    const [message, setMessage] = useState("")
    const [loggedUserName, setLoggedUserName] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

    // Kayıt fonksiyonu
    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")
        setMessageType('')

        const musteri = {
            ad: fullName.split(" ")[0] || fullName,
            soyad: fullName.split(" ")[1] || "",
            email,
            telefon: telephone,
            password,
        }

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Cookie'leri dahil et
                body: JSON.stringify({
                    email,
                    password,
                    fullName,
                    telephone
                }),
            })

            if (res.ok) {
                const data = await res.json()
                // console.log('Register response:', data)
                
                const userName = `${data.ad} ${data.soyad}`.trim() || fullName
                setLoggedUserName(userName)
                setMessage("🎉 Kayıt başarılı! Giriş yapılıyor...")
                setMessageType('success')
                
                // Kullanıcı bilgilerini localStorage'a kaydet
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    name: userName,
                    email: data.email || email
                }))

                // Navbar'ı güncellemek için event gönder
                window.dispatchEvent(new CustomEvent('userLogin', { 
                    detail: { name: userName, id: data.id } 
                }))

                // Form temizleme
                setEmail("")
                setPassword("")
                setFullName("")
                setTelephone("")
                setIsLogin(true)
                
                // 2 saniye sonra anasayfaya yönlendir
                setTimeout(() => {
                    router.push("/")
                }, 2000)
            } else {
                const errorText = await res.text()
                setMessage(`❌ ${errorText || 'Kayıt başarısız! Lütfen bilgilerinizi kontrol edin.'}`)
                setMessageType('error')
            }
        } catch (error) {
            console.error('Register error:', error)
            setMessage("🌐 Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin.")
            setMessageType('error')
        } finally {
            setIsLoading(false)
        }
    }

    // Login fonksiyonu
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")
        setMessageType('')

        try {
            // console.log('Giriş denemesi:', { email, password })

            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include", // Cookie'leri dahil et
                body: JSON.stringify({ email, password }),
            })

            // console.log('Response status:', res.status)
            // console.log('Response headers:', res.headers)

            if (res.ok) {
                const data = await res.json()
                // console.log('Login response:', data)
                
                const userName = `${data.ad} ${data.soyad}`.trim() || "Kullanıcı"
                setLoggedUserName(userName)
                setMessage(`🎉 Giriş başarılı! Hoşgeldin, ${userName}`)
                setMessageType('success')

                // Kullanıcı bilgilerini localStorage'a kaydet
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    name: userName,
                    email: data.email || email
                }))

                // Navbar'ı güncellemek için event gönder
                window.dispatchEvent(new CustomEvent('userLogin', { 
                    detail: { name: userName, id: data.id } 
                }))

                // 2 saniye sonra anasayfaya yönlendir
                setTimeout(() => {
                    router.push("/")
                }, 2000)
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Bilinmeyen hata' }))
                console.error('Login error:', errorData)
                setMessage(`❌ ${errorData.message || 'Email veya şifre yanlış!'}`)
                setMessageType('error')
            }
        } catch (error) {
            console.error('Login catch error:', error)
            setMessage("🌐 Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin.")
            setMessageType('error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo ve Başlık */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                        <User className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isLogin ? "Hoş Geldiniz!" : "Hesap Oluştur"}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}
                    </p>
                </div>

                {/* Ana Kart */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    <form
                        onSubmit={e => {
                            if (isLogin) handleLogin(e)
                            else handleRegister(e)
                        }}
                        className="space-y-6"
                    >
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Email Adresi
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Şifre Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {/* Şifremi Unuttum Linki - Sadece giriş modunda göster */}
                            {isLogin && (
                                <div className="text-right">
                                    <a
                                        href="/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                    >
                                        Şifremi unuttum
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Kayıt formu için ek alanlar */}
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Ad Soyad
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Ad Soyad"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Telefon Numarası
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            placeholder="0555 123 45 67"
                                            value={telephone}
                                            onChange={e => setTelephone(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Mesaj */}
                        {message && (
                            <div className={`p-4 rounded-xl border ${
                                messageType === 'success' 
                                    ? 'bg-green-50 border-green-200 text-green-700' 
                                    : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                                <div className="flex items-center">
                                    {messageType === 'success' ? (
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 mr-2" />
                                    )}
                                    <p className="text-sm font-medium">{message}</p>
                                </div>
                            </div>
                        )}

                        {/* Giriş/Kayıt Butonu */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    {isLogin ? "Giriş Yapılıyor..." : "Kayıt Yapılıyor..."}
                                </>
                            ) : (
                                <>
                                    {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Giriş/Kayıt Değiştirme */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600 text-sm">
                            {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setMessage("")
                                    setMessageType('')
                                    setLoggedUserName(null)
                                    setEmail("")
                                    setPassword("")
                                    setFullName("")
                                    setTelephone("")
                                }}
                                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                            >
                                {isLogin ? "Hesap Oluştur" : "Giriş Yap"}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        © 2024 TechStore. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </div>
    )
}
