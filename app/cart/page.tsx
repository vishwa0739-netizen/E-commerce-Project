"use client"

import { useState } from "react"
import Link from "next/link"
import { BackButton } from "@/components/BackButton"

type IconProps = { size?: number; className?: string; style?: React.CSSProperties; strokeWidth?: number }

function ShoppingBagIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
function LockIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
function Trash2Icon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}
function ArrowLeftIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
    </svg>
  )
}
function PlusIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  )
}
function MinusIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  )
}

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const CREAM = "#ffffff"
const DARK  = "#1A1A2E"
const GREEN = "#2BA84A"
const RED   = "#E63946"
const PLACEHOLDER = "https://placehold.co/80x80/F2F0EA/1A1A2E?text=🧸"
const font    = "'Nunito', sans-serif"
const heading = "'Fredoka One', cursive"

type CartItem = { id: number; name: string; variant: string; price: number; qty: number; image: string }

const INITIAL_ITEMS: CartItem[] = [
  { id: 1, name: "Cuddle Teddy Bear",      variant: "Standard", price: 340, qty: 1, image: PLACEHOLDER },
  { id: 2, name: "Choo-Choo Wooden Train", variant: "Standard", price: 480, qty: 2, image: PLACEHOLDER },
]

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)

  const updateQty  = (id: number, delta: number) =>
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((it) => it.id !== id))

  const subtotal     = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  const freeShipping = subtotal >= 500
  const shipping     = freeShipping ? 0 : 50
  const total        = subtotal + shipping

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center"
        style={{ backgroundColor: CREAM, color: DARK, fontFamily: font }}>
        <BackButton href="/shop" label="Back to Shop" />
        <div style={{ fontSize: "5rem", marginTop: "24px" }}>🛒</div>
        <h1 style={{ fontFamily: heading, fontSize: "2.5rem", margin: "16px 0 8px" }}>Your cart is empty</h1>
        <p style={{ maxWidth: "320px", opacity: 0.75, lineHeight: 1.7 }}>Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" style={{
          marginTop: "32px", display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: PINK, color: "#fff", border: `2.5px solid ${DARK}`,
          borderRadius: "50px", padding: "12px 28px", fontFamily: font,
          fontWeight: 800, fontSize: "1rem", textDecoration: "none", boxShadow: `5px 5px 0 ${DARK}`,
        }}>
          <ShoppingBagIcon size={20} strokeWidth={2.5} /> Start Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: DARK, fontFamily: font }}>

      {/* ← Back button */}
      <BackButton href="/" label="Back to Home" />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 lg:flex-row lg:items-start">

        {/* LEFT */}
        <section className="flex-grow">
          <h1 style={{ fontFamily: heading, fontSize: "clamp(2rem,5vw,3rem)", marginBottom: "24px" }}>
            Your Cart 🛒
          </h1>
          <div className="rounded-2xl bg-white p-4 md:p-6"
            style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>
            {items.map((it, idx) => (
              <div key={it.id}>
                <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                  <img src={it.image} alt={it.name}
                    className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                    style={{ border: `2.5px solid ${DARK}` }}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER }} />
                  <div className="flex-grow">
                    <h2 style={{ fontFamily: heading, fontSize: "1.1rem" }}>{it.name}</h2>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, opacity: 0.7 }}>{it.variant}</p>
                    <p style={{ marginTop: "4px", fontSize: "0.9rem", fontWeight: 800, color: PINK }}>₹{it.price}</p>
                  </div>
                  <div className="flex items-center overflow-hidden rounded-xl" style={{ border: `2.5px solid ${DARK}` }}>
                    <button onClick={() => updateQty(it.id, -1)} aria-label="Decrease"
                      className="flex h-9 w-9 items-center justify-center"
                      style={{ cursor: "pointer", background: "none", border: "none" }}>
                      <MinusIcon size={16} strokeWidth={2.5} />
                    </button>
                    <span className="flex h-9 w-10 items-center justify-center"
                      style={{ fontFamily: heading, fontSize: "1rem", borderLeft: `2.5px solid ${DARK}`, borderRight: `2.5px solid ${DARK}` }}>
                      {it.qty}
                    </span>
                    <button onClick={() => updateQty(it.id, 1)} aria-label="Increase"
                      className="flex h-9 w-9 items-center justify-center"
                      style={{ cursor: "pointer", background: "none", border: "none" }}>
                      <PlusIcon size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <p style={{ fontFamily: heading, fontSize: "1.1rem" }}>₹{it.price * it.qty}</p>
                  </div>
                  <button onClick={() => removeItem(it.id)} aria-label={`Remove ${it.name}`}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ border: `2.5px solid ${DARK}`, color: RED, cursor: "pointer", background: "none" }}>
                    <Trash2Icon size={18} strokeWidth={2.5} />
                  </button>
                </div>
                {idx < items.length - 1 && <div style={{ borderTop: `2px solid ${DARK}`, opacity: 0.12 }} />}
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="w-full lg:sticky lg:top-8 lg:w-80 lg:flex-shrink-0">
          <div className="rounded-2xl bg-white p-6"
            style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>
            <h2 style={{ fontFamily: heading, fontSize: "1.6rem" }}>Order Summary</h2>
            <div className="mt-5 flex items-center justify-between" style={{ fontFamily: font, fontSize: "0.95rem", fontWeight: 600 }}>
              <span style={{ opacity: 0.8 }}>Subtotal</span><span>₹{subtotal}</span>
            </div>
            <div className="mt-3 flex items-center justify-between" style={{ fontFamily: font, fontSize: "0.95rem", fontWeight: 600 }}>
              <span style={{ opacity: 0.8 }}>Shipping</span>
              {freeShipping ? <span style={{ fontWeight: 800, color: GREEN }}>FREE</span> : <span>₹50</span>}
            </div>
            {!freeShipping && (
              <p style={{ fontSize: "0.78rem", opacity: 0.65, marginTop: "4px" }}>Add ₹{500 - subtotal} more for free shipping</p>
            )}
            <div style={{ borderTop: `2px solid ${DARK}`, opacity: 0.15, margin: "16px 0" }} />
            <div className="flex items-end justify-between">
              <span style={{ fontFamily: heading, fontSize: "1.3rem" }}>Total</span>
              <span style={{ fontFamily: heading, fontSize: "2rem", color: PINK }}>₹{total}</span>
            </div>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3"
              style={{ backgroundColor: PINK, border: `2.5px solid ${DARK}`, boxShadow: `4px 4px 0 ${DARK}`,
                color: "#fff", fontFamily: font, fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}>
              <ShoppingBagIcon size={20} strokeWidth={2.5} />
              Proceed to Checkout
              <LockIcon size={16} strokeWidth={2.5} />
            </button>
            <Link href="/shop" className="mt-4 flex items-center justify-center gap-1.5"
              style={{ color: TEAL, fontFamily: font, fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}>
              <ArrowLeftIcon size={16} strokeWidth={2.5} /> Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}