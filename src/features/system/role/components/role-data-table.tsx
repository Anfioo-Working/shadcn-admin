'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  UserIcon,
} from 'lucide-react'
import { toast } from 'sonner'
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
  roleList,
  deleteRole,
  changeRoleStatus,
} from '@/features/system/shared/api'
import type { Role } from '@/features/system/shared/types'
import type { RoleSearchParams } from './role-search-form'

interface RoleDataTableProps {
  searchParams: RoleSearchParams
  onEdit: (role: Role) => void
  onDataScopeAssign: (role: Role) => void
  onAssignUser: (role: Role) => void
  onAdd: () => void
}

export function RoleDataTable({
  searchParams,
  onEdit,
  onDataScopeAssign,
  onAssignUser,
  onAdd,
}: RoleDataTableProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<{
    roleId: number
    newStatus: string
  } | null>(null)

  const loadRoles = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await roleList({
        pageNum,
        pageSize,
        roleName: searchParams.roleName,
        roleKey: searchParams.roleKey,
        status: searchParams.status,
      })
      if (res.code === 200) {
        setRoles(res.data.rows)
        setTotal(res.data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [pageNum, pageSize, searchParams])

  React.useEffect(() => {
    void (async () => {
      loadRoles()
    })()
  }, [loadRoles])

  const isAllSelected = useMemo(() => {
    return roles.length > 0 && selectedIds.length === roles.length
  }, [roles, selectedIds])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(roles.map((r) => r.roleId))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (roleId: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, roleId])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== roleId))
    }
  }

  const handleDeleteClick = (ids: number[]) => {
    setDeleteTarget(ids)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    for (const id of deleteTarget) {
      await deleteRole(id)
    }
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
    setSelectedIds([])
    loadRoles()
    toast.success('删除成功')
  }

  const handleStatusChange = (roleId: number, currentStatus: string) => {
    const newStatus = currentStatus === '0' ? '1' : '0'
    setStatusTarget({ roleId, newStatus })
    setStatusDialogOpen(true)
  }

  const handleStatusConfirm = async () => {
    if (!statusTarget) return
    await changeRoleStatus(statusTarget.roleId, statusTarget.newStatus)
    setStatusDialogOpen(false)
    setStatusTarget(null)
    loadRoles()
    toast.success('状态修改成功')
  }

  const handleExport = () => {
    toast.success('导出功能开发中')
  }

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

  const canEdit = selectedIds.length === 1
  const canDelete = selectedIds.length > 0

  return (
    <Card>
      <CardHeader className='border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Button variant='default' onClick={onAdd}>
            <PlusIcon data-icon='inline-start' />
            新增
          </Button>
          <Button
            className='bg-green-600 hover:bg-green-700'
            disabled={!canEdit}
            onClick={() => {
              const role = roles.find((r) => r.roleId === selectedIds[0])
              if (role) onEdit(role)
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
            className='bg-amber-500 text-white hover:bg-amber-600'
            onClick={handleExport}
          >
            <DownloadIcon data-icon='inline-start' />
            导出
          </Button>
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
              <TableHead>角色名称</TableHead>
              <TableHead>权限字符</TableHead>
              <TableHead>显示顺序</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className='w-[240px]'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='py-8 text-center text-muted-foreground'
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='py-8 text-center text-muted-foreground'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow
                  key={role.roleId}
                  data-selected={selectedIds.includes(role.roleId)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(role.roleId)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(role.roleId, checked as boolean)
                      }
                      aria-label='选择行'
                      disabled={role.roleId === 1}
                    />
                  </TableCell>
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell>{role.roleKey}</TableCell>
                  <TableCell>{role.roleSort}</TableCell>
                  <TableCell>
                    <Switch
                      checked={role.status === '0'}
                      onCheckedChange={() =>
                        handleStatusChange(role.roleId, role.status)
                      }
                      disabled={role.roleId === 1}
                    />
                  </TableCell>
                  <TableCell>{role.createTime}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onEdit(role)}
                        className='h-7 px-2'
                        disabled={role.roleId === 1}
                      >
                        <PencilIcon className='size-3.5' />
                        修改
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteClick([role.roleId])}
                        className='h-7 px-2'
                        disabled={role.roleId === 1}
                      >
                        <Trash2Icon className='size-3.5' />
                        删除
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDataScopeAssign(role)}
                        className='h-7 px-2'
                        disabled={role.roleId === 1}
                      >
                        <CircleCheckIcon className='size-3.5' />
                        数据权限
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onAssignUser(role)}
                        className='h-7 px-2'
                        disabled={role.roleId === 1}
                      >
                        <UserIcon className='size-3.5' />
                        分配用户
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              是否确认删除编号为 "{deleteTarget?.join(', ')}" 的角色数据项？
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

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认修改状态</AlertDialogTitle>
            <AlertDialogDescription>
              是否确认将角色状态修改为
              {statusTarget?.newStatus === '0' ? '正常' : '停用'}？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusConfirm}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
