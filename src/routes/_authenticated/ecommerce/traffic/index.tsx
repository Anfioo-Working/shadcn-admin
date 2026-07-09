import { createFileRoute } from '@tanstack/react-router'
import { TrafficPage } from '@/features/ecommerce-dashboard/pages/traffic'

export const Route = createFileRoute('/_authenticated/ecommerce/traffic/')({
  component: TrafficPage,
})