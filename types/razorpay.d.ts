// types/razorpay.d.ts
// Global type augmentation for the Razorpay checkout.js script loaded from CDN.
// FIX: Moved out of the page component where it doesn't belong.
// This file is auto-picked up by TypeScript — no import needed.

export {}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export type RazorpayInstance = {
  open(): void
  close(): void
  on(event: string, callback: () => void): void
}

export type RazorpayPaymentResponse = {
  razorpay_order_id:   string
  razorpay_payment_id: string
  razorpay_signature:  string
}

export type RazorpayOptions = {
  key:         string
  amount:      number
  currency:    string
  order_id:    string
  name:        string
  description: string
  image?:      string
  prefill: {
    name:     string
    email:    string
    contact?: string
  }
  notes?: Record<string, string>
  theme: {
    color: string
  }
  handler:  (response: RazorpayPaymentResponse) => void
  modal?: {
    ondismiss?:         () => void
    escape?:            boolean
    backdropclose?:     boolean
    animation?:         boolean
    confirm_close?:     boolean
  }
}