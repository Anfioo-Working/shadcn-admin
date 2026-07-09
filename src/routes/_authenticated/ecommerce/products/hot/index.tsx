import { createFileRoute } from '@tanstack/react-router'
import { ProductsHotPage } from '@/features/ecommerce-dashboard/pages/products-hot'

export const Route = createFileRoute('/_authenticated/ecommerce/products/hot/')({
  component: ProductsHotPage,
})