"use client"

import React, { useState, useEffect } from "react"
import AdminNavbar from "@/app/components/admin-navbar"
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
    const [showForm, setShowForm] = useState(false)
    const [duzenlenenUrun, setDuzenlenenUrun] = useState<Urun | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchUrunler = () => {
        setIsLoading(true)
        fetch("http://localhost:5000/api/urun")
            .then((res) => res.json())
            .then((data) => {
                setUrunler(data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.error("API bağlantı hatası:", err)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchUrunler()
    }, [])

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
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <AdminNavbar menuItems={menuItems} activeItem={activeMenu} onSelect={setActiveMenu} />

                {/* Ana içerik */}
                <div className="flex-grow p-8 overflow-auto">
                    {activeMenu === "Ürünler" && (
                        <>
                            {!showForm && (
                                <>
                                    {/* Header */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Ürün Yönetimi</h1>
                                                <p className="text-gray-600">Tüm ürünleri görüntüleyin ve yönetin</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setDuzenlenenUrun(null)
                                                    setShowForm(true)
                                                }}
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                                            >
                                                <Plus className="h-5 w-5 mr-2" />
                                                Yeni Ürün Ekle
                                            </button>
                                        </div>

                                        {/* İstatistikler */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                                <div className="flex items-center">
                                                    <div className="p-3 bg-blue-100 rounded-xl">
                                                        <Package className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                                                        <p className="text-2xl font-bold text-gray-800">{urunler.length}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                                <div className="flex items-center">
                                                    <div className="p-3 bg-green-100 rounded-xl">
                                                        <Package className="h-8 w-8 text-green-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-600">Stokta Olan</p>
                                                        <p className="text-2xl font-bold text-gray-800">
                                                            {urunler.filter(u => u.stok > 0).length}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                                <div className="flex items-center">
                                                    <div className="p-3 bg-red-100 rounded-xl">
                                                        <Package className="h-8 w-8 text-red-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-600">Stok Dışı</p>
                                                        <p className="text-2xl font-bold text-gray-800">
                                                            {urunler.filter(u => u.stok === 0).length}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ürün Tablosu */}
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-100">
                                            <h2 className="text-xl font-semibold text-gray-800">Ürün Listesi</h2>
                                        </div>
                                        
                                        {isLoading ? (
                                            <div className="p-8 text-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                                <p className="text-gray-600">Ürünler yükleniyor...</p>
                                            </div>
                                        ) : urunler.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 text-lg">Henüz ürün bulunmuyor</p>
                                                <p className="text-gray-500">Yeni ürün eklemek için yukarıdaki butonu kullanın</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ürün Adı</th>
                                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fiyat</th>
                                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stok</th>
                                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Durum</th>
                                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">İşlemler</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {urunler.map((urun) => (
                                                            <tr key={urun.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{urun.id}</td>
                                                                <td className="px-6 py-4">
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">{urun.isim}</p>
                                                                        <p className="text-sm text-gray-500 truncate max-w-xs">{urun.aciklama}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{urun.fiyat} ₺</td>
                                                                <td className="px-6 py-4 text-sm text-gray-900">{urun.stok}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        urun.stok > 0 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {urun.stok > 0 ? 'Stokta' : 'Stok Dışı'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center space-x-2">
                                                                        <button
                                                                            onClick={() => {
                                                                                setDuzenlenenUrun(urun)
                                                                                setShowForm(true)
                                                                            }}
                                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                                            title="Düzenle"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(urun.id)}
                                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                                            title="Sil"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {showForm && (
                                <UrunForm
                                    kategoriler={kategoriler}
                                    urun={duzenlenenUrun}
                                    onCancel={() => setShowForm(false)}
                                    onSuccess={() => {
                                        setShowForm(false)
                                        fetchUrunler()
                                    }}
                                />
                            )}
                        </>
                    )}

                    {/* Müşteriler Sayfası */}
                    {activeMenu === "Müşteriler" && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="text-center">
                                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Müşteri Yönetimi</h2>
                                <p className="text-gray-600">Bu özellik yakında eklenecek</p>
                            </div>
                        </div>
                    )}

                    {/* Ayarlar Sayfası */}
                    {activeMenu === "Ayarlar" && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="text-center">
                                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sistem Ayarları</h2>
                                <p className="text-gray-600">Bu özellik yakında eklenecek</p>
                            </div>
                        </div>
                    )}
                </div>
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
