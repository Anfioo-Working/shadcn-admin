import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  MessageSquare,
  Paperclip,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import type { KanbanTask } from '../data/kanban-data'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  task: KanbanTask
}

const labelVariants: Record<string, string> = {
  bug: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900',
  feature: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900',
  enhancement: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900',
  documentation: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900',
}

const priorityVariants: Record<string, string> = {
  low: 'text-slate-500',
  medium: 'text-amber-500',
  high: 'text-red-500',
}

export function KanbanCard({ task }: KanbanCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <Card className='cursor-grab border bg-card shadow-sm transition-all hover:shadow-md active:cursor-grabbing'>
      <CardContent className='p-4'>
        <div className='mb-3 flex items-start justify-between gap-2'>
          <Badge
            variant='outline'
            className={cn(
              'font-medium capitalize',
              labelVariants[task.label]
            )}
          >
            {task.label}
          </Badge>
          <AlertCircle
            className={cn(
              'h-4 w-4 shrink-0',
              priorityVariants[task.priority]
            )}
          />
        </div>

        <h4 className='mb-2 font-medium leading-snug text-foreground'>
          {task.title}
        </h4>

        <p className='mb-4 line-clamp-2 text-sm text-muted-foreground'>
          {task.description}
        </p>

        <div className='mb-3 flex items-center gap-4 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <MessageSquare className='h-3.5 w-3.5' />
            <span>{task.comments}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Paperclip className='h-3.5 w-3.5' />
            <span>{task.attachments}</span>
          </div>
          <div
            className={cn(
              'flex items-center gap-1',
              isOverdue && 'text-red-500'
            )}
          >
            <Calendar className='h-3.5 w-3.5' />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-6 w-6'>
              <AvatarImage src={task.assigneeAvatar} alt={task.assignee} />
              <AvatarFallback>
                {task.assignee.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className='text-xs text-muted-foreground'>
              {task.assignee}
            </span>
          </div>
          <span className='text-xs font-mono text-muted-foreground'>
            {task.id}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
