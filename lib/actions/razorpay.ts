// lib/actions/razorpay.ts
// Server actions for Razorpay payment integration
//
// Setup:
//   1. No extra npm package needed — uses native fetch + crypto
//   2. Add to .env.local:
//        RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
//        RAZORPAY_KEY_SECRET=your_secret_here
//        NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

"use server"

import crypto from "crypto"

// ─── Types ────────────────────────────────────────────────────────────────────

export type RazorpayOrderResult = {
  orderId:  string
  amount:   number  // in paise (₹1 = 100 paise)
  currency: string
  keyId:    string
}

export type PaymentVerifyInput = {
  razorpay_order_id:   string
  razorpay_payment_id: string
  razorpay_signature:  string
  cartItems: Array<{ id: string; name: string; price: number; quantity: number }>
  totalAmount: number
}

// ─── Create Razorpay Order ────────────────────────────────────────────────────

export async function createRazorpayOrder(
  amountInRupees: number
): Promise<RazorpayOrderResult> {
  // FIX #1: Validate amount before hitting Razorpay API
  if (!amountInRupees || amountInRupees <= 0) {
    throw new Error("Invalid order amount. Amount must be greater than ₹0.")
  }

  const keyId     = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local"
    )
  }

  // Razorpay amounts are in paise (₹1 = 100 paise)
  const amountInPaise = Math.round(amountInRupees * 100)

  // FIX #2: Add Idempotency-Key header to prevent duplicate orders on network retry
  const idempotencyKey = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Idempotency-Key": idempotencyKey,
      // Basic auth: key_id:key_secret as base64
      Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
    },
    body: JSON.stringify({
      amount:   amountInPaise,
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
      // FIX #3: `payment_capture: 1` is deprecated — use `payment_capture: true`
      // For full control, omit and handle capture via webhook or dashboard setting
      payment_capture: true,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(
      `Razorpay order creation failed: ${
        (err as { error?: { description?: string } }).error?.description ?? response.statusText
      }`
    )
  }

  const order = await response.json() as {
    id: string
    amount: number
    currency: string
  }

  return {
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
    keyId,
  }
}

// ─── Verify Payment Signature ─────────────────────────────────────────────────
//
// IMPORTANT: Always verify on the server — never trust client-side payment data.
// Razorpay signs the response with your key_secret using HMAC-SHA256.

export async function verifyRazorpayPayment(
  input: PaymentVerifyInput
): Promise<{ success: boolean; message: string }> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.")
  }

  // FIX #4: Basic input validation before doing crypto work
  if (
    !input.razorpay_order_id ||
    !input.razorpay_payment_id ||
    !input.razorpay_signature
  ) {
    return { success: false, message: "Missing payment verification fields." }
  }

  // Step 1: Recreate the expected signature
  const body     = `${input.razorpay_order_id}|${input.razorpay_payment_id}`
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex")

  // FIX #5: Use timingSafeEqual instead of === to prevent timing attacks
  // An attacker measuring response time from === comparisons could brute-force
  // the signature byte-by-byte. timingSafeEqual always takes the same time.
  const expectedBuf = Buffer.from(expected, "hex")
  const receivedBuf = Buffer.from(input.razorpay_signature, "hex")

  const isValid =
    expectedBuf.length === receivedBuf.length &&
    crypto.timingSafeEqual(expectedBuf, receivedBuf)

  if (!isValid) {
    return {
      success: false,
      message: "Payment verification failed. Please contact support.",
    }
  }

  // Step 3: (Optional) Save order to Supabase
  // Uncomment and adapt once you have an 'orders' table in Supabase:
  //
  // const supabase = await createClient()
  // const { error } = await supabase.from("orders").insert({
  //   razorpay_order_id:   input.razorpay_order_id,
  //   razorpay_payment_id: input.razorpay_payment_id,
  //   amount:              input.totalAmount,
  //   items:               input.cartItems,
  //   status:              "paid",
  //   created_at:          new Date().toISOString(),
  // })
  // if (error) throw new Error(`Failed to save order: ${error.message}`)

  return { success: true, message: "Payment verified successfully!" }
}