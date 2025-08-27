"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { FaHeart, FaShoppingCart, FaStar, FaUser, FaCalendar, FaThumbsUp } from "react-icons/fa"
import { Heart, ShoppingCart, Star, User, Calendar, MessageSquare, Send, Minus, Plus, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "../../lib/cart-context"
import { toast } from "sonner"

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
    const router = useRouter()
    const { addToCart, addToFavorites, removeFromFavorites, isInFavorites } = useCart()
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
        // console.log("User data:", userData)
        if (userData) {
            try {
                const user = JSON.parse(userData)
                // console.log("Parsed user:", user)
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
        // console.log("Submitting comment, user data:", userData)
        if (!userData) {
            toast.error("Yorum yapmak için giriş yapmanız gerekiyor!")
            return
        }

        setIsSubmitting(true)
        try {
            const userDataObj = JSON.parse(userData);
            const response = await fetch("http://localhost:5000/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userDataObj.id.toString(),
                },
                body: JSON.stringify({
                    productId: urun.id,
                    rating: rating,
                    body: newComment,
                }),
            })

            if (response.ok) {
                setNewComment("")
                setRating(5)
                fetchComments() // Yorumları yenile
                toast.success("Yorum başarıyla eklendi!")
            } else {
                toast.error("Yorum eklenirken bir hata oluştu!")
            }
        } catch (error) {
            console.error("Yorum ekleme hatası:", error)
            toast.error("Yorum eklenirken bir hata oluştu!")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoBack = () => {
        router.back()
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

    const handleAddToCart = () => {
        if (urun) {
            addToCart(urun, quantity)

            // Başarı mesajı göster
            const button = document.querySelector('[data-cart-button]') as HTMLButtonElement
            if (button) {
                const originalText = button.innerHTML
                button.innerHTML = '<span class="text-green-300">✓ Sepete Eklendi!</span>'
                button.classList.add('bg-green-600')
                button.classList.remove('bg-blue-600', 'hover:bg-blue-700')

                setTimeout(() => {
                    button.innerHTML = originalText
                    button.classList.remove('bg-green-600')
                    button.classList.add('bg-blue-600', 'hover:bg-blue-700')
                }, 2000)
            }
        }
    }

    const handleToggleFavorite = () => {
        if (urun) {
            if (isInFavorites(urun.id)) {
                removeFromFavorites(urun.id)
            } else {
                addToFavorites(urun)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Ürün yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (!urun) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Ürün bulunamadı</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Geri Tuşu */}
                <div className="mb-4 sm:mb-6">
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors touch-manipulation"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm sm:text-base font-medium">Geri Dön</span>
                    </button>
                </div>

                {/* Ürün Detayları */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Ürün Resmi */}
                        <div className="p-4 sm:p-6">
                            <div className="relative">
                                <img
                                    src={urun.resim_url}
                                    alt={urun.isim}
                                    className="w-full h-64 sm:h-80 md:h-96 object-contain bg-gray-50 rounded-lg"
                                />
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`absolute top-2 right-2 p-2 backdrop-blur-sm rounded-full transition-all duration-200 shadow-lg touch-manipulation ${urun && isInFavorites(urun.id)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/80 hover:bg-red-500 hover:text-white'
                                        }`}
                                >
                                    <Heart className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Ürün Bilgileri */}
                        <div className="p-4 sm:p-6 lg:p-8">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{urun.isim}</h1>

                            <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                                {urun.aciklama}
                            </p>

                            {/* Fiyat */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">{urun.fiyat} ₺</span>
                                    <span className="text-lg text-gray-500 line-through">{(urun.fiyat * 1.33).toFixed(0)} ₺</span>
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                                        %25 İndirim
                                    </span>
                                </div>
                                <p className="text-sm text-green-600 font-medium">Stok: {urun.stok} adet</p>
                            </div>

                            {/* Miktar Seçimi */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Miktar</label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Aksiyon Butonları */}
                            <div className="space-y-3 sm:space-y-4">
                                <button
                                    data-cart-button
                                    onClick={handleAddToCart}
                                    className="w-full bg-blue-600 text-white py-3 sm:py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-semibold text-base sm:text-lg touch-manipulation"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    <span>Sepete Ekle</span>
                                </button>

                                <button
                                    onClick={handleToggleFavorite}
                                    className={`w-full py-3 sm:py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 font-semibold text-base sm:text-lg touch-manipulation ${urun && isInFavorites(urun.id)
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Heart className="h-5 w-5" />
                                    <span>{urun && isInFavorites(urun.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Yorumlar Bölümü */}
                <div className="mt-8 sm:mt-12">
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Yorumlar ({comments.length})</h2>

                        {/* Yorum Formu */}
                        <form onSubmit={handleSubmitComment} className="mb-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Değerlendirme</label>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="p-1 touch-manipulation"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Yorumunuz</label>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                                        rows={4}
                                        placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Gönderiliyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            <span>Yorum Gönder</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Yorumlar Listesi */}
                        <div className="space-y-4 sm:space-y-6">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Kullanıcı</p>
                                                    <div className="flex items-center space-x-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-3 w-3 sm:h-4 sm:w-4 ${star <= comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs sm:text-sm text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{comment.body}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
