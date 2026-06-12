"use client"

import { useState } from "react"
import Link from "next/link"
import { BackButton } from "@/components/BackButton"

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const CREAM = "#ffffff"
const DARK  = "#1A1A2E"
const font    = "'Nunito', sans-serif"
const heading = "'Fredoka One', cursive"

export default function LoginPage() {
  const [email, setEmail]           = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setShowSuccess(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>

      {/* ← Back button */}
      <BackButton href="/" label="Back to Home" />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl p-10"
          style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>

          {showSuccess ? (
            /* ── Success state ── */
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                border: "2.5px solid #4CAF50", display: "flex",
                alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 style={{ fontFamily: heading, fontSize: "2rem", color: "#4CAF50", marginBottom: "12px" }}>
                Check your inbox!
              </h1>
              <p style={{ fontFamily: font, color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>
                We sent a magic link to{" "}
                <strong style={{ color: DARK }}>{email}</strong>.
                Click the link to sign in.
              </p>
              <p style={{ fontFamily: font, fontSize: "0.85rem", color: "#888" }}>
                Didn&apos;t get it?{" "}
                <button onClick={() => setShowSuccess(false)}
                  style={{ color: PINK, background: "none", border: "none",
                    cursor: "pointer", fontWeight: 700, fontFamily: font }}>
                  Resend
                </button>
              </p>
              <div style={{
                marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #eee",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "6px", fontSize: "0.78rem", color: "#999", fontFamily: font,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your data is always private &amp; secure.
              </div>
            </div>
          ) : (
            /* ── Sign-in form ── */
            <div>
              {/* Logo */}
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <span style={{ fontFamily: "'Pacifico', cursive", fontSize: "2.2rem", color: PINK }}>Craft</span>
                <span style={{ fontFamily: "'Pacifico', cursive", fontSize: "2.2rem", color: DARK }}>Nest</span>
              </div>

              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <h1 style={{ fontFamily: heading, fontSize: "2rem", color: DARK, marginBottom: "8px" }}>
                  Welcome back!
                </h1>
                <p style={{ fontFamily: font, color: "#777", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  Sign in to track orders, save favourites &amp; checkout faster.
                </p>
              </div>

              {/* Google button */}
              <button onClick={() => console.log("Google OAuth")}
                style={{
                  width: "100%", backgroundColor: "white",
                  border: `2.5px solid ${DARK}`, borderRadius: "16px",
                  padding: "12px 16px", fontFamily: font, fontWeight: 700,
                  fontSize: "0.95rem", color: DARK, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  boxShadow: `5px 5px 0 ${DARK}`, marginBottom: "20px",
                }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ flex: 1, borderTop: "1px solid #ddd" }} />
                <span style={{ color: "#aaa", fontSize: "0.85rem", fontFamily: font }}>or</span>
                <div style={{ flex: 1, borderTop: "1px solid #ddd" }} />
              </div>

              {/* Magic link form */}
              <form onSubmit={handleSubmit}>
                <label style={{ display: "block", fontFamily: font, fontWeight: 700,
                  fontSize: "0.9rem", color: DARK, marginBottom: "8px" }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%", backgroundColor: CREAM, border: `2.5px solid ${DARK}`,
                    borderRadius: "14px", padding: "12px 16px", fontFamily: font,
                    fontSize: "0.95rem", color: DARK, outline: "none",
                    marginBottom: "14px", boxSizing: "border-box",
                  }}
                />
                <button type="submit"
                  style={{
                    width: "100%", backgroundColor: PINK,
                    border: `2.5px solid ${DARK}`, borderRadius: "50px",
                    padding: "13px 16px", fontFamily: font, fontWeight: 800,
                    fontSize: "1rem", color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: `5px 5px 0 ${DARK}`, marginBottom: "10px",
                  }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  Send Magic Link
                </button>
                <p style={{ textAlign: "center", fontFamily: font, fontSize: "0.78rem", color: "#999" }}>
                  We&apos;ll email you a secure sign-in link. No password needed.
                </p>
              </form>

              {/* Security note */}
              <div style={{
                marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #eee",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "6px", fontSize: "0.78rem", color: "#999", fontFamily: font,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your data is always private &amp; secure.
              </div>

              {/* Don't have account note */}
              <p style={{ textAlign: "center", fontFamily: font, fontSize: "0.82rem",
                color: "#888", marginTop: "16px" }}>
                No account?{" "}
                <span style={{ color: TEAL, fontWeight: 700 }}>
                  It&apos;s created automatically when you sign in.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}