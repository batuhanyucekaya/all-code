"use client"

import React, { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Email gönderme işlemi - backend'e gönder
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        toast.error("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.")
      }
    } catch (error) {
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            İletişim
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Sorularınız mı var? Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* İletişim Bilgileri */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
              <p className="text-gray-600 mb-8">
                TechStore olarak müşterilerimizin memnuniyeti bizim için en önemli önceliktir. 
                Herhangi bir sorunuz veya öneriniz varsa, aşağıdaki kanallardan bize ulaşabilirsiniz.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600 mb-2">info@techstore.com</p>
                  <p className="text-sm text-gray-500">7/24 email desteği</p>
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Telefon</h3>
                  <p className="text-gray-600 mb-2">+90 (212) 123 45 67</p>
                  <p className="text-sm text-gray-500">Pazartesi - Cuma: 09:00 - 18:00</p>
                </div>
              </div>

              {/* Adres */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Adres</h3>
                  <p className="text-gray-600 mb-2">
                    Teknoloji Mahallesi, No:123<br />
                    İstanbul, Türkiye
                  </p>
                  <p className="text-sm text-gray-500">Mağaza ziyaretleri için randevu alın</p>
                </div>
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Çalışma Saatleri</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pazartesi - Cuma</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cumartesi</span>
                  <span className="font-medium">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pazar</span>
                  <span className="font-medium">Kapalı</span>
                </div>
              </div>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mesaj Gönderin</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Adınız ve soyadınız"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Konu *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Mesajınızın konusu"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Mesaj Gönder</span>
                  </>
                )}
              </button>
            </form>

            {/* Bilgi Notu */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Hızlı Yanıt</h4>
                  <p className="text-sm text-blue-700">
                    Mesajınızı aldıktan sonra en kısa sürede size dönüş yapacağız. 
                    Genellikle 24 saat içinde yanıt veriyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
