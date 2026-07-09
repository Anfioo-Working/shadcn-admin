import { createFileRoute } from '@tanstack/react-router'
import { SalesTrendPage } from '@/features/ecommerce-dashboard/pages/sales-trend'

export const Route = createFileRoute('/_authenticated/ecommerce/sales/trend/')({
  component: SalesTrendPage,
})