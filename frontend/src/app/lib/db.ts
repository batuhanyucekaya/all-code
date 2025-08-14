import { Pool } from "pg"

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
})

// Slug → alt_kategori_id eşlemesi
export async function getProductsBySlug(slug: string) {
    const slugToAltKategoriId: Record<string, number> = {
        // PC Hardware
        "storage": 1,
        "software": 2,
        "accessories": 3,
        "network": 4,
        "office-products": 5,
        "monitors": 6,
        "gaming-monitors": 7,

        // Headphones
        "bluetooth-headphones": 8,
        "gaming-headset": 9,
        "wired-headphones": 10,
        "in-ear-headphones": 11,
        "over-ear-headphones": 12,

        // Phones & Accessories
        "android-phones": 13,
        "ios-phones": 14,
        "ai-phones": 15,
        "cases": 16,
        "screen-protectors": 17,
        "chargers": 18,
        "charging-cables": 19,
        "phone-holders": 20,

        // Computers & Accessories
        "desktop-pcs": 21,
        "laptops": 22,
        "mac": 23,
        "gaming-laptops": 24,
        "gaming-desktops": 25,
        "gaming-mouse": 26,
        "gaming-keyboard": 27,
        "gaming-headphones": 28,
        "gaming-accessories": 29,

        // TV, Sound, Monitor
        "tvs": 30,
        "monitors-again": 31, // eğer monitörleri iki yerde kullanıyorsan farklı id kullan
        "speakers": 32,


    }

    const altKategoriId = slugToAltKategoriId[slug]
    if (!altKategoriId) return []

    const query = `
    SELECT * FROM urunler
    WHERE alt_kategori_id = $1
  `
    const { rows } = await pool.query(query, [altKategoriId])
    return rows
}

// Rastgele ürünleri getir (3 adet)
export async function getRandomDiscountedProducts(limit: number = 3) {
    const query = `
        SELECT * FROM urunler
        ORDER BY RANDOM()
        LIMIT $1
    `
    const { rows } = await pool.query(query, [limit])
    return rows
}
