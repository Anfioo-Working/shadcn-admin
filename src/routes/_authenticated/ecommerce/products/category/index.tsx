import { createFileRoute } from '@tanstack/react-router'
import { ProductsCategoryPage } from '@/features/ecommerce-dashboard/pages/products-category'

export const Route = createFileRoute('/_authenticated/ecommerce/products/category/')({
  component: ProductsCategoryPage,
})