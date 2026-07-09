import { createFileRoute } from '@tanstack/react-router'
import { SettingsStoresPage } from '@/features/ecommerce-dashboard/pages/settings/settings-stores'

export const Route = createFileRoute('/_authenticated/ecommerce/settings/stores/')({
  component: SettingsStoresPage,
})