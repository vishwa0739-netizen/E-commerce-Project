"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const DARK  = "#1A1A2E"
const font    = "'Nunito', sans-serif"
const heading = "'Fredoka One', cursive"

export function WelcomePopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail]     = useState("")
  const [done, setDone]       = useState(false)

  /* Show after 2.5s, only once per session */
  useEffect(() => {
    const seen = sessionStorage.getItem("cn_popup_seen")
    if (seen) return
    const t = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setVisible(false)
    sessionStorage.setItem("cn_popup_seen", "1")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setDone(true)
      setTimeout(close, 2000)
    }
  }

  if (!visible) return null

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      backgroundColor: "rgba(26,26,46,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px", backdropFilter: "blur(4px)",
      animation: "fadeIn 0.3s ease",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div style={{
        backgroundColor: "#fff", border: `3px solid ${DARK}`,
        borderRadius: "28px", padding: "40px 36px", maxWidth: "440px", width: "100%",
        boxShadow: `8px 8px 0 ${DARK}`, position: "relative",
        animation: "slideUp 0.35s ease",
        textAlign: "center",
      }}>
        {/* Close button */}
        <button onClick={close} style={{
          position: "absolute", top: "14px", right: "14px",
          background: "none", border: "none", cursor: "pointer",
          fontSize: "1.4rem", color: DARK, lineHeight: 1,
        }} aria-label="Close">✕</button>

        {done ? (
          <>
            <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🎉</div>
            <h2 style={{ fontFamily: heading, fontSize: "1.8rem", color: PINK, marginBottom: "8px" }}>
              You&apos;re in!
            </h2>
            <p style={{ fontFamily: font, color: DARK, opacity: 0.75 }}>
              Check your inbox for your 15% off code. Happy shopping!
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🧸</div>
            <h2 style={{ fontFamily: heading, fontSize: "2rem", color: DARK, marginBottom: "8px" }}>
              Welcome to CraftNest!
            </h2>
            <p style={{ fontFamily: font, fontSize: "0.95rem", color: DARK,
              opacity: 0.75, lineHeight: 1.7, marginBottom: "20px" }}>
              Sign up and get <strong style={{ color: PINK }}>15% off your first order</strong>.
              Handmade toys delivered with love. 💛
            </p>

            {/* Offer pill */}
            <div style={{
              backgroundColor: TEAL, border: `2px solid ${DARK}`,
              borderRadius: "50px", padding: "8px 20px", marginBottom: "24px",
              fontFamily: font, fontWeight: 800, fontSize: "0.85rem", color: DARK,
              display: "inline-block",
            }}>
              🎁 Grand Opening — 30% off with code CRAFT30
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" required
                style={{
                  width: "100%", border: `2.5px solid ${DARK}`,
                  borderRadius: "14px", padding: "12px 16px",
                  fontFamily: font, fontSize: "0.95rem", color: DARK,
                  backgroundColor: "#ffffff", outline: "none", boxSizing: "border-box",
                }}
              />
              <button type="submit" style={{
                backgroundColor: PINK, color: "#fff",
                border: `2.5px solid ${DARK}`, borderRadius: "50px",
                padding: "13px", fontFamily: font, fontWeight: 800,
                fontSize: "1rem", cursor: "pointer",
                boxShadow: `4px 4px 0 ${DARK}`,
              }}>
                Claim My 15% Off 🎉
              </button>
            </form>

            <button onClick={close} style={{
              marginTop: "14px", background: "none", border: "none",
              fontFamily: font, fontSize: "0.82rem", color: "#aaa",
              cursor: "pointer", textDecoration: "underline",
            }}>
              No thanks, I&apos;ll pay full price
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}