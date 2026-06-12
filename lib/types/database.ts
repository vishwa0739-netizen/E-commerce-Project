export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock_qty: number
  category: string | null
  images: string[]
  tags: string[]
  is_featured: boolean
  is_active: boolean
  maker_name: string | null
  average_rating: number
  review_count: number
  created_at: string
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  user_id: string
  status: OrderStatus
  total_amount: number
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  shipping_address: ShippingAddress | null
  created_at: string
}

export type ShippingAddress = {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number        // computed column from DB
  products?: Product      // joined
}

export type CartItem = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  products?: Product      // joined via select('*, products(*)')
}

export type Review = {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  is_verified_purchase: boolean
  created_at: string
  profiles?: Pick<Profile, 'full_name' | 'avatar_url'>  // joined
}

export type Invoice = {
  id: string
  order_id: string
  invoice_number: string
  pdf_url: string | null
  issued_at: string
}