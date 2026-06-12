'use server'
import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/lib/types/database'

export async function getCart() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')   // joins product details
    .eq('user_id', user.id)

  if (error) return []
  return data as CartItem[]
}

export async function addToCart(product_id: string, quantity = 1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  // upsert: inserts if not exists, updates quantity if already in cart
  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { user_id: user.id, product_id, quantity },
      { onConflict: 'user_id,product_id' }
    )

  if (error) throw new Error(error.message)
}

export async function updateCartQuantity(cart_item_id: string, quantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  if (quantity <= 0) {
    return removeFromCart(cart_item_id)
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cart_item_id)
    .eq('user_id', user.id)   // safety: can only update own cart

  if (error) throw new Error(error.message)
}

export async function removeFromCart(cart_item_id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cart_item_id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}

export async function clearCart() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}