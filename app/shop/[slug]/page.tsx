// app/product/[slug]/page.tsx
// This is a SERVER component — it fetches all data before rendering.
// No "use client" here; all interactivity lives in ProductClient.tsx.

import { notFound } from "next/navigation"
import { getProductBySlug, getProducts } from "@/lib/actions/products"
import { getReviewsForProduct } from "@/lib/actions/reviews"
import ProductClient from "./ProductClient"

type Props = {
  params: { slug: string }
}

export default async function ProductPage({ params }: Props) {
  // 1. Fetch the main product by its URL slug (e.g. /product/crochet-bunny-pal)
  const product = await getProductBySlug(params.slug)

  // 2. If no product found (wrong slug / inactive product), show 404
  if (!product) notFound()

  // 3. Fetch reviews and related products in parallel (faster than sequential)
  const [reviews, allProducts] = await Promise.all([
    getReviewsForProduct(product.id),
    getProducts({ category: product.category ?? undefined }),
  ])

  // 4. Filter out the current product from related products, show max 3
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  // 5. Pass everything to the Client Component as props
  return (
    <ProductClient
      product={product}
      reviews={reviews}
      relatedProducts={relatedProducts}
    />
  )
}

// Optional: pre-generate static pages at build time for SEO
// Uncomment this once you have real products in Supabase
//
// export async function generateStaticParams() {
//   const products = await getProducts()
//   return products.map((p) => ({ slug: p.slug }))
// }