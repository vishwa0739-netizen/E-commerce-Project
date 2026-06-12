"use client"

import { useState } from "react"
import { useWishlist } from "@/context/WishlistContext"
import { addToCart } from "@/lib/actions/cart"
import type { Product, Review } from "@/lib/types/database"

// ─── Icon Components ──────────────────────────────────────────────────────────

type IconProps = {
  size?: number
  className?: string
  style?: React.CSSProperties
  fill?: string
  strokeWidth?: number
}

function HeartIcon({ size = 24, className, style, fill = "none", strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
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

function ShoppingCartIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function TruckIcon({ size = 24, className, style, strokeWidth = 2 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const CREAM = "#ffffff"
const DARK  = "#1A1A2E"
const PLACEHOLDER = "https://placehold.co/400x400/F2F0EA/1A1A2E?text=🧸"

const BADGE_COLOR_MAP: Record<string, string> = {
  "Handmade":     "#7BC47F",
  "Eco-Friendly": TEAL,
  "Best Seller":  PINK,
}

// ─── Props ────────────────────────────────────────────────────────────────────

type ProductClientProps = {
  product: Product
  reviews: Review[]
  // Related products: same category, excluding current product
  relatedProducts: Product[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductClient({ product, reviews, relatedProducts }: ProductClientProps) {
  const [activeImage, setActiveImage]   = useState(0)
  const [quantity, setQuantity]         = useState(1)
  const [loadingCart, setLoadingCart]   = useState(false)
  // Track add-to-cart for each related product independently
  const [loadingRelated, setLoadingRelated] = useState<string | null>(null)

  const { toggleItem, isWished } = useWishlist()
  const wished = isWished(product.id)

  // Use first tag as the badge label, fall back to "Handmade"
  const badgeLabel = product.tags?.[0] ?? "Handmade"
  const badgeColor = BADGE_COLOR_MAP[badgeLabel] ?? TEAL

  // Maker initials for the avatar circle (e.g. "Priya Sharma" → "PS")
  const makerInitials = product.maker_name
    ? product.maker_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "CN"

  // ── Wishlist handler ──
  const handleWishlist = () => {
    toggleItem({
      id:         product.id,
      name:       product.name,
      price:      product.price,
      image:      product.images?.[0] ?? PLACEHOLDER,
      badge:      badgeLabel,
      badgeColor: badgeColor,
      rating:     Math.round(product.average_rating),
    })
  }

  // ── Add to cart (main product) ──
  const handleAddToCart = async () => {
    setLoadingCart(true)
    try {
      await addToCart(product.id, quantity)
      // TODO: show success toast
    } catch (err: any) {
  if (err?.message === 'Not logged in') {
    window.location.href = '/auth/login'
  } else {
    console.error("Add to cart failed:", err)
  }
} finally {
      setLoadingCart(false)
    }
  }

  // ── Add to cart (related product) ──
  const handleRelatedAddToCart = async (productId: string) => {
    setLoadingRelated(productId)
    try {
      await addToCart(productId, 1)
    } catch (err: any) {
  if (err?.message === 'Not logged in') {
    window.location.href = '/auth/login'
  } else {
    console.error("Add to cart failed:", err)
  }
} finally {
      setLoadingRelated(null)
    }
  }

  // ── Format review date from ISO string → "May 12, 2026" ──
  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
    })

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: DARK, fontFamily: "'Nunito', sans-serif" }}>
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* LEFT — Image gallery */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden bg-white"
              style={{
                border: `2.5px solid ${DARK}`,
                boxShadow: `5px 5px 0 ${DARK}`,
                borderRadius: "140px 140px 20px 20px",
              }}>
              <img
                // Shows whichever thumbnail is active; falls back to placeholder
                src={product.images?.[activeImage] ?? PLACEHOLDER}
                alt={`${product.name} view ${activeImage + 1}`}
                className="aspect-square w-full object-cover"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
              />
            </div>

            {/* Thumbnails — only render if product has more than 1 image */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => {
                  const active = i === activeImage
                  return (
                    <button key={i} onClick={() => setActiveImage(i)}
                      aria-label={`Show image ${i + 1}`}
                      aria-pressed={active}
                      className="overflow-hidden rounded-2xl bg-white transition-transform active:scale-95"
                      style={{
                        border: `2.5px solid ${DARK}`,
                        boxShadow: active ? `4px 4px 0 ${PINK}` : `3px 3px 0 ${DARK}`,
                        outline: active ? `2.5px solid ${PINK}` : "none",
                        outlineOffset: "-2.5px",
                      }}>
                      <img src={img} alt={`${product.name} thumbnail ${i + 1}`}
                        className="aspect-square w-full object-cover"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* RIGHT — Product info */}
          <div className="flex flex-col gap-5">

            {/* Badge from first tag */}
            <span className="flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold"
              style={{ backgroundColor: badgeColor, color: DARK, border: `2.5px solid ${DARK}` }}>
              <StarIcon size={14} fill={DARK} strokeWidth={2.5} />
              {badgeLabel} · {product.stock_qty > 0 ? `${product.stock_qty} in stock` : "Out of stock"}
            </span>

            <h1 className="text-4xl leading-tight md:text-5xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {product.name}
            </h1>

            {/* Rating row — uses real average_rating + review_count from DB */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5" aria-label={`Rated ${product.average_rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={20} style={{ color: PINK }}
                    fill={i < Math.round(product.average_rating) ? PINK : "none"} strokeWidth={2.5} />
                ))}
              </div>
              {/* review_count is auto-updated by your DB trigger on the reviews table */}
              <span className="text-sm font-bold opacity-70">({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
                ₹{product.price}
              </span>
            </div>

            <p className="text-base" style={{ lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Quantity stepper + Add to Cart + Wishlist */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

              {/* Quantity stepper */}
              <div className="flex w-fit items-center rounded-2xl bg-white"
                style={{ border: `2.5px solid ${DARK}`, boxShadow: `3px 3px 0 ${DARK}` }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-4 py-3 text-xl leading-none"
                  style={{ fontFamily: "'Fredoka One', cursive" }}>
                  −
                </button>
                <span className="min-w-10 text-center text-xl" aria-live="polite"
                  style={{ fontFamily: "'Fredoka One', cursive" }}>
                  {quantity}
                </span>
                <button
                  // Prevent exceeding stock
                  onClick={() => setQuantity((q) => Math.min(product.stock_qty, q + 1))}
                  aria-label="Increase quantity"
                  className="px-4 py-3 text-xl leading-none"
                  style={{ fontFamily: "'Fredoka One', cursive" }}>
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={loadingCart || product.stock_qty === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-extrabold text-white transition-transform active:translate-x-[2px] active:translate-y-[2px]"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  backgroundColor: product.stock_qty === 0 ? "#ccc" : loadingCart ? TEAL : PINK,
                  border: `2.5px solid ${DARK}`,
                  boxShadow: `5px 5px 0 ${DARK}`,
                  cursor: (loadingCart || product.stock_qty === 0) ? "not-allowed" : "pointer",
                }}>
                <ShoppingCartIcon size={20} strokeWidth={2.5} />
                {product.stock_qty === 0 ? "Out of Stock" : loadingCart ? "Adding…" : "Add to Cart"}
              </button>

              {/* Wishlist heart */}
              <button
                onClick={handleWishlist}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wished}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white transition-transform active:scale-90"
                style={{ border: `2.5px solid ${DARK}`, boxShadow: `3px 3px 0 ${DARK}`, cursor: "pointer" }}>
                <HeartIcon size={22} style={{ color: PINK }} fill={wished ? PINK : "none"} strokeWidth={2.5} />
              </button>
            </div>

            {/* Shipping info */}
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ backgroundColor: TEAL, border: `2.5px solid ${DARK}`, color: DARK }}>
              <TruckIcon size={22} strokeWidth={2.5} />
              <span className="text-sm font-bold">Ships in 3–5 days · Free over ₹500</span>
            </div>

            {/* Maker row — uses maker_name from your products table */}
            {product.maker_name && (
              <div className="flex items-center gap-3 pt-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm text-white"
                  style={{ backgroundColor: PINK, border: `2.5px solid ${DARK}`, fontFamily: "'Fredoka One', cursive" }}
                  aria-hidden="true">
                  {makerInitials}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide opacity-60">Crafted by</p>
                  <p className="text-lg leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    {product.maker_name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Customer Reviews ── */}
        <section className="mt-16">
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-6 text-sm opacity-60">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {reviews.map((r) => (
                <article key={r.id}
                  className="flex flex-col gap-3 rounded-2xl bg-white p-5"
                  style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>

                  <div className="flex items-center gap-0.5" aria-label={`Rated ${r.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} size={16} style={{ color: PINK }}
                        fill={i < r.rating ? PINK : "none"} strokeWidth={2.5} />
                    ))}
                  </div>

                  <p className="text-sm" style={{ lineHeight: 1.7 }}>{r.comment}</p>

                  <div className="mt-auto">
                    {/* profiles.full_name is joined via select('*, profiles(full_name, avatar_url)') */}
                    <p className="text-base leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
                      {r.profiles?.full_name ?? "Anonymous"}
                    </p>
                    <p className="text-xs font-semibold opacity-60">{formatDate(r.created_at)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
              You might also like
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => {
                const relBadge = p.tags?.[0] ?? "Handmade"
                const relColor = BADGE_COLOR_MAP[relBadge] ?? TEAL
                const isLoading = loadingRelated === p.id

                return (
                  <article key={p.id}
                    className="flex flex-col overflow-hidden rounded-2xl bg-white"
                    style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>

                    <div className="relative" style={{ borderBottom: `2.5px solid ${DARK}` }}>
                      <img src={p.images?.[0] ?? PLACEHOLDER} alt={p.name}
                        className="aspect-square w-full object-cover"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-extrabold"
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          backgroundColor: relColor,
                          color: relBadge === "Best Seller" ? "#fff" : DARK,
                          border: `2px solid ${DARK}`,
                        }}>
                        ✦ {relBadge}
                      </span>

                      <h3 className="text-lg leading-snug" style={{ fontFamily: "'Fredoka One', cursive" }}>
                        {p.name}
                      </h3>

                      <div className="flex items-center gap-0.5" aria-label={`Rated ${p.average_rating} out of 5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} size={16} style={{ color: PINK }}
                            fill={i < Math.round(p.average_rating) ? PINK : "none"} strokeWidth={2.5} />
                        ))}
                      </div>

                      <span className="mt-1 text-xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
                        ₹{p.price}
                      </span>

                      <button
                        onClick={() => handleRelatedAddToCart(p.id)}
                        disabled={isLoading}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-extrabold text-white"
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          backgroundColor: isLoading ? TEAL : PINK,
                          border: `2.5px solid ${DARK}`,
                          boxShadow: `3px 3px 0 ${DARK}`,
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}>
                        <ShoppingCartIcon size={18} strokeWidth={2.5} />
                        {isLoading ? "Adding…" : "Add to Cart"}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}