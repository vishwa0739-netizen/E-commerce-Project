'use server'
import { createClient } from '@/lib/supabase/server'
import type { Review } from '@/lib/types/database'

export async function getReviewsForProduct(product_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', product_id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data as Review[]
}

export async function addReview({
  product_id,
  rating,
  comment,
}: {
  product_id: string
  rating: number
  comment?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to review')

  const { error } = await supabase
    .from('reviews')
    .insert({ product_id, user_id: user.id, rating, comment })

  // average_rating + review_count update automatically via your DB trigger
  if (error) throw new Error(error.message)
}