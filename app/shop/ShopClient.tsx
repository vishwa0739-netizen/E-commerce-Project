"use client"

import { useState } from "react"
import { BackButton } from "@/components/BackButton"
import { useWishlist } from "@/context/WishlistContext"
import { addToCart } from "@/lib/actions/cart"
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

function SearchIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
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

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const CREAM = "#ffffff"
const DARK  = "#1A1A2E"
const PLACEHOLDER = "https://placehold.co/400x400/F2F0EA/1A1A2E?text=🧸"

// Badge colors mapped to your DB tags array values
// If a product has no recognised badge tag, falls back to TEAL
const BADGE_COLOR_MAP: Record<string, string> = {
  "Handmade":     "#7BC47F",
  "Eco-Friendly": TEAL,
  "Best Seller":  PINK,
}

// ─── Props ────────────────────────────────────────────────────────────────────

type ShopClientProps = {
  // Real Product rows from Supabase, typed via lib/types/database.ts
  products: Product[]
  // Unique category strings fetched from the DB (e.g. ["Stuffed Animals", "Wooden Toys"])
  categories: string[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [query, setQuery] = useState("")
  // Track which cart buttons are loading to give user feedback
  const [loadingCart, setLoadingCart] = useState<string | null>(null)

  const { toggleItem, isWished } = useWishlist()

  // Prepend "All" to the real categories from DB
  const allCategories = ["All", ...categories]

  // Client-side filter on top of already-fetched products.
  // Category + search filtering here matches what the server fetched.
  const filtered = products.filter((p) => {
    const matchCat   = activeCategory === "All" || p.category === activeCategory
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  })

  // ── Wishlist handler ──
  // Maps Supabase Product shape → WishlistContext shape
  const handleWishlist = (p: Product) => {
    // Use first tag as badge label, fall back to "Handmade"
    const badgeLabel = p.tags?.[0] ?? "Handmade"
    toggleItem({
      id:            p.id,
      name:          p.name,
      price:         p.price,
      image:         p.images?.[0] ?? PLACEHOLDER,
      badge:         badgeLabel,
      badgeColor:    BADGE_COLOR_MAP[badgeLabel] ?? TEAL,
      rating:        Math.round(p.average_rating),
    })
  }

  // ── Add to Cart handler ──
  // Calls the server action; shows a loading state on the clicked button
  const handleAddToCart = async (productId: string) => {
    setLoadingCart(productId)
    try {
      await addToCart(productId, 1)
      // TODO: show a success toast here (e.g. react-hot-toast)
    } catch (err: any) {
  if (err?.message === 'Not logged in') {
    window.location.href = '/auth/login'
  } else {
    console.error("Add to cart failed:", err)
  }
}finally {
      setLoadingCart(null)
    }
  }

  return (
    <main className="min-h-screen"
      style={{ backgroundColor: CREAM, color: DARK, fontFamily: "'Nunito', sans-serif" }}>
      <BackButton href="/" label="Back to Home" />

      {/* ── Heading ── */}
      <section className="px-6 py-10 md:px-10" style={{ backgroundColor: CREAM }}>
        <p className="mb-2 text-sm font-bold uppercase tracking-widest" style={{ color: PINK }}>
          CraftNest Collection
        </p>
        <h1 className="text-4xl leading-tight md:text-6xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
          All Handcraft Toys
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed opacity-80">
          Lovingly made by hand, one stitch and one whittle at a time.
        </p>
      </section>

      {/* ── Filters ── */}
      <section className="px-6 pb-2 md:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {allCategories.map((cat) => {
              const active = cat === activeCategory
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className="rounded-2xl px-4 py-2 text-sm font-extrabold"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    border: `2.5px solid ${DARK}`,
                    backgroundColor: active ? PINK : "#fff",
                    color: active ? "#fff" : DARK,
                    boxShadow: `3px 3px 0 ${DARK}`, cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = TEAL }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "#fff" }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <SearchIcon size={20}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: DARK }} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search toys..."
              className="w-full rounded-2xl bg-white py-2.5 pl-11 pr-4 text-sm font-semibold outline-none"
              style={{ fontFamily: "'Nunito', sans-serif", border: `2.5px solid ${TEAL}`, color: DARK }}
            />
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="px-6 py-8 md:px-10">
        {filtered.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center"
            style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>
            <p className="text-2xl" style={{ fontFamily: "'Fredoka One', cursive" }}>No toys found 🧸</p>
            <p className="mt-2 text-sm opacity-70">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => {
              const wished      = isWished(p.id)
              const badgeLabel  = p.tags?.[0] ?? "Handmade"
              const badgeColor  = BADGE_COLOR_MAP[badgeLabel] ?? TEAL
              const imageUrl    = p.images?.[0] ?? PLACEHOLDER
              const isLoading   = loadingCart === p.id

              return (
                <article key={p.id}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white"
                  style={{
                    border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}`,
                    transition: "transform 0.15s, box-shadow 0.15s", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-3px,-3px)"; e.currentTarget.style.boxShadow = `8px 8px 0 ${DARK}` }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = `5px 5px 0 ${DARK}` }}
                >
                  {/* ── Product Image ── */}
                  <div className="relative" style={{ borderBottom: `2.5px solid ${DARK}` }}>
                    <img
                      src={imageUrl} alt={p.name}
                      className="aspect-square w-full object-cover"
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                    />

                    {/* "New" badge: shown if product was created within the last 14 days */}
                    {(() => {
                      const ageInDays = (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)
                      return ageInDays < 14 ? (
                        <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold uppercase text-white"
                          style={{ fontFamily: "'Nunito', sans-serif", backgroundColor: "#E63946", border: `2px solid ${DARK}` }}>
                          New
                        </span>
                      ) : null
                    })()}

                    {/* Wishlist heart button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleWishlist(p) }}
                      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                      aria-pressed={wished}
                      title={wished ? "Saved to wishlist ♥" : "Save to wishlist"}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white"
                      style={{
                        border: `2.5px solid ${DARK}`,
                        transition: "transform 0.15s, background 0.15s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <HeartIcon size={18} style={{ color: PINK }} fill={wished ? PINK : "none"} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* ── Product Info ── */}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    {/* Badge from first tag */}
                    <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-extrabold"
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        backgroundColor: badgeColor,
                        color: badgeLabel === "Best Seller" ? "#fff" : DARK,
                        border: `2px solid ${DARK}`,
                      }}>
                      ✦ {badgeLabel}
                    </span>

                    <h2 className="text-lg leading-snug" style={{ fontFamily: "'Fredoka One', cursive" }}>
                      {p.name}
                    </h2>

                    {/* Star rating from average_rating (0–5) */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} size={15} style={{ color: PINK }}
                          fill={i < Math.round(p.average_rating) ? PINK : "none"} strokeWidth={2.5} />
                      ))}
                    </div>

                    {/* Price — no originalPrice in schema, show single price */}
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
                        ₹{p.price}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(p.id)}
                      disabled={isLoading}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-extrabold text-white"
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        backgroundColor: isLoading ? TEAL : PINK,
                        border: `2.5px solid ${DARK}`,
                        boxShadow: `3px 3px 0 ${DARK}`,
                        transition: "transform 0.1s, box-shadow 0.1s",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.8 : 1,
                      }}
                      onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = `4px 4px 0 ${DARK}` }}}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = `3px 3px 0 ${DARK}` }}
                    >
                      <ShoppingCartIcon size={18} strokeWidth={2.5} />
                      {isLoading ? "Adding…" : "Add to Cart"}
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