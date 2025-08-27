"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [isValidToken, setIsValidToken] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<"success" | "error" | "">("")
    
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    useEffect(() => {
        validateToken()
    }, [token])

    const validateToken = async () => {
        if (!token) {
            setMessage("Geçersiz token. Lütfen email'deki linki kullanın.")
            setMessageType("error")
            setIsValidating(false)
            return
        }

        try {
            const response = await fetch(`http://localhost:5000/api/passwordreset/validate?token=${token}`)
            const data = await response.json()

            if (response.ok) {
                setIsValidToken(true)
                setMessage("Token geçerli. Yeni şifrenizi belirleyin.")
                setMessageType("success")
            } else {
                setIsValidToken(false)
                setMessage(data.message || "Geçersiz veya süresi dolmuş token.")
                setMessageType("error")
            }
        } catch (error) {
            setIsValidToken(false)
            setMessage("Token doğrulama hatası.")
            setMessageType("error")
        } finally {
            setIsValidating(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")
        setMessageType("")

        if (newPassword !== confirmPassword) {
            setMessage("Şifreler eşleşmiyor.")
            setMessageType("error")
            setIsLoading(false)
            return
        }

        if (newPassword.length < 6) {
            setMessage("Şifre en az 6 karakter olmalıdır.")
            setMessageType("error")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("http://localhost:5000/api/passwordreset/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                    confirmPassword,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage("Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...")
                setMessageType("success")
                setTimeout(() => {
                    router.push("/login")
                }, 3000)
            } else {
                setMessage(data.message || "Şifre güncelleme hatası.")
                setMessageType("error")
            }
        } catch (error) {
            setMessage("Bağlantı hatası. Lütfen tekrar deneyin.")
            setMessageType("error")
        } finally {
            setIsLoading(false)
        }
    }

    if (isValidating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Token doğrulanıyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Giriş sayfasına dön
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni Şifre Belirle</h1>
                    <p className="text-gray-600">
                        Güvenli bir şifre seçin ve tekrar girin.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Message */}
                    {message && (
                        <div className={`p-4 rounded-lg flex items-start space-x-3 mb-6 ${
                            messageType === "success" 
                                ? "bg-green-50 border border-green-200 text-green-800" 
                                : "bg-red-50 border border-red-200 text-red-800"
                        }`}>
                            {messageType === "success" ? (
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            )}
                            <p className="text-sm">{message}</p>
                        </div>
                    )}

                    {isValidToken ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Yeni Şifre
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="En az 6 karakter"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Şifre Tekrar
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Şifrenizi tekrar girin"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Güncelleniyor...
                                    </div>
                                ) : (
                                    "Şifreyi Güncelle"
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">
                                Geçersiz veya süresi dolmuş token. Lütfen yeni bir şifre sıfırlama talebinde bulunun.
                            </p>
                            <Link
                                href="/forgot-password"
                                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Yeni Şifre Sıfırlama Talebi
                            </Link>
                        </div>
                    )}
                </div>

                {/* Security Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">🔒 Güvenlik İpuçları</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• En az 6 karakter kullanın</li>
                        <li>• Büyük/küçük harf, rakam ve sembol kullanın</li>
                        <li>• Kişisel bilgilerinizi şifre olarak kullanmayın</li>
                        <li>• Şifrenizi güvenli bir yerde saklayın</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
