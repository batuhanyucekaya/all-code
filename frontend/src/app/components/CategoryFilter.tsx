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
        <div className="relative">
            {/* VARSAYILAN: merkezde, mobilde scroll; md+’da taşma yok */}
            <div className="flex items-center gap-2 py-2 justify-center md:overflow-visible overflow-x-auto no-scrollbar">
                {/* Tümü */}
                <button
                    onClick={() => setCategory(undefined)}
                    className={[
                        "whitespace-nowrap px-4 py-2 rounded-full border transition-colors",
                        selectedId === undefined
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50",
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
                                "whitespace-nowrap px-4 py-2 rounded-full border transition-colors",
                                active
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50",
                            ].join(" ")}
                            title={c.ad}
                        >
                            {c.ad}
                        </button>
                    )
                })}
            </div>

            {/*
        ALTERNATİF: wrap’lı tam merkez (tek satır zorunlu değil)
        <div className="flex items-center gap-2 py-2 justify-center flex-wrap">
          ...butonlar...
        </div>
      */}
        </div>
    )
}
