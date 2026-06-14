import type { Metadata } from "next"
import "./globals.css"
import { WishlistProvider } from "@/context/WishlistContext"
import { CartProvider }     from "@/context/CartContext"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "CraftNest — Handmade Toys Made with Love",
  description:
    "Every toy is crafted by hand, one stitch at a time — designed to spark imagination and become a lifelong treasure.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        {/* FIX #10 #14 — CartProvider wraps everything so any page can read/write the cart */}
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}