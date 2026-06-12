// ─── POST /api/admin/products ─────────────────────────────────────────────────
//
// Creates a new product. Requires the caller to be:
//   1. Authenticated (valid Supabase session in cookies)
//   2. An admin (is_admin = true in the profiles table)
//
// Request body (JSON):
//   Required: name, slug, price, category
//   Optional: description, compare_at_price, images, stock_quantity, is_featured
//
// Status codes:
//   201 → product created successfully
//   400 → missing required fields or slug already exists
//   401 → no session
//   403 → authenticated but not an admin
//   500 → database error

import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, createAdminClient } from "../../_lib/supabase"
import type { ProductCreatePayload } from "../../_lib/types"

export async function POST(req: NextRequest) {
  // ── 1. Auth guard ───────────────────────────────────────────────────────
  // requireAdmin() throws a Response directly when auth fails, which Next.js
  // will surface as an HTTP error. Wrapping in try/catch catches both that
  // and any unexpected runtime errors below.
  try {
    await requireAdmin()
  } catch (authResponse) {
    // Re-throw Response objects (our 401/403) unchanged
    if (authResponse instanceof Response) return authResponse
    throw authResponse
  }

  try {
    // ── 2. Parse + validate body ──────────────────────────────────────────
    let body: ProductCreatePayload

    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    const { name, slug, price, category } = body

    // Required-field validation
    const missing: string[] = []
    if (!name?.trim())     missing.push("name")
    if (!slug?.trim())     missing.push("slug")
    if (price == null)     missing.push("price")
    if (!category?.trim()) missing.push("category")

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      )
    }

    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { error: "price must be a non-negative number" },
        { status: 400 }
      )
    }

    // Slugs must be URL-safe
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "slug must be lowercase letters, numbers, and hyphens only (e.g. 'soft-bear-toy')",
        },
        { status: 400 }
      )
    }

    // ── 3. Check slug uniqueness ───────────────────────────────────────────
    // We use the service-role client so RLS doesn't hide existing slugs
    const adminClient = createAdminClient()

    const { data: existing } = await adminClient
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()     // returns null (not error) when not found

    if (existing) {
      return NextResponse.json(
        { error: `A product with slug "${slug}" already exists` },
        { status: 400 }
      )
    }

    // ── 4. Insert ──────────────────────────────────────────────────────────
    const newProduct = {
      name:               name.trim(),
      slug:               slug.trim(),
      price,
      category:           category.trim(),
      description:        body.description        ?? null,
      compare_at_price:   body.compare_at_price   ?? null,
      images:             body.images             ?? [],
      stock_quantity:     body.stock_quantity      ?? 0,
      is_featured:        body.is_featured         ?? false,
      is_active:          true,   // new products are active by default
    }

    const { data: product, error } = await adminClient
      .from("products")
      .insert(newProduct)
      .select()
      .single()

    if (error) {
      console.error("[POST /api/admin/products] Insert error:", error)
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      )
    }

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error("[POST /api/admin/products] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}