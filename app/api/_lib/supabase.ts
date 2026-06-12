// ─── Supabase Client Helpers ──────────────────────────────────────────────────
//
// Two separate clients are used throughout the API:
//
//  1. createRouteHandlerClient  → reads the user's session from cookies.
//     Use this whenever you need to know *who* is making the request.
//
//  2. createClient (service-role) → bypasses Row Level Security entirely.
//     Use this only for admin writes where RLS would otherwise block the op.

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

/** Client that reads the caller's session from the request cookies. */
export async function createSessionClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )
}

/**
 * Service-role client that bypasses RLS.
 * Only import and call this inside admin-protected routes after you have
 * already confirmed the caller is an admin.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars"
    )
  }

  return createClient(url, key, {
    auth: {
      // Disable auto session refresh — this client is server-only and
      // does not persist or use browser cookies.
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Confirm the calling user exists and has is_admin = true in the profiles table.
 * Returns { userId } on success, or throws a Response with 401/403.
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const supabase = await createSessionClient()

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized: no active session" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single()

  if (profileError || !profile) {
    throw new Response(
      JSON.stringify({ error: "Forbidden: profile not found" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }

  if (!profile.is_admin) {
    throw new Response(
      JSON.stringify({ error: "Forbidden: admin access required" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }

  return { userId: session.user.id }
}