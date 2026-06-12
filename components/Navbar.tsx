"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

/* ── Icons ── */
function IconHeart({ size = 20, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#FF78AC" : "none"}
      stroke="#FF78AC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  )
}
function IconUser({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}
function IconCart({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
function IconMenu({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}
function IconX({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: "Home",   href: "/" },
  { label: "Shop",   href: "/shop" },
  { label: "About",  href: "/about" },
  { label: "Orders", href: "/orders" },
]

const PINK  = "#FF78AC"
const GOLD  = "#E8C96A"
const font    = "'Nunito', sans-serif"
const headingF = "'Fredoka One', cursive"

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount]             = useState(2)
  const [wishCount]             = useState(1)
  const pathname                = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* ── Global styles injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

        .cn-nav-link {
          font-family: ${font};
          font-weight: 700;
          font-size: 0.95rem;
          color: ${GOLD};
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 50px;
          transition: background 0.2s, color 0.2s;
          letter-spacing: 0.02em;
        }
        .cn-nav-link:hover,
        .cn-nav-link.active {
          background: rgba(232, 201, 106, 0.15);
          color: #ffffff;
        }
        .cn-nav-link.active {
          color: #ffffff;
          text-shadow: 0 0 12px rgba(232,201,106,0.6);
        }
        .cn-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 12px;
          border-radius: 12px;
          text-decoration: none;
          color: #fff;
          transition: background 0.15s;
          cursor: pointer;
        }
        .cn-icon-btn:hover {
          background: rgba(255,255,255,0.12);
        }
        .cn-icon-label {
          font-family: ${font};
          font-weight: 700;
          font-size: 0.62rem;
          line-height: 1;
          color: rgba(255,255,255,0.65);
        }
        @media (max-width: 768px) {
          .cn-desktop-links { display: none !important; }
          .cn-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .cn-hamburger { display: none !important; }
          .cn-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* ── Offer Banner ── */}
      <div style={{
        background: "linear-gradient(90deg, #1A1A2E 0%, #7B2D8B 40%, #C0392B 100%)",
        padding: "8px 16px",
        textAlign: "center",
        fontFamily: font,
        fontWeight: 800,
        fontSize: "0.85rem",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        position: "relative",
        zIndex: 60,
      }}>
        <span>🎉</span>
        <span>GRAND OPENING SALE — 30% off everything until 30 June!</span>
        <span>Use code <strong style={{
          backgroundColor: "#fff", color: PINK,
          borderRadius: "6px", padding: "1px 8px", fontFamily: "monospace",
        }}>CRAFT30</strong></span>
        <span>🎉</span>
      </div>

      {/*
        ── FLOATING LOGO — absolutely positioned top-left, outside nav pill ──
        Place this BEFORE the nav so it renders underneath the pill on z-axis
        but above the hero video. Adjust `top` to match your banner height.
      */}
      <div style={{
        position: "fixed",
        top: scrolled ? "44px" : "46px",
        left: "28px",
        zIndex: 55,
        transition: "top 0.25s",
        pointerEvents: "auto",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
          {/* Subtle glow backdrop so logo is readable on any bg */}
          <div style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: scrolled ? "1.5rem" : "1.85rem",
            lineHeight: 1,
            transition: "font-size 0.25s",
            filter: "drop-shadow(0 2px 12px rgba(255,120,172,0.55))",
          }}>
            <span style={{ color: PINK }}>Craft</span>
            <span style={{
              color: "#fff",
              textShadow: "0 0 20px rgba(255,255,255,0.35)",
            }}>Nest</span>
          </div>
        </Link>
      </div>

      {/* ── Main Glass Navbar ── */}
      <nav style={{
        position: "fixed",
        top: scrolled ? "36px" : "38px",   /* sits just below banner height */
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 54,
        transition: "top 0.25s, width 0.25s, padding 0.25s",
        width: scrolled ? "min(680px, 90vw)" : "min(760px, 88vw)",
      }}>
        {/* Glass pill */}
        <div style={{
          backgroundColor: "rgba(30, 30, 50, 0.38)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          borderRadius: "50px",
          border: "1.5px solid rgba(255,255,255,0.18)",
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.35),
            0 1.5px 0 rgba(255,255,255,0.12) inset,
            0 -1px 0 rgba(0,0,0,0.2) inset
          `,
          padding: scrolled ? "8px 24px" : "10px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          transition: "padding 0.25s",
        }}>

          {/* Desktop nav links — centred in pill */}
          <ul className="cn-desktop-links" style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            listStyle: "none",
            margin: 0,
            padding: 0,
            flex: 1,
            justifyContent: "center",
          }}>
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href))
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`cn-nav-link${active ? " active" : ""}`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            {/* Wishlist */}
            <Link href="/wishlist" aria-label="Wishlist" className="cn-icon-btn">
              <IconHeart size={19} filled={wishCount > 0} />
              <span className="cn-icon-label" style={{ color: wishCount > 0 ? PINK : undefined }}>
                {wishCount > 0 ? `Wish (${wishCount})` : "Wishlist"}
              </span>
            </Link>

            {/* Login */}
            <Link href="/auth/login" aria-label="Sign in" className="cn-icon-btn">
              <IconUser size={19} />
              <span className="cn-icon-label">Login</span>
            </Link>

            {/* Cart — slightly more prominent */}
            <Link href="/cart" aria-label="Cart" style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              padding: "7px 14px",
              backgroundColor: "rgba(255,120,172,0.88)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              borderRadius: "40px",
              textDecoration: "none",
              color: "#fff",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(255,120,172,0.4)",
              transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,120,172,0.55)"
                e.currentTarget.style.backgroundColor = "rgba(255,120,172,1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(255,120,172,0.4)"
                e.currentTarget.style.backgroundColor = "rgba(255,120,172,0.88)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <IconCart size={15} />
                <span style={{ fontFamily: headingF, fontSize: "0.95rem", lineHeight: 1 }}>{cartCount}</span>
              </div>
              <span style={{ fontFamily: font, fontWeight: 800, fontSize: "0.62rem", lineHeight: 1 }}>Cart</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="cn-hamburger"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: "6px", display: "none" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — drops below the pill */}
        {menuOpen && (
          <div className="cn-mobile-menu" style={{
            marginTop: "10px",
            backgroundColor: "rgba(20, 20, 40, 0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "24px",
            border: "1.5px solid rgba(255,255,255,0.15)",
            padding: "20px 28px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} onClick={() => setMenuOpen(false)}
                    style={{ fontFamily: font, fontWeight: 700, color: GOLD, textDecoration: "none", fontSize: "1.1rem" }}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: font, fontWeight: 800, color: PINK, textDecoration: "none", fontSize: "1.1rem" }}>
                  Sign In →
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}