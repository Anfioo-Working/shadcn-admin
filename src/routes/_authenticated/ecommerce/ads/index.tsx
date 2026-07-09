import { createFileRoute } from '@tanstack/react-router'
import { AdsPage } from '@/features/ecommerce-dashboard/pages/ads'

export const Route = createFileRoute('/_authenticated/ecommerce/ads/')({
  component: AdsPage,
})