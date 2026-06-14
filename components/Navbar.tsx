"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
function IconSearch({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: "Home",   href: "/" },
  { label: "Shop",   href: "/shop" },
  { label: "About",  href: "/about" },
  { label: "Orders", href: "/orders" },
]

const PINK   = "#FF78AC"
const GOLD   = "#E8C96A"
const font   = "'Nunito', sans-serif"
const headingF = "'Fredoka One', cursive"

export function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [cartCount]                   = useState(2)
  const [wishCount]                   = useState(1)
  // FIX #02 — offer bar visible state; hides after 5 s
  const [offerVisible, setOfferVisible] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname                      = usePathname()

  // FIX #02 — auto-hide offer bar after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setOfferVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Offer bar height so navbar can shift down correctly
  const offerH = offerVisible ? 32 : 0

  return (
    <>
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
        .cn-nav-link:hover, .cn-nav-link.active {
          background: rgba(232, 201, 106, 0.15);
          color: #ffffff;
        }
        .cn-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 8px;
          border-radius: 12px;
          text-decoration: none;
          color: #fff;
          transition: background 0.15s;
          cursor: pointer;
        }
        .cn-icon-btn:hover { background: rgba(255,255,255,0.12); }
        .cn-icon-label {
          font-family: ${font};
          font-weight: 700;
          font-size: 0.62rem;
          line-height: 1;
          color: rgba(255,255,255,0.65);
        }

        /* ── FIX #02 — Offer banner with fade-out transition ── */
        .cn-offer-banner {
          background: linear-gradient(90deg, #1A1A2E 0%, #7B2D8B 40%, #C0392B 100%);
          padding: 6px 12px;
          text-align: center;
          font-family: ${font};
          font-weight: 800;
          font-size: 0.85rem;
          color: #fff;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: nowrap;
          white-space: nowrap;
          overflow: hidden;
          min-height: 32px;
          transition: opacity 0.6s ease, transform 0.6s ease, max-height 0.6s ease;
        }
        .cn-offer-banner.hidden {
          opacity: 0;
          transform: translateY(-100%);
          pointer-events: none;
          max-height: 0;
          min-height: 0;
          padding: 0;
        }

        @media (max-width: 600px) {
          .cn-offer-banner { font-size: 0.7rem; gap: 4px; padding: 5px 8px; }
          .cn-offer-hide-mobile { display: none !important; }
        }

        /* ── FIX #09 — Search bar inside glass navbar ── */
        .cn-search-wrap {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.22);
          border-radius: 40px;
          padding: 4px 10px 4px 14px;
          gap: 6px;
          flex: 1;
          max-width: 260px;
          transition: background 0.2s, border 0.2s;
        }
        .cn-search-wrap:focus-within {
          background: rgba(255,255,255,0.18);
          border-color: ${PINK};
        }
        .cn-search-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: ${font};
          font-weight: 600;
          font-size: 0.85rem;
          color: #fff;
          width: 100%;
        }
        .cn-search-input::placeholder { color: rgba(255,255,255,0.45); }

        @media (max-width: 768px) {
          .cn-desktop-links { display: none !important; }
          .cn-search-wrap   { display: none !important; }
          .cn-hamburger     { display: flex !important; }
          .cn-logo          { font-size: 1.3rem !important; }
        }
        @media (min-width: 769px) {
          .cn-hamburger   { display: none !important; }
          .cn-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* ── FIX #02 — Offer Banner — auto-hides after 5 s ── */}
      <div className={`cn-offer-banner${offerVisible ? "" : " hidden"}`}>
        <span>🎉</span>
        <span>30% off until 30 June!</span>
        <span>Use code <strong style={{
          backgroundColor: "#fff", color: PINK,
          borderRadius: "6px", padding: "1px 8px",
          fontFamily: "monospace", fontSize: "0.85em",
        }}>CRAFT30</strong></span>
        <span className="cn-offer-hide-mobile">🎉</span>
      </div>

      {/* ── FIX #12 — Floating Logo: always dark (CraftNest brand colors), always visible ── */}
      <div style={{
        position: "fixed",
        top: offerVisible
          ? (scrolled ? "40px" : "42px")
          : (scrolled ? "10px" : "12px"),
        left: "16px",
        zIndex: 55,
        transition: "top 0.35s",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="cn-logo" style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: scrolled ? "1.3rem" : "1.55rem",
            lineHeight: 1,
            transition: "font-size 0.25s",
            filter: "drop-shadow(0 2px 12px rgba(255,120,172,0.55))",
          }}>
            {/* FIX #12 — logo uses brand dark pink + dark navy so it's always readable */}
            <span style={{ color: PINK }}>Craft</span>
            <span style={{
              color: "#1A1A2E",
              WebkitTextStroke: "0.5px rgba(255,255,255,0.6)",
              textShadow: "0 0 12px rgba(255,255,255,0.5)",
            }}>Nest</span>
          </div>
        </Link>
      </div>

      {/* ── FIX #03 + #09 — Floating Glass Navbar with search bar centered ── */}
      <nav style={{
        position: "fixed",
        top: offerVisible
          ? (scrolled ? "32px" : "34px")
          : (scrolled ? "6px"  : "8px"),
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 54,
        transition: "top 0.35s, width 0.25s",
        width: scrolled ? "min(780px, 94vw)" : "min(860px, 92vw)",
      }}>
        <div style={{
          backgroundColor: "rgba(30, 30, 50, 0.38)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          borderRadius: "50px",
          border: "1.5px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          padding: scrolled ? "6px 16px" : "8px 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "padding 0.25s",
        }}>

          {/* Desktop nav links — LEFT side */}
          <ul className="cn-desktop-links" style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            listStyle: "none",
            margin: 0,
            padding: 0,
            flexShrink: 0,
          }}>
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href))
              return (
                <li key={label}>
                  <Link href={href} className={`cn-nav-link${active ? " active" : ""}`}>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* FIX #09 — Search bar — CENTER of navbar */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 8px" }}>
            <div className="cn-search-wrap">
              <IconSearch size={14} />
              <input
                className="cn-search-input"
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`
                  }
                }}
              />
            </div>
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
            <Link href="/wishlist" aria-label="Wishlist" className="cn-icon-btn">
              <IconHeart size={18} filled={wishCount > 0} />
              <span className="cn-icon-label" style={{ color: wishCount > 0 ? PINK : undefined }}>
                {wishCount > 0 ? `Wish(${wishCount})` : "Wish"}
              </span>
            </Link>

            <Link href="/auth/login" aria-label="Sign in" className="cn-icon-btn">
              <IconUser size={18} />
              <span className="cn-icon-label">Login</span>
            </Link>

            <Link href="/cart" aria-label="Cart" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              padding: "6px 12px",
              backgroundColor: "rgba(255,120,172,0.88)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              borderRadius: "40px",
              textDecoration: "none",
              color: "#fff",
              boxShadow: "0 2px 12px rgba(255,120,172,0.4)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <IconCart size={14} />
                <span style={{ fontFamily: headingF, fontSize: "0.9rem", lineHeight: 1 }}>{cartCount}</span>
              </div>
              <span style={{ fontFamily: font, fontWeight: 800, fontSize: "0.6rem", lineHeight: 1 }}>Cart</span>
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

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="cn-mobile-menu" style={{
            marginTop: "10px",
            backgroundColor: "rgba(20, 20, 40, 0.92)",
            backdropFilter: "blur(24px)",
            borderRadius: "24px",
            border: "1.5px solid rgba(255,255,255,0.15)",
            padding: "20px 28px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}>
            {/* Mobile search */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.1)", borderRadius: "40px",
                border: "1.5px solid rgba(255,255,255,0.2)", padding: "8px 16px",
              }}>
                <IconSearch size={14} />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`
                      setMenuOpen(false)
                    }
                  }}
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    fontFamily: font, fontWeight: 600, fontSize: "0.9rem",
                    color: "#fff", width: "100%",
                  }}
                />
              </div>
            </div>
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