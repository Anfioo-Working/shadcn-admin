import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { KanbanColumn } from './components/kanban-column'
import { columns, kanbanTasks } from './data/kanban-data'
import { Plus, Filter, LayoutGrid, List } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function KanbanBoard() {
  const getTasksByStatus = (status: string) => {
    return kanbanTasks.filter((task) => task.status === status)
  }

  const totalTasks = kanbanTasks.length
  const completedTasks = kanbanTasks.filter((t) => t.status === 'done').length

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Kanban Board</h2>
            <p className='text-muted-foreground'>
              Manage and visualize your tasks in a beautiful kanban view.
              {completedTasks} of {totalTasks} tasks completed.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Tabs defaultValue='board'>
              <TabsList>
                <TabsTrigger value='board' className='gap-2'>
                  <LayoutGrid className='h-4 w-4' />
                  Board
                </TabsTrigger>
                <TabsTrigger value='list' className='gap-2'>
                  <List className='h-4 w-4' />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant='outline' className='gap-2'>
              <Filter className='h-4 w-4' />
              Filter
            </Button>
            <Button className='gap-2'>
              <Plus className='h-4 w-4' />
              New Task
            </Button>
          </div>
        </div>

        <div className='flex flex-1 gap-4 overflow-x-auto pb-4'>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={getTasksByStatus(column.id)}
            />
          ))}
        </div>
      </Main>
    </>
  )
}
