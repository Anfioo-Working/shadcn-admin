'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import {
  PencilIcon,
  Trash2Icon,
  KeyIcon,
  CircleCheckIcon,
  MoreHorizontalIcon,
  PlusIcon,
  DownloadIcon,
  UploadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  userList,
  deleteUser,
  changeUserStatus,
} from '@/features/system/shared/api'
import type { User } from '@/features/system/shared/types'
import type { UserSearchParams } from './user-search-form'

interface UserDataTableProps {
  searchParams: UserSearchParams
  deptId?: number
  onEdit: (user: User) => void
  onResetPassword: (user: User) => void
  onAdd: () => void
}

export function UserDataTable({
  searchParams,
  deptId,
  onEdit,
  onResetPassword,
  onAdd,
}: UserDataTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null)

  // 加载用户列表
  const loadUsers = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await userList({
        pageNum,
        pageSize,
        userName: searchParams.userName,
        nickName: searchParams.nickName,
        phonenumber: searchParams.phonenumber,
        status: searchParams.status,
        deptId: deptId,
        beginTime: searchParams.beginTime,
        endTime: searchParams.endTime,
      })
      if (res.code === 200) {
        setUsers(res.data.rows)
        setTotal(res.data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [pageNum, pageSize, searchParams, deptId])

  React.useEffect(() => {
    void (async () => {
      loadUsers()
    })()
  }, [loadUsers])

  // 选择相关
  const isAllSelected = useMemo(() => {
    return users.length > 0 && selectedIds.length === users.length
  }, [users, selectedIds])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map((u) => u.userId))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, userId])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== userId))
    }
  }

  // 状态切换
  const handleStatusChange = async (user: User, newStatus: string) => {
    const res = await changeUserStatus(user.userId, newStatus)
    if (res.code === 200) {
      loadUsers()
    }
  }

  // 删除操作
  const handleDeleteClick = (ids: number[]) => {
    setDeleteTarget(ids)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    for (const id of deleteTarget) {
      await deleteUser(id)
    }
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
    setSelectedIds([])
    loadUsers()
  }

  // 分页
  const totalPages = Math.ceil(total / pageSize)

  const handlePrevPage = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1)
    }
  }

  const handleNextPage = () => {
    if (pageNum < totalPages) {
      setPageNum(pageNum + 1)
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPageNum(1)
  }

  // 工具栏按钮禁用状态
  const canEdit = selectedIds.length === 1
  const canDelete = selectedIds.length > 0

  // 导出功能
  const handleExport = async () => {
    toast.info('正在导出数据...')
    await sleep(1000)
    toast.success('导出成功')
  }

  // 下载模板功能
  const handleDownloadTemplate = async () => {
    toast.info('正在下载模板...')
    await sleep(500)
    const blob = new Blob(
      ['用户名称,用户昵称,归属部门,手机号码,邮箱,用户性别,状态,岗位,角色,备注'],
      { type: 'text/csv' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '用户导入模板.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('模板下载成功')
  }

  // 导入数据功能
  const handleImportClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.xlsx'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        toast.info(`正在导入 ${file.name}...`)
        await sleep(1000)
        toast.success('导入成功')
        loadUsers()
      }
    }
    input.click()
  }

  return (
    <Card>
      <CardHeader className='border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Button onClick={onAdd}>
            <PlusIcon data-icon='inline-start' />
            新增
          </Button>
          <Button
            className='bg-green-600 hover:bg-green-700 text-white'
            disabled={!canEdit}
            onClick={() => {
              const user = users.find((u) => u.userId === selectedIds[0])
              if (user) onEdit(user)
            }}
          >
            <PencilIcon data-icon='inline-start' />
            修改
          </Button>
          <Button
            variant='destructive'
            disabled={!canDelete}
            onClick={() => handleDeleteClick(selectedIds)}
          >
            <Trash2Icon data-icon='inline-start' />
            删除
          </Button>
          <Button
            className='bg-amber-500 hover:bg-amber-600 text-white'
            onClick={handleExport}
          >
            <DownloadIcon data-icon='inline-start' />
            导出
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                更多
                <MoreHorizontalIcon className='ml-1' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleDownloadTemplate}>
                <DownloadIcon className='mr-1 size-3.5' />
                下载模板
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
                <UploadIcon className='mr-1 size-3.5' />
                导入数据
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label='全选'
                />
              </TableHead>
              <TableHead className='hidden'>用户编号</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>用户昵称</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>手机号码</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className='w-[240px]'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='py-8 text-center text-muted-foreground'
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='py-8 text-center text-muted-foreground'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.userId}
                  data-selected={selectedIds.includes(user.userId)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(user.userId)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(user.userId, checked as boolean)
                      }
                      aria-label='选择行'
                    />
                  </TableCell>
                  <TableCell className='hidden'>{user.userId}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.nickName}</TableCell>
                  <TableCell>{user.dept?.deptName || '-'}</TableCell>
                  <TableCell>{user.phonenumber}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.status === '0'}
                      onCheckedChange={(checked) =>
                        handleStatusChange(user, checked ? '0' : '1')
                      }
                      aria-label='状态切换'
                      disabled={user.userId === 1}
                    />
                  </TableCell>
                  <TableCell>{user.createTime}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      {user.userId !== 1 && (
                        <>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onEdit(user)}
                            className='h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                          >
                            <PencilIcon className='size-3.5' />
                            修改
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteClick([user.userId])}
                            className='h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50'
                          >
                            <Trash2Icon className='size-3.5' />
                            删除
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onResetPassword(user)}
                            className='h-7 px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                          >
                            <KeyIcon className='size-3.5' />
                            重置密码
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => toast.info('分配角色功能开发中')}
                            className='h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50'
                          >
                            <CircleCheckIcon className='size-3.5' />
                            分配角色
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 分页 */}
        {total > 0 && (
          <div className='flex items-center justify-between border-t px-4 py-3'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              共 {total} 条
              <Select
                value={String(pageSize)}
                onValueChange={(v) => handlePageSizeChange(Number(v))}
              >
                <SelectTrigger className='w-[80px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10条/页</SelectItem>
                  <SelectItem value='20'>20条/页</SelectItem>
                  <SelectItem value='50'>50条/页</SelectItem>
                  <SelectItem value='100'>100条/页</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={pageNum === 1}
                onClick={handlePrevPage}
              >
                <ChevronLeftIcon className='size-4' />
              </Button>
              <span className='text-sm'>
                第 {pageNum} / {totalPages} 页
              </span>
              <Button
                variant='outline'
                size='sm'
                disabled={pageNum === totalPages}
                onClick={handleNextPage}
              >
                <ChevronRightIcon className='size-4' />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              是否确认删除编号为 "{deleteTarget?.join(', ')}" 的用户数据项？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
