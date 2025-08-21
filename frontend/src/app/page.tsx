// app/page.tsx
import ProductCard from "./components/products-cards"
import CategoryFilter from "./components/CategoryFilter"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

// Kategori ID → Görünen İsim eşlemesi
const CATEGORY_NAME_MAP: Record<number, string> = {
  1: "PC Hardware",
  2: "Headphones",
  3: "Phones & Accessories",
  4: "Computers & Accessories",
  5: "TV, Sound & Monitor",
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
  const resolvedSearchParams = await searchParams
  const selectedKategoriId = resolvedSearchParams?.kategoriId ? Number(resolvedSearchParams.kategoriId) : undefined

  // Ürünleri çek
  const res = await fetch(`${API_URL}/api/urun`, { cache: "no-store" })
  const products: any[] = res.ok ? await res.json() : []

  // 300 TL altını göster
  const filteredByPrice = products.filter((p: any) => Number(p?.fiyat) < 300)

  // sayfada bulunan kategoriler
  const productCatIds = Array.from(
    new Set(
      filteredByPrice
        .map(getCatId)
        .filter((x): x is number => typeof x === "number")
    )
  )

  // Kategorileri API'den (yoksa yerelden) hazırla
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
    // no-op
  }

  if (categories.length === 0) {
    categories = productCatIds.map((id) => ({
      id,
      ad: CATEGORY_NAME_MAP[id] ?? `Kategori ${id}`,
    }))
  }

  // Kategori filtresi uygulama
  let filtered = filteredByPrice
  if (selectedKategoriId && productCatIds.includes(selectedKategoriId)) {
    filtered = filteredByPrice.filter((p: any) => getCatId(p) === selectedKategoriId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Kahraman alanı */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="floating-circle absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="floating-circle absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full" style={{ animationDelay: "2s" }}></div>
          <div className="floating-circle absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full" style={{ animationDelay: "4s" }}></div>
          <div className="floating-circle absolute bottom-10 right-1/4 w-8 h-8 bg-white/10 rounded-full" style={{ animationDelay: "6s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 px-4 slide-in-top">
              Uygun Fiyatlı Teknoloji
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 px-4 slide-in-bottom">
              300 TL altı kaliteli ürünlerle teknoloji dünyasını keşfedin
            </p>
            <div className="bounce-arrow">
              <svg className="w-8 h-8 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori chip'leri – CategoryFilter mobilde yatay kaydırmalı */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 category-filter-container">
          <CategoryFilter
            categories={categories}
            selectedId={selectedKategoriId && productCatIds.includes(selectedKategoriId) ? selectedKategoriId : undefined}
            showAllLabel="Tümü"
            paramKey="kategoriId"
          />
        </div>
      )}

      {/* Ürün listesi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 slide-in-left">300 TL Altı Ürünler</h2>
          <p className="text-base sm:text-lg text-gray-600 slide-in-right">Uygun fiyatlı teknoloji ürünlerini keşfedin</p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 py-8 fade-in">Bu filtrelere uygun ürün bulunamadı.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((product: any, index: number) => (
              <div key={product.id} className="product-card-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alt içerik */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 slide-in-bottom">Neden Bizi Tercih Etmelisiniz?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="feature-card">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Uygun Fiyat</h4>
                <p className="text-sm text-gray-600">300 TL altı kaliteli ürünler</p>
              </div>

              <div className="feature-card">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Güvenilir</h4>
                <p className="text-sm text-gray-600">Kaliteli ve güvenilir ürünler</p>
              </div>

              <div className="feature-card">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Hızlı Teslimat</h4>
                <p className="text-sm text-gray-600">Hızlı ve güvenli kargo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
