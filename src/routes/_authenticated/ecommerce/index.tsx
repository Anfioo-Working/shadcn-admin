import { createFileRoute } from '@tanstack/react-router'
import { EcommerceOverview } from '@/features/ecommerce-dashboard/pages/overview'

export const Route = createFileRoute('/_authenticated/ecommerce/')({
  component: EcommerceOverview,
})