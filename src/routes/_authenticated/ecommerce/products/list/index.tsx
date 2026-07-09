import { createFileRoute } from '@tanstack/react-router'
import { ProductsListPage } from '@/features/ecommerce-dashboard/pages/products-list'

export const Route = createFileRoute('/_authenticated/ecommerce/products/list/')({
  component: ProductsListPage,
})