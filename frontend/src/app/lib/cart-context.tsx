"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: number
  isim: string
  fiyat: number
  resim_url: string
  quantity: number
}

interface FavoriteItem {
  id: number
  isim: string
  fiyat: number
  resim_url: string
}

interface CartContextType {
  cartItems: CartItem[]
  favoriteItems: FavoriteItem[]
  addToCart: (product: any, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateCartItemQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  addToFavorites: (product: any) => void
  removeFromFavorites: (productId: number) => void
  isInCart: (productId: number) => boolean
  isInFavorites: (productId: number) => boolean
  getCartTotal: () => number
  getCartItemCount: () => number
  getFavoriteCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([])

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    const savedFavorites = localStorage.getItem('favorites')
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Cart data parse error:', error)
        localStorage.removeItem('cart')
      }
    }
    
    if (savedFavorites) {
      try {
        setFavoriteItems(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Favorites data parse error:', error)
        localStorage.removeItem('favorites')
      }
    }
  }, [])

  // LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteItems))
  }, [favoriteItems])

  const addToCart = (product: any, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prev, {
          id: product.id,
          isim: product.isim,
          fiyat: product.fiyat,
          resim_url: product.resim_url,
          quantity
        }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const addToFavorites = (product: any) => {
    setFavoriteItems(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (!exists) {
        return [...prev, {
          id: product.id,
          isim: product.isim,
          fiyat: product.fiyat,
          resim_url: product.resim_url
        }]
      }
      return prev
    })
  }

  const removeFromFavorites = (productId: number) => {
    setFavoriteItems(prev => prev.filter(item => item.id !== productId))
  }

  const isInCart = (productId: number) => {
    return cartItems.some(item => item.id === productId)
  }

  const isInFavorites = (productId: number) => {
    return favoriteItems.some(item => item.id === productId)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.fiyat * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getFavoriteCount = () => {
    return favoriteItems.length
  }

  const value = {
    cartItems,
    favoriteItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    isInCart,
    isInFavorites,
    getCartTotal,
    getCartItemCount,
    getFavoriteCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
