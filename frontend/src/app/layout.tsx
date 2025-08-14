"use client"

import "./globals.css"
import type { ReactNode } from "react"
import Navbar from "./components/navbar"        // ✅ yol düzeltildi
import { usePathname } from "next/navigation"
import BotWidget from "./components/BotWidget"  // zaten doğru

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showNavbar = !pathname.startsWith("/admin")

  return (
    <html lang="tr">
      <body className="bg-gray-50 relative">
        {showNavbar && <Navbar />}
        <main className="min-h-screen">{children}</main>

        <div className="fixed z-[9999]
                        right-[max(1rem,env(safe-area-inset-right))]
                        bottom-[max(1rem,env(safe-area-inset-bottom))]">
          <BotWidget />
        </div>
      </body>
    </html>
  )
}
