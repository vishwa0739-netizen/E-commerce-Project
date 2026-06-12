// ─── GET /api/products/[slug] ─────────────────────────────────────────────────
//
// Fetches a single active product by its URL slug.
// Includes the 5 most recent reviews joined with the reviewer's profile
// (full_name + avatar_url) for display on the product detail page.
//
// Returns 404 when no product matches the slug or it is soft-deleted.

import { NextRequest, NextResponse } from "next/server"
import { createSessionClient } from "../../_lib/supabase"
import type { ProductWithReviews } from "../../_lib/types"

interface RouteContext {
  params: { slug: string }
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      )
    }

    const supabase = await createSessionClient()

    // ── Fetch the product ───────────────────────────────────────────────────
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()             // returns null (not an array) when there's one row

    if (productError || !product) {
      // Supabase returns a PGRST116 code when .single() finds zero rows
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // ── Fetch 5 most recent reviews with reviewer profile ───────────────────
    //
    // The Supabase select string "profiles(full_name, avatar_url)" tells
    // PostgREST to follow the foreign key from reviews.user_id → profiles.id
    // and embed those columns directly in each review object.
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select(`
        id,
        product_id,
        user_id,
        rating,
        comment,
        created_at,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq("product_id", product.id)
      .order("created_at", { ascending: false })
      .limit(5)

    if (reviewsError) {
      // Reviews are non-critical — log the error but still return the product
      console.warn(
        `[GET /api/products/${slug}] Could not fetch reviews:`,
        reviewsError
      )
    }

    const response: ProductWithReviews = {
      ...product,
      reviews: reviews ?? [],
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error(`[GET /api/products/[slug]] Unexpected error:`, err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}