'use client'

import { useState, useCallback } from 'react'
import { SearchIcon, RefreshCwIcon } from 'lucide-react'
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
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import type { Dept } from '@/features/system/shared/types'
import { DeptFormDialog } from './components/dept-dialogs'
import { DeptTreeTable } from './components/dept-tree-table'

// 搜索参数类型
interface DeptSearchParams {
  deptName?: string
  deptCategory?: string
  status?: string
}

export default function DeptPage() {
  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<DeptSearchParams>({})
  const [deptName, setDeptName] = useState('')
  const [deptCategory, setDeptCategory] = useState('')
  const [status, setStatus] = useState('')

  // 对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingDeptId, setEditingDeptId] = useState<number | null>(null)
  const [parentDeptId, setParentDeptId] = useState<number | undefined>(
    undefined
  )

  // 刷新表格的key，用于强制刷新
  const [refreshKey, setRefreshKey] = useState(0)

  // 处理搜索
  const handleSearch = useCallback(() => {
    setSearchParams({
      deptName: deptName || undefined,
      deptCategory: deptCategory || undefined,
      status: status || undefined,
    })
  }, [deptName, deptCategory, status])

  // 处理重置
  const handleReset = useCallback(() => {
    setDeptName('')
    setDeptCategory('')
    setStatus('')
    setSearchParams({})
  }, [])

  // 处理新增部门
  const handleAdd = useCallback(() => {
    setEditingDeptId(null)
    setParentDeptId(undefined)
    setFormDialogOpen(true)
  }, [])

  // 处理编辑部门
  const handleEdit = useCallback((dept: Dept) => {
    setEditingDeptId(dept.deptId)
    setParentDeptId(undefined)
    setFormDialogOpen(true)
  }, [])

  // 处理新增子部门
  const handleAddChild = useCallback((dept: Dept) => {
    setEditingDeptId(null)
    setParentDeptId(dept.deptId)
    setFormDialogOpen(true)
  }, [])

  // 表单提交成功后刷新
  const handleFormSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Department Management
            </h2>
            <p className='text-muted-foreground'>Manage departments</p>
          </div>
        </div>

        <Card>
          <CardContent className='py-4'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium'>部门名称:</label>
                <Input
                  placeholder='请输入部门名称'
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className='w-[200px]'
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium'>类别编码:</label>
                <Input
                  placeholder='请输入类别编码'
                  value={deptCategory}
                  onChange={(e) => setDeptCategory(e.target.value)}
                  className='w-[200px]'
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium'>状态:</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className='w-[120px]'>
                    <SelectValue placeholder='部门状态' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>全部</SelectItem>
                    <SelectItem value='0'>正常</SelectItem>
                    <SelectItem value='1'>停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='default' onClick={handleSearch}>
                  <SearchIcon className='size-4' />
                  搜索
                </Button>
                <Button variant='outline' onClick={handleReset}>
                  <RefreshCwIcon className='size-4' />
                  重置
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <DeptTreeTable
          key={refreshKey}
          searchParams={searchParams}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onAddChild={handleAddChild}
        />
      </Main>

      <DeptFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        deptId={editingDeptId}
        parentId={parentDeptId}
      />
    </>
  )
}
