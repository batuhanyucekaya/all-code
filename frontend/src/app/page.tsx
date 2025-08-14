// app/page.tsx
import Link from "next/link"
import ProductCard from "./components/products-cards"
import CategoryFilter from "./components/CategoryFilter"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

// Kategori ID → Görünen İsim eşlemesi (Navbar ile aynı olacak şekilde doldur)
const CATEGORY_NAME_MAP: Record<number, string> = {
  1: "PC Hardware",
  2: "Headphones",
  3: "Phones & Accessories",
  4: "Computers & Accessories",
  5: "TV, Sound & Monitor",
  // alt kategori örnekleri:
  6: "Monitors",
  7: "Gaming Monitors",
  13: "Android Phones",
  14: "iOS Phones",
  15: "AI Phones",
  16: "Cases",
  17: "Screen Protectors",
  18: "Chargers",
  19: "Charging Cables",
  20: "Phone Holders",
  30: "TVs",
  31: "Monitors",
  32: "Speakers",
}

type SearchParams = { kategoriId?: string }


function getCatId(p: any): number | undefined {
  const c =
    p?.kategori_id ??
    p?.kategoriId ??
    p?.category_id ??
    p?.categoryId ??
    p?.kategori ??
    p?.category
  return typeof c === "number" ? c : undefined
}

export default async function Home({ searchParams }: { searchParams?: SearchParams }) {
  const selectedKategoriId = searchParams?.kategoriId ? Number(searchParams.kategoriId) : undefined

  const res = await fetch(`${API_URL}/api/urun`, { cache: "no-store" })
  const products: any[] = res.ok ? await res.json() : []


  const filteredByPrice = products.filter((p: any) => Number(p?.fiyat) < 300)


  const productCatIds = Array.from(
    new Set(
      filteredByPrice
        .map(getCatId)
        .filter((x): x is number => typeof x === "number")
    )
  )

  let categories: { id: number; ad: string }[] = []
  try {
    const cres = await fetch(`${API_URL}/api/kategori`, { cache: "no-store" })
    if (cres.ok) {
      const raw = await cres.json()
      const fromApi = Array.isArray(raw)
        ? raw
          .map((c: any) => {
            const id = c?.id ?? c?.kategori_id ?? c?.kategoriId
            if (typeof id !== "number") return null
            if (!productCatIds.includes(id)) return null
            const apiName = c?.ad ?? c?.isim ?? c?.name
            const ad = CATEGORY_NAME_MAP[id] ?? apiName ?? `Kategori ${id}`
            return { id, ad }
          })
          .filter(Boolean) as { id: number; ad: string }[]
        : []
      categories = fromApi
    }
  } catch {

  }


  if (categories.length === 0) {
    categories = productCatIds.map((id) => ({
      id,
      ad: CATEGORY_NAME_MAP[id] ?? `Kategori ${id}`,
    }))
  }


  let filtered = filteredByPrice
  if (selectedKategoriId && productCatIds.includes(selectedKategoriId)) {
    filtered = filteredByPrice.filter(
      (p: any) => getCatId(p) === selectedKategoriId
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">En İyi Teknoloji Ürünleri</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              %25&apos;e varan indirimlerle teknoloji dünyasını keşfedin
            </p>
          </div>
        </div>
      </div>


      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <CategoryFilter
            categories={categories}
            selectedId={
              selectedKategoriId && productCatIds.includes(selectedKategoriId)
                ? selectedKategoriId
                : undefined
            }
            showAllLabel="Tümü"
            paramKey="kategoriId"
          />
        </div>
      )}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">İndirimli Ürünler</h2>
          <p className="text-lg text-gray-600">En popüler ürünlerimizi keşfedin</p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600">
            Bu filtrelere uygun ürün bulunamadı.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
