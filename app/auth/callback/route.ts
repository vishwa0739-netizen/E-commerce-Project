import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=missing_code", requestUrl.origin)
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
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

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      console.error("[auth/callback] exchangeCodeForSession error:", error);
      return NextResponse.redirect(
        new URL("/auth/login?error=auth_failed", requestUrl.origin)
      );
    }

    const user = data.user;

    const { error: profileError } = await supabase.from("profiles").upsert(
  {
    id: user.id,
    email: user.email ?? null,
    full_name: (user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      null) as string | null,
    avatar_url: (user.user_metadata?.avatar_url ?? null) as string | null,
    is_admin: false,
    updated_at: new Date().toISOString(),
  } as never,
  {
    onConflict: "id",
    ignoreDuplicates: false,
  }
);

    if (profileError) {
      console.error("[auth/callback] profile upsert error:", profileError);
    }

    const redirectTo =
      requestUrl.searchParams.get("redirectTo") ?? "/account";
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
  } catch (err) {
    console.error("[auth/callback] unexpected error:", err);
    return NextResponse.redirect(
      new URL("/auth/login?error=server_error", requestUrl.origin)
    );
  }
}