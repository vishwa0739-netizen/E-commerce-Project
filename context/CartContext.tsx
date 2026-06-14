"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

type CartCtx = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  count: number          // total units in cart
  subtotal: number       // total price
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartCtx | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  // FIX #14 — start with EMPTY array, not hardcoded default items
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // FIX #14 — load from localStorage on first mount (persists across page refreshes)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cn_cart")
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        // Basic validation — make sure it's an array of items with required fields
        if (Array.isArray(parsed) && parsed.every((i) => i.id && i.name && typeof i.price === "number")) {
          setItems(parsed)
        }
      }
    } catch {
      // corrupted storage — start fresh
      localStorage.removeItem("cn_cart")
    }
    setHydrated(true)
  }, [])

  // Save to localStorage whenever items change (after hydration to avoid overwriting)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("cn_cart", JSON.stringify(items))
    }
  }, [items, hydrated])

  // FIX #10 — addItem: if product already in cart, increase qty; otherwise push new entry
  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        // Already in cart → just bump the quantity
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      // New product → append to cart
      return [...prev, { ...item, quantity: qty }]
    })
  }

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cn_cart")
  }

  const count    = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}