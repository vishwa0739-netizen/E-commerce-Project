"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

const PINK    = "#FF78AC"
const TEAL    = "#A8D5E3"
const DARK    = "#1A1A2E"
const font    = "'Nunito', sans-serif"
const headingF = "'Fredoka One', cursive"

const MAIN_SLIDES = [
  { src: "/ddb.jpg",   label: "Crochet teddy🧸" },
  { src: "/tray2.jpg", label: "Crochet Bird 🕊️" },
  { src: "/Tray.avif", label: "Crochet Penguin 🐧" },
  { src: "/flo.webp",  label: "Blossom Flower 🌹" },
]

const SMALL_SLIDES = [
  { src: "/chain.webp", label: "Cute Bow 🎀" },
  { src: "/pqpq.webp",  label: "New crochet products" },
  { src: "/bata.webp",  label: "Cute Couple heart 💕" },
]

function useAutoSlide(length: number, interval: number) {
  const [index, setIndex]   = useState(0)
  const [fading, setFading] = useState(false)

  const go = useCallback((next: number) => {
    setFading(true)
    setTimeout(() => { setIndex(next); setFading(false) }, 280)
  }, [])

  useEffect(() => {
    const t = setInterval(() => go((index + 1) % length), interval)
    return () => clearInterval(t)
  }, [index, length, interval, go])

  return { index, fading, go }
}

export function HeroSection() {
  const main  = useAutoSlide(MAIN_SLIDES.length, 3800)
  const small = useAutoSlide(SMALL_SLIDES.length, 2600)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

        .hero-video-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          z-index: 0;
          filter: brightness(0.92) saturate(1.08);
        }
        @media (max-width: 640px) {
          .hero-video-bg { object-position: center top; }
        }

        /* FIX #01 — lighter overlay so hero content is clearly visible */
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            105deg,
            rgba(26, 26, 46, 0.60) 0%,
            rgba(26, 26, 46, 0.28) 50%,
            rgba(26, 26, 46, 0.08) 100%
          );
        }

        .hero-content { position: relative; z-index: 2; }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .shop-btn:hover {
          transform: translate(-2px, -2px) !important;
          box-shadow: 6px 6px 0 rgba(0,0,0,0.4) !important;
        }
        .story-btn:hover { background-color: ${TEAL} !important; }

        /* FIX #01 — on mobile hide collage so text is fully readable */
        @media (max-width: 768px) {
          .hero-collage { display: none !important; }
          .hero-text    { flex: 1 1 100% !important; }
        }
      `}</style>

      <section style={{
        /*
          FIX #01 — paddingTop accounts for:
            offer bar  ≈ 32px (visible for first 5s)
            glass nav  ≈ 60px
            extra air  ≈ 28px
          Total: ~120px — use clamp so it scales on different screens.
          Once the offer bar fades, the section still looks great because
          the video background fills the full viewport.
        */
        paddingTop: "clamp(110px, 14vw, 140px)",
        position: "relative",
        overflow: "hidden",
        borderBottom: `3px solid ${DARK}`,
        backgroundColor: "#0d0d1a",
        minHeight: "100vh",
        /* FIX #01 — ensure section stretches to at least full viewport */
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Background video */}
        <video
          className="hero-video-bg"
          src="/ber.mp4"
          autoPlay muted loop playsInline preload="auto"
          aria-hidden="true"
        />
        <div className="hero-overlay" />

        {/* Main content */}
        <div className="hero-content" style={{
          maxWidth: "1280px",
          margin: "0 auto",
          /*
            FIX #01 — horizontal padding is generous on desktop so the
            text column doesn't butt up against the left logo.
            On desktop the logo sits at left:16px outside the navbar,
            so 24px left padding is safe — the glass nav is centered.
          */
          padding: "clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px) 56px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "clamp(28px, 5vw, 56px)",
          flex: 1,
          width: "100%",
        }}>

          {/* ── LEFT TEXT ── */}
          <div className="hero-text" style={{
            flex: "1 1 320px",
            /* FIX #01 — min-width prevents text being squished on mid-size screens */
            minWidth: "min(320px, 100%)",
            zIndex: 1,
          }}>
            {/* Pill badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(168,213,227,0.22)",
              border: `1.5px solid ${TEAL}`,
              borderRadius: "50px",
              padding: "4px 16px",
              marginBottom: "20px",
              fontFamily: font,
              fontWeight: 800,
              fontSize: "0.85rem",
              color: TEAL,
              backdropFilter: "blur(8px)",
            }}>
              ✦ 100% Handmade · Made with Care ✦
            </div>

            <h1 style={{
              fontFamily: "'Pacifico', cursive",
              color: "#ffffff",
              /* FIX #01 — clamp keeps heading large on desktop, readable on mobile */
              fontSize: "clamp(2.4rem, 5.5vw, 4.8rem)",
              lineHeight: 1.12,
              margin: "0 0 14px",
              textShadow: "0 2px 28px rgba(0,0,0,0.55)",
            }}>
              Handmade
              <br />
              <span style={{ color: PINK }}>with love</span>
              <span style={{ marginLeft: "10px", fontSize: "0.7em" }}>🧸</span>
            </h1>

            <p style={{
              fontFamily: font,
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              color: "rgba(255,255,255,0.88)",
              maxWidth: "460px",
              lineHeight: 1.78,
              margin: "0 0 32px",
            }}>
              Every toy is crafted by hand, one stitch at a time — designed to
              spark imagination and become a lifelong treasure.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "40px" }}>
              <Link href="/shop" className="shop-btn" style={{
                backgroundColor: PINK,
                color: "#fff",
                border: `2.5px solid rgba(255,255,255,0.3)`,
                borderRadius: "50px",
                padding: "14px 32px",
                fontFamily: font,
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                display: "inline-block",
                boxShadow: `4px 4px 0 rgba(0,0,0,0.35)`,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}>
                Shop the Collection →
              </Link>
              <Link href="/about" className="story-btn" style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: `2px solid rgba(255,255,255,0.45)`,
                borderRadius: "50px",
                padding: "14px 32px",
                fontFamily: font,
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                display: "inline-block",
                backdropFilter: "blur(8px)",
                transition: "background 0.15s",
              }}>
                Our Story
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "clamp(18px, 4vw, 40px)", flexWrap: "wrap" }}>
              {[["2,400+", "Happy Kids"], ["100%", "Handmade"], ["4.9★", "Avg Rating"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{
                    fontFamily: headingF,
                    fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
                    color: PINK,
                    lineHeight: 1,
                    textShadow: "0 0 16px rgba(255,120,172,0.5)",
                  }}>{v}</div>
                  <div style={{
                    fontFamily: font,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.62)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginTop: "3px",
                  }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: IMAGE COLLAGE (hidden on mobile) ── */}
          <div className="hero-collage" style={{
            flex: "1 1 300px",
            maxWidth: "480px",
            position: "relative",
            minHeight: "460px",
            /* FIX #01 — slight left margin keeps collage away from edge */
            marginLeft: "auto",
          }}>
            {/* MAIN CYLINDER */}
            <div style={{
              position: "absolute", top: 0, left: "8%",
              width: "56%", aspectRatio: "3/4",
              borderRadius: "140px 140px 24px 24px",
              border: `3px solid rgba(255,255,255,0.25)`,
              boxShadow: `6px 6px 0 rgba(0,0,0,0.4), 0 0 40px rgba(255,120,172,0.12)`,
              overflow: "hidden", zIndex: 2,
              backgroundColor: DARK,
            }}>
              {MAIN_SLIDES.map((s, i) => (
                <div key={i} style={{
                  position: "absolute", inset: 0,
                  opacity: i === main.index && !main.fading ? 1 : 0,
                  transition: "opacity 0.35s ease",
                }}>
                  <img src={s.src} alt={s.label} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: i === main.index && !main.fading ? "scale(1)" : "scale(1.04)",
                    transition: "transform 0.5s ease",
                  }} />
                </div>
              ))}
              <div style={{
                position: "absolute", bottom: "12px", left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(26,26,46,0.78)", color: "#fff",
                borderRadius: "50px", padding: "5px 14px",
                fontFamily: font, fontWeight: 800, fontSize: "0.78rem",
                whiteSpace: "nowrap", backdropFilter: "blur(6px)", zIndex: 3,
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                {MAIN_SLIDES[main.index].label}
              </div>
              <div style={{
                position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: "6px", zIndex: 3,
              }}>
                {MAIN_SLIDES.map((_, i) => (
                  <button key={i} onClick={() => main.go(i)} style={{
                    width: i === main.index ? "20px" : "7px",
                    height: "7px", borderRadius: "50px",
                    backgroundColor: i === main.index ? "#fff" : "rgba(255,255,255,0.45)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "width 0.25s, background 0.25s",
                  }} aria-label={`Main slide ${i + 1}`} />
                ))}
              </div>
            </div>

            {/* SMALL BOX */}
            <div style={{
              position: "absolute", bottom: "20px", right: "0",
              width: "44%", aspectRatio: "1/1",
              borderRadius: "20px",
              border: `3px solid rgba(255,255,255,0.2)`,
              boxShadow: `5px 5px 0 ${PINK}, 0 0 30px rgba(255,120,172,0.2)`,
              overflow: "hidden", zIndex: 3,
              backgroundColor: DARK,
            }}>
              {SMALL_SLIDES.map((s, i) => (
                <div key={i} style={{
                  position: "absolute", inset: 0,
                  opacity: i === small.index && !small.fading ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}>
                  <img src={s.src} alt={s.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
              <div style={{
                position: "absolute", bottom: "8px", left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(26,26,46,0.78)", color: "#fff",
                borderRadius: "50px", padding: "3px 10px",
                fontFamily: font, fontWeight: 800, fontSize: "0.7rem",
                whiteSpace: "nowrap", backdropFilter: "blur(6px)", zIndex: 4,
                border: "1px solid rgba(255,255,255,0.12)",
              }}>
                {SMALL_SLIDES[small.index].label}
              </div>
              <div style={{
                position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: "5px", zIndex: 4,
              }}>
                {SMALL_SLIDES.map((_, i) => (
                  <button key={i} onClick={() => small.go(i)} style={{
                    width: i === small.index ? "16px" : "6px",
                    height: "6px", borderRadius: "50px",
                    backgroundColor: i === small.index ? PINK : "rgba(255,255,255,0.45)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "width 0.25s",
                  }} aria-label={`Small slide ${i + 1}`} />
                ))}
              </div>
            </div>

            {/* Decorative circles */}
            <div style={{
              position: "absolute", top: "-12px", right: "14px",
              width: "72px", height: "72px",
              backgroundColor: "rgba(168,213,227,0.35)", borderRadius: "50%",
              border: `2px solid rgba(168,213,227,0.6)`, backdropFilter: "blur(4px)", zIndex: 1,
            }} />
            <div style={{
              position: "absolute", bottom: "80px", left: "-4px",
              width: "44px", height: "44px",
              backgroundColor: "rgba(107,203,119,0.35)", borderRadius: "50%",
              border: `2px solid rgba(107,203,119,0.6)`, backdropFilter: "blur(4px)", zIndex: 1,
            }} />

            {/* New arrivals badge */}
            <div style={{
              position: "absolute", top: "18px", right: "4px",
              backgroundColor: "rgba(107,203,119,0.85)",
              border: `2px solid rgba(255,255,255,0.3)`,
              borderRadius: "12px", padding: "7px 12px",
              fontFamily: headingF, fontSize: "0.88rem", color: "#fff",
              boxShadow: `3px 3px 0 rgba(0,0,0,0.3)`,
              backdropFilter: "blur(8px)",
              transform: "rotate(4deg)", zIndex: 4,
            }}>
              New arrivals! 🎉
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div style={{
          position: "relative", zIndex: 2,
          backgroundColor: "rgba(26, 26, 46, 0.88)",
          backdropFilter: "blur(10px)",
          borderTop: `1.5px solid rgba(255,255,255,0.1)`,
          padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap",
        }}>
          <div style={{ display: "inline-flex", animation: "marquee 22s linear infinite" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{
                fontFamily: headingF, fontSize: "1rem", color: PINK,
                padding: "0 32px", display: "inline-flex", alignItems: "center", gap: "14px",
              }}>
                🧸 Handmade Toys &nbsp;✦&nbsp;
                <span style={{ color: "#fff" }}>Free Shipping Over ₹500</span> &nbsp;✦&nbsp;
                Eco-Friendly Materials &nbsp;✦&nbsp;
                <span style={{ color: "#fff" }}>Safe for All Ages</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}