"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<"success" | "error" | "">("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")
        setMessageType("")

        try {
            const response = await fetch("http://localhost:5000/api/passwordreset/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage("Şifre sıfırlama linki email adresinize gönderildi. Lütfen email'inizi kontrol edin.")
                setMessageType("success")
                setEmail("")
            } else {
                setMessage(data.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
                setMessageType("error")
            }
        } catch (error) {
            setMessage("Bağlantı hatası. Lütfen tekrar deneyin.")
            setMessageType("error")
        } finally {
            setIsLoading(false)
        }
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Şifremi Unuttum</h1>
                    <p className="text-gray-600">
                        Email adresinizi girin, size şifre sıfırlama linki göndereceğiz.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Adresi
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`p-4 rounded-lg flex items-start space-x-3 ${
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Gönderiliyor...
                                </div>
                            ) : (
                                "Şifre Sıfırlama Linki Gönder"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Hesabınız yok mu?{" "}
                            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                                Kayıt ol
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Bilgilendirme</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Şifre sıfırlama linki 1 saat geçerlidir</li>
                        <li>• Email'inizi kontrol etmeyi unutmayın</li>
                        <li>• Spam klasörünü de kontrol edin</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
