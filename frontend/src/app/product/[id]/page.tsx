import { pool } from "../../../app/lib/db"
import { notFound } from "next/navigation"
import { FaHeart, FaShoppingCart } from "react-icons/fa"

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { rows } = await pool.query("SELECT * FROM urunler WHERE id = $1", [params.id])
    const urun = rows[0]
    if (!urun) return notFound()

    return (
        <div className="p-10 flex flex-col md:flex-row bg-[#e6f7f8] min-h-screen gap-8 items-start justify-center">

            {/* Sol: Ürün Resmi */}
            <div className="w-full md:w-1/3">
                <img
                    src={urun.resim_url}
                    alt={urun.isim}
                    className="rounded shadow-md w-full object-contain max-h-[400px] bg-white p-2"
                />
            </div>

            {/* Orta: Bilgi */}
            <div className="w-full md:w-1/2 space-y-4 bg-[#004466] text-white p-6 rounded shadow-md">
                <h1 className="text-2xl font-bold">{urun.isim}</h1>
                <p className="text-gray-200">{urun.aciklama}</p>
                <p className="text-green-400 text-xl font-bold">{urun.fiyat} ₺</p>
            </div>

            {/* Sağ: Sepet ve Favori */}
            <div className="w-full md:w-1/6 space-y-4 text-center bg-[#002f3f] p-6 rounded shadow-md text-white">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2">
                    <FaShoppingCart /> Sepete Ekle
                </button>

                <button className="w-full bg-red-500 hover:bg-red-600 py-2 px-4 rounded flex items-center justify-center gap-2">
                    <FaHeart /> Favorilere Ekle
                </button>
            </div>
        </div>
    )
}
