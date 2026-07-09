import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { KanbanStatus, KanbanTask } from '../data/kanban-data'
import { KanbanCard } from './kanban-card'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: KanbanStatus
  title: string
  color: string
  tasks: KanbanTask[]
}

export function KanbanColumn({ id: _id, title, color, tasks }: KanbanColumnProps) {
  return (
    <div className='flex h-full w-full min-w-[300px] flex-col rounded-xl bg-muted/40'>
      <div className='flex items-center justify-between p-3 pb-2'>
        <div className='flex items-center gap-2'>
          <div className={cn('h-2.5 w-2.5 rounded-full', color)} />
          <h3 className='font-medium text-foreground'>{title}</h3>
          <span className='rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
            {tasks.length}
          </span>
        </div>
        <Button variant='ghost' size='icon' className='h-7 w-7'>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex flex-1 flex-col gap-3 overflow-y-auto p-3 pt-0'>
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}

        <Button
          variant='ghost'
          className='flex w-full items-center justify-center gap-2 border border-dashed text-muted-foreground hover:bg-background'
        >
          <Plus className='h-4 w-4' />
          Add Task
        </Button>
      </div>
    </div>
  )
}
