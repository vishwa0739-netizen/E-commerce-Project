import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types/database'

// All active products (for Shop page)
export async function getProducts(options?: {
  category?: string
  search?: string
  featured?: boolean
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*')
    // RLS already filters is_active=true for anon/authenticated
    .order('created_at', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.search) {
    // searches name OR description
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as Product[]
}

// Single product by slug (for Product Detail page)
export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()           // returns one row or null

  if (error) return null
  return data as Product
}

// All unique categories (for Shop filter tabs)
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .not('category', 'is', null)

  if (error) return []

  // Extract unique non-null category values
  const unique = [...new Set(data.map(p => p.category as string))]
  return unique
}