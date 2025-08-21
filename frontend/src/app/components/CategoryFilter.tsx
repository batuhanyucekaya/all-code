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
            {/* Mobil için gradient overlay'ler */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none md:hidden"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none md:hidden"></div>

            <div className="flex items-center gap-2 py-2 md:justify-center md:overflow-visible overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-0">
                <button
                    onClick={() => setCategory(undefined)}
                    className={[
                        "whitespace-nowrap px-4 py-2 rounded-full border transition-colors flex-shrink-0",
                        "text-sm md:text-base",
                        "min-w-max",
                        selectedId === undefined
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300",
                    ].join(" ")}
                >
                    {showAllLabel}
                </button>

                {categories.map((c) => {
                    const active = selectedId === c.id
                    return (
                        <button
                            key={c.id}
                            onClick={() => setCategory(c.id)}
                            className={[
                                "whitespace-nowrap px-4 py-2 rounded-full border transition-colors flex-shrink-0",
                                "text-sm md:text-base",
                                "min-w-max",
                                active
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300",
                            ].join(" ")}
                            title={c.ad}
                        >
                            {c.ad}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
