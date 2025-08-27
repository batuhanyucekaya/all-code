"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { toast } from 'sonner'

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
  currentMusteriId: number | null
  addToCart: (product: any, quantity?: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateCartItemQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  addToFavorites: (product: any) => Promise<void>
  removeFromFavorites: (productId: number) => Promise<void>
  clearFavorites: () => Promise<void>
  isInCart: (productId: number) => boolean
  isInFavorites: (productId: number) => boolean
  getCartTotal: () => number
  getCartItemCount: () => number
  getFavoriteCount: () => number
  loadUserData: (musteriId: number) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const API_BASE_URL = 'http://localhost:5000/api'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([])
  const [currentMusteriId, setCurrentMusteriId] = useState<number | null>(null)
  const loadUserData = useCallback(async (musteriId: number) => {
    try {
      const cartResponse = await fetch(`${API_BASE_URL}/sepet/musteri/${musteriId}`)
      if (cartResponse.ok) {
        const cartData = await cartResponse.json()
        const formattedCartItems = cartData.map((item: any) => ({
          id: item.urun.id,
          isim: item.urun.isim,
          fiyat: item.urun.fiyat,
          resim_url: item.urun.resim_url,
          quantity: item.miktar
        }))
        setCartItems(formattedCartItems)
      } else {
        console.error('Sepet yükleme hatası:', await cartResponse.text())
      }

      const favoritesResponse = await fetch(`${API_BASE_URL}/favori/musteri/${musteriId}`)
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json()
        const formattedFavoriteItems = favoritesData.map((item: any) => ({
          id: item.urun.id,
          isim: item.urun.isim,
          fiyat: item.urun.fiyat,
          resim_url: item.urun.resim_url
        }))
        setFavoriteItems(formattedFavoriteItems)
      } else {
        console.error('Favori yükleme hatası:', await favoritesResponse.text())
      }
      
      setCurrentMusteriId(musteriId)
    } catch (error) {
      console.error('Kullanıcı verileri yüklenirken hata:', error)
    }
  }, [])
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData && !currentMusteriId) {
      try {
        const user = JSON.parse(userData)
        if (user.id) {
          loadUserData(user.id)
        }
      } catch (error) {
        console.error('Kullanıcı verisi parse hatası:', error)
        localStorage.removeItem('user')
      }
    }
  }, [currentMusteriId, loadUserData])
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        loadUserData(event.detail.id)
      }
    }

    const handleUserLogout = () => {
      setCurrentMusteriId(null)
      setCartItems([])
      setFavoriteItems([])
    }

    window.addEventListener('userLogin', handleUserLogin as EventListener)
    window.addEventListener('userLogout', handleUserLogout)
    
    return () => {
      window.removeEventListener('userLogin', handleUserLogin as EventListener)
      window.removeEventListener('userLogout', handleUserLogout)
    }
  }, [loadUserData])

  const addToCart = async (product: any, quantity: number = 1) => {
    if (currentMusteriId) {
      try {
        const response = await fetch(`${API_BASE_URL}/sepet/ekle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            musteriId: currentMusteriId,
            urunId: product.id,
            miktar: quantity
          })
        })

        if (response.ok) {
          await loadUserData(currentMusteriId)
        } else {
          const errorText = await response.text()
          console.error('Sepete ekleme hatası:', errorText)
          throw new Error(errorText)
        }
      } catch (error) {
        console.error('Sepete ekleme hatası:', error)
        throw error
      }
    } else {
      const error = new Error('Sepete eklemek için giriş yapmalısınız')
      toast.error('Sepete eklemek için giriş yapmalısınız')
      throw error
    }
  }

  const removeFromCart = async (productId: number) => {
    if (currentMusteriId) {
      try {
        const response = await fetch(`${API_BASE_URL}/sepet/sil/${currentMusteriId}/${productId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadUserData(currentMusteriId)
        } else {
          console.error('Sepetten silme hatası:', await response.text())
        }
      } catch (error) {
        console.error('Sepetten silme hatası:', error)
      }
    } else {
              toast.error('Sepetten silmek için giriş yapmalısınız')
    }
  }

  const updateCartItemQuantity = async (productId: number, quantity: number) => {
    if (currentMusteriId) {
      // Backend'i güncelle
      try {
        const response = await fetch(`${API_BASE_URL}/sepet/guncelle`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            musteriId: currentMusteriId,
            urunId: productId,
            miktar: quantity
          })
        })

        if (response.ok) {
          await loadUserData(currentMusteriId)
        } else {
          const errorText = await response.text()
          console.error('Sepet güncelleme hatası:', errorText)
          throw new Error(errorText)
        }
      } catch (error) {
        console.error('Sepet güncelleme hatası:', error)
        throw error
      }
    } else {
      const error = new Error('Sepet miktarını güncellemek için giriş yapmalısınız')
      toast.error('Sepet miktarını güncellemek için giriş yapmalısınız')
      throw error
    }
  }

  const clearCart = async () => {
    if (currentMusteriId) {
      // Backend'i temizle
      try {
        const response = await fetch(`${API_BASE_URL}/sepet/temizle/${currentMusteriId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setCartItems([])
        } else {
          const errorText = await response.text()
          console.error('Sepet temizleme hatası:', errorText)
          throw new Error(errorText)
        }
      } catch (error) {
        console.error('Sepet temizleme hatası:', error)
        throw error
      }
    } else {
      const error = new Error('Sepeti temizlemek için giriş yapmalısınız')
      toast.error('Sepeti temizlemek için giriş yapmalısınız')
      throw error
    }
  }

  const clearFavorites = async () => {
    if (currentMusteriId) {
      // Backend'i temizle
      try {
        const response = await fetch(`${API_BASE_URL}/favori/temizle/${currentMusteriId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setFavoriteItems([])
        } else {
          console.error('Favori temizleme hatası:', await response.text())
        }
      } catch (error) {
        console.error('Favori temizleme hatası:', error)
      }
    } else {
      // Giriş yapmamış kullanıcı - işlem yapılamaz
              toast.error('Favorileri temizlemek için giriş yapmalısınız')
    }
  }

  const addToFavorites = async (product: any) => {
    if (currentMusteriId) {
      // Backend'e gönder
      try {
        const response = await fetch(`${API_BASE_URL}/favori/ekle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            musteriId: currentMusteriId,
            urunId: product.id
          })
        })

        if (response.ok) {
          // Favorileri yeniden yükle
          await loadUserData(currentMusteriId)
        } else {
          console.error('Favorilere ekleme hatası:', await response.text())
        }
      } catch (error) {
        console.error('Favorilere ekleme hatası:', error)
      }
    } else {
      // Giriş yapmamış kullanıcı - işlem yapılamaz
              toast.error('Favorilere eklemek için giriş yapmalısınız')
    }
  }

  const removeFromFavorites = async (productId: number) => {
    if (currentMusteriId) {
      // Backend'den sil
      try {
        const response = await fetch(`${API_BASE_URL}/favori/sil/${currentMusteriId}/${productId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          // Favorileri yeniden yükle
          await loadUserData(currentMusteriId)
        } else {
          const errorText = await response.text()
          console.error('Favorilerden silme hatası:', errorText)
          throw new Error(errorText)
        }
      } catch (error) {
        console.error('Favorilerden silme hatası:', error)
        throw error
      }
    } else {
      // Giriş yapmamış kullanıcı - işlem yapılamaz
      const error = new Error('Favorilerden silmek için giriş yapmalısınız')
      toast.error('Favorilerden silmek için giriş yapmalısınız')
      throw error
    }
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
    currentMusteriId,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    isInCart,
    isInFavorites,
    getCartTotal,
    getCartItemCount,
    getFavoriteCount,
    loadUserData
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
