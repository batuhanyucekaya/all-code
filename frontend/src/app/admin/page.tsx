"use client"

import React, { useState, useEffect } from "react"
import AdminProtectedLayout from "../components/admin-protected-layout"
import { Plus, Edit, Trash2, Package, Users, Settings, Eye, EyeOff } from "lucide-react"

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
        alert(`Müşteri düzenleme: ${musteri.ad} ${musteri.soyad}`)
    }

    const handleMusteriDelete = async (id: number) => {
        if (!confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) return
        
        try {
            const res = await fetch(`http://localhost:5000/api/musteri/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                alert("Müşteri başarıyla silindi.")
                fetchMusteriler()
            } else {
                alert("Silme işlemi başarısız oldu.")
            }
        } catch {
            alert("Sunucuya bağlanırken hata oluştu.")
        }
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
        if (!confirm("Bu ürünü silmek istediğine emin misin?")) return
        try {
            const res = await fetch(`http://localhost:5000/api/urun/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                alert("Ürün başarıyla silindi.")
                fetchUrunler()
            } else {
                alert("Silme işlemi başarısız oldu.")
            }
        } catch {
            alert("Sunucuya bağlanırken hata oluştu.")
        }
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
                                    className="w-full sm:w-auto bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
                                >
                                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span>Yeni Ürün Ekle</span>
                                </button>
                            </div>

                            {/* Arama ve Filtreleme */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Arama */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
                                        <input
                                            type="text"
                                            placeholder="Ürün adı veya açıklama..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Kategori Filtresi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                setSelectedCategory(e.target.value)
                                                setSelectedSubCategory("")
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Tüm Kategoriler</option>
                                            {kategoriler.map((kategori) => (
                                                <option key={kategori.id} value={kategori.id}>
                                                    {kategori.ad}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Alt Kategori Filtresi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Alt Kategori</label>
                                        <select
                                            value={selectedSubCategory}
                                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={!selectedCategory}
                                        >
                                            <option value="">Tüm Alt Kategoriler</option>
                                            {selectedCategory && kategoriler
                                                .find(k => k.id === parseInt(selectedCategory))
                                                ?.alt.map((altKategori) => (
                                                    <option key={altKategori.id} value={altKategori.id}>
                                                        {altKategori.ad}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Sonuç Sayısı */}
                                    <div className="flex items-end">
                                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                                            <span className="text-sm text-gray-600">
                                                {filteredUrunler.length} ürün bulundu
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Loading */}
                            {isLoading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Yükleniyor...</p>
                                    </div>
                                </div>
                            )}

                            {/* Products Grid */}
                            {!isLoading && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {filteredUrunler.map((urun) => (
                                        <div key={urun.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                                            <div className="aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                                                <img
                                                    src={urun.resim_url}
                                                    alt={urun.isim}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            
                                            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2">
                                                {urun.isim}
                                            </h3>
                                            
                                            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                                                {urun.aciklama}
                                            </p>
                                            
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-lg font-bold text-gray-900">{urun.fiyat} ₺</span>
                                                <span className="text-sm text-gray-500">Stok: {urun.stok}</span>
                                            </div>
                                            
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setDuzenlenenUrun(urun)
                                                        setShowForm(true)
                                                    }}
                                                    className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm touch-manipulation flex items-center justify-center space-x-1"
                                                >
                                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span>Düzenle</span>
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleDelete(urun.id)}
                                                    className="flex-1 bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm touch-manipulation flex items-center justify-center space-x-1"
                                                >
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span>Sil</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Ürün Ekleme/Düzenleme Modal */}
                            {showForm && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <UrunForm
                                            kategoriler={kategoriler}
                                            urun={duzenlenenUrun}
                                            onCancel={() => setShowForm(false)}
                                            onSuccess={() => {
                                                setShowForm(false)
                                                fetchUrunler()
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeMenu === "Müşteriler" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Müşteriler</h2>
                            </div>

                            {/* Müşteri Listesi */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ad Soyad
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Telefon
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    İşlemler
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {musteriler.map((musteri) => (
                                                <tr key={musteri.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {musteri.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {musteri.ad} {musteri.soyad}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {musteri.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {musteri.telefon}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleMusteriEdit(musteri)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            Düzenle
                                                        </button>
                                                        <button
                                                            onClick={() => handleMusteriDelete(musteri.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Sil
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeMenu === "Ayarlar" && (
                        <div className="space-y-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Şifre Değiştir</h2>
                            
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md">
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mevcut Şifre
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Mevcut şifrenizi girin"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Yeni Şifre
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Yeni şifrenizi girin"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Yeni Şifre (Tekrar)
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Yeni şifrenizi tekrar girin"
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Şifreyi Değiştir
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
            </div>
        </AdminProtectedLayout>
    )
}

type UrunFormProps = {
    kategoriler: typeof kategoriler
    urun: Urun | null
    onCancel: () => void
    onSuccess: () => void
}

function UrunForm({ kategoriler, urun, onCancel, onSuccess }: UrunFormProps) {
    const [isim, setIsim] = useState("")
    const [aciklama, setAciklama] = useState("")
    const [fiyat, setFiyat] = useState(0)
    const [stok, setStok] = useState(0)
    const [kategoriId, setKategoriId] = useState(0)
    const [altKategoriId, setAltKategoriId] = useState(0)
    const [altKategoriler, setAltKategoriler] = useState<{ id: number; ad: string }[]>([])
    const [resimUrl, setResimUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [comments, setComments] = useState<Comment[]>([])
    const [showComments, setShowComments] = useState(false)

    useEffect(() => {
        if (urun) {
            setIsim(urun.isim)
            setAciklama(urun.aciklama)
            setFiyat(urun.fiyat)
            setStok(urun.stok)
            setKategoriId(urun.kategori_id)
            setResimUrl(urun.resim_url)
        } else {
            setIsim("")
            setAciklama("")
            setFiyat(0)
            setStok(0)
            setKategoriId(0)
            setAltKategoriId(0)
            setResimUrl("")
        }
    }, [urun])

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
        if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return
        
        try {
            const res = await fetch(`http://localhost:5000/api/comments/admin/${commentId}`, {
                method: "DELETE",
            })
            if (res.ok) {
                alert("Yorum başarıyla silindi.")
                if (urun) {
                    fetchComments(urun.id)
                }
            } else {
                alert("Yorum silme işlemi başarısız oldu.")
            }
        } catch (error) {
            alert("Sunucuya bağlanırken hata oluştu.")
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
                alert(urun ? "Ürün başarıyla güncellendi!" : "Ürün başarıyla eklendi!")
                onSuccess()
            } else {
                alert("İşlem başarısız oldu!")
            }
        } catch {
            alert("Sunucuya bağlanırken hata oluştu!")
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
                            Stok Miktarı *
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
                            onChange={(e) => setKategoriId(parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            required
                        >
                            <option value="">Kategori seçin</option>
                            {kategoriler.map((kategori) => (
                                <option key={kategori.id} value={kategori.id}>
                                    {kategori.ad}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Alt Kategori */}
                {altKategoriler.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Alt Kategori
                        </label>
                        <select
                            value={altKategoriId}
                            onChange={(e) => setAltKategoriId(parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                            <option value="">Alt kategori seçin</option>
                            {altKategoriler.map((altKategori) => (
                                <option key={altKategori.id} value={altKategori.id}>
                                    {altKategori.ad}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Açıklama */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Açıklama
                    </label>
                    <textarea
                        value={aciklama}
                        onChange={(e) => setAciklama(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Ürün açıklamasını girin"
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
