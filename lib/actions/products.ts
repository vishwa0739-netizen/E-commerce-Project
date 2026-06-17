import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types/database'

// ─────────────────────────────────────────────────────────────────────────────
// FIX #07 — Shop page 2-3s lag fix
//
// Strategy:
//   1. Next.js 14 App Router caches `fetch()` calls by default, but Supabase
//      uses its own HTTP client, so we need to use unstable_cache or revalidate.
//   2. We add { cache: 'force-cache' } style via Next.js `unstable_cache` to
//      cache the DB result at the server level for 60 seconds.
//   3. Products that don't change often (categories, featured) get longer TTL.
//   4. The shop page uses Promise.all() already — this makes each call faster.
//
// Result: first load fetches from DB, subsequent loads within 60s use the
// in-memory Next.js data cache → eliminates the lag.
// ─────────────────────────────────────────────────────────────────────────────

import { unstable_cache } from 'next/cache'

// ── Internal fetch helpers (not exported) ────────────────────────────────────

async function _getProducts(options?: {
  category?: string
  search?: string
  featured?: boolean
}): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }
  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as Product[]
}

async function _getCategories(): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true)
    .not('category', 'is', null)

  if (error) return []
  const unique = [...new Set(data.map((p) => p.category as string))]
  return unique
}

async function _getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as Product
}

// ── Exported cached wrappers ─────────────────────────────────────────────────
//
// FIX #07 — unstable_cache wraps each DB call with Next.js server-side caching.
//   • revalidate: 60  → cached for 60 seconds (good balance for a shop)
//   • tags allow on-demand revalidation when products are updated in Supabase
//     via a webhook calling /api/revalidate (see below)
//
// For search queries we skip caching (dynamic) so results are always fresh.

export async function getProducts(options?: {
  category?: string
  search?: string
  featured?: boolean
}): Promise<Product[]> {
  // Don't cache search results — they should be real-time
  if (options?.search) {
    return _getProducts(options)
  }

  // Build a stable cache key from the options object
  const cacheKey = `products-${options?.category ?? 'all'}-${options?.featured ? 'featured' : 'all'}`

  const cached = unstable_cache(
    () => _getProducts(options),
    [cacheKey],
    {
      revalidate: 60,           // re-fetch from DB at most once per 60 seconds
      tags: ['products'],       // invalidated by POST /api/revalidate?tag=products
    }
  )

  return cached()
}

export async function getCategories(): Promise<string[]> {
  const cached = unstable_cache(
    _getCategories,
    ['categories'],
    {
      revalidate: 300,          // categories change rarely — cache for 5 minutes
      tags: ['products', 'categories'],
    }
  )

  return cached()
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cached = unstable_cache(
    () => _getProductBySlug(slug),
    [`product-${slug}`],
    {
      revalidate: 120,
      tags: ['products', `product-${slug}`],
    }
  )

  return cached()
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONAL: On-demand revalidation route
//
// Create this file at app/api/revalidate/route.ts to allow Supabase webhooks
// (or your CMS) to bust the cache when a product is created/updated/deleted:
//
// import { revalidateTag } from 'next/cache'
// import { NextRequest, NextResponse } from 'next/server'
//
// export async function POST(req: NextRequest) {
//   const secret = req.nextUrl.searchParams.get('secret')
//   if (secret !== process.env.REVALIDATE_SECRET) {
//     return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
//   }
//   const tag = req.nextUrl.searchParams.get('tag') ?? 'products'
//   revalidateTag(tag)
//   return NextResponse.json({ revalidated: true, tag })
// }
// ─────────────────────────────────────────────────────────────────────────────