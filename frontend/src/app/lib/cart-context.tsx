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

  // Kullanıcı verilerini yükle
  const loadUserData = useCallback(async (musteriId: number) => {
    try {
      // console.log('Kullanıcı verileri yükleniyor:', musteriId)
      
      // Sepet verilerini yükle
      const cartResponse = await fetch(`${API_BASE_URL}/sepet/musteri/${musteriId}`)
              // console.log('Sepet response:', cartResponse.status)
      if (cartResponse.ok) {
        const cartData = await cartResponse.json()
                  // console.log('Sepet verileri:', cartData)
        const formattedCartItems = cartData.map((item: any) => ({
          id: item.urun.id,
          isim: item.urun.isim,
          fiyat: item.urun.fiyat,
          resim_url: item.urun.resim_url,
          quantity: item.miktar
        }))
        setCartItems(formattedCartItems)
                  // console.log('Sepet yüklendi:', formattedCartItems.length, 'ürün')
      } else {
        console.error('Sepet yükleme hatası:', await cartResponse.text())
      }

      // Favori verilerini yükle
      const favoritesResponse = await fetch(`${API_BASE_URL}/favori/musteri/${musteriId}`)
              // console.log('Favori response:', favoritesResponse.status)
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json()
                  // console.log('Favori verileri:', favoritesData)
        const formattedFavoriteItems = favoritesData.map((item: any) => ({
          id: item.urun.id,
          isim: item.urun.isim,
          fiyat: item.urun.fiyat,
          resim_url: item.urun.resim_url
        }))
        setFavoriteItems(formattedFavoriteItems)
                  // console.log('Favoriler yüklendi:', formattedFavoriteItems.length, 'ürün')
      } else {
        console.error('Favori yükleme hatası:', await favoritesResponse.text())
      }
      
      // En son currentMusteriId'yi güncelle
      setCurrentMusteriId(musteriId)
    } catch (error) {
      console.error('Kullanıcı verileri yüklenirken hata:', error)
    }
  }, [])

  // Sayfa yüklendiğinde kullanıcı zaten giriş yapmışsa verileri yükle
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData && !currentMusteriId) {
      try {
        const user = JSON.parse(userData)
        if (user.id) {
          // console.log('Sayfa yüklendi, kullanıcı verileri yükleniyor:', user.id)
          loadUserData(user.id)
        }
      } catch (error) {
        console.error('Kullanıcı verisi parse hatası:', error)
        localStorage.removeItem('user')
      }
    }
  }, [currentMusteriId, loadUserData])

  // Kullanıcı giriş/çıkış event'lerini dinle
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        // console.log('Kullanıcı giriş yaptı, veriler yükleniyor:', event.detail.id)
        loadUserData(event.detail.id)
      }
    }

    const handleUserLogout = () => {
              // console.log('Kullanıcı çıkış yaptı')
      setCurrentMusteriId(null)
      setCartItems([])
      setFavoriteItems([])
      // Veriler temizlenmez, kalıcı kalır
    }

    window.addEventListener('userLogin', handleUserLogin as EventListener)
    window.addEventListener('userLogout', handleUserLogout)
    
    return () => {
      window.removeEventListener('userLogin', handleUserLogin as EventListener)
      window.removeEventListener('userLogout', handleUserLogout)
    }
  }, [loadUserData])

  // LocalStorage kaydetme kaldırıldı - sadece giriş yapmış kullanıcılar veri saklayabilir

  const addToCart = async (product: any, quantity: number = 1) => {
    if (currentMusteriId) {
      // Backend'e gönder
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
          // Sepeti yeniden yükle
          await loadUserData(currentMusteriId)
        } else {
          console.error('Sepete ekleme hatası:', await response.text())
        }
      } catch (error) {
        console.error('Sepete ekleme hatası:', error)
      }
    } else {
      // Giriş yapmamış kullanıcı - işlem yapılamaz
              toast.error('Sepete eklemek için giriş yapmalısınız')
    }
  }

  const removeFromCart = async (productId: number) => {
    if (currentMusteriId) {
      // Backend'den sil
      try {
        const response = await fetch(`${API_BASE_URL}/sepet/sil/${currentMusteriId}/${productId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          // Sepeti yeniden yükle
          await loadUserData(currentMusteriId)
        } else {
          console.error('Sepetten silme hatası:', await response.text())
        }
      } catch (error) {
        console.error('Sepetten silme hatası:', error)
      }
    } else {
      // Giriş yapmamış kullanıcı - işlem yapılamaz
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
          // Sepeti yeniden yükle
          await loadUserData(currentMusteriId)
        } else {
          console.error('Sepet güncelleme hatası:', await response.text())
        }
      } catch (error) {
        console.error('Sepet güncelleme hatası:', error)
      }
    } else {
      // Giriş yapmamış kullanıcı - işlem yapılamaz
              toast.error('Sepet miktarını güncellemek için giriş yapmalısınız')
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
          console.error('Sepet temizleme hatası:', await response.text())
        }
      } catch (error) {
        console.error('Sepet temizleme hatası:', error)
      }
    } else {
      // Giriş yapmamış kullanıcı - işlem yapılamaz
              toast.error('Sepeti temizlemek için giriş yapmalısınız')
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
          console.error('Favorilerden silme hatası:', await response.text())
        }
      } catch (error) {
        console.error('Favorilerden silme hatası:', error)
      }
    } else {
      // Giriş yapmamış kullanıcı - işlem yapılamaz
              toast.error('Favorilerden silmek için giriş yapmalısınız')
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
