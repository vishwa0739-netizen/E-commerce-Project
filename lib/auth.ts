import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from "@/types/supabase";

// ─── Create Supabase client for server components / route handlers ─────────────

export async function createClient() {
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

// ─── requireAuth ──────────────────────────────────────────────────────────────
// Throws if the user is not authenticated.
// Use inside route handlers / server actions.

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

// ─── authErrorResponse ────────────────────────────────────────────────────────
// Converts errors thrown by requireAuth into proper NextResponse objects.

export function authErrorResponse(err: unknown): NextResponse {
  if (err instanceof Error && err.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "You must be logged in to perform this action." },
      { status: 401 }
    );
  }

  console.error("[authErrorResponse] Unexpected error:", err);
  return NextResponse.json(
    { error: "An unexpected error occurred." },
    { status: 500 }
  );
}