import React from "react"
import { useSearchParams } from "next/navigation"

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const categoryName = params.slug

    return (
        <div className="bg-[#004466] text-white p-4 rounded-md shadow-md transition duration-300 
                hover:bg-[#006699] hover:text-yellow-200 cursor-pointer">
            <h1 className="text-2xl font-bold mb-4">Category: {categoryName.replace(/-/g, " ")}</h1>


            <p>Products for {categoryName} will be listed here.</p>
        </div>
    )
}
