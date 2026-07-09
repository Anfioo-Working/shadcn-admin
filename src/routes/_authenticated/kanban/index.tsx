import { createFileRoute } from '@tanstack/react-router'
import { KanbanBoard } from '@/features/kanban'

export const Route = createFileRoute('/_authenticated/kanban/')({
  component: KanbanBoard,
})
