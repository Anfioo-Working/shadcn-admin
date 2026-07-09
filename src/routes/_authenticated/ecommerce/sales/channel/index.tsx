import { createFileRoute } from '@tanstack/react-router'
import { SalesChannelPage } from '@/features/ecommerce-dashboard/pages/sales-channel'

export const Route = createFileRoute('/_authenticated/ecommerce/sales/channel/')({
  component: SalesChannelPage,
})