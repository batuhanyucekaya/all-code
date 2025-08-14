"use client"

import React, { useState } from "react"

export default function AdminCard() {
    const [isim, setIsim] = useState("")
    const [aciklama, setAciklama] = useState("")
    const [fiyat, setFiyat] = useState("")
    const [stok, setStok] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [kategoriId, setKategoriId] = useState<number | null>(null)
    const [altKategoriId, setAltKategoriId] = useState<number | null>(null)

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({
            kategoriId,
            altKategoriId,
            isim,
            aciklama,
            fiyat,
            stok,
            image,
        })
        alert("Form verileri konsola yazdırıldı!")
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#e6f7ff] to-[#cce7ff]">
            <form
                onSubmit={handleSubmit}
                className="bg-white text-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-xl space-y-6"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
                    Admin Panel – Ürün Ekle
                </h2>

                {/* Kategori Seçimi */}
                <div>
                    <label className="block mb-1 font-medium">Kategori:</label>
                    <select
                        value={kategoriId ?? ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value)
                            setKategoriId(selectedId)
                            setAltKategoriId(null)
                        }}
                        className="w-full p-2 rounded border border-gray-300"
                        required
                    >
                        <option value="">Kategori Seçin</option>
                        {kategoriler.map((kategori) => (
                            <option key={kategori.id} value={kategori.id}>
                                {kategori.ad}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Alt Kategori Seçimi */}
                {kategoriId !== null && (
                    <div>
                        <label className="block mb-1 font-medium">Alt Kategori:</label>
                        <select
                            value={altKategoriId ?? ""}
                            onChange={(e) => setAltKategoriId(parseInt(e.target.value))}
                            className="w-full p-2 rounded border border-gray-300"
                            required
                        >
                            <option value="">Alt Kategori Seçin</option>
                            {kategoriler
                                .find((k) => k.id === kategoriId)
                                ?.alt.map((alt) => (
                                    <option key={alt.id} value={alt.id}>
                                        {alt.ad}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}

                {/* Ürün İsmi */}
                <div>
                    <label className="block mb-1 font-medium">Ürün İsmi:</label>
                    <input
                        type="text"
                        value={isim}
                        onChange={(e) => setIsim(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300"
                        required
                    />
                </div>

                {/* Açıklama */}
                <div>
                    <label className="block mb-1 font-medium">Açıklama:</label>
                    <textarea
                        value={aciklama}
                        onChange={(e) => setAciklama(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300"
                        required
                    />
                </div>

                {/* Fiyat */}
                <div>
                    <label className="block mb-1 font-medium">Fiyat:</label>
                    <input
                        type="number"
                        value={fiyat}
                        onChange={(e) => setFiyat(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300"
                        required
                    />
                </div>

                {/* Stok */}
                <div>
                    <label className="block mb-1 font-medium">Stok:</label>
                    <input
                        type="number"
                        value={stok}
                        onChange={(e) => setStok(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300"
                        required
                    />
                </div>

                {/* Resim */}
                <div>
                    <label className="block mb-1 font-medium">Ürün Görseli:</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="w-full p-2 rounded border border-gray-300 bg-white text-gray-700"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full"
                >
                    Ürünü Ekle
                </button>
            </form>
        </div>
    )
}
