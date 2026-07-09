'use client'

import * as React from 'react'
import { SearchIcon, RefreshCcwIcon, CalendarDaysIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface RoleSearchFormProps {
  onSearch: (params: RoleSearchParams) => void
  onReset: () => void
  defaultValues?: RoleSearchParams
}

export interface RoleSearchParams {
  roleName?: string
  roleKey?: string
  status?: string
  beginTime?: string
  endTime?: string
}

export function RoleSearchForm({
  onSearch,
  onReset,
  defaultValues,
}: RoleSearchFormProps) {
  const [roleName, setRoleName] = React.useState(defaultValues?.roleName || '')
  const [roleKey, setRoleKey] = React.useState(defaultValues?.roleKey || '')
  const [status, setStatus] = React.useState(defaultValues?.status || '')
  const [beginTime, setBeginTime] = React.useState<Date | undefined>(
    defaultValues?.beginTime ? new Date(defaultValues.beginTime) : undefined
  )
  const [endTime, setEndTime] = React.useState<Date | undefined>(
    defaultValues?.endTime ? new Date(defaultValues.endTime) : undefined
  )

  React.useEffect(() => {
    void (async () => {
      if (defaultValues) {
        setRoleName(defaultValues.roleName || '')
        setRoleKey(defaultValues.roleKey || '')
        setStatus(defaultValues.status || '')
        setBeginTime(
          defaultValues.beginTime
            ? new Date(defaultValues.beginTime)
            : undefined
        )
        setEndTime(
          defaultValues.endTime ? new Date(defaultValues.endTime) : undefined
        )
      }
    })()
  }, [defaultValues])

  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const handleSearch = () => {
    onSearch({
      roleName: roleName || undefined,
      roleKey: roleKey || undefined,
      status: status || undefined,
      beginTime: beginTime ? formatDate(beginTime) : undefined,
      endTime: endTime ? formatDate(endTime) : undefined,
    })
  }

  const handleReset = () => {
    setRoleName('')
    setRoleKey('')
    setStatus('')
    setBeginTime(undefined)
    setEndTime(undefined)
    onReset()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card className='mb-4'>
      <CardContent className='p-4'>
        <div className='flex flex-wrap items-end gap-4'>
          {/* 角色名称 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>角色名称</label>
            <Input
              placeholder='请输入角色名称'
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 权限字符 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>权限字符</label>
            <Input
              placeholder='请输入权限字符'
              value={roleKey}
              onChange={(e) => setRoleKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 状态 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>状态</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-[120px]'>
                <SelectValue placeholder='角色状态' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>正常</SelectItem>
                <SelectItem value='1'>停用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 创建时间 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>创建时间</label>
            <div className='flex items-center gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-[160px] justify-start font-normal',
                      !beginTime && 'text-muted-foreground'
                    )}
                  >
                    <CalendarDaysIcon className='mr-2 size-4' />
                    {beginTime ? formatDate(beginTime) : '开始日期'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={beginTime}
                    onSelect={setBeginTime}
                    disabled={(date) =>
                      date > new Date() ||
                      (endTime !== undefined && date > endTime)
                    }
                  />
                </PopoverContent>
              </Popover>
              <span className='text-muted-foreground'>至</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-[160px] justify-start font-normal',
                      !endTime && 'text-muted-foreground'
                    )}
                  >
                    <CalendarDaysIcon className='mr-2 size-4' />
                    {endTime ? formatDate(endTime) : '结束日期'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={endTime}
                    onSelect={setEndTime}
                    disabled={(date) =>
                      date > new Date() ||
                      (beginTime !== undefined && date < beginTime)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 搜索/重置按钮 */}
          <div className='flex items-center gap-2'>
            <Button variant='default' onClick={handleSearch}>
              <SearchIcon data-icon='inline-start' />
              搜索
            </Button>
            <Button variant='outline' onClick={handleReset}>
              <RefreshCcwIcon data-icon='inline-start' />
              重置
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
