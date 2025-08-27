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
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false)
            }
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setResults([])
                setSearchTerm("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            {/* Main Navbar */}
            <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-lg sm:text-xl lg:text-2xl font-bold text-white hover:text-yellow-300 transition-colors">
                                TechStore
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
                            {menuItems.map((menu, i) => (
                                <div
                                    key={i}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(i)}
                                    onMouseLeave={() => handleMouseLeave(i)}
                                >
                                    <button className="flex items-center text-white hover:text-yellow-300 transition-colors font-medium px-2 lg:px-3 py-2 rounded-lg hover:bg-white/10 text-sm lg:text-base">
                                        {menu.label}
                                        <ChevronDown className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div ref={searchRef} className="flex-1 max-w-xs lg:max-w-lg mx-2 lg:mx-4 hidden md:block">
                            <div className="relative">
                                <Search className="absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Ürün ara..."
                                    className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 rounded-lg bg-white/90 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            {/* Search Results */}
                            {loading && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border p-4 z-50">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                        <span className="ml-2 text-gray-600">Aranıyor...</span>
                                    </div>
                                </div>
                            )}
                            {!loading && results.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border max-h-60 overflow-y-auto z-50">
                                    {results.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                            onClick={() => handleResultClick(item.id)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                                                    📦
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{item.isim || item.name}</p>
                                                    <p className="text-purple-600 font-bold text-sm">{item.fiyat} ₺</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                            {/* Mobile Search Button */}
                            <button className="md:hidden p-1.5 lg:p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                                <Search className="h-4 w-4 lg:h-5 lg:w-5" />
                            </button>

                            {/* Favorites */}
                            <Link href="/favorites" className="relative p-1.5 lg:p-2 text-white hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors">
                                <Heart className="h-4 w-4 lg:h-5 lg:w-5" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 lg:h-4 lg:w-4 flex items-center justify-center font-bold">
                                    {getFavoriteCount()}
                                </span>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="relative p-1.5 lg:p-2 text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors">
                                <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
                                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-3 w-3 lg:h-4 lg:w-4 flex items-center justify-center font-bold">
                                    {getCartItemCount()}
                                </span>
                            </Link>

                            {/* User Menu */}
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center space-x-1 lg:space-x-2 p-1.5 lg:p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                            <User className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                                        </div>
                                        <span className="hidden lg:block text-sm font-medium">{user.name}</span>
                                        <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                                            <div className="px-4 py-2 border-b">
                                                <p className="text-sm font-semibold text-gray-900">Hoşgeldin, {user.name}</p>
                                            </div>
                                            <Link
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                ⚙️ Ayarlar
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem("user")
                                                    setUser(null)
                                                    setUserMenuOpen(false)
                                                    window.dispatchEvent(new CustomEvent("userLogout"))
                                                    router.push("/login")
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                🚪 Çıkış Yap
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center space-x-1 lg:space-x-2 p-1.5 lg:p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                        <User className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                                    </div>
                                    <span className="hidden lg:block text-sm font-medium">Giriş Yap</span>
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-1.5 lg:p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {mobileMenuOpen ? <X className="h-4 w-4 lg:h-5 lg:w-5" /> : <Menu className="h-4 w-4 lg:h-5 lg:w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-white/20">
                            {/* Mobile Search */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Ürün ara..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>

                            {/* Mobile Menu Items */}
                            {menuItems.map((menu, i) => (
                                <div key={i} className="mb-4">
                                    <div className="text-white font-semibold mb-2 px-4">{menu.label}</div>
                                    <div className="pl-4">
                                        {menu.items.map(([href, child], idx) => (
                                            <Link
                                                key={idx}
                                                href={href}
                                                className="block py-2 text-white/80 hover:text-yellow-300 transition-colors"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {child}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Desktop Dropdown Menu */}
            {openIndex !== null && (
                <div 
                    className="fixed top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40"
                    onMouseEnter={() => handleMouseEnter(openIndex)}
                    onMouseLeave={() => handleMouseLeave(openIndex)}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 text-center">{menuItems[openIndex].label}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {menuItems[openIndex].items.map(([href, child], idx) => (
                                <Link
                                    key={idx}
                                    href={href}
                                    className="block p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors font-medium"
                                >
                                    {child}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

