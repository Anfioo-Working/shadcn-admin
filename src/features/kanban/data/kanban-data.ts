import { faker } from '@faker-js/faker'

faker.seed(67890)

export type KanbanStatus = 'todo' | 'in-progress' | 'review' | 'done'

export type KanbanPriority = 'low' | 'medium' | 'high'

export type KanbanLabel = 'bug' | 'feature' | 'enhancement' | 'documentation'

export interface KanbanTask {
  id: string
  title: string
  description: string
  status: KanbanStatus
  priority: KanbanPriority
  label: KanbanLabel
  assignee: string
  assigneeAvatar: string
  dueDate: Date
  comments: number
  attachments: number
}

export const columns: { id: KanbanStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'In Review', color: 'bg-amber-500' },
  { id: 'done', title: 'Done', color: 'bg-emerald-500' },
]

const statuses: KanbanStatus[] = ['todo', 'in-progress', 'review', 'done']
const labels: KanbanLabel[] = ['bug', 'feature', 'enhancement', 'documentation']
const priorities: KanbanPriority[] = ['low', 'medium', 'high']

export const kanbanTasks: KanbanTask[] = Array.from({ length: 24 }, () => ({
  id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
  title: faker.lorem.sentence({ min: 4, max: 10 }),
  description: faker.lorem.paragraph({ min: 1, max: 2 }),
  status: faker.helpers.arrayElement(statuses),
  label: faker.helpers.arrayElement(labels),
  priority: faker.helpers.arrayElement(priorities),
  assignee: faker.person.fullName(),
  assigneeAvatar: faker.image.avatar(),
  dueDate: faker.date.soon({ days: 30 }),
  comments: faker.number.int({ min: 0, max: 15 }),
  attachments: faker.number.int({ min: 0, max: 5 }),
}))

export function getTasksByStatus(status: KanbanStatus): KanbanTask[] {
  return kanbanTasks.filter((task) => task.status === status)
}
