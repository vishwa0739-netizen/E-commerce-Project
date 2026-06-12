// ─── PUT + DELETE /api/admin/products/[id] ────────────────────────────────────
//
// PUT    → update any product fields (partial update, PATCH semantics)
// DELETE → soft-delete: sets is_active = false instead of removing the row
//
// Both methods require the caller to be authenticated and is_admin = true.
//
// PUT request body (all fields optional):
//   name, slug, price, category, description, compare_at_price,
//   images, stock_quantity, is_featured, is_active
//
// Status codes:
//   200 → success
//   400 → validation error (e.g. bad slug format, no fields to update)
//   401 → no session
//   403 → not an admin
//   404 → product not found
//   500 → database error

import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, createAdminClient } from "../../../_lib/supabase"
import type { ProductUpdatePayload } from "../../../_lib/types"

interface RouteContext {
  params: { id: string }
}

// ─── PUT /api/admin/products/[id] ────────────────────────────────────────────

export async function PUT(req: NextRequest, { params }: RouteContext) {
  // ── Auth guard ───────────────────────────────────────────────────────────
  try {
    await requireAdmin()
  } catch (authResponse) {
    if (authResponse instanceof Response) return authResponse
    throw authResponse
  }

  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // ── Parse body ─────────────────────────────────────────────────────────
    let body: ProductUpdatePayload

    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // ── Validate optional fields that were provided ────────────────────────
    if (body.price !== undefined) {
      if (typeof body.price !== "number" || body.price < 0) {
        return NextResponse.json(
          { error: "price must be a non-negative number" },
          { status: 400 }
        )
      }
    }

    if (body.slug !== undefined) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) {
        return NextResponse.json(
          {
            error:
              "slug must be lowercase letters, numbers, and hyphens only",
          },
          { status: 400 }
        )
      }
    }

    // Build the update payload — only include keys the caller sent.
    // This prevents accidentally nulling out fields not in the request.
    const updates: Partial<ProductUpdatePayload & { updated_at: string }> = {}

    const allowedKeys: (keyof ProductUpdatePayload)[] = [
      "name",
      "slug",
      "price",
      "category",
      "description",
      "compare_at_price",
      "images",
      "stock_quantity",
      "is_featured",
      "is_active",
    ]

    for (const key of allowedKeys) {
      if (key in body) {
        // TypeScript needs the cast here because key is a union type
        ;(updates as Record<string, unknown>)[key] = body[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      )
    }

    // Always stamp updated_at so the frontend can show "last modified"
    updates.updated_at = new Date().toISOString()

    // ── Check the product exists ───────────────────────────────────────────
    const adminClient = createAdminClient()

    const { data: existing, error: findError } = await adminClient
      .from("products")
      .select("id")
      .eq("id", id)
      .maybeSingle()

    if (findError || !existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // ── Apply update ───────────────────────────────────────────────────────
    const { data: updated, error: updateError } = await adminClient
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error(
        `[PUT /api/admin/products/${id}] Update error:`,
        updateError
      )
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      )
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error("[PUT /api/admin/products/[id]] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/admin/products/[id] (soft delete) ───────────────────────────

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  // ── Auth guard ───────────────────────────────────────────────────────────
  try {
    await requireAdmin()
  } catch (authResponse) {
    if (authResponse instanceof Response) return authResponse
    throw authResponse
  }

  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    // ── Confirm product exists before attempting the update ────────────────
    const { data: existing, error: findError } = await adminClient
      .from("products")
      .select("id, is_active")
      .eq("id", id)
      .maybeSingle()

    if (findError || !existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    if (!existing.is_active) {
      // Already soft-deleted — treat as idempotent success
      return NextResponse.json(
        { message: "Product was already deactivated", id },
        { status: 200 }
      )
    }

    // ── Soft delete: flip is_active = false ────────────────────────────────
    // We intentionally do NOT remove the row so:
    //   • Order history referencing this product stays intact
    //   • The product can be reactivated later
    const { error: deleteError } = await adminClient
      .from("products")
      .update({
        is_active:   false,
        updated_at:  new Date().toISOString(),
      })
      .eq("id", id)

    if (deleteError) {
      console.error(
        `[DELETE /api/admin/products/${id}] Soft-delete error:`,
        deleteError
      )
      return NextResponse.json(
        { error: "Failed to deactivate product" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Product deactivated successfully", id },
      { status: 200 }
    )
  } catch (err) {
    console.error("[DELETE /api/admin/products/[id]] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}