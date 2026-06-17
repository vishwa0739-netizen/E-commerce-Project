// hooks/useRazorpayScript.ts
// FIX: Extracted script loading from the checkout page into a reusable hook.
// This avoids duplicating the load logic if you add Razorpay to other pages
// (e.g. Buy Now buttons on product pages).

"use client"

import { useState, useEffect } from "react"

type ScriptStatus = "idle" | "loading" | "ready" | "error"

export function useRazorpayScript(): ScriptStatus {
  const [status, setStatus] = useState<ScriptStatus>("idle")

  useEffect(() => {
    // If already loaded by a previous mount, don't re-append
    const existing = document.getElementById("razorpay-checkout-script")
    if (existing) {
      // Script tag exists — check if Razorpay object is already on window
      if (typeof window.Razorpay === "function") {
        setStatus("ready")
      } else {
        // Script tag exists but hasn't fired onload yet; wait for it
        setStatus("loading")
        existing.addEventListener("load",  () => setStatus("ready"))
        existing.addEventListener("error", () => setStatus("error"))
      }
      return
    }

    setStatus("loading")

    const script     = document.createElement("script")
    script.id        = "razorpay-checkout-script"
    script.src       = "https://checkout.razorpay.com/v1/checkout.js"
    script.async     = true
    script.onload    = () => setStatus("ready")
    script.onerror   = () => {
      console.error("[Razorpay] Failed to load checkout script from CDN.")
      setStatus("error")
    }

    document.head.appendChild(script)
  }, [])

  return status
}