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

function FileTextIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  )
}

function EyeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function PackageIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  )
}

type OrderItem = { id: string; name: string; quantity: number; price: number; image: string }
type Order = {
  id: string; orderNumber: string; date: string
  status: "Delivered" | "Shipped" | "Processing" | "Pending"
  items: OrderItem[]; total: number
}

const STATUS_COLORS: Record<string, string> = {
  Delivered:  "#4CAF50",
  Shipped:    "#A8D5E3",
  Processing: "#FFC107",
  Pending:    "#9E9E9E",
}
const STATUS_TEXT: Record<string, string> = {
  Shipped: DARK, Processing: DARK,
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: "1", orderNumber: "CN-2024-0042", date: "2024-11-15", status: "Delivered", total: 4297,
    items: [
      { id: "i1", name: "Wooden Train Set",      quantity: 1, price: 2499, image: "https://placehold.co/60x60/A8D5E3/1A1A2E?text=🚂" },
      { id: "i2", name: "Felt Pom-Pom Animals",  quantity: 2, price: 899,  image: "https://placehold.co/60x60/FF78AC/ffffff?text=🐾" },
    ],
  },
  {
    id: "2", orderNumber: "CN-2024-0041", date: "2024-11-10", status: "Shipped", total: 1599,
    items: [
      { id: "i3", name: "Hand-Knitted Doll", quantity: 1, price: 1599, image: "https://placehold.co/60x60/F2F0EA/1A1A2E?text=🧸" },
    ],
  },
  {
    id: "3", orderNumber: "CN-2024-0040", date: "2024-11-05", status: "Processing", total: 3346,
    items: [
      { id: "i4", name: "Ceramic Puzzle Set",   quantity: 1, price: 1299, image: "https://placehold.co/60x60/6BCB77/ffffff?text=🧩" },
      { id: "i5", name: "Macramé Wall Hanging", quantity: 1, price: 749,  image: "https://placehold.co/60x60/FF78AC/ffffff?text=🎨" },
      { id: "i6", name: "Beaded Bracelet",      quantity: 3, price: 299,  image: "https://placehold.co/60x60/A8D5E3/1A1A2E?text=💎" },
    ],
  },
]

export default function OrdersPage() {
  const [orders] = useState<Order[]>(SAMPLE_ORDERS)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

  if (orders.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ backgroundColor: CREAM, color: DARK, fontFamily: font }}>
        <BackButton href="/" label="Back to Home" />
        <div style={{ color: "#ccc", marginTop: "32px" }}><PackageIcon size={64} /></div>
        <h2 style={{ fontFamily: heading, fontSize: "2rem", margin: "16px 0 8px" }}>No orders yet</h2>
        <p style={{ opacity: 0.7, marginBottom: "24px" }}>Start your handcraft toy collection today!</p>
        <Link href="/shop" style={{
          backgroundColor: PINK, color: "#fff", border: `2.5px solid ${DARK}`,
          borderRadius: "50px", padding: "12px 28px", fontFamily: font,
          fontWeight: 800, fontSize: "1rem", textDecoration: "none",
          boxShadow: `5px 5px 0 ${DARK}`, display: "inline-block",
        }}>
          Shop the Collection →
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: DARK, fontFamily: font }}>

      {/* ← Back button */}
      <BackButton href="/" label="Back to Home" />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: heading, fontSize: "clamp(2rem,5vw,3rem)", marginBottom: "6px" }}>
            My Orders
          </h1>
          <p style={{ opacity: 0.7, fontSize: "0.95rem" }}>
            Track and manage your handcraft toy orders.
          </p>
        </div>

        {/* Orders list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6"
              style={{ border: `2.5px solid ${DARK}`, boxShadow: `5px 5px 0 ${DARK}` }}>

              {/* Top row */}
              <div className="flex justify-between items-start"
                style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: `2px solid ${DARK}`, opacity: 1 }}>
                <div>
                  <h2 style={{ fontFamily: heading, fontSize: "1.3rem" }}>
                    Order #{order.orderNumber}
                  </h2>
                  <p style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "4px" }}>
                    {formatDate(order.date)}
                  </p>
                </div>
                <span style={{
                  backgroundColor: STATUS_COLORS[order.status],
                  color: STATUS_TEXT[order.status] ?? "#fff",
                  border: `2px solid ${DARK}`, borderRadius: "50px",
                  padding: "4px 14px", fontFamily: font,
                  fontWeight: 800, fontSize: "0.85rem",
                }}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div style={{ marginBottom: "20px", paddingBottom: "20px",
                borderBottom: `2px solid ${DARK}`, display: "flex", flexDirection: "column", gap: "16px" }}>
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name}
                      style={{ width: "60px", height: "60px", borderRadius: "12px",
                        objectFit: "cover", border: `2px solid ${DARK}`, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.name}</p>
                      <p style={{ fontSize: "0.82rem", opacity: 0.65 }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>₹{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              <div className="flex justify-between items-center flex-wrap gap-4">
                <p style={{ fontFamily: heading, fontSize: "1.1rem" }}>
                  Total: <span style={{ color: PINK }}>₹{order.total.toFixed(2)}</span>
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "8px 16px", border: `2.5px solid ${TEAL}`,
                      borderRadius: "12px", backgroundColor: "white",
                      color: DARK, fontFamily: font, fontWeight: 700,
                      fontSize: "0.85rem", cursor: "pointer",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = TEAL }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white" }}
                  >
                    <FileTextIcon size={16} />
                    <span>Invoice</span>
                  </button>
                  <button
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "8px 16px", border: `2.5px solid ${DARK}`,
                      borderRadius: "12px", backgroundColor: PINK,
                      color: "#fff", fontFamily: font, fontWeight: 700,
                      fontSize: "0.85rem", cursor: "pointer",
                      boxShadow: `3px 3px 0 ${DARK}`,
                    }}
                  >
                    <EyeIcon size={16} />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}