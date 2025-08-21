"use client"

import React, { useState } from "react"
import { Menu, X, LogOut, User, Settings, Package } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
    }

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Panel</h1>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>Admin</span>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Çıkış</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                        <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span>Admin</span>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}
