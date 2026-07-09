'use client'

import * as React from 'react'
import { SearchIcon, RefreshCcwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
}

export function RoleSearchForm({
  onSearch,
  onReset,
  defaultValues,
}: RoleSearchFormProps) {
  const [roleName, setRoleName] = React.useState(defaultValues?.roleName || '')
  const [roleKey, setRoleKey] = React.useState(defaultValues?.roleKey || '')
  const [status, setStatus] = React.useState(defaultValues?.status || '')

  React.useEffect(() => {
    void (async () => {
      if (defaultValues) {
        setRoleName(defaultValues.roleName || '')
        setRoleKey(defaultValues.roleKey || '')
        setStatus(defaultValues.status || '')
      }
    })()
  }, [defaultValues])

  const handleSearch = () => {
    onSearch({
      roleName: roleName || undefined,
      roleKey: roleKey || undefined,
      status: status || undefined,
    })
  }

  const handleReset = () => {
    setRoleName('')
    setRoleKey('')
    setStatus('')
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
