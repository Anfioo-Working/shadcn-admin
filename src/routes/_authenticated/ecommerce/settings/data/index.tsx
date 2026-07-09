import { createFileRoute } from '@tanstack/react-router'
import { SettingsDataPage } from '@/features/ecommerce-dashboard/pages/settings/settings-data'

export const Route = createFileRoute('/_authenticated/ecommerce/settings/data/')({
  component: SettingsDataPage,
})