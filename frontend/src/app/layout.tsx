"use client"

import "./globals.css"
import type { ReactNode } from "react"
import Navbar from "./components/navbar"
import { usePathname } from "next/navigation"
import BotWidget from "./components/BotWidget"
import { CartProvider } from "./lib/cart-context"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showNavbar = !pathname.startsWith("/admin")

  return (
    <html lang="tr">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#4f46e5" />


        <meta name="mobile-web-app-capable" content="yes" />


        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-gray-50 relative min-h-screen">
        <CartProvider>
          {showNavbar && <Navbar />}
          <main className="min-h-screen pb-20">{children}</main>

          <div className="fixed z-[9999]
                          right-[max(1rem,env(safe-area-inset-right))]
                          bottom-[max(1rem,env(safe-area-inset-bottom))]">
            <BotWidget />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
