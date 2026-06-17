import type { Metadata } from "next"
import "./globals.css"
import { WishlistProvider } from "@/context/WishlistContext"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "CraftNest — Handmade Toys Made with Love",
  description: "Every toy is crafted by hand, one stitch at a time — designed to spark imagination and become a lifelong treasure.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </body>
    </html>
  )
}