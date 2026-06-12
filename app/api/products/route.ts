// ─── GET /api/products ────────────────────────────────────────────────────────
//
// Supported query params:
//   ?category=toys          → exact match on the category column
//   ?search=bear            → case-insensitive ILIKE on name + description
//   ?sort=price_asc         → price_asc | price_desc | newest (default: newest)
//   ?featured=true          → only products where is_featured = true
//   ?limit=12               → page size (default 12, max 100)
//   ?offset=0               → record offset for pagination (default 0)
//
// Response: { products: Product[], total: number, page: { limit, offset } }

import { NextRequest, NextResponse } from "next/server"
import { createSessionClient } from "../_lib/supabase"
import type { SortOption } from "../_lib/types"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl

    // ── Parse query params ──────────────────────────────────────────────────
    const category = searchParams.get("category") ?? undefined
    const search   = searchParams.get("search")   ?? undefined
    const featured = searchParams.get("featured")             // "true" | null
    const sort     = (searchParams.get("sort") ?? "newest") as SortOption
    const limit    = Math.min(parseInt(searchParams.get("limit")  ?? "12", 10), 100)
    const offset   =          parseInt(searchParams.get("offset") ?? "0",  10)

    // ── Build Supabase query ────────────────────────────────────────────────
    const supabase = await createSessionClient()

    // Start with a base query — always exclude soft-deleted products
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })  // count:"exact" gives us total rows
      .eq("is_active", true)

    // Optional filters
    if (category) {
      query = query.eq("category", category)
    }

    if (search) {
      // Search across both name and description with a single OR filter.
      // %term% matches anywhere in the string (case-insensitive).
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    // Sorting
    switch (sort) {
      case "price_asc":
        query = query.order("price", { ascending: true })
        break
      case "price_desc":
        query = query.order("price", { ascending: false })
        break
      case "newest":
      default:
        query = query.order("created_at", { ascending: false })
        break
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    // ── Execute ─────────────────────────────────────────────────────────────
    const { data: products, count, error } = await query

    if (error) {
      console.error("[GET /api/products] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      products: products ?? [],
      total: count ?? 0,
      page: { limit, offset },
    })
  } catch (err) {
    console.error("[GET /api/products] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}