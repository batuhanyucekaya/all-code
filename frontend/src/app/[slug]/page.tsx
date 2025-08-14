import { notFound } from "next/navigation"
import { getProductsBySlug } from "@/app/lib/db"
import ProductCard from "@/app/components/products-cards"

export default async function CategoryPage({ params }: { params: { slug: string } }) {

    const specialRoutes = ["admin"]
    if (specialRoutes.includes(params.slug.toLowerCase())) {
        notFound()
    }

    const products = await getProductsBySlug(params.slug)

    return (

        <div className="p-6 text-white">

            <h1 className="text-2xl font-bold mb-4">
                Category: {params.slug.replace(/-/g, " ")}
            </h1>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
