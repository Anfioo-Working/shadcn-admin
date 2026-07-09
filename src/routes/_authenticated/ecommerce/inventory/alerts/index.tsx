import { createFileRoute } from '@tanstack/react-router'
import { InventoryAlertsPage } from '@/features/ecommerce-dashboard/pages/inventory-alerts'

export const Route = createFileRoute('/_authenticated/ecommerce/inventory/alerts/')({
  component: InventoryAlertsPage,
})