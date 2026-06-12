"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

const PINK    = "#FF78AC"
const TEAL    = "#A8D5E3"
const DARK    = "#1A1A2E"
const font    = "'Nunito', sans-serif"
const headingF = "'Fredoka One', cursive"

/* ── Main cylinder slides ── */
const MAIN_SLIDES = [
  { src: "/ddb.jpg",         label: "Crochet teddy🧸" },
  { src: "/tray2.jpg", label: "Crochet Bird 🕊️" },
  { src: "/Tray.avif", label: "Crochet Penguin 🐧" },
  { src: "/flo.webp", label: "Bloosm Flower 🌹" },
]

/* ── Small box slides (independent) ── */
const SMALL_SLIDES = [
  { src: "/chain.webp", label: "Cute Bow 🎀" },
  { src: "/pqpq.webp", label: "New crochet products" },
  { src: "/bata.webp", label: "Cute Couple heart 💕" },
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
  const main  = useAutoSlide(MAIN_SLIDES.length,  3800)
  const small = useAutoSlide(SMALL_SLIDES.length, 2600)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

        /* Video fills section, clipped within */
        .hero-video-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;  /* ← focus on top for mobile */
        z-index: 0;
        filter: brightness(0.72) saturate(1.15);
        }

        /* Gradient overlay so left-side text stays crisp */
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            105deg,
            rgba(26, 26, 46, 0.82) 0%,
            rgba(26, 26, 46, 0.55) 45%,
            rgba(26, 26, 46, 0.10) 100%
          );
        }

        /* Content sits above video + overlay */
        .hero-content {
          position: relative;
          z-index: 2;
        }

        /* Marquee animation */
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Shop button hover */
        .shop-btn:hover {
          transform: translate(-2px, -2px) !important;
          box-shadow: 6px 6px 0 ${DARK} !important;
        }
        .story-btn:hover {
          background-color: ${TEAL} !important;
        }
      `}</style>

      <section style={{
        /*
          IMPORTANT: The hero needs top padding to clear the fixed glass navbar
          (banner ~36px + navbar pill ~60px + buffer = ~110px).
          Adjust this value if your banner height changes.
        */
        paddingTop: "clamp(90px, 15vw, 130px)",
        position: "relative",
        overflow: "hidden",
        borderBottom: `3px solid ${DARK}`,
        /* Give the section a dark fallback while video loads */
        backgroundColor: "#0d0d1a",
        minHeight: "100vh",
      }}>

        {/*
          ── BACKGROUND VIDEO ──
          Place your compiled video at /public/pink_leaves.mp4
          (i.e. copy pink_leaves.mp4 into your Next.js /public folder)
        */}
        <video
          className="hero-video-bg"
          src="videos/stu.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* Gradient overlay for text legibility */}
        <div className="hero-overlay" />

        {/* ── Main content wrapper ── */}
        <div className="hero-content" style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 24px 56px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "48px",
        }}>

          {/* ────────── LEFT TEXT ────────── */}
          <div style={{ flex: "1 1 320px", zIndex: 1 }}>

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
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              lineHeight: 1.1,
              margin: "0 0 12px",
              textShadow: "0 2px 24px rgba(0,0,0,0.5)",
            }}>
              Handmade
              <br />
              <span style={{ color: PINK }}>with love</span>
              <span style={{ marginLeft: "10px", fontSize: "0.7em" }}>🧸</span>
            </h1>

            <p style={{
              fontFamily: font,
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "460px",
              lineHeight: 1.75,
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

            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {[["2,400+", "Happy Kids"], ["100%", "Handmade"], ["4.9★", "Avg Rating"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{
                    fontFamily: headingF,
                    fontSize: "1.6rem",
                    color: PINK,
                    lineHeight: 1,
                    textShadow: "0 0 16px rgba(255,120,172,0.5)",
                  }}>{v}</div>
                  <div style={{
                    fontFamily: font,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ────────── RIGHT: IMAGE COLLAGE ────────── */}
          <div style={{ flex: "1 1 300px", maxWidth: "500px", position: "relative", minHeight: "460px" }}>

            {/* ── MAIN CYLINDER ── */}
            <div style={{
              position: "absolute", top: 0, left: "8%",
              width: "58%", aspectRatio: "3/4",
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
                  <img src={s.src} alt={s.label}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      transform: i === main.index && !main.fading ? "scale(1)" : "scale(1.04)",
                      transition: "transform 0.5s ease",
                    }} />
                </div>
              ))}
              {/* Label */}
              <div style={{
                position: "absolute", bottom: "12px", left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(26,26,46,0.78)",
                color: "#fff",
                borderRadius: "50px", padding: "5px 14px",
                fontFamily: font, fontWeight: 800, fontSize: "0.78rem",
                whiteSpace: "nowrap", backdropFilter: "blur(6px)", zIndex: 3,
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                {MAIN_SLIDES[main.index].label}
              </div>
              {/* Dots */}
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

            {/* ── SMALL BOX ── */}
            <div style={{
              position: "absolute", bottom: "20px", right: "0",
              width: "46%", aspectRatio: "1/1",
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
              {/* Label */}
              <div style={{
                position: "absolute", bottom: "8px", left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(26,26,46,0.78)",
                color: "#fff",
                borderRadius: "50px", padding: "3px 10px",
                fontFamily: font, fontWeight: 800, fontSize: "0.7rem",
                whiteSpace: "nowrap", backdropFilter: "blur(6px)", zIndex: 4,
                border: "1px solid rgba(255,255,255,0.12)",
              }}>
                {SMALL_SLIDES[small.index].label}
              </div>
              {/* Dots */}
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

            {/* Decorative teal circle top-right */}
            <div style={{
              position: "absolute", top: "-12px", right: "14px",
              width: "72px", height: "72px",
              backgroundColor: "rgba(168,213,227,0.35)",
              borderRadius: "50%",
              border: `2px solid rgba(168,213,227,0.6)`,
              backdropFilter: "blur(4px)",
              zIndex: 1,
            }} />

            {/* Decorative green circle bottom-left */}
            <div style={{
              position: "absolute", bottom: "80px", left: "-4px",
              width: "44px", height: "44px",
              backgroundColor: "rgba(107,203,119,0.35)",
              borderRadius: "50%",
              border: `2px solid rgba(107,203,119,0.6)`,
              backdropFilter: "blur(4px)",
              zIndex: 1,
            }} />

            {/* "New arrivals" badge */}
            <div style={{
              position: "absolute", top: "18px", right: "4px",
              backgroundColor: "rgba(107,203,119,0.85)",
              border: `2px solid rgba(255,255,255,0.3)`,
              borderRadius: "12px", padding: "7px 12px",
              fontFamily: headingF, fontSize: "0.88rem", color: "#fff",
              boxShadow: `3px 3px 0 rgba(0,0,0,0.3)`,
              backdropFilter: "blur(8px)",
              transform: "rotate(4deg)",
              zIndex: 4,
            }}>
              New arrivals! 🎉
            </div>
          </div>
        </div>

        {/* ── Marquee strip — sits on top of video too ── */}
        <div style={{
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(26, 26, 46, 0.88)",
          backdropFilter: "blur(10px)",
          borderTop: `1.5px solid rgba(255,255,255,0.1)`,
          padding: "10px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}>
          <div style={{ display: "inline-flex", animation: "marquee 22s linear infinite" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{
                fontFamily: headingF,
                fontSize: "1rem",
                color: PINK,
                padding: "0 32px",
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
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