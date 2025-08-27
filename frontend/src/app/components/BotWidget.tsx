"use client"

import React, { useEffect, useRef, useState } from "react"
import { MessageCircle, X, Send, ExternalLink } from "lucide-react"

type SpecCard = {
    name?: string
    manufacturer?: string | null
    releaseDate?: string | null
    image?: string | null
    summary?: string | null
    sources?: string[]
}

type Msg =
    | { role: "user"; text: string }
    | { role: "bot"; text?: string; spec?: SpecCard }

function formatDateTR(iso?: string | null) {
    if (!iso) return undefined
    const d = new Date(iso)
    return isNaN(d.getTime()) ? undefined : d.toLocaleDateString("tr-TR")
}

async function fetchSpecs(query: string): Promise<SpecCard | null> {
    const r = await fetch(`/api/specs?q=${encodeURIComponent(query)}`)
    if (!r.ok) return null
    const j = await r.json()
    return {
        name: j?.name,
        manufacturer: j?.manufacturer ?? null,
        releaseDate: j?.releaseDate ?? null,
        image: j?.image ?? null,
        summary: j?.summary ?? j?.description ?? null,
        sources: Array.isArray(j?.sources) ? j.sources : [],
    }
}

export default function BotWidget() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<Msg[]>([
        { role: "bot", text: "Merhaba! Bir ürün sor: “iPhone 12”, “Galaxy S21”, “AirPods Pro”..." },
    ])
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, open])

    const send = async () => {
        const q = input.trim()
        if (!q) return
        setMessages((m) => [...m, { role: "user", text: q }])
        setInput("")
        setLoading(true)

        try {
            const spec = await fetchSpecs(q)
            if (spec) {
                setMessages((m) => [...m, { role: "bot", spec }])
            } else {
                setMessages((m) => [
                    ...m,
                    { role: "bot", text: "Bu ürünü bulamadım. Biraz daha net yazar mısın? (Örn: iPhone 12 mini)" },
                ])
            }
        } catch {
            setMessages((m) => [
                ...m,
                { role: "bot", text: "Şu an bilgiye erişemedim, lütfen biraz sonra tekrar dene." },
            ])
        } finally {
            setLoading(false)
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") send()
    }

    const quick = (q: string) => {
        setInput(q)
        setTimeout(send, 0)
    }

    return (
        <>
            {/* Aç/Kapa butonu */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-5 right-5 z-50 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl p-4 hover:scale-105 transition"
                aria-label="Sohbeti aç/kapat"
            >
                {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>

            {/* Panel */}
            {open && (
                <div className="fixed bottom-20 right-5 z-50 w-[min(92vw,380px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-blue-50">
                        <p className="font-semibold text-gray-900">Tekno Asistan</p>
                        <p className="text-xs text-gray-600">Ürün adı yaz, özellikleri getireyim.</p>
                    </div>

                    <div ref={listRef} className="max-h-96 overflow-y-auto p-4 space-y-3">
                        {messages.map((m, i) => {
                            if (m.role === "user") {
                                return (
                                    <div key={i} className="flex justify-end">
                                        <div className="rounded-2xl px-3 py-2 text-sm shadow-sm max-w-[85%] bg-blue-600 text-white whitespace-pre-wrap">
                                            {m.text}
                                        </div>
                                    </div>
                                )
                            }

                            // bot
                            if (m.spec) {
                                const d = m.spec
                                const date = formatDateTR(d.releaseDate)
                                return (
                                    <div key={i} className="flex justify-start">
                                        <div className="w-full rounded-2xl p-3 bg-gray-50 border border-gray-200 shadow-sm">
                                            <div className="flex gap-3">
                                                {d.image ? (
                                                    <img
                                                        src={d.image}
                                                        alt={d.name || "ürün görseli"}
                                                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                    />
                                                ) : null}
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{d.name || "Ürün"}</div>
                                                    {d.summary ? (
                                                        <div className="text-sm text-gray-700 mt-1 line-clamp-4">{d.summary}</div>
                                                    ) : null}
                                                    <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                                                        {d.manufacturer && <div>Üretici: {d.manufacturer}</div>}
                                                        {date && <div>Çıkış: {date}</div>}
                                                    </div>
                                                    {d.sources?.length ? (
                                                        <div className="mt-2">
                                                            <a
                                                                href={d.sources[0]}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                                                            >
                                                                Kaynakı aç <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div key={i} className="flex justify-start">
                                    <div className="rounded-2xl px-3 py-2 text-sm shadow-sm max-w-[85%] bg-gray-100 text-gray-800 whitespace-pre-wrap">
                                        {m.text}
                                    </div>
                                </div>
                            )
                        })}

                        {loading && <div className="text-xs text-gray-500">Arıyorum…</div>}
                    </div>

                    {/* Hızlı öneriler */}
                    <div className="px-3 pb-2 flex gap-2 flex-wrap">
                        {["iPhone 12", "iPhone 12 Pro", "Galaxy S21"].map((q) => (
                            <button
                                key={q}
                                onClick={() => quick(q)}
                                className="text-xs px-3 py-1 rounded-full border border-gray-200 hover:bg-blue-50"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Giriş alanı */}
                    <div className="p-3 border-t flex items-center gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Örn: iPhone 12"
                        />
                        <button
                            onClick={send}
                            disabled={loading || !input.trim()}
                            className="rounded-xl bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 disabled:opacity-60 flex items-center gap-1"
                        >
                            <Send className="h-4 w-4" />
                            Gönder
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
