import { notFound } from "next/navigation"
import { getProductsBySlug } from "@/app/lib/db"
import ProductCard from "@/app/components/products-cards"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params

    const specialRoutes = ["admin"]
    if (specialRoutes.includes(resolvedParams.slug.toLowerCase())) {
        notFound()
    }

    const products = await getProductsBySlug(resolvedParams.slug)

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                        {resolvedParams.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        {products.length} ürün bulundu
                    </p>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">
                            Ürün Bulunamadı
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                            Bu kategoride henüz ürün bulunmuyor.
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                            Ana Sayfaya Dön
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                        {products.map((product: any, index: number) => (
                            <div key={product.id} className="product-card-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
