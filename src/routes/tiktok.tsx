import { createFileRoute } from '@tanstack/react-router'
import { TikTokPage } from '@/features/tiktok'

export const Route = createFileRoute('/tiktok')({
  component: TikTokPage,
})
