"use client"

import { useEffect } from "react"
import { Navbar }        from "@/components/Navbar"
import { HeroSection }   from "@/components/HeroSection"
import { Footer }        from "@/components/Footer"
import { ProductCard }   from "@/components/ProductCard"
import { WelcomePopup }  from "@/components/WelcomePopup"
import Link from "next/link"

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const CREAM = "#ffffff"
const DARK  = "#1A1A2E"
const font    = "'Nunito', sans-serif"
const heading = "'Fredoka One', cursive"

/* ── FIX 6: global scroll observer ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]")
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          ;(en.target as HTMLElement).style.opacity = "1"
          ;(en.target as HTMLElement).style.transform = "none"
        }
      }),
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const FEATURED = [
  { id: "1", name: "Crochet Bunny Pal",       price: 34.99, originalPrice: 44.99,
    image: "https://images.unsplash.com/photo-1753370241607-5d48d8aaa70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 5, reviews: 214, badge: "Handmade",   badgeColor: "#6BCB77", isNew: true },
  { id: "2", name: "Rainbow Wooden Dolls Set", price: 52.00,
    image: "https://images.unsplash.com/photo-1779384027896-3c78d80e230b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.8, reviews: 89, badge: "Eco-Friendly", badgeColor: TEAL,    isNew: false },
  { id: "3", name: "Artisan Fox Plushie",      price: 29.95, originalPrice: 39.95,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.9, reviews: 156, badge: "Best Seller", badgeColor: PINK,    isNew: false },
  { id: "4", name: "Block Car Racer",          price: 24.50,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.7, reviews: 63, badge: "Handmade",   badgeColor: "#6BCB77", isNew: true },
]

const TESTIMONIALS = [
  { name: "Priya M.",   stars: 5, text: "My daughter hasn't put down her bunny since it arrived. The quality is absolutely beautiful." },
  { name: "Rahul S.",   stars: 5, text: "Ordered as a birthday gift. The packaging was gorgeous and the toys are so well made!" },
  { name: "Ananya K.",  stars: 5, text: "Finally found a toy shop that cares about craftsmanship. My son loves his fox plushie." },
]

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < Math.floor(count) ? PINK : "#ddd", fontSize: "1rem" }}>★</span>
      ))}
    </div>
  )
}

export default function HomePage() {
  useScrollReveal()

  return (
    <>
      {/* FIX 2: Welcome popup with offer */}
      <WelcomePopup />

      <Navbar />
      <HeroSection />

      {/* ── Featured Products ── */}
      <section style={{ backgroundColor: CREAM, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

          <div data-reveal style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between", flexWrap: "wrap",
            gap: "16px", marginBottom: "48px",
          }}>
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                backgroundColor: PINK, border: `2px solid ${DARK}`,
                borderRadius: "50px", padding: "3px 14px", marginBottom: "12px",
                fontFamily: font, fontWeight: 800, fontSize: "0.8rem", color: "#fff",
              }}>✦ Featured Picks</span>
              <h2 style={{ fontFamily: heading, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: DARK, margin: 0 }}>
                Kids are obsessing over these
              </h2>
            </div>
            <Link href="/shop" style={{
              fontFamily: font, fontWeight: 700, fontSize: "0.95rem",
              color: PINK, textDecoration: "underline", textUnderlineOffset: "4px",
            }}>
              View all products →
            </Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "28px",
          }}>
            {FEATURED.map((p, i) => (
              <div key={p.id} data-reveal data-reveal-delay={String((i + 1) * 100)}>
                <ProductCard {...p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values strip ── */}
      <section data-reveal style={{
        backgroundColor: TEAL, borderTop: `3px solid ${DARK}`,
        borderBottom: `3px solid ${DARK}`, padding: "64px 24px",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
          gap: "40px", textAlign: "center",
        }}>
          {[
            { icon: "🧵", title: "100% Handmade", desc: "Every toy is stitched or carved by hand — no machines." },
            { icon: "🌿", title: "Eco-Friendly",  desc: "Natural, non-toxic materials safe for kids and the planet." },
            { icon: "💛", title: "Made with Love",desc: "Each toy is a one-of-a-kind creation packed with care." },
            { icon: "🚚", title: "Free Shipping", desc: "Free delivery on all orders over ₹500 across India." },
          ].map((v, i) => (
            <div key={v.title} data-reveal data-reveal-delay={String(i * 100)}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{v.icon}</div>
              <h3 style={{ fontFamily: heading, fontSize: "1.2rem", color: DARK, marginBottom: "8px" }}>{v.title}</h3>
              <p style={{ fontFamily: font, fontSize: "0.88rem", color: DARK, opacity: 0.75, lineHeight: 1.65, maxWidth: "180px", margin: "0 auto" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ backgroundColor: CREAM, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div data-reveal style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontFamily: heading, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: DARK }}>
              Happy families, happy kids 🧸
            </h2>
            <p style={{ fontFamily: font, fontSize: "1rem", color: DARK, opacity: 0.65, marginTop: "10px" }}>
              Don&apos;t just take our word for it.
            </p>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "24px",
          }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} data-reveal data-reveal-delay={String(i * 150)}
                style={{
                  backgroundColor: "#fff", border: `2.5px solid ${DARK}`,
                  borderRadius: "20px", padding: "28px",
                  boxShadow: `5px 5px 0 ${DARK}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
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
                <Stars count={t.stars} />
                <p style={{ fontFamily: font, fontSize: "0.95rem", color: DARK,
                  lineHeight: 1.7, margin: "14px 0", opacity: 0.85 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <p style={{ fontFamily: heading, fontSize: "1rem", color: PINK }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section data-reveal style={{
        backgroundColor: DARK, padding: "72px 24px", textAlign: "center",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: heading, fontSize: "clamp(1.8rem,4vw,2.8rem)",
            color: PINK, marginBottom: "16px" }}>
            Ready to find a forever toy? 🧸
          </h2>
          <p style={{ fontFamily: font, color: CREAM, opacity: 0.8,
            marginBottom: "32px", fontSize: "1rem", lineHeight: 1.7 }}>
            Every purchase supports our small team of independent makers.
            Handcrafted with love, delivered to your door.
          </p>
          <Link href="/shop" style={{
            backgroundColor: PINK, color: "#fff",
            border: `2.5px solid ${PINK}`, borderRadius: "50px",
            padding: "16px 44px", fontFamily: font, fontWeight: 800,
            fontSize: "1.05rem", textDecoration: "none",
            boxShadow: `4px 4px 0 rgba(255,120,172,0.4)`,
            display: "inline-block", transition: "transform 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Shop Now →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}