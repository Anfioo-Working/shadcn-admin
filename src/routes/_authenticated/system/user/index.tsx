import { createFileRoute } from '@tanstack/react-router'
import UserPage from '@/features/system/user'

export const Route = createFileRoute('/_authenticated/system/user/')({
  component: UserPage,
})
