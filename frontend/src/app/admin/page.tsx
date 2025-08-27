"use client"

import React, { useState, useEffect } from "react"
import AdminProtectedLayout from "../components/admin-protected-layout"
import { Plus, Edit, Trash2, Package, Users, Settings, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import ConfirmDialog from "../components/confirm-dialog"

type Urun = {
    id: number
    isim: string
    aciklama: string
    fiyat: number
    stok: number
    kategori_id: number
    alt_kategori_id: number
    resim_url: string
}

type Musteri = {
    id: number
    ad: string
    soyad: string
    email: string
    telefon: string
}

type Comment = {
    id: number
    productId: number
    userId: number
    userName: string
    rating: number
    body: string
    createdAt: string
}

const kategoriler = [
    {
        id: 1,
        ad: "PC Hardware",
        alt: [
            { id: 1, ad: "Storage" },
            { id: 2, ad: "Software" },
            { id: 3, ad: "Accessories" },
            { id: 4, ad: "Network" },
            { id: 5, ad: "Office Products" },
            { id: 6, ad: "Monitors" },
            { id: 7, ad: "Gaming Monitors" },
        ],
    },
    {
        id: 2,
        ad: "Headphones",
        alt: [
            { id: 8, ad: "Bluetooth Headphones" },
            { id: 9, ad: "Gaming Headset" },
            { id: 10, ad: "Wired Headphones" },
            { id: 11, ad: "In-Ear Headphones" },
            { id: 12, ad: "Over-Ear Headphones" },
        ],
    },
    {
        id: 3,
        ad: "Phones & Accessories",
        alt: [
            { id: 13, ad: "Android Phones" },
            { id: 14, ad: "iOS Phones" },
            { id: 15, ad: "AI Phones" },
            { id: 16, ad: "Cases" },
            { id: 17, ad: "Chargers" },
            { id: 18, ad: "Screen Protectors" },
            { id: 19, ad: "Charging Cables" },
            { id: 20, ad: "Phone Holders" },
        ],
    },
    {
        id: 4,
        ad: "Computers & Accessories",
        alt: [
            { id: 21, ad: "Desktop PCs" },
            { id: 22, ad: "Laptops" },
            { id: 23, ad: "Mac" },
            { id: 24, ad: "Gaming Laptops" },
            { id: 25, ad: "Gaming Desktops" },
            { id: 26, ad: "Gaming Mouse" },
            { id: 27, ad: "Gaming Keyboard" },
            { id: 28, ad: "Gaming Headset" },
            { id: 29, ad: "Gaming Accessories" },
        ],
    },
    {
        id: 5,
        ad: "TV, Sound & Monitor",
        alt: [
            { id: 30, ad: "TVs" },
            { id: 31, ad: "Monitors" },
            { id: 32, ad: "Speakers" },
        ],
    },
]

const menuItems = ["Ürünler", "Müşteriler", "Ayarlar"]

// Ürün Form Bileşeni
function UrunForm({ urun, onSuccess, onCancel }: { urun: Urun | null, onSuccess: () => void, onCancel: () => void }) {
    const [isim, setIsim] = useState(urun?.isim || "")
    const [aciklama, setAciklama] = useState(urun?.aciklama || "")
    const [fiyat, setFiyat] = useState(urun?.fiyat || 0)
    const [stok, setStok] = useState(urun?.stok || 0)
    const [kategoriId, setKategoriId] = useState(urun?.kategori_id || 0)
    const [altKategoriId, setAltKategoriId] = useState(urun?.alt_kategori_id || 0)
    const [resimUrl, setResimUrl] = useState(urun?.resim_url || "")
    const [isLoading, setIsLoading] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState<Comment[]>([])
    const [altKategoriler, setAltKategoriler] = useState<{ id: number; ad: string }[]>([])

    useEffect(() => {
        if (kategoriId) {
            const kategori = kategoriler.find(k => k.id === kategoriId)
            setAltKategoriler(kategori?.alt || [])
            setAltKategoriId(0)
        } else {
            setAltKategoriler([])
        }
    }, [kategoriId, kategoriler])

    // Yorumları yükle
    useEffect(() => {
        if (urun && showComments) {
            fetchComments(urun.id)
        }
    }, [urun, showComments])

    const fetchComments = async (productId: number) => {
        try {
            const res = await fetch(`http://localhost:5000/api/comments?productId=${productId}`)
            if (res.ok) {
                const data = await res.json()
                setComments(data)
            }
        } catch (error) {
            console.error("Yorumlar yüklenirken hata:", error)
        }
    }

    const handleDeleteComment = async (commentId: number) => {
        if (confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
            try {
                const res = await fetch(`http://localhost:5000/api/comments/admin/${commentId}`, {
                    method: "DELETE",
                })
                if (res.ok) {
                    toast.success("Yorum başarıyla silindi.")
                    if (urun) {
                        fetchComments(urun.id)
                    }
                } else {
                    toast.error("Yorum silme işlemi başarısız oldu.")
                }
            } catch (error) {
                toast.error("Sunucuya bağlanırken hata oluştu.")
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const urunData = {
            isim,
            aciklama,
            fiyat: parseFloat(fiyat.toString()),
            stok: parseInt(stok.toString()),
            kategori_id: kategoriId,
            alt_kategori_id: altKategoriId,
            resim_url: resimUrl,
        }

        try {
            const url = urun ? `http://localhost:5000/api/urun/${urun.id}` : "http://localhost:5000/api/urun"
            const method = urun ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(urunData),
            })

            if (res.ok) {
                toast.success(urun ? "Ürün başarıyla güncellendi!" : "Ürün başarıyla eklendi!")
                onSuccess()
            } else {
                toast.error("İşlem başarısız oldu!")
            }
        } catch {
            toast.error("Sunucuya bağlanırken hata oluştu!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {urun ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                </h2>
                <p className="text-gray-600">
                    {urun ? "Ürün bilgilerini güncelleyin" : "Yeni ürün bilgilerini girin"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ürün Adı */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Ürün Adı *
                        </label>
                        <input
                            type="text"
                            value={isim}
                            onChange={(e) => setIsim(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Ürün adını girin"
                            required
                        />
                    </div>

                    {/* Fiyat */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Fiyat (₺) *
                        </label>
                        <input
                            type="number"
                            value={fiyat}
                            onChange={(e) => setFiyat(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    {/* Stok */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Stok *
                        </label>
                        <input
                            type="number"
                            value={stok}
                            onChange={(e) => setStok(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="0"
                            min="0"
                            required
                        />
                    </div>

                    {/* Kategori */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Kategori *
                        </label>
                        <select
                            value={kategoriId}
                            onChange={(e) => setKategoriId(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            required
                        >
                            <option value={0}>Kategori Seçin</option>
                            {kategoriler.map((kategori) => (
                                <option key={kategori.id} value={kategori.id}>
                                    {kategori.ad}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Alt Kategori */}
                    {kategoriId > 0 && (
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Alt Kategori *
                            </label>
                            <select
                                value={altKategoriId}
                                onChange={(e) => setAltKategoriId(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                required
                            >
                                <option value={0}>Alt Kategori Seçin</option>
                                {altKategoriler.map((alt) => (
                                    <option key={alt.id} value={alt.id}>
                                        {alt.ad}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Açıklama */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Açıklama *
                    </label>
                    <textarea
                        value={aciklama}
                        onChange={(e) => setAciklama(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Ürün açıklamasını girin"
                        required
                    />
                </div>

                {/* Resim URL */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Resim URL
                    </label>
                    <input
                        type="url"
                        value={resimUrl}
                        onChange={(e) => setResimUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="https://example.com/resim.jpg"
                    />
                </div>

                {/* Yorumlar Bölümü - Sadece düzenleme modunda göster */}
                {urun && (
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Ürün Yorumları</h3>
                            <button
                                type="button"
                                onClick={() => setShowComments(!showComments)}
                                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                {showComments ? "Yorumları Gizle" : "Yorumları Göster"}
                            </button>
                        </div>

                        {showComments && (
                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Bu ürün için henüz yorum yok.</p>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-gray-800">
                                                            {comment.userName}
                                                        </span>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg
                                                                    key={i}
                                                                    className={`w-4 h-4 ${
                                                                        i < comment.rating ? "text-yellow-400" : "text-gray-300"
                                                                    }`}
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700">{comment.body}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                                                    title="Yorumu Sil"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Butonlar */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-300"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {urun ? "Güncelleniyor..." : "Ekleniyor..."}
                            </>
                        ) : (
                            urun ? "Güncelle" : "Ekle"
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

// Ana admin sayfası bileşeni
export default function AdminUrunlerPage() {
    const [activeMenu, setActiveMenu] = useState("Ürünler")
    const [urunler, setUrunler] = useState<Urun[]>([])
    const [filteredUrunler, setFilteredUrunler] = useState<Urun[]>([])
    const [musteriler, setMusteriler] = useState<Musteri[]>([])
    const [showForm, setShowForm] = useState(false)
    const [duzenlenenUrun, setDuzenlenenUrun] = useState<Urun | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedSubCategory, setSelectedSubCategory] = useState("")
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean
        title: string
        message: string
        onConfirm: () => void
        type: "danger" | "warning" | "info"
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        type: "danger"
    })

    const fetchUrunler = () => {
        setIsLoading(true)
        fetch("http://localhost:5000/api/urun")
            .then((res) => res.json())
            .then((data) => {
                setUrunler(data)
                setFilteredUrunler(data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error("Ürünler yüklenirken hata:", error)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchUrunler()
        fetchMusteriler()
    }, [])

    const fetchMusteriler = () => {
        fetch("http://localhost:5000/api/musteri")
            .then((res) => res.json())
            .then((data) => setMusteriler(data))
            .catch((error) => {
                console.error("Müşteriler yüklenirken hata:", error)
            })
    }

    const handleMusteriEdit = (musteri: Musteri) => {
        // Müşteri düzenleme modal'ı açılabilir
        toast.info(`Müşteri düzenleme: ${musteri.ad} ${musteri.soyad}`)
    }

    const handleMusteriDelete = async (id: number) => {
        setConfirmDialog({
            isOpen: true,
            title: "Müşteri Sil",
            message: "Bu müşteriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            onConfirm: async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/musteri/${id}`, {
                        method: "DELETE",
                    })
                    if (res.ok) {
                        toast.success("Müşteri başarıyla silindi.")
                        fetchMusteriler()
                    } else {
                        toast.error("Silme işlemi başarısız oldu.")
                    }
                } catch {
                    toast.error("Sunucuya bağlanırken hata oluştu.")
                }
            },
            type: "danger"
        })
    }

    // Arama ve filtreleme fonksiyonu
    useEffect(() => {
        let filtered = urunler

        // Metin araması
        if (searchTerm) {
            filtered = filtered.filter(urun =>
                urun.isim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                urun.aciklama.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Kategori filtresi
        if (selectedCategory) {
            const categoryId = parseInt(selectedCategory)
            filtered = filtered.filter(urun => urun.kategori_id === categoryId)
        }

        // Alt kategori filtresi
        if (selectedSubCategory) {
            const subCategoryId = parseInt(selectedSubCategory)
            filtered = filtered.filter(urun => urun.alt_kategori_id === subCategoryId)
        }

        setFilteredUrunler(filtered)
    }, [urunler, searchTerm, selectedCategory, selectedSubCategory])

    const handleDelete = async (id: number) => {
        setConfirmDialog({
            isOpen: true,
            title: "Ürün Sil",
            message: "Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            onConfirm: async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/urun/${id}`, {
                        method: "DELETE",
                    })
                    if (res.ok) {
                        toast.success("Ürün başarıyla silindi.")
                        fetchUrunler()
                    } else {
                        toast.error("Silme işlemi başarısız oldu.")
                    }
                } catch {
                    toast.error("Sunucuya bağlanırken hata oluştu.")
                }
            },
            type: "danger"
        })
    }

    return (
        <AdminProtectedLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Paneli</h1>
                    <p className="text-sm sm:text-base text-gray-600">Ürünleri ve sistemi yönetin</p>
                </div>

                {/* Menu Tabs */}
                <div className="border-b border-gray-200 mb-6 sm:mb-8">
                    <nav className="-mb-px flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar">
                        {menuItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveMenu(item)}
                                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                                    activeMenu === item
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                {activeMenu === "Ürünler" && (
                    <div>
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Ürünler</h2>
                            <button
                                onClick={() => {
                                    setDuzenlenenUrun(null)
                                    setShowForm(true)
                                }}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Yeni Ürün Ekle
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Ürün ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value)
                                    setSelectedSubCategory("")
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tüm Kategoriler</option>
                                {kategoriler.map((kategori) => (
                                    <option key={kategori.id} value={kategori.id}>
                                        {kategori.ad}
                                    </option>
                                ))}
                            </select>
                            {selectedCategory && (
                                <select
                                    value={selectedSubCategory}
                                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tüm Alt Kategoriler</option>
                                    {kategoriler
                                        .find((k) => k.id === parseInt(selectedCategory))
                                        ?.alt.map((alt) => (
                                            <option key={alt.id} value={alt.id}>
                                                {alt.ad}
                                            </option>
                                        ))}
                                </select>
                            )}
                        </div>

                        {/* Products Grid */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredUrunler.map((urun) => (
                                    <div key={urun.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                            {urun.resim_url ? (
                                                <img
                                                    src={urun.resim_url}
                                                    alt={urun.isim}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                                                    <Package className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{urun.isim}</h3>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{urun.aciklama}</p>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-lg font-bold text-blue-600">₺{urun.fiyat}</span>
                                                <span className="text-sm text-gray-500">Stok: {urun.stok}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setDuzenlenenUrun(urun)
                                                        setShowForm(true)
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(urun.id)}
                                                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeMenu === "Müşteriler" && (
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Müşteriler</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {musteriler.map((musteri) => (
                                <div key={musteri.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="font-semibold text-gray-900">
                                                    {musteri.ad} {musteri.soyad}
                                                </h3>
                                                <p className="text-sm text-gray-500">{musteri.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Telefon:</span> {musteri.telefon}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleMusteriEdit(musteri)}
                                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleMusteriDelete(musteri.id)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeMenu === "Ayarlar" && (
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Ayarlar</h2>
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                            <p className="text-gray-600">Ayarlar sayfası yakında eklenecek...</p>
                        </div>
                    </div>
                )}

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowForm(false)} />
                        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <UrunForm
                                urun={duzenlenenUrun}
                                onSuccess={() => {
                                    setShowForm(false)
                                    fetchUrunler()
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Confirm Dialog */}
                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                    type={confirmDialog.type}
                />
            </div>
        </AdminProtectedLayout>
    )
}
