import { createFileRoute } from '@tanstack/react-router'
import { SettingsChannelsPage } from '@/features/ecommerce-dashboard/pages/settings/settings-channels'

export const Route = createFileRoute('/_authenticated/ecommerce/settings/channels/')({
  component: SettingsChannelsPage,
})