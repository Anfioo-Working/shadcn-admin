import { createFileRoute } from '@tanstack/react-router'
import { InventoryPage } from '@/features/ecommerce-dashboard/pages/inventory'

export const Route = createFileRoute('/_authenticated/ecommerce/inventory/')({
  component: InventoryPage,
})