'use server'
import { createClient } from '@/lib/supabase/server'
import type { Order, OrderItem, ShippingAddress } from '@/lib/types/database'

// Fetch all orders for the logged-in user
export async function getMyOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products ( name, images, slug )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

// Fetch a single order with its invoice (for Order Detail / Invoice page)
export async function getOrderWithInvoice(order_id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*, products(*)),
      invoices (invoice_number, pdf_url, issued_at)
    `)
    .eq('id', order_id)
    .eq('user_id', user.id)   // RLS double-check
    .single()

  if (error) return null
  return data
}

// Place a new order (called after Stripe payment succeeds)
export async function placeOrder({
  cartItems,
  shippingAddress,
  stripeSessionId,
}: {
  cartItems: Array<{ product_id: string; quantity: number; unit_price: number }>
  shippingAddress: ShippingAddress
  stripeSessionId: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const total_amount = cartItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity, 0
  )

  // 1. Insert the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'paid',
      total_amount,
      stripe_session_id: stripeSessionId,
      shipping_address: shippingAddress,
    })
    .select()
    .single()

  if (orderError || !order) throw new Error(orderError?.message)

  // 2. Insert all order items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))
    )

  if (itemsError) throw new Error(itemsError.message)

  // 3. Clear the cart
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  // Invoice is auto-created by your DB trigger (trg_create_invoice) — no code needed here!
  return order
}