"use client"

import { useEffect, useState } from "react"
import { FiEdit, FiTrash2, FiX } from "react-icons/fi"
import AdminProtectedLayout from "../../components/admin-protected-layout"
import { toast } from "sonner"

interface Musteri {
    id: number
    ad: string
    soyad: string
    email: string
    telefon: string
}

export default function MusteriPage() {
    const [musteriler, setMusteriler] = useState<Musteri[]>([])
    const [duzenlenen, setDuzenlenen] = useState<Musteri | null>(null) // Düzenlenen müşteri
    const [form, setForm] = useState({
        ad: "",
        soyad: "",
        email: "",
        telefon: "",
    })

    useEffect(() => {
                    fetch("http://localhost:5000/api/musteri")
            .then((res) => res.json())
            .then((data) => setMusteriler(data))
            .catch((err) => console.error("Müşteri verisi alınamadı:", err))
    }, [])

    // Form alanları değişince state güncelle
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    // Düzenleme başlatma: modal aç, formu doldur
    const handleEditClick = (musteri: Musteri) => {
        setDuzenlenen(musteri)
        setForm({
            ad: musteri.ad,
            soyad: musteri.soyad,
            email: musteri.email,
            telefon: musteri.telefon,
        })
    }

    // Düzenleme kaydetme
    const handleSave = async () => {
        if (!duzenlenen) return
        try {
            const res = await fetch(`http://localhost:5000/api/musteri/${duzenlenen.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: duzenlenen.id, ...form }),
            })
            if (res.ok) {
                toast.success("Müşteri başarıyla güncellendi.")
                // Listeyi güncelle
                setMusteriler((prev) =>
                    prev.map((m) => (m.id === duzenlenen.id ? { id: m.id, ...form } : m))
                )
                setDuzenlenen(null) // modal kapat
            } else {
                toast.error("Güncelleme başarısız oldu.")
            }
        } catch (error) {
            toast.error("API hatası: " + error)
        }
    }

    // Silme fonksiyonu (önceki gibi)
    const handleDelete = async (id: number) => {
        if (!confirm("Bu müşteriyi silmek istediğine emin misin?")) return

        try {
            const res = await fetch(`http://localhost:5000/api/musteri/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                toast.success("Müşteri başarıyla silindi.")
                setMusteriler(musteriler.filter((m) => m.id !== id))
            } else {
                toast.error("Silme işlemi başarısız oldu.")
            }
        } catch (error) {
            toast.error("API hatası: " + error)
        }
    }

    return (
        <AdminProtectedLayout>
            <div className="p-6 bg-[#e6f2ff] min-h-screen relative">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">Müşteri Bilgileri</h1>

            <div className="space-y-4">
                {musteriler.map((musteri) => (
                    <div
                        key={musteri.id}
                        className="relative bg-white text-black p-4 rounded-md shadow hover:bg-gray-100 transition group"
                    >
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                                onClick={() => handleEditClick(musteri)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Düzenle"
                            >
                                <FiEdit size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(musteri.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Sil"
                            >
                                <FiTrash2 size={20} />
                            </button>
                        </div>

                        <p>
                            <strong>Ad:</strong> {musteri.ad}
                        </p>
                        <p>
                            <strong>Soyad:</strong> {musteri.soyad}
                        </p>
                        <p>
                            <strong>Email:</strong> {musteri.email}
                        </p>
                        <p>
                            <strong>Telefon:</strong> {musteri.telefon}
                        </p>
                    </div>
                ))}
            </div>

            {/* Düzenleme Modalı */}
            {duzenlenen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <button
                            onClick={() => setDuzenlenen(null)}
                            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                            title="Kapat"
                        >
                            <FiX size={24} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Müşteri Düzenle</h2>

                        <label className="block mb-2">
                            Ad:
                            <input
                                name="ad"
                                value={form.ad}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </label>

                        <label className="block mb-2">
                            Soyad:
                            <input
                                name="soyad"
                                value={form.soyad}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </label>

                        <label className="block mb-2">
                            Email:
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                type="email"
                            />
                        </label>

                        <label className="block mb-4">
                            Telefon:
                            <input
                                name="telefon"
                                value={form.telefon}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </label>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setDuzenlenen(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </AdminProtectedLayout>
    )
}
