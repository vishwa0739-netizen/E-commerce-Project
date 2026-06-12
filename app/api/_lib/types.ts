// ─── Shared Types for CraftNest Product API Routes ───────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  category: string
  images: string[]
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export interface ProductWithReviews extends Product {
  reviews: Review[]
}

export interface ProductCreatePayload {
  name: string
  slug: string
  price: number
  category: string
  description?: string
  compare_at_price?: number
  images?: string[]
  stock_quantity?: number
  is_featured?: boolean
}

export interface ProductUpdatePayload {
  name?: string
  slug?: string
  price?: number
  category?: string
  description?: string
  compare_at_price?: number
  images?: string[]
  stock_quantity?: number
  is_featured?: boolean
  is_active?: boolean
}

export type SortOption = "price_asc" | "price_desc" | "newest"