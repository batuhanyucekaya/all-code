"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Search, User, Menu, X, ChevronDown } from "lucide-react"
import { useCart } from "../lib/cart-context"

const menuItems = [
    {
        label: "PC Hardware",
        items: [
            ["/storage", "Storage"],
            ["/software", "Software"],
            ["/accessories", "Accessories"],
            ["/network", "Network"],
            ["/office-products", "Office Products"],
            ["/monitors", "Monitors"],
            ["/gaming-monitors", "Gaming Monitors"],
        ],
    },
    {
        label: "Headphones",
        items: [
            ["/bluetooth-headphones", "Bluetooth Headphones"],
            ["/gaming-headset", "Gaming Headset"],
            ["/wired-headphones", "Wired Headphones"],
            ["/in-ear-headphones", "In-Ear Headphones"],
            ["/over-ear-headphones", "Over-Ear Headphones"],
        ],
    },
    {
        label: "Phones & Accessories",
        items: [
            ["/android-phones", "Android Phones"],
            ["/ios-phones", "iOS Phones"],
            ["/ai-phones", "AI Phones"],
            ["/cases", "Cases"],
            ["/chargers", "Chargers"],
            ["/screen-protectors", "Screen Protectors"],
            ["/charging-cables", "Charging Cables"],
            ["/phone-holders", "Phone Holders"],
        ],
    },
    {
        label: "Computers & Accessories",
        items: [
            ["/desktop-pcs", "Desktop PCs"],
            ["/laptops", "Laptops"],
            ["/mac", "Mac"],
            ["/gaming-laptops", "Gaming Laptops"],
            ["/gaming-desktops", "Gaming Desktops"],
            ["/gaming-mouse", "Gaming Mouse"],
            ["/gaming-keyboard", "Gaming Keyboard"],
            ["/gaming-headset", "Gaming Headset"],
            ["/gaming-accessories", "Gaming Accessories"],
        ],
    },
    {
        label: "TV, Sound & Monitor",
        items: [
            ["/tvs", "TVs"],
            ["/monitors", "Monitors"],
            ["/speakers", "Speakers"],
        ],
    },
]

// hepsi aynı hizada/ortalı
const navButtonStyle =
    "inline-flex items-center justify-center whitespace-nowrap leading-none px-4 py-2 text-white text-center hover:text-yellow-300 font-medium transition-colors duration-200 relative group"

export default function Navbar() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()
    const { getCartItemCount, getFavoriteCount } = useCart()

    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const userMenuRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const timeoutRefs = useRef<{ [key: number]: NodeJS.Timeout }>({})

    const [user, setUser] = useState<{ name: string } | null>(null)

    const handleMouseEnter = (index: number) => {
        if (timeoutRefs.current[index]) clearTimeout(timeoutRefs.current[index])
        setOpenIndex(index)
    }
    const handleMouseLeave = (index: number) => {
        timeoutRefs.current[index] = setTimeout(() => setOpenIndex(null), 300)
    }

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            try {
                const u = JSON.parse(userData)
                setUser({ name: u.name })
            } catch {
                localStorage.removeItem("user")
            }
        }
        const handleUserLogin = (event: CustomEvent) => {
            setUser({ name: event.detail.name })
        }
        const handleUserLogout = () => setUser(null)

        window.addEventListener("userLogin", handleUserLogin as EventListener)
        window.addEventListener("userLogout", handleUserLogout)

        return () => {
            window.removeEventListener("userLogin", handleUserLogin as EventListener)
            window.removeEventListener("userLogout", handleUserLogout)
            Object.values(timeoutRefs.current).forEach(clearTimeout)
        }
    }, [])

    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setResults([])
            return
        }
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await fetch(
                    `http://localhost:5000/api/urun/search?q=${encodeURIComponent(searchTerm)}`
                )
                if (res.ok) {
                    const data = await res.json()
                    setResults(data)
                } else setResults([])
            } catch {
                setResults([])
            }
            setLoading(false)
        }
        const t = setTimeout(fetchData, 300)
        return () => clearTimeout(t)
    }, [searchTerm])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            setResults([])
            router.push(`/search?query=${encodeURIComponent(searchTerm)}`)
        }
    }

    const handleResultClick = (id: number) => {
        setResults([])
        setSearchTerm("")
        router.push(`/product/${id}`)
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Kullanıcı menüsü için
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false)
            }
            
            // Arama sonuçları için
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setResults([])
                setSearchTerm("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl sticky top-0 z-50">
            <div className="w-full px-4 sm:px-6 lg:px-8">

                {/* satır: mobile wrap, desktop sabit yükseklik */}
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center md:h-20 py-3 gap-3">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="text-2xl sm:text-3xl font-bold text-white hover:text-yellow-300 transition-colors duration-300"
                        >
                            TechStore
                        </Link>
                    </div>

                    {/* Desktop Menu (ortalanmış) */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="flex items-center gap-4">
                            {menuItems.map((menu, i) => (
                                <div
                                    key={i}
                                    className="relative group"
                                    onMouseEnter={() => handleMouseEnter(i)}
                                    onMouseLeave={() => handleMouseLeave(i)}
                                >
                                    <button className={navButtonStyle}>
                                        {menu.label}
                                        <ChevronDown className="ml-1 h-4 w-4 inline" />
                                    </button>

                                    {/* Dropdown */}
                                    {openIndex === i && (
                                        <div
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50"
                                            onMouseEnter={() => handleMouseEnter(i)}
                                            onMouseLeave={() => handleMouseLeave(i)}
                                        >
                                            {/* ok: kutunun içinde */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 pointer-events-none"></div>

                                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl">
                                                <h3 className="text-base font-bold text-gray-900 text-center">{menu.label}</h3>
                                            </div>
                                            <div className="py-2">
                                                {menu.items.map(([href, child], idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={href}
                                                        className="block px-6 py-3 text-sm text-gray-700 text-center hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 transition-all duration-200 font-medium"
                                                    >
                                                        {child}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search: büyük & responsive */}
                    <div ref={searchRef} className="order-3 md:order-none relative w-full md:w-auto md:flex-1 md:max-w-3xl xl:max-w-4xl">
                        <div className="relative">
                            <Search className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Ürün ara..."
                                className="w-full h-10 sm:h-12 pl-10 sm:pl-14 pr-4 sm:pr-6 rounded-full bg-white/90 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-300 text-sm sm:text-base text-gray-800 placeholder-gray-500 shadow-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => {
                                    // Kısa bir gecikme ile sonuçları kapat (tıklama işlemi için)
                                    setTimeout(() => {
                                        if (!searchRef.current?.contains(document.activeElement)) {
                                            setResults([])
                                        }
                                    }, 150)
                                }}
                            />
                        </div>

                        {/* Sonuçlar */}
                        {loading && (
                            <div className="absolute top-full mt-3 w-full bg-white rounded-xl shadow-2xl border border-gray-100 p-6 z-50">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                    <span className="ml-3 text-gray-600 font-medium">Aranıyor...</span>
                                </div>
                            </div>
                        )}
                        {!loading && results.length > 0 && (
                            <div className="absolute top-full mt-3 w-full bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[60vh] overflow-y-auto z-50">
                                {results.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200"
                                        onClick={() => handleResultClick(item.id)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                                                <span className="text-lg">📦</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900 text-center md:text-left">
                                                    {item.isim || item.name}
                                                </p>
                                                <p className="text-sm text-purple-600 font-bold text-center md:text-left">
                                                    {item.fiyat} ₺
                                                </p>
                                            </div>
                                            <div className="text-purple-400">
                                                <Search className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sağ ikonlar */}
                    <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
                        <Link href="/favorites" className="p-2 sm:p-3 text-white hover:text-red-300 hover:bg-white/10 rounded-xl transition-all duration-300 relative group backdrop-blur-sm">
                            <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold shadow-lg">
                                {getFavoriteCount()}
                            </span>
                        </Link>

                        <Link href="/cart" className="p-2 sm:p-3 text-white hover:text-green-300 hover:bg-white/10 rounded-xl transition-all duration-300 relative group backdrop-blur-sm">
                            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold shadow-lg">
                                {getCartItemCount()}
                            </span>
                        </Link>

                        {/* User */}
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 p-2 sm:p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm"
                                >
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium hidden sm:block text-white whitespace-nowrap text-center">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl">
                                            <p className="text-sm font-semibold text-gray-900 text-center">
                                                Hoşgeldin, {user.name}
                                            </p>
                                            <p className="text-xs text-purple-600 font-medium text-center">Müşteri</p>
                                        </div>

                                        <Link
                                            href="/settings"
                                            className="block px-4 py-3 text-sm text-gray-700 text-center hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200"
                                        >
                                            ⚙️ Ayarlar
                                        </Link>
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem("user")
                                                    setUser(null)
                                                    setUserMenuOpen(false)
                                                    window.dispatchEvent(new CustomEvent("userLogout"))
                                                    router.push("/login")
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                            >
                                                🚪 Çıkış Yap
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-2 p-2 sm:p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium hidden sm:block text-white whitespace-nowrap text-center">
                                    Giriş Yap
                                </span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 sm:p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden w-full">
                            <div className="px-4 pt-2 pb-4 space-y-2 sm:px-6 bg-white/10 backdrop-blur-md rounded-2xl mt-2 border border-white/20">
                                {menuItems.map((menu, i) => (
                                    <div key={i}>
                                        <div className="px-4 py-3 text-sm font-semibold text-white text-center border-b border-white/20 bg-white/5 rounded-lg">
                                            {menu.label}
                                        </div>
                                        <div className="pl-2 mt-2">
                                            {menu.items.map(([href, child], idx) => (
                                                <Link
                                                    key={idx}
                                                    href={href}
                                                    className="block px-4 py-3 text-sm text-white/90 text-center hover:text-yellow-300 hover:bg-white/10 rounded-xl transition-all duration-200 mb-1"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {child}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

function ListItem({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="block hover:bg-gray-100 p-2 rounded-md">
                <p className="text-sm font-medium text-center">{children}</p>
            </Link>
        </li>
    )
}

