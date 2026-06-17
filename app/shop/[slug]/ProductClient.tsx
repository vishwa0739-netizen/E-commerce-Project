"use client"

import { useState } from "react"
import Link from "next/link"
import { BackButton } from "@/components/BackButton"
import { useWishlist } from "@/context/WishlistContext"
import { useCart }     from "@/context/CartContext"        // FIX #10 #14
import type { Product, Review } from "@/lib/types/database"

// ─── Icons ────────────────────────────────────────────────────────────────────

type IconProps = {
  size?: number; className?: string
  style?: React.CSSProperties; fill?: string; strokeWidth?: number
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
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
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
      <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
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
function ShieldIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function LeafIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const CREAM = "#ffffff"
const DARK  = "#1A1A2E"
const GREEN = "#6BCB77"
const PLACEHOLDER = "https://placehold.co/600x600/F2F0EA/1A1A2E?text=🧸"

const BADGE_COLOR_MAP: Record<string, string> = {
  "Handmade":     "#7BC47F",
  "Eco-Friendly": TEAL,
  "Best Seller":  PINK,
}

const font    = "'Nunito', sans-serif"
const heading = "'Fredoka One', cursive"

// ─── Props ────────────────────────────────────────────────────────────────────

type ProductClientProps = {
  product:         Product
  reviews:         Review[]
  relatedProducts: Product[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductClient({ product, reviews, relatedProducts }: ProductClientProps) {
  const [activeImage, setActiveImage]   = useState(0)
  const [quantity, setQuantity]         = useState(1)
  const [addedMain, setAddedMain]       = useState(false)
  const [addedRelated, setAddedRelated] = useState<string | null>(null)
  const [activeTab, setActiveTab]       = useState<"details" | "reviews" | "care">("details")

  const { toggleItem, isWished } = useWishlist()
  // FIX #10 #14 — use CartContext instead of server action
  const { addItem } = useCart()

  const wished     = isWished(product.id)
  const badgeLabel = product.tags?.[0] ?? "Handmade"
  const badgeColor = BADGE_COLOR_MAP[badgeLabel] ?? TEAL
  const makerInitials = product.maker_name
    ? product.maker_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "CN"

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

  // FIX #10 — add main product to CartContext
  const handleAddToCart = () => {
    addItem({
      id:    product.id,
      name:  product.name,
      price: product.price,
      image: product.images?.[0] ?? PLACEHOLDER,
    }, quantity)
    setAddedMain(true)
    setTimeout(() => setAddedMain(false), 1800)
  }

  // FIX #10 — add related product to CartContext
  const handleRelatedAddToCart = (p: Product) => {
    addItem({
      id:    p.id,
      name:  p.name,
      price: p.price,
      image: p.images?.[0] ?? PLACEHOLDER,
    })
    setAddedRelated(p.id)
    setTimeout(() => setAddedRelated(null), 1800)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.average_rating

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: DARK, fontFamily: font }}>

      {/* FIX #15 — glass back button */}
      <BackButton href="/shop" label="Back to Shop" />

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">

        {/* ── PRODUCT OVERVIEW: two-column layout ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
          gap: "clamp(24px, 5vw, 64px)",
          alignItems: "start",
        }}>

          {/* LEFT — Image gallery */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Main image */}
            <div style={{
              overflow: "hidden",
              backgroundColor: "#fafafa",
              border: `2.5px solid ${DARK}`,
              boxShadow: `6px 6px 0 ${DARK}`,
              borderRadius: "140px 140px 24px 24px",
              position: "relative",
            }}>
              <img
                src={product.images?.[activeImage] ?? PLACEHOLDER}
                alt={`${product.name} view ${activeImage + 1}`}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
              />
              {/* Stock badge */}
              {product.stock_qty <= 5 && product.stock_qty > 0 && (
                <div style={{
                  position: "absolute", top: "16px", left: "16px",
                  backgroundColor: "#E63946", color: "#fff",
                  border: `2px solid ${DARK}`, borderRadius: "50px",
                  padding: "3px 12px", fontFamily: font, fontWeight: 800, fontSize: "0.75rem",
                }}>
                  Only {product.stock_qty} left!
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {(product.images?.length ?? 0) > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    style={{
                      padding: 0, cursor: "pointer",
                      border: `2.5px solid ${i === activeImage ? PINK : DARK}`,
                      borderRadius: "14px", overflow: "hidden",
                      boxShadow: i === activeImage ? `3px 3px 0 ${PINK}` : `2px 2px 0 ${DARK}`,
                      transition: "box-shadow 0.15s, border-color 0.15s",
                    }}>
                    <img src={img} alt=""
                      style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div style={{
              display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "4px",
            }}>
              {[
                { icon: <ShieldIcon size={16} />, text: "Safe for 0+ months" },
                { icon: <LeafIcon size={16} />,   text: "Eco materials" },
                { icon: <TruckIcon size={16} />,  text: "Free over ₹500" },
              ].map(({ icon, text }) => (
                <div key={text} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  backgroundColor: "#f3fff3",
                  border: `1.5px solid ${GREEN}`,
                  borderRadius: "50px", padding: "5px 12px",
                  fontFamily: font, fontWeight: 700, fontSize: "0.78rem", color: DARK,
                }}>
                  <span style={{ color: GREEN }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Product info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Badge + Stock */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                backgroundColor: badgeColor,
                color: badgeLabel === "Best Seller" ? "#fff" : DARK,
                border: `2.5px solid ${DARK}`, borderRadius: "50px",
                padding: "4px 16px", fontFamily: font, fontWeight: 800, fontSize: "0.82rem",
              }}>
                ✦ {badgeLabel}
              </span>
              <span style={{
                fontFamily: font, fontWeight: 700, fontSize: "0.8rem",
                color: product.stock_qty > 0 ? GREEN : "#E63946",
                opacity: 0.9,
              }}>
                {product.stock_qty > 0 ? `✓ In Stock (${product.stock_qty})` : "✗ Out of Stock"}
              </span>
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: heading,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: DARK, margin: 0, lineHeight: 1.15,
            }}>
              {product.name}
            </h1>

            {/* Rating summary */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={20} style={{ color: PINK }}
                    fill={i < Math.round(avgRating) ? PINK : "none"} strokeWidth={2.5} />
                ))}
              </div>
              <span style={{ fontFamily: font, fontWeight: 700, fontSize: "0.9rem", opacity: 0.7 }}>
                {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontFamily: heading, fontSize: "2.4rem", color: DARK }}>
                ₹{product.price}
              </span>
              {product.original_price && (
                <span style={{ fontFamily: font, fontSize: "1rem", color: "#999", textDecoration: "line-through", fontWeight: 600 }}>
                  ₹{product.original_price}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontFamily: font, fontSize: "0.97rem", lineHeight: 1.78, margin: 0, opacity: 0.85 }}>
              {product.description}
            </p>

            {/* Quantity + Add to Cart */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              {/* Qty stepper */}
              <div style={{
                display: "flex", alignItems: "center",
                border: `2.5px solid ${DARK}`, borderRadius: "16px",
                overflow: "hidden", backgroundColor: "#fff",
                boxShadow: `3px 3px 0 ${DARK}`,
              }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: "40px", height: "46px", background: "none", border: "none",
                    fontFamily: heading, fontSize: "1.3rem", cursor: "pointer", color: DARK,
                  }}>−</button>
                <span style={{
                  width: "40px", textAlign: "center",
                  fontFamily: heading, fontSize: "1.2rem",
                  borderLeft: `2px solid ${DARK}`, borderRight: `2px solid ${DARK}`,
                  lineHeight: "46px",
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_qty, q + 1))}
                  style={{
                    width: "40px", height: "46px", background: "none", border: "none",
                    fontFamily: heading, fontSize: "1.3rem", cursor: "pointer", color: DARK,
                  }}>+</button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock_qty === 0}
                style={{
                  flex: 1, minWidth: "180px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  backgroundColor: product.stock_qty === 0 ? "#ccc" : addedMain ? GREEN : PINK,
                  color: "#fff",
                  border: `2.5px solid ${DARK}`,
                  borderRadius: "16px", padding: "13px 20px",
                  fontFamily: font, fontWeight: 800, fontSize: "1rem",
                  boxShadow: `4px 4px 0 ${DARK}`,
                  cursor: product.stock_qty === 0 ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => { if (product.stock_qty > 0) e.currentTarget.style.transform = "translate(-2px,-2px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)" }}
              >
                {addedMain
                  ? <><CheckIcon size={18} /> Added to Cart!</>
                  : product.stock_qty === 0
                  ? "Out of Stock"
                  : <><ShoppingCartIcon size={18} strokeWidth={2.5} /> Add to Cart</>
                }
              </button>

              {/* Wishlist */}
              <button onClick={handleWishlist}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                style={{
                  width: "50px", height: "50px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: "#fff", border: `2.5px solid ${DARK}`,
                  borderRadius: "16px", boxShadow: `3px 3px 0 ${DARK}`,
                  cursor: "pointer", transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <HeartIcon size={22} style={{ color: PINK }} fill={wished ? PINK : "none"} strokeWidth={2.5} />
              </button>
            </div>

            {/* Shipping banner */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              backgroundColor: TEAL, border: `2.5px solid ${DARK}`,
              borderRadius: "14px", padding: "12px 18px",
              fontFamily: font, fontWeight: 700, fontSize: "0.88rem", color: DARK,
            }}>
              <TruckIcon size={20} strokeWidth={2.5} />
              Ships in 3–5 days · Free delivery over ₹500
            </div>

            {/* Maker row */}
            {product.maker_name && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "4px" }}>
                <div style={{
                  width: "46px", height: "46px", borderRadius: "50%",
                  backgroundColor: PINK, border: `2.5px solid ${DARK}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: heading, fontSize: "1rem", color: "#fff", flexShrink: 0,
                }}>
                  {makerInitials}
                </div>
                <div>
                  <p style={{ fontFamily: font, fontSize: "0.75rem", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                    Crafted by
                  </p>
                  <p style={{ fontFamily: heading, fontSize: "1.15rem", margin: 0 }}>
                    {product.maker_name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── TAB SECTION: Details / Reviews / Care ── */}
        <div style={{ marginTop: "56px" }}>
          {/* Tab bar */}
          <div style={{
            display: "flex", gap: "4px",
            borderBottom: `2.5px solid ${DARK}`,
            marginBottom: "32px",
          }}>
            {(["details", "reviews", "care"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 22px",
                  fontFamily: heading, fontSize: "1rem",
                  border: `2.5px solid ${DARK}`,
                  borderBottom: "none",
                  borderRadius: "12px 12px 0 0",
                  backgroundColor: activeTab === tab ? PINK : "#fff",
                  color: activeTab === tab ? "#fff" : DARK,
                  cursor: "pointer",
                  transition: "background 0.15s",
                  textTransform: "capitalize",
                }}>
                {tab === "reviews" ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Details tab */}
          {activeTab === "details" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {[
                { label: "Category",  value: product.category ?? "Toys" },
                { label: "Material",  value: "Cotton, wool, non-toxic dyes" },
                { label: "Age Group", value: "0+ months" },
                { label: "Dimensions", value: "Varies by product" },
                { label: "Made in",   value: "India 🇮🇳" },
                { label: "Safety",    value: "CE certified, non-toxic" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  backgroundColor: "#f9f9f9",
                  border: `2px solid ${DARK}`,
                  borderRadius: "14px", padding: "16px 20px",
                }}>
                  <p style={{ fontFamily: font, fontSize: "0.75rem", fontWeight: 700, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: heading, fontSize: "1.05rem", margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <div>
              {/* Rating summary bar */}
              <div style={{
                display: "flex", gap: "24px", alignItems: "center",
                padding: "24px", backgroundColor: "#fff",
                border: `2.5px solid ${DARK}`, borderRadius: "20px",
                boxShadow: `4px 4px 0 ${DARK}`, marginBottom: "28px",
                flexWrap: "wrap",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: heading, fontSize: "3.5rem", lineHeight: 1, color: PINK }}>
                    {avgRating.toFixed(1)}
                  </div>
                  <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginTop: "6px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} size={16} style={{ color: PINK }}
                        fill={i < Math.round(avgRating) ? PINK : "none"} strokeWidth={2.5} />
                    ))}
                  </div>
                  <p style={{ fontFamily: font, fontSize: "0.8rem", opacity: 0.6, margin: "4px 0 0" }}>
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {/* Rating distribution bars */}
                <div style={{ flex: 1, minWidth: "180px" }}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length
                    const pct   = reviews.length ? (count / reviews.length) * 100 : 0
                    return (
                      <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontFamily: font, fontSize: "0.78rem", fontWeight: 700, width: "14px" }}>{star}</span>
                        <StarIcon size={12} fill={PINK} stroke={PINK} strokeWidth={2} />
                        <div style={{ flex: 1, height: "8px", backgroundColor: "#f0f0f0", borderRadius: "99px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", backgroundColor: PINK, borderRadius: "99px", transition: "width 0.4s" }} />
                        </div>
                        <span style={{ fontFamily: font, fontSize: "0.75rem", opacity: 0.6, width: "20px" }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {reviews.length === 0 ? (
                <p style={{ fontFamily: font, opacity: 0.6, textAlign: "center", padding: "32px 0" }}>
                  No reviews yet. Be the first to review this product! 🌟
                </p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {reviews.map((r) => (
                    <article key={r.id} style={{
                      backgroundColor: "#fff",
                      border: `2.5px solid ${DARK}`, borderRadius: "20px",
                      padding: "20px 22px",
                      boxShadow: `4px 4px 0 ${DARK}`,
                      display: "flex", flexDirection: "column", gap: "10px",
                    }}>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} size={16} style={{ color: PINK }}
                            fill={i < r.rating ? PINK : "none"} strokeWidth={2.5} />
                        ))}
                      </div>
                      <p style={{ fontFamily: font, fontSize: "0.92rem", lineHeight: 1.72, margin: 0, opacity: 0.85 }}>
                        &ldquo;{r.comment}&rdquo;
                      </p>
                      <div style={{ marginTop: "auto" }}>
                        <p style={{ fontFamily: heading, fontSize: "1rem", margin: "0 0 2px" }}>
                          {r.profiles?.full_name ?? "Anonymous"}
                        </p>
                        <p style={{ fontFamily: font, fontSize: "0.75rem", opacity: 0.55, margin: 0 }}>
                          {formatDate(r.created_at)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Care tab */}
          {activeTab === "care" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                { emoji: "🧺", title: "Hand wash only",    desc: "Use cold water with a mild soap. Do not machine wash or tumble dry." },
                { emoji: "🌿", title: "Air dry",           desc: "Lay flat to dry. Keep away from direct sunlight to preserve dye colours." },
                { emoji: "🧸", title: "Spot clean",        desc: "For light stains, use a damp cloth with gentle soap and blot gently." },
                { emoji: "📦", title: "Store dry",         desc: "Store in a cool, dry place. Avoid moisture to prevent mould on natural fibres." },
              ].map(({ emoji, title, desc }) => (
                <div key={title} style={{
                  backgroundColor: "#fff",
                  border: `2.5px solid ${DARK}`, borderRadius: "20px",
                  padding: "22px 20px",
                  boxShadow: `4px 4px 0 ${DARK}`,
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{emoji}</div>
                  <h3 style={{ fontFamily: heading, fontSize: "1.1rem", margin: "0 0 6px" }}>{title}</h3>
                  <p style={{ fontFamily: font, fontSize: "0.86rem", lineHeight: 1.65, margin: 0, opacity: 0.75 }}>{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: "64px" }}>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                backgroundColor: PINK, border: `2px solid ${DARK}`,
                borderRadius: "50px", padding: "3px 16px", marginBottom: "12px",
                fontFamily: font, fontWeight: 800, fontSize: "0.8rem", color: "#fff",
              }}>
                ✦ More you&apos;ll love
              </span>
              <h2 style={{ fontFamily: heading, fontSize: "clamp(1.8rem,3.5vw,2.6rem)", margin: 0 }}>
                You might also like
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
            }}>
              {relatedProducts.map((p) => {
                const relBadge  = p.tags?.[0] ?? "Handmade"
                const relColor  = BADGE_COLOR_MAP[relBadge] ?? TEAL
                const isAdded   = addedRelated === p.id

                return (
                  <article key={p.id} style={{
                    display: "flex", flexDirection: "column",
                    overflow: "hidden", borderRadius: "20px",
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
                    <Link href={`/product/${p.id}`} style={{ display: "block", borderBottom: `2.5px solid ${DARK}` }}>
                      <img src={p.images?.[0] ?? PLACEHOLDER} alt={p.name}
                        style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                      />
                    </Link>

                    <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        backgroundColor: relColor,
                        color: relBadge === "Best Seller" ? "#fff" : DARK,
                        border: `1.5px solid ${DARK}`, borderRadius: "50px",
                        padding: "2px 10px", fontSize: "0.7rem",
                        fontFamily: font, fontWeight: 800, width: "fit-content",
                      }}>
                        ✦ {relBadge}
                      </span>

                      <Link href={`/product/${p.id}`} style={{ textDecoration: "none" }}>
                        <h3 style={{ fontFamily: heading, fontSize: "1.05rem", color: DARK, margin: 0, lineHeight: 1.25 }}>
                          {p.name}
                        </h3>
                      </Link>

                      <div style={{ display: "flex", gap: "2px" }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} size={13} style={{ color: PINK }}
                            fill={i < Math.round(p.average_rating) ? PINK : "none"} strokeWidth={2.5} />
                        ))}
                      </div>

                      <p style={{ fontFamily: heading, fontSize: "1.2rem", margin: 0 }}>₹{p.price}</p>

                      <button
                        onClick={() => handleRelatedAddToCart(p)}
                        style={{
                          marginTop: "auto",
                          backgroundColor: isAdded ? GREEN : PINK,
                          color: "#fff",
                          border: `2.5px solid ${DARK}`, borderRadius: "50px",
                          padding: "9px 14px", fontFamily: font, fontWeight: 800,
                          fontSize: "0.85rem", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          transition: "background-color 0.2s",
                          boxShadow: `3px 3px 0 ${DARK}`,
                        }}
                      >
                        {isAdded ? <><CheckIcon size={15} /> Added!</> : <><ShoppingCartIcon size={15} strokeWidth={2.5} /> Add to Cart</>}
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