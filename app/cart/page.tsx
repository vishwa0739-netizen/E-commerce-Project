"use client"

import { useState } from "react"
import Link from "next/link"
import { BackButton } from "@/components/BackButton"
import { useCart } from "@/context/CartContext"

// ─── Icons ────────────────────────────────────────────────────────────────────

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
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
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
function StarIcon({ size = 14, fill = "#FF78AC", stroke = "#FF78AC" }: { size?: number; fill?: string; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.685 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.45 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK      = "#FF78AC"
const TEAL      = "#A8D5E3"
const CREAM     = "#ffffff"
const DARK      = "#1A1A2E"
const GREEN     = "#2BA84A"
const RED       = "#E63946"
const YELLOW    = "#E8C96A"
const PLACEHOLDER = "https://placehold.co/80x80/F2F0EA/1A1A2E?text=🧸"
const font      = "'Nunito', sans-serif"
const heading   = "'Fredoka One', cursive"

// FIX #11 — Recommended products shown at bottom of cart page
const RECOMMENDED = [
  {
    id: "r1",
    name: "Crochet Bunny Pal",
    price: 349,
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=300&h=300&fit=crop",
    rating: 5,
    badge: "Best Seller",
    badgeColor: PINK,
  },
  {
    id: "r2",
    name: "Rainbow Wooden Dolls",
    price: 520,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300&h=300&fit=crop",
    rating: 4.8,
    badge: "Eco-Friendly",
    badgeColor: TEAL,
  },
  {
    id: "r3",
    name: "Artisan Fox Plushie",
    price: 299,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    rating: 4.9,
    badge: "Handmade",
    badgeColor: "#7BC47F",
  },
  {
    id: "r4",
    name: "Block Car Racer Set",
    price: 245,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop",
    rating: 4.7,
    badge: "Handmade",
    badgeColor: "#7BC47F",
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function CartPage() {
  // FIX #14 — use CartContext, NOT local hardcoded INITIAL_ITEMS
  const { items, removeItem, updateQty, subtotal, count, addItem } = useCart()
  const [addedRec, setAddedRec] = useState<string | null>(null)

  const freeShipping = subtotal >= 500
  const shipping     = freeShipping ? 0 : 50
  const total        = subtotal + shipping

  // FIX #11 — add recommended item to cart
  const handleAddRecommended = (rec: typeof RECOMMENDED[0]) => {
    addItem({ id: rec.id, name: rec.name, price: rec.price, image: rec.image })
    setAddedRec(rec.id)
    setTimeout(() => setAddedRec(null), 1800)
  }

  // ── Empty state ──
  if (count === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center"
        style={{ backgroundColor: CREAM, color: DARK, fontFamily: font }}>
        <BackButton href="/shop" label="Back to Shop" />
        <div style={{ fontSize: "5rem", marginTop: "24px" }}>🛒</div>
        <h1 style={{ fontFamily: heading, fontSize: "2.5rem", margin: "16px 0 8px" }}>Your cart is empty</h1>
        <p style={{ maxWidth: "320px", opacity: 0.75, lineHeight: 1.7 }}>
          Looks like you haven&apos;t added anything yet. Explore our handmade collection!
        </p>
        <Link href="/shop" style={{
          marginTop: "32px", display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: PINK, color: "#fff", border: `2.5px solid ${DARK}`,
          borderRadius: "50px", padding: "12px 28px", fontFamily: font,
          fontWeight: 800, fontSize: "1rem", textDecoration: "none", boxShadow: `5px 5px 0 ${DARK}`,
        }}>
          <ShoppingBagIcon size={20} strokeWidth={2.5} /> Start Shopping
        </Link>

        {/* FIX #11 — Show recommended products even on empty cart */}
        <RecommendedSection
          addedRec={addedRec}
          onAdd={handleAddRecommended}
          cartItemIds={[]}
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: DARK, fontFamily: font }}>

      {/* FIX #15 — glass back button (handled by BackButton component) */}
      <BackButton href="/" label="Back to Home" />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 lg:flex-row lg:items-start">

        {/* ── LEFT — Cart items ── */}
        <section className="flex-grow">
          <h1 style={{ fontFamily: heading, fontSize: "clamp(2rem,5vw,3rem)", marginBottom: "24px" }}>
            Your Cart 🛒
          </h1>

          <div className="rounded-2xl bg-white p-4 md:p-6"
            style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>
            {items.map((it, idx) => (
              <div key={it.id}>
                <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                  <img
                    src={it.image || PLACEHOLDER}
                    alt={it.name}
                    className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                    style={{ border: `2.5px solid ${DARK}` }}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                  />

                  <div className="flex-grow">
                    <h2 style={{ fontFamily: heading, fontSize: "1.1rem" }}>{it.name}</h2>
                    {it.variant && (
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, opacity: 0.7 }}>{it.variant}</p>
                    )}
                    <p style={{ marginTop: "4px", fontSize: "0.9rem", fontWeight: 800, color: PINK }}>
                      ₹{it.price}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center overflow-hidden rounded-xl" style={{ border: `2.5px solid ${DARK}` }}>
                    <button
                      onClick={() => updateQty(it.id, it.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex h-9 w-9 items-center justify-center"
                      style={{ cursor: "pointer", background: "none", border: "none" }}
                    >
                      <MinusIcon size={16} strokeWidth={2.5} />
                    </button>
                    <span className="flex h-9 w-10 items-center justify-center"
                      style={{
                        fontFamily: heading, fontSize: "1rem",
                        borderLeft: `2.5px solid ${DARK}`, borderRight: `2.5px solid ${DARK}`,
                      }}>
                      {it.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(it.id, it.quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex h-9 w-9 items-center justify-center"
                      style={{ cursor: "pointer", background: "none", border: "none" }}
                    >
                      <PlusIcon size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Line total */}
                  <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <p style={{ fontFamily: heading, fontSize: "1.1rem" }}>
                      ₹{it.price * it.quantity}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(it.id)}
                    aria-label={`Remove ${it.name}`}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ border: `2.5px solid ${DARK}`, color: RED, cursor: "pointer", background: "none" }}
                  >
                    <Trash2Icon size={18} strokeWidth={2.5} />
                  </button>
                </div>

                {idx < items.length - 1 && (
                  <div style={{ borderTop: `2px solid ${DARK}`, opacity: 0.12 }} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── RIGHT — Order summary ── */}
        <aside className="w-full lg:sticky lg:top-8 lg:w-80 lg:flex-shrink-0">
          <div className="rounded-2xl bg-white p-6"
            style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>
            <h2 style={{ fontFamily: heading, fontSize: "1.6rem" }}>Order Summary</h2>

            <div className="mt-5 flex items-center justify-between"
              style={{ fontFamily: font, fontSize: "0.95rem", fontWeight: 600 }}>
              <span style={{ opacity: 0.8 }}>Items ({count})</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="mt-3 flex items-center justify-between"
              style={{ fontFamily: font, fontSize: "0.95rem", fontWeight: 600 }}>
              <span style={{ opacity: 0.8 }}>Shipping</span>
              {freeShipping
                ? <span style={{ fontWeight: 800, color: GREEN }}>FREE 🎉</span>
                : <span>₹{shipping}</span>}
            </div>

            {!freeShipping && (
              <p style={{ fontSize: "0.78rem", opacity: 0.65, marginTop: "6px", lineHeight: 1.5 }}>
                Add ₹{500 - subtotal} more to get <strong>free shipping</strong>
              </p>
            )}

            {/* Progress bar toward free shipping */}
            <div style={{
              marginTop: "10px",
              height: "6px",
              backgroundColor: "rgba(0,0,0,0.08)",
              borderRadius: "99px",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.min((subtotal / 500) * 100, 100)}%`,
                backgroundColor: freeShipping ? GREEN : YELLOW,
                borderRadius: "99px",
                transition: "width 0.3s ease",
              }} />
            </div>

            <div style={{ borderTop: `2px solid ${DARK}`, opacity: 0.15, margin: "16px 0" }} />

            <div className="flex items-end justify-between">
              <span style={{ fontFamily: heading, fontSize: "1.3rem" }}>Total</span>
              <span style={{ fontFamily: heading, fontSize: "2rem", color: PINK }}>₹{total}</span>
            </div>

            <button
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3"
              style={{
                backgroundColor: PINK,
                border: `2.5px solid ${DARK}`,
                boxShadow: `4px 4px 0 ${DARK}`,
                color: "#fff",
                fontFamily: font,
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              <ShoppingBagIcon size={20} strokeWidth={2.5} />
              Proceed to Checkout
              <LockIcon size={16} strokeWidth={2.5} />
            </button>

            <Link href="/shop"
              className="mt-4 flex items-center justify-center gap-1.5"
              style={{ color: TEAL, fontFamily: font, fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}
            >
              <ArrowLeftIcon size={16} strokeWidth={2.5} /> Continue Shopping
            </Link>
          </div>
        </aside>
      </div>

      {/* FIX #11 — Recommended products section below cart */}
      <RecommendedSection
        addedRec={addedRec}
        onAdd={handleAddRecommended}
        cartItemIds={items.map((i) => i.id)}
      />
    </main>
  )
}

// ─── FIX #11 — Recommended Products Section ───────────────────────────────────

function RecommendedSection({
  addedRec,
  onAdd,
  cartItemIds,
}: {
  addedRec: string | null
  onAdd: (item: typeof RECOMMENDED[0]) => void
  cartItemIds: string[]
}) {
  // Filter out products already in cart
  const toShow = RECOMMENDED.filter((r) => !cartItemIds.includes(r.id))
  if (toShow.length === 0) return null

  return (
    <section style={{
      backgroundColor: "#F9F4FF",
      borderTop: `3px solid ${DARK}`,
      padding: "64px 24px",
      marginTop: "40px",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            backgroundColor: PINK, border: `2px solid ${DARK}`,
            borderRadius: "50px", padding: "3px 16px", marginBottom: "14px",
            fontFamily: font, fontWeight: 800, fontSize: "0.8rem", color: "#fff",
          }}>
            ✦ You Might Also Love
          </span>
          <h2 style={{ fontFamily: heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: DARK, margin: 0 }}>
            Recommended for You 🧸
          </h2>
          <p style={{ fontFamily: font, fontSize: "0.9rem", color: DARK, opacity: 0.65, marginTop: "8px" }}>
            Handpicked by our makers, loved by little ones.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px",
        }}>
          {toShow.map((rec) => {
            const isAdded = addedRec === rec.id
            return (
              <div key={rec.id}
                style={{
                  backgroundColor: "#fff",
                  border: `2.5px solid ${DARK}`,
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: `5px 5px 0 ${DARK}`,
                  transition: "transform 0.15s, box-shadow 0.15s",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-3px,-3px)"
                  e.currentTarget.style.boxShadow = `8px 8px 0 ${DARK}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0,0)"
                  e.currentTarget.style.boxShadow = `5px 5px 0 ${DARK}`
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", borderBottom: `2.5px solid ${DARK}` }}>
                  <img
                    src={rec.image}
                    alt={rec.name}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    backgroundColor: rec.badgeColor,
                    color: rec.badge === "Best Seller" ? "#fff" : DARK,
                    border: `1.5px solid ${DARK}`, borderRadius: "50px",
                    padding: "2px 10px", fontSize: "0.72rem",
                    fontFamily: font, fontWeight: 800, width: "fit-content",
                  }}>
                    ✦ {rec.badge}
                  </span>

                  <h3 style={{ fontFamily: heading, fontSize: "1.05rem", color: DARK, margin: 0, lineHeight: 1.25 }}>
                    {rec.name}
                  </h3>

                  {/* Stars */}
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} size={13}
                        fill={i < Math.round(rec.rating) ? PINK : "none"}
                        stroke={i < Math.round(rec.rating) ? PINK : "#ccc"}
                      />
                    ))}
                  </div>

                  <p style={{ fontFamily: heading, fontSize: "1.25rem", color: DARK, margin: 0 }}>
                    ₹{rec.price}
                  </p>

                  <button
                    onClick={() => onAdd(rec)}
                    style={{
                      marginTop: "auto",
                      backgroundColor: isAdded ? "#6BCB77" : PINK,
                      color: "#fff",
                      border: `2.5px solid ${DARK}`,
                      borderRadius: "50px",
                      padding: "9px 16px",
                      fontFamily: font,
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "background-color 0.2s, transform 0.1s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    {isAdded ? "Added! ✓" : "+ Add to Cart"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}