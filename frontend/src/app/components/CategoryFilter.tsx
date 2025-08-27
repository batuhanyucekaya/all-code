"use client"

import { useRouter, useSearchParams } from "next/navigation"
import React from "react"

type Cat = { id: number; ad: string }

export default function CategoryFilter({
    categories,
    selectedId,
    showAllLabel = "Tümü",
    paramKey = "kategoriId",
}: {
    categories: Cat[]
    selectedId?: number
    showAllLabel?: string
    paramKey?: string
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const setCategory = (id?: number) => {
        const sp = new URLSearchParams(searchParams?.toString() || "")
        if (id === undefined) sp.delete(paramKey)
        else sp.set(paramKey, String(id))
        const qs = sp.toString()
        router.push(qs ? `/?${qs}` : "/")
    }

    return (
        <div className="relative w-full">
            {/* Mobile gradient overlays for better UX */}
            <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none lg:hidden"></div>
            <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none lg:hidden"></div>

            {/* Category buttons container */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 py-1 sm:py-2 lg:justify-center lg:overflow-visible overflow-x-auto no-scrollbar scroll-smooth px-2 sm:px-4 lg:px-0">
                {/* All categories button */}
                <button
                    onClick={() => setCategory(undefined)}
                    className={[
                        "whitespace-nowrap px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full border transition-all duration-200 flex-shrink-0",
                        "text-xs sm:text-sm md:text-base font-medium",
                        "min-w-max shadow-sm hover:shadow-md",
                        selectedId === undefined
                            ? "bg-blue-600 text-white border-blue-600 shadow-md hover:bg-blue-700"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700",
                    ].join(" ")}
                >
                    {showAllLabel}
                </button>

                {/* Category buttons */}
                {categories.map((c) => {
                    const active = selectedId === c.id
                    return (
                        <button
                            key={c.id}
                            onClick={() => setCategory(c.id)}
                            className={[
                                "whitespace-nowrap px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full border transition-all duration-200 flex-shrink-0",
                                "text-xs sm:text-sm md:text-base font-medium",
                                "min-w-max shadow-sm hover:shadow-md",
                                active
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md hover:bg-blue-700"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700",
                            ].join(" ")}
                            title={c.ad}
                        >
                            {c.ad}
                        </button>
                    )
                })}
            </div>

            {/* Scroll indicator for mobile */}
            <div className="lg:hidden flex justify-center mt-2">
                <div className="w-8 h-1 bg-gray-300 rounded-full opacity-50"></div>
            </div>
        </div>
    )
}
