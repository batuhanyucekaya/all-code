import { NextResponse } from "next/server"
import { getRandomDiscountedProducts } from "@/app/lib/db"

export async function GET() {
    try {
        const products = await getRandomDiscountedProducts(3)
        return NextResponse.json(products)
    } catch (error) {
        console.error("API Hatası:", error)
        return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
    }
}
