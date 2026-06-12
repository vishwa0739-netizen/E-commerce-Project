// ─── PUT + DELETE /api/admin/products/[id] ────────────────────────────────────

import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, createAdminClient } from "../../../_lib/supabase"
import type { ProductUpdatePayload } from "../../../_lib/types"

// ─── PUT /api/admin/products/[id] ────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
  } catch (authResponse) {
    if (authResponse instanceof Response) return authResponse
    throw authResponse
  }

  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    let body: ProductUpdatePayload

    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

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
          { error: "slug must be lowercase letters, numbers, and hyphens only" },
          { status: 400 }
        )
      }
    }

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
        ;(updates as Record<string, unknown>)[key] = body[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      )
    }

    updates.updated_at = new Date().toISOString()

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

    const { data: updated, error: updateError } = await adminClient
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error(`[PUT /api/admin/products/${id}] Update error:`, updateError)
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
  } catch (authResponse) {
    if (authResponse instanceof Response) return authResponse
    throw authResponse
  }

  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

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
      return NextResponse.json(
        { message: "Product was already deactivated", id },
        { status: 200 }
      )
    }

    const { error: deleteError } = await adminClient
      .from("products")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (deleteError) {
      console.error(`[DELETE /api/admin/products/${id}] Soft-delete error:`, deleteError)
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