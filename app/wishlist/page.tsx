"use client"

import Link from "next/link"
import { useWishlist } from "@/context/WishlistContext"
import { BackButton } from "@/components/BackButton"

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const DARK  = "#1A1A2E"
const CREAM = "#ffffff"
const font    = "'Nunito', sans-serif"
const heading = "'Fredoka One', cursive"

function HeartFilledIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={PINK}
      stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  )
}

function CartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function TrashIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

const PLACEHOLDER = "https://placehold.co/300x300/F2F0EA/1A1A2E?text=🧸"

export default function WishlistPage() {
  const { items, removeItem, count } = useWishlist()

  /* ── Empty state ── */
  if (count === 0) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: CREAM, fontFamily: font, color: DARK }}>
        <BackButton href="/" label="Back to Home" />
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "70vh", textAlign: "center", padding: "24px",
        }}>
          <div style={{ fontSize: "5rem", marginBottom: "16px" }}>🤍</div>
          <h1 style={{ fontFamily: heading, fontSize: "2.4rem", marginBottom: "12px" }}>
            Your wishlist is empty
          </h1>
          <p style={{ opacity: 0.7, maxWidth: "340px", lineHeight: 1.7, marginBottom: "28px" }}>
            Browse the shop and tap the heart ♡ on any toy to save it here for later.
          </p>
          <Link href="/shop" style={{
            backgroundColor: PINK, color: "#fff",
            border: `2.5px solid ${DARK}`, borderRadius: "50px",
            padding: "14px 32px", fontFamily: font, fontWeight: 800,
            fontSize: "1rem", textDecoration: "none", display: "inline-block",
            boxShadow: `4px 4px 0 ${DARK}`, transition: "transform 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-2px,-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
          >
            Browse Toys →
          </Link>
        </div>
      </main>
    )
  }

  /* ── Wishlist with items ── */
  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, fontFamily: font, color: DARK }}>
      <BackButton href="/" label="Back to Home" />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <HeartFilledIcon size={28} />
            <h1 style={{ fontFamily: heading, fontSize: "clamp(2rem,5vw,3rem)", margin: 0 }}>
              My Wishlist
            </h1>
            <span style={{
              backgroundColor: PINK, color: "#fff",
              border: `2px solid ${DARK}`, borderRadius: "50px",
              padding: "2px 12px", fontFamily: font,
              fontWeight: 800, fontSize: "0.85rem",
            }}>
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          <p style={{ opacity: 0.65, fontSize: "0.95rem" }}>
            Toys you&apos;ve saved. Add them to your cart whenever you&apos;re ready.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px",
        }}>
          {items.map((item) => (
            <div key={item.id}
              style={{
                backgroundColor: "#fff",
                border: `2.5px solid ${DARK}`, borderRadius: "20px",
                overflow: "hidden", boxShadow: `5px 5px 0 ${DARK}`,
                display: "flex", flexDirection: "column",
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
                <img
                  src={item.image || PLACEHOLDER}
                  alt={item.name}
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                />
                {/* Remove from wishlist */}
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove from wishlist"
                  style={{
                    position: "absolute", top: "10px", right: "10px",
                    width: "34px", height: "34px", borderRadius: "50%",
                    backgroundColor: "#fff", border: `2px solid ${DARK}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe4ee")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                >
                  <HeartFilledIcon size={16} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>

                {/* Badge */}
                <span style={{
                  display: "inline-block", width: "fit-content",
                  backgroundColor: item.badgeColor, color: item.badge === "Best Seller" ? "#fff" : DARK,
                  border: `2px solid ${DARK}`, borderRadius: "50px",
                  padding: "2px 10px", fontFamily: font,
                  fontWeight: 800, fontSize: "0.72rem",
                }}>
                  ✦ {item.badge}
                </span>

                {/* Name */}
                <h2 style={{ fontFamily: heading, fontSize: "1.1rem", margin: 0, lineHeight: 1.3 }}>
                  {item.name}
                </h2>

                {/* Stars */}
                <div style={{ display: "flex", gap: "2px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < Math.floor(item.rating) ? PINK : "#ddd", fontSize: "0.85rem" }}>★</span>
                  ))}
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
                  <span style={{ fontFamily: heading, fontSize: "1.3rem", color: DARK }}>₹{item.price}</span>
                  {item.originalPrice && (
                    <span style={{ fontSize: "0.85rem", textDecoration: "line-through", opacity: 0.5 }}>
                      ₹{item.originalPrice}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                  {/* Add to cart */}
                  <Link href="/cart" style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    backgroundColor: PINK, color: "#fff",
                    border: `2px solid ${DARK}`, borderRadius: "14px",
                    padding: "9px 8px", fontFamily: font,
                    fontWeight: 800, fontSize: "0.82rem", textDecoration: "none",
                    boxShadow: `3px 3px 0 ${DARK}`, transition: "transform 0.1s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-1px,-1px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
                  >
                    <CartIcon size={14} /> Add to Cart
                  </Link>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove"
                    style={{
                      width: "38px", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: "#fff", color: "#E63946",
                      border: `2px solid ${DARK}`, borderRadius: "14px",
                      cursor: "pointer", transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe4ee")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: "48px", textAlign: "center",
          padding: "32px", backgroundColor: TEAL,
          border: `2.5px solid ${DARK}`, borderRadius: "20px",
          boxShadow: `5px 5px 0 ${DARK}`,
        }}>
          <p style={{ fontFamily: heading, fontSize: "1.3rem", marginBottom: "16px" }}>
            Want to explore more? 🧸
          </p>
          <Link href="/shop" style={{
            backgroundColor: DARK, color: "#fff",
            border: `2px solid ${DARK}`, borderRadius: "50px",
            padding: "12px 28px", fontFamily: font,
            fontWeight: 800, fontSize: "0.95rem", textDecoration: "none",
            display: "inline-block", boxShadow: `3px 3px 0 ${PINK}`,
          }}>
            Continue Shopping →
          </Link>
        </div>
      </div>
    </main>
  )
}