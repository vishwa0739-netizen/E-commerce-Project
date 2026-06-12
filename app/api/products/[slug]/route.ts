// ─── GET /api/products/[slug] ─────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server"
import { createSessionClient } from "../../_lib/supabase"
import type { ProductWithReviews } from "../../_lib/types"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      )
    }

    const supabase = await createSessionClient()

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

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