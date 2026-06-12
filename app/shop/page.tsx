import { getProducts, getCategories } from '@/lib/actions/products'
import ShopClient from './ShopClient'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const [products, categories] = await Promise.all([
    getProducts({
      category: searchParams.category,
      search: searchParams.search,
    }),
    getCategories(),
  ])

  return <ShopClient products={products} categories={categories} />
}