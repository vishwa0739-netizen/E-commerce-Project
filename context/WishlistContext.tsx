"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type WishlistItem = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  badge: string
  badgeColor: string
  rating: number
}

type WishlistCtx = {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  toggleItem: (item: WishlistItem) => void
  isWished: (id: string) => boolean
  count: number
}

const WishlistContext = createContext<WishlistCtx | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  /* Load from localStorage on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cn_wishlist")
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  /* Save to localStorage whenever items change */
  useEffect(() => {
    localStorage.setItem("cn_wishlist", JSON.stringify(items))
  }, [items])

  const addItem = (item: WishlistItem) =>
    setItems((prev) => prev.find((i) => i.id === item.id) ? prev : [...prev, item])

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const toggleItem = (item: WishlistItem) =>
    setItems((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    )

  const isWished = (id: string) => items.some((i) => i.id === id)

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isWished, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider")
  return ctx
}