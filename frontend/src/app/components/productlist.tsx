"use client"

import { useEffect, useState } from "react"

export default function UrunListesi() {
    const [urunler, setUrunler] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/api/urun")
            .then(res => res.json())
            .then(data => setUrunler(data))
            .catch(err => console.error("Veri alınamadı:", err))
    }, [])

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-4">Ürün Listesi</h1>
            <ul>
                {urunler.map((urun: any) => (
                    <li key={urun.id}>
                        {urun.isim} - {urun.fiyat} TL
                    </li>
                ))}
            </ul>
        </div>
    )
}
