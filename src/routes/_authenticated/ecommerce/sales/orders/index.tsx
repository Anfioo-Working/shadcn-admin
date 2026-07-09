import { createFileRoute } from '@tanstack/react-router'
import { SalesOrdersPage } from '@/features/ecommerce-dashboard/pages/sales-orders'

export const Route = createFileRoute('/_authenticated/ecommerce/sales/orders/')({
  component: SalesOrdersPage,
})