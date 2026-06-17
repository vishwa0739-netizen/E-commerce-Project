"use client"

// app/checkout/page.tsx
// Razorpay payment integration — fixed version
//
// HOW IT WORKS:
//   1. User fills delivery details (with proper validation)
//   2. "Pay Now" calls createRazorpayOrder server action → gets an order_id
//   3. Razorpay checkout modal opens (script loaded via useRazorpayScript hook)
//   4. On payment success, verifyRazorpayPayment server action checks the
//      HMAC-SHA256 signature → saves order to DB → clears cart
//
// SETUP:
//   .env.local:
//     RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
//     RAZORPAY_KEY_SECRET=your_secret_here
//     NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/BackButton"
import { useCart }    from "@/context/CartContext"
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/actions/razorpay"
import { useRazorpayScript } from "@/hooks/useRazorpayScript"
// types/razorpay.d.ts is global — no import needed

// ─── Icons ────────────────────────────────────────────────────────────────────

function LockIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function CheckCircleIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK  = "#FF78AC"
const TEAL  = "#A8D5E3"
const DARK  = "#1A1A2E"
const GREEN = "#6BCB77"
const font    = "'Nunito', sans-serif"
const heading = "'Fredoka One', cursive"
const PLACEHOLDER = "https://placehold.co/64x64/F2F0EA/1A1A2E?text=🧸"

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  name:    string
  email:   string
  phone:   string
  address: string
  city:    string
  state:   string
  pincode: string
}

type PaymentState = "idle" | "loading" | "processing" | "success" | "error"

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PINCODE_RE = /^\d{6}$/
const PHONE_RE   = /^[6-9]\d{9}$/   // Indian mobile numbers

function validateForm(form: FormData): string | null {
  if (!form.name.trim())            return "Full name is required."
  if (!EMAIL_RE.test(form.email))   return "Enter a valid email address."
  if (!PHONE_RE.test(form.phone.replace(/\D/g, "")))
                                    return "Enter a valid 10-digit Indian mobile number."
  if (!form.address.trim())         return "Delivery address is required."
  if (!form.city.trim())            return "City is required."
  if (!PINCODE_RE.test(form.pincode)) return "Enter a valid 6-digit pincode."
  return null
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router                              = useRouter()
  const { items, subtotal, count, clearCart } = useCart()
  const rzpStatus                           = useRazorpayScript()

  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  })
  const [paymentState, setPaymentState]     = useState<PaymentState>("idle")
  const [errorMsg, setErrorMsg]             = useState("")
  const [successOrderId, setSuccessOrderId] = useState("")

  // FIX #1: Use a ref to track paymentState inside Razorpay callbacks.
  // Razorpay's modal.ondismiss closes over the initial value of paymentState
  // due to JavaScript closures — by the time it fires, the state variable
  // still reads "processing" even if the user already paid.
  // A ref always reflects the latest value.
  const paymentStateRef = useRef<PaymentState>("idle")
  const syncState = (s: PaymentState) => {
    paymentStateRef.current = s
    setPaymentState(s)
  }

  const shipping = subtotal >= 500 ? 0 : 50
  const total    = subtotal + shipping

  // Redirect if cart is empty (but not after a successful payment)
  useEffect(() => {
    if (count === 0 && paymentStateRef.current !== "success") {
      router.push("/shop")
    }
  }, [count, router])

  const update = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  // FIX #2: useCallback so handlePay identity is stable; also fixes
  // the stale closure risk if it were ever used inside an effect.
  const handlePay = useCallback(async () => {
    setErrorMsg("")

    // FIX #3: Proper validation with descriptive messages
    const validationError = validateForm(form)
    if (validationError) { setErrorMsg(validationError); return }

    if (rzpStatus !== "ready") {
      setErrorMsg(
        rzpStatus === "error"
          ? "Payment gateway failed to load. Please refresh the page."
          : "Payment gateway is still loading, please wait a moment."
      )
      return
    }

    // FIX #4: Snapshot cart items before any async work —
    // avoids reading an empty array if clearCart fires mid-flight
    const cartSnapshot = items.map((i) => ({
      id: i.id, name: i.name, price: i.price, quantity: i.quantity,
    }))

    if (cartSnapshot.length === 0) {
      setErrorMsg("Your cart is empty.")
      return
    }

    syncState("loading")

    try {
      // 1. Create Razorpay order on the server
      const order = await createRazorpayOrder(total)

      // 2. Open checkout modal
      syncState("processing")

      const rzp = new window.Razorpay({
        key:         order.keyId,
        amount:      order.amount,
        currency:    order.currency,
        order_id:    order.orderId,
        name:        "CraftNest",
        description: `${count} handmade item${count !== 1 ? "s" : ""}`,
        prefill: {
          name:    form.name,
          email:   form.email,
          contact: form.phone.replace(/\D/g, ""),
        },
        theme: { color: PINK },

        // 3. On successful payment, verify signature on the server
        handler: async (response) => {
          try {
            const result = await verifyRazorpayPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              cartItems:   cartSnapshot,
              totalAmount: total,
            })

            if (result.success) {
              setSuccessOrderId(response.razorpay_payment_id)
              syncState("success")
              clearCart()
            } else {
              setErrorMsg(result.message)
              syncState("error")
            }
          } catch {
            setErrorMsg("Payment verification failed. Please contact support@craftnest.in")
            syncState("error")
          }
        },

        modal: {
          // FIX #5: Use the ref to read the real current state, not the
          // stale closure value. This correctly handles the dismiss case.
          ondismiss: () => {
            if (paymentStateRef.current === "processing") {
              syncState("idle")
            }
          },
          // Ask user to confirm before closing the modal
          confirm_close: true,
        },
      })

      rzp.open()

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed. Please try again."
      setErrorMsg(msg)
      syncState("error")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, items, total, count, rzpStatus, clearCart])

  const isProcessing = paymentState === "loading" || paymentState === "processing"

  // ── Success screen ──────────────────────────────────────────────────────────
  if (paymentState === "success") {
    return (
      <main style={{
        minHeight: "100vh", backgroundColor: "#f0fff4",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", fontFamily: font,
      }}>
        {/* FIX #6: Google Fonts loaded inline for reliability in this component */}
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');`}</style>

        <div style={{
          backgroundColor: "#fff", border: `2.5px solid ${DARK}`,
          borderRadius: "28px", boxShadow: `8px 8px 0 ${DARK}`,
          padding: "48px 40px", maxWidth: "480px", width: "100%", textAlign: "center",
        }}>
          <div style={{ color: GREEN, marginBottom: "20px" }}>
            <CheckCircleIcon size={72} />
          </div>
          <h1 style={{ fontFamily: heading, fontSize: "2.4rem", color: DARK, margin: "0 0 12px" }}>
            Order Placed! 🎉
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, opacity: 0.75, margin: "0 0 8px" }}>
            Thank you, <strong>{form.name}</strong>! Your handmade treasures are on their way.
          </p>
          <p style={{ fontSize: "0.82rem", opacity: 0.55, margin: "0 0 32px" }}>
            Payment ID:{" "}
            <code style={{ backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "6px" }}>
              {successOrderId}
            </code>
          </p>
          <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "32px" }}>
            A confirmation will be sent to <strong>{form.email}</strong>
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {/* FIX #7: Changed /orders to /shop — /orders likely doesn't exist yet.
                Swap back to /orders once you build that page. */}
            <Link href="/shop" style={{
              backgroundColor: PINK, color: "#fff",
              border: `2.5px solid ${DARK}`, borderRadius: "50px",
              padding: "12px 28px", fontFamily: font, fontWeight: 800,
              fontSize: "0.95rem", textDecoration: "none",
              boxShadow: `4px 4px 0 ${DARK}`,
            }}>
              Continue Shopping
            </Link>
            <Link href="/" style={{
              backgroundColor: "#fff", color: DARK,
              border: `2.5px solid ${DARK}`, borderRadius: "50px",
              padding: "12px 28px", fontFamily: font, fontWeight: 800,
              fontSize: "0.95rem", textDecoration: "none",
              boxShadow: `4px 4px 0 ${DARK}`,
            }}>
              Go Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Checkout form ───────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fafafa", fontFamily: font, color: DARK }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');`}</style>

      <BackButton href="/cart" label="Back to Cart" />

      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "24px 20px 60px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(340px,100%), 1fr))",
        gap: "32px",
        alignItems: "start",
      }}>

        {/* ── LEFT: Delivery form ── */}
        <section>
          <h1 style={{ fontFamily: heading, fontSize: "2.2rem", marginBottom: "28px" }}>
            Checkout 🛍️
          </h1>

          <div style={{
            backgroundColor: "#fff", border: `2.5px solid ${DARK}`,
            borderRadius: "24px", boxShadow: `5px 5px 0 ${DARK}`, padding: "28px",
          }}>
            <h2 style={{ fontFamily: heading, fontSize: "1.4rem", marginBottom: "20px" }}>
              Delivery Details
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Full Name *"  value={form.name}  onChange={update("name")}  placeholder="Priya Sharma" />
                <Field label="Email *"      value={form.email} onChange={update("email")} placeholder="priya@email.com" type="email" />
              </div>

              <Field
                label="Phone Number *"
                value={form.phone}
                onChange={update("phone")}
                placeholder="9876543210"
                type="tel"
              />

              <Field
                label="Address *"
                value={form.address}
                onChange={update("address")}
                placeholder="123 Toy Lane, Apartment 4B"
                textarea
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <Field label="City *"    value={form.city}    onChange={update("city")}    placeholder="Chennai" />
                <Field label="State"     value={form.state}   onChange={update("state")}   placeholder="Tamil Nadu" />
                <Field label="Pincode *" value={form.pincode} onChange={update("pincode")} placeholder="600001" />
              </div>
            </div>
          </div>

          <div style={{
            marginTop: "16px", display: "flex", alignItems: "center", gap: "8px",
            fontFamily: font, fontSize: "0.82rem", color: DARK, opacity: 0.6,
          }}>
            <LockIcon size={14} />
            Payments secured by Razorpay. We never store your card details.
          </div>
        </section>

        {/* ── RIGHT: Order summary + Pay button ── */}
        <aside>
          <div style={{
            backgroundColor: "#fff", border: `2.5px solid ${DARK}`,
            borderRadius: "24px", boxShadow: `5px 5px 0 ${DARK}`, padding: "28px",
            position: "sticky", top: "100px",
          }}>
            <h2 style={{ fontFamily: heading, fontSize: "1.4rem", marginBottom: "20px" }}>
              Order Summary
            </h2>

            {/* Items list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={item.image || PLACEHOLDER}
                    alt={item.name}
                    style={{
                      width: "56px", height: "56px", borderRadius: "12px",
                      objectFit: "cover", border: `2px solid ${DARK}`, flexShrink: 0,
                    }}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: heading, fontSize: "0.95rem", margin: "0 0 2px",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: 0 }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p style={{ fontFamily: heading, fontSize: "1rem", flexShrink: 0 }}>
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `2px solid ${DARK}`, opacity: 0.1, margin: "16px 0" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Row label="Subtotal" value={`₹${subtotal}`} />
              <Row
                label="Shipping"
                value={subtotal >= 500 ? "FREE 🎉" : "₹50"}
                valueColor={subtotal >= 500 ? GREEN : undefined}
              />
              {subtotal < 500 && (
                <p style={{ fontSize: "0.78rem", opacity: 0.55, margin: "-4px 0 0" }}>
                  Add ₹{500 - subtotal} more for free shipping
                </p>
              )}
            </div>

            <div style={{ borderTop: `2px solid ${DARK}`, opacity: 0.15, margin: "16px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: heading, fontSize: "1.3rem" }}>Total</span>
              <span style={{ fontFamily: heading, fontSize: "2.2rem", color: PINK }}>₹{total}</span>
            </div>

            {/* Script load error warning */}
            {rzpStatus === "error" && (
              <div style={{
                marginTop: "16px", padding: "12px 16px",
                backgroundColor: "#fff8e1", border: "2px solid #F9A825",
                borderRadius: "12px", fontSize: "0.82rem", color: "#5D4037",
              }}>
                ⚠️ Payment gateway failed to load. Please refresh the page.
              </div>
            )}

            {/* Form / payment error message */}
            {errorMsg && (
              <div style={{
                marginTop: "16px", padding: "12px 16px",
                backgroundColor: "#fff0f0", border: "2px solid #E63946",
                borderRadius: "12px", fontFamily: font, fontSize: "0.85rem",
                color: "#E63946", fontWeight: 700,
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={isProcessing || rzpStatus === "error"}
              style={{
                marginTop: "20px",
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                backgroundColor: isProcessing ? TEAL : PINK,
                color: "#fff",
                border: `2.5px solid ${DARK}`,
                borderRadius: "50px", padding: "16px 24px",
                fontFamily: font, fontWeight: 800, fontSize: "1.05rem",
                boxShadow: `5px 5px 0 ${DARK}`,
                cursor: isProcessing ? "not-allowed" : "pointer",
                transition: "transform 0.1s, background-color 0.2s",
                opacity: rzpStatus === "error" ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) e.currentTarget.style.transform = "translate(-2px,-2px)"
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)" }}
            >
              <LockIcon size={18} />
              {paymentState === "loading"    ? "Creating order…"   :
               paymentState === "processing" ? "Awaiting payment…" :
               rzpStatus !== "ready"         ? "Loading gateway…"  :
               `Pay ₹${total} Securely`}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.75rem", opacity: 0.5, marginTop: "12px" }}>
              🔒 Powered by Razorpay · UPI · Cards · Net Banking · Wallets
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder = "", type = "text", textarea = false,
}: {
  label:      string
  value:      string
  onChange:   (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  type?:      string
  textarea?:  boolean
}) {
  const base: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "0.9rem",
    color: "#1A1A2E", backgroundColor: "#fafafa",
    border: "2px solid #1A1A2E", borderRadius: "12px",
    padding: "10px 14px", outline: "none",
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 700,
        fontSize: "0.78rem", opacity: 0.65,
      }}>
        {label}
      </label>
      {textarea
        ? <textarea value={value} onChange={onChange} placeholder={placeholder}
            rows={3} style={{ ...base, resize: "vertical" }} />
        : <input type={type} value={value} onChange={onChange}
            placeholder={placeholder} style={base} />
      }
    </div>
  )
}

// ─── Row component ────────────────────────────────────────────────────────────

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 600,
        fontSize: "0.9rem", opacity: 0.75,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 800,
        fontSize: "0.9rem", color: valueColor,
      }}>
        {value}
      </span>
    </div>
  )
}