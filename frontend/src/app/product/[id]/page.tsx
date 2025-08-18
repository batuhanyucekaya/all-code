"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { FaHeart, FaShoppingCart, FaStar, FaUser, FaCalendar, FaThumbsUp } from "react-icons/fa"
import { Heart, ShoppingCart, Star, User, Calendar, MessageSquare, Send, Minus, Plus } from "lucide-react"

type Comment = {
    id: number
    productId: number
    userId?: number
    rating: number
    body: string
    createdAt: string
}

type Product = {
    id: number
    isim: string
    aciklama: string
    fiyat: number
    stok: number
    kategori_id: number
    alt_kategori_id: number
    resim_url: string
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [urun, setUrun] = useState<Product | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [rating, setRating] = useState(5)
    const [quantity, setQuantity] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchProduct()
        fetchComments()
        
        // Debug: Authentication durumunu kontrol et
        const userData = localStorage.getItem("user")
        console.log("User data:", userData)
        if (userData) {
            try {
                const user = JSON.parse(userData)
                console.log("Parsed user:", user)
            } catch (e) {
                console.error("User data parse error:", e)
            }
        }
    }, [resolvedParams.id])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/urun/${resolvedParams.id}`)
            const data = await response.json()
            setUrun(data)
        } catch (error) {
            console.error("Ürün yüklenirken hata:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // YORUMLAR: 5000 PORTUNDAN ÇEK
    const fetchComments = async () => {
        try {
            const response = await fetch(
                `/api/comments?productId=${resolvedParams.id}`
            )
            const data = await response.json()
            setComments(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Yorumlar yüklenirken hata:", error)
            setComments([])
        }
    }

    // YORUM EKLEME: 5000 PORTUNA GÖNDER
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !urun) return

        // Kullanıcı girişi kontrolü
        const userData = localStorage.getItem("user")
        console.log("Submitting comment, user data:", userData)
        if (!userData) {
            alert("Yorum yapmak için giriş yapmanız gerekiyor!")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch("http://localhost:5000/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Cookie'leri dahil et
                body: JSON.stringify({
                    productId: urun.id,
                    rating: rating,
                    body: newComment,
                }),
            })

            if (response.ok) {
                setNewComment("")
                setRating(5)
                fetchComments()
            } else {
                const errorText = await response.text()
                console.error("Yorum ekleme hatası:", errorText)
                if (response.status === 401) {
                    alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.")
                } else {
                    alert("Yorum eklenirken bir hata oluştu: " + errorText)
                }
            }
        } catch (error) {
            console.error("Yorum eklenirken hata:", error)
            alert("Bağlantı hatası! Lütfen tekrar deneyin.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getAverageRating = () => {
        if (!Array.isArray(comments) || comments.length === 0) return "0.0"
        const total = comments.reduce((sum, comment) => sum + comment.rating, 0)
        return (total / comments.length).toFixed(1)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= (urun?.stok || 1)) {
            setQuantity(newQuantity)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!urun) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700 mb-4">Ürün Bulunamadı</h1>
                    <p className="text-gray-500">Aradığınız ürün mevcut değil.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Ürün Detay Kartı */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        {/* Ürün Resmi - Daha Küçük */}
                        <div className="lg:col-span-1">
                            <div className="relative group">
                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 max-w-sm mx-auto">
                                    <img
                                        src={urun.resim_url}
                                        alt={urun.isim}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                                    <Heart className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        </div>

                        {/* Ürün Bilgileri - Daha Geniş */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{urun.isim}</h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(parseFloat(getAverageRating()))
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        ({getAverageRating()}) {Array.isArray(comments) ? comments.length : 0} yorum
                                    </span>
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-green-600">
                                ₺{(urun.fiyat || 0).toLocaleString()}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${urun.stok > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-sm font-medium ${urun.stok > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {urun.stok > 0 ? `${urun.stok} adet stokta` : 'Stokta yok'}
                                </span>
                            </div>

                            <p className="text-gray-600 leading-relaxed">{urun.aciklama}</p>

                            {/* Miktar Seçici */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Miktar:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            disabled={quantity <= 1}
                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 text-center min-w-[60px] font-medium">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            disabled={quantity >= urun.stok}
                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                    Toplam: ₺{((urun.fiyat || 0) * quantity).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Sepete Ekle ({quantity})
                                </button>
                                <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-colors">
                                    Favorilere Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Yorumlar Bölümü */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Yorumlar ve Değerlendirmeler</h2>

                    {/* Yorum Formu */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yorum Yap</h3>
                        
                        {/* Kullanıcı durumu kontrolü */}
                        {(() => {
                            const userData = localStorage.getItem("user")
                            if (!userData) {
                                return (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                        <p className="text-yellow-800">
                                            Yorum yapmak için lütfen{" "}
                                            <a href="/login" className="text-blue-600 hover:underline font-medium">
                                                giriş yapın
                                            </a>
                                        </p>
                                    </div>
                                )
                            }
                            return null
                        })()}
                        
                        <form onSubmit={handleSubmitComment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Puanınız
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= rating
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Yorumunuz
                                </label>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Bu ürün hakkında düşüncelerinizi paylaşın..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows={4}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim() || !localStorage.getItem("user")}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
                            </button>
                        </form>
                    </div>

                    {/* Yorumlar Listesi */}
                    <div className="space-y-6">
                        {!Array.isArray(comments) || comments.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Kullanıcı {comment.userId || "Anonim"}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < comment.rating
                                                                    ? "text-yellow-400 fill-current"
                                                                    : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(comment.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{comment.body}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
