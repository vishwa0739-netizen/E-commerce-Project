import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAuth, authErrorResponse } from "@/lib/auth";
import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewPayload {
  product_id: string;
  rating: number;
  comment: string;
  encrypted_comment?: string;
  encryption_iv?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validatePayload(
  body: unknown
): { valid: true; data: ReviewPayload } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object." };
  }

  const b = body as Record<string, unknown>;

  if (!b.product_id || typeof b.product_id !== "string") {
    return { valid: false, error: "product_id is required and must be a string." };
  }

  const rating = Number(b.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { valid: false, error: "rating must be an integer between 1 and 5." };
  }

  if (typeof b.comment !== "string" || b.comment.trim().length === 0) {
    return { valid: false, error: "comment is required and cannot be empty." };
  }

  if (b.comment.length > 500) {
    return { valid: false, error: "comment cannot exceed 500 characters." };
  }

  return {
    valid: true,
    data: {
      product_id: b.product_id,
      rating,
      comment: b.comment.trim(),
      encrypted_comment:
        typeof b.encrypted_comment === "string" ? b.encrypted_comment : undefined,
      encryption_iv:
        typeof b.encryption_iv === "string" ? b.encryption_iv : undefined,
    },
  };
}

// ─── Supabase client helper ───────────────────────────────────────────────────

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// ─── POST /api/reviews ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── 1. Authentication ──────────────────────────────────────────────────────
  let user: Awaited<ReturnType<typeof requireAuth>>;
  try {
    user = await requireAuth();
  } catch (err) {
    return authErrorResponse(err);
  }

  // ── 2. Parse and validate body ─────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const validation = validatePayload(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { product_id, rating, comment, encrypted_comment, encryption_iv } =
    validation.data;

  const supabase = await getSupabaseClient();

  // ── 3. Rate limit — 1 review per user per product ─────────────────────────
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existingReview) {
    return NextResponse.json(
      { error: "You have already submitted a review for this product." },
      { status: 409 }
    );
  }

  // ── 4. Verified-purchase check ─────────────────────────────────────────────
  const { data: verifiedOrder } = await supabase
    .from("order_items")
    .select(`
      id,
      orders!inner (
        id,
        user_id,
        status
      )
    `)
    .eq("product_id", product_id)
    .eq("orders.user_id", user.id)
    .eq("orders.status", "delivered")
    .limit(1)
    .maybeSingle();

  if (!verifiedOrder) {
    return NextResponse.json(
      {
        error:
          "You can only review products from a delivered order. We could not verify your purchase.",
      },
      { status: 403 }
    );
  }

  // ── 5. Insert review ───────────────────────────────────────────────────────
  const { data: newReview, error: insertError } = await supabase
    .from("reviews")
    .insert({
      user_id: user.id,
      product_id,
      rating,
      comment: encrypted_comment ?? comment,
      encrypted: encrypted_comment ? true : null,
      encryption_iv: encrypted_comment ? (encryption_iv ?? null) : null,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError || !newReview) {
    console.error("[POST /api/reviews] insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to save your review. Please try again." },
      { status: 500 }
    );
  }

  // ── 6. Recompute product rating aggregates ─────────────────────────────────
  const { data: allRatings, error: ratingsError } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", product_id);

  if (!ratingsError && allRatings && allRatings.length > 0) {
    const review_count = allRatings.length;
    const average_rating =
      allRatings.reduce(
        (sum: number, r: { rating: number }) => sum + r.rating, 0
      ) / review_count;

    await supabase
      .from("products")
      .update({
        average_rating: Math.round(average_rating * 10) / 10,
        review_count,
      })
      .eq("id", product_id);
  }

  return NextResponse.json(
    { message: "Review submitted successfully.", review: newReview },
    { status: 201 }
  );
}