"use client"

import { useState } from "react"
import Link from "next/link"
import { BackButton } from "@/components/BackButton"
import { useWishlist } from "@/context/WishlistContext"
import { useCart } from "@/context/CartContext"          // FIX #10 #14
import type { Product } from "@/lib/types/database"

// ─── Icon Components ──────────────────────────────────────────────────────────

type IconProps = { size?: number; className?: string; style?: React.CSSProperties; fill?: string; strokeWidth?: number }

function HeartIcon({ size = 24, className, style, fill = "none", strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  )
}
function ShoppingCartIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
function StarIcon({ size = 24, className, style, fill = "none", strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.685 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.45 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  )
}
function CheckIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK        = "#FF78AC"
const TEAL        = "#A8D5E3"
const CREAM       = "#ffffff"
const DARK        = "#1A1A2E"
const PLACEHOLDER = "https://placehold.co/400x400/F2F0EA/1A1A2E?text=🧸"

const BADGE_COLOR_MAP: Record<string, string> = {
  "Handmade":     "#7BC47F",
  "Eco-Friendly": TEAL,
  "Best Seller":  PINK,
}

// ─── Props ────────────────────────────────────────────────────────────────────

type ShopClientProps = {
  products:   Product[]
  categories: string[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [query, setQuery]                   = useState("")
  const [addedId, setAddedId]               = useState<string | null>(null)

  const { toggleItem, isWished } = useWishlist()
  // FIX #10 #14 — use cart context instead of calling a server action
  const { addItem } = useCart()

  const allCategories = ["All", ...categories]

  const filtered = products.filter((p) => {
    const matchCat   = activeCategory === "All" || p.category === activeCategory
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  })

  const handleWishlist = (p: Product) => {
    const badgeLabel = p.tags?.[0] ?? "Handmade"
    toggleItem({
      id:         p.id,
      name:       p.name,
      price:      p.price,
      image:      p.images?.[0] ?? PLACEHOLDER,
      badge:      badgeLabel,
      badgeColor: BADGE_COLOR_MAP[badgeLabel] ?? TEAL,
      rating:     Math.round(p.average_rating),
    })
  }

  // FIX #10 — Add to Cart now calls CartContext.addItem → persists in localStorage
  // FIX #14 — no longer calls a server action that was resetting to default items
  const handleAddToCart = (p: Product) => {
    addItem({
      id:    p.id,
      name:  p.name,
      price: p.price,
      image: p.images?.[0] ?? PLACEHOLDER,
    })
    // Show "Added!" feedback for 1.8 s
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: CREAM, color: DARK, fontFamily: "'Nunito', sans-serif" }}
    >
      {/* FIX #15 — glass back button */}
      <BackButton href="/" label="Back to Home" />

      {/* ── Heading ── */}
      <section className="px-6 py-10 md:px-10" style={{ backgroundColor: CREAM }}>
        <p className="mb-2 text-sm font-bold uppercase tracking-widest" style={{ color: PINK }}>
          CraftNest Collection
        </p>
        <h1 className="text-4xl leading-tight md:text-6xl"
          style={{ fontFamily: "'Fredoka One', cursive" }}>
          All Handcraft Toys
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed opacity-80">
          Lovingly made by hand, one stitch and one whittle at a time.
        </p>
      </section>

      {/* ── Filters ──
          FIX #09 — removed duplicate search bar here; search lives in Navbar now.
          Category pills remain for filtering. ── */}
      <section className="px-6 pb-6 md:px-10">
        <div className="flex flex-wrap gap-3">
          {allCategories.map((cat) => {
            const active = cat === activeCategory
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-2xl px-4 py-2 text-sm font-extrabold"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  border: `2.5px solid ${DARK}`,
                  backgroundColor: active ? PINK : "#fff",
                  color: active ? "#fff" : DARK,
                  boxShadow: `3px 3px 0 ${DARK}`,
                  cursor: "pointer",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = TEAL }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "#fff" }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Inline search fallback (shows on mobile where navbar search is hidden) */}
        <div className="mt-4 block lg:hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search toys..."
            className="w-full rounded-2xl bg-white py-2.5 px-4 text-sm font-semibold outline-none"
            style={{ fontFamily: "'Nunito', sans-serif", border: `2.5px solid ${TEAL}`, color: DARK }}
          />
        </div>
      </section>

      {/* ── Product Grid ──
          FIX #09 — uniform grid with fixed card sizes, proper alignment ── */}
      <section className="px-6 py-4 pb-16 md:px-10">
        {filtered.length === 0 ? (
          <div
            className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center"
            style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}
          >
            <p className="text-2xl" style={{ fontFamily: "'Fredoka One', cursive" }}>No toys found 🧸</p>
            <p className="mt-2 text-sm opacity-70">Try a different category or search term.</p>
          </div>
        ) : (
          // FIX #04 #09 — uniform 3-column on md, 4-column on lg, consistent card sizing
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "24px",
            alignItems: "start",      // FIX #09 — all cards aligned to top
          }}>
            {filtered.map((p) => {
              const wished      = isWished(p.id)
              const badgeLabel  = p.tags?.[0] ?? "Handmade"
              const badgeColor  = BADGE_COLOR_MAP[badgeLabel] ?? TEAL
              const imageUrl    = p.images?.[0] ?? PLACEHOLDER
              const isAdded     = addedId === p.id
              const ageInDays   = (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)

              return (
                <article
                  key={p.id}
                  // FIX #09 — each card stretches to fill its grid cell uniformly
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRadius: "20px",
                    backgroundColor: "#fff",
                    border: `2.5px solid ${DARK}`,
                    boxShadow: `5px 5px 0 ${DARK}`,
                    transition: "transform 0.15s, box-shadow 0.15s",
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
                    <Link href={`/product/${p.id}`} style={{ display: "block" }}>
                      <img
                        src={imageUrl}
                        alt={p.name}
                        style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                      />
                    </Link>

                    {ageInDays < 14 && (
                      <span style={{
                        position: "absolute", top: "10px", left: "10px",
                        backgroundColor: "#E63946", color: "#fff",
                        border: `2px solid ${DARK}`, borderRadius: "50px",
                        padding: "2px 10px", fontFamily: "'Nunito', sans-serif",
                        fontWeight: 800, fontSize: "0.7rem",
                      }}>
                        NEW
                      </span>
                    )}

                    <button
                      onClick={() => handleWishlist(p)}
                      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                      style={{
                        position: "absolute", top: "10px", right: "10px",
                        backgroundColor: "#fff", border: `2.5px solid ${DARK}`,
                        borderRadius: "50%", width: "36px", height: "36px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "transform 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <HeartIcon size={16} style={{ color: PINK }} fill={wished ? PINK : "none"} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      backgroundColor: badgeColor,
                      color: badgeLabel === "Best Seller" ? "#fff" : DARK,
                      border: `1.5px solid ${DARK}`, borderRadius: "50px",
                      padding: "2px 10px", fontSize: "0.7rem",
                      fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                      width: "fit-content",
                    }}>
                      ✦ {badgeLabel}
                    </span>

                    {/* FIX #08 — name links to product overview page */}
                    <Link href={`/product/${p.id}`} style={{ textDecoration: "none" }}>
                      <h2 style={{
                        fontFamily: "'Fredoka One', cursive",
                        fontSize: "1.05rem",
                        color: DARK,
                        margin: 0,
                        lineHeight: 1.25,
                      }}>
                        {p.name}
                      </h2>
                    </Link>

                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} size={13} style={{ color: PINK }}
                          fill={i < Math.round(p.average_rating) ? PINK : "none"} strokeWidth={2.5} />
                      ))}
                    </div>

                    <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.2rem", color: DARK, margin: 0 }}>
                      ₹{p.price}
                    </p>

                    {/* FIX #10 — button now calls CartContext.addItem correctly */}
                    <button
                      onClick={() => handleAddToCart(p)}
                      style={{
                        marginTop: "auto",
                        backgroundColor: isAdded ? "#6BCB77" : PINK,
                        color: "#fff",
                        border: `2.5px solid ${DARK}`,
                        borderRadius: "50px",
                        padding: "10px 14px",
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "background-color 0.2s, transform 0.1s",
                        boxShadow: `3px 3px 0 ${DARK}`,
                      }}
                      onMouseEnter={(e) => {
                        if (!isAdded) e.currentTarget.style.transform = "translate(-1px,-1px)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translate(0,0)"
                      }}
                    >
                      {isAdded ? <><CheckIcon size={16} /> Added!</> : <><ShoppingCartIcon size={16} strokeWidth={2.5} /> Add to Cart</>}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}