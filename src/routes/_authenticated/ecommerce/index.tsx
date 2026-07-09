import { createFileRoute } from '@tanstack/react-router'
import { EcommerceDashboard } from '@/features/ecommerce-dashboard'

export const Route = createFileRoute('/_authenticated/ecommerce/')({
  component: EcommerceDashboard,
})
