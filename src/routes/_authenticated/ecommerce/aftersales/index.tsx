import { createFileRoute } from '@tanstack/react-router'
import { AftersalesPage } from '@/features/ecommerce-dashboard/pages/aftersales'

export const Route = createFileRoute('/_authenticated/ecommerce/aftersales/')({
  component: AftersalesPage,
})