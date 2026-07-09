'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  ChevronDownIcon,
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
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deptList, deleteDept, updateDept } from '@/features/system/shared/api'
import type { Dept, DeptForm } from '@/features/system/shared/types'

interface DeptTreeTableProps {
  searchParams: {
    deptName?: string
    deptCategory?: string
    status?: string
  }
  onAdd: () => void
  onEdit: (dept: Dept) => void
  onAddChild: (dept: Dept) => void
}

export function DeptTreeTable({
  searchParams,
  onAdd,
  onEdit,
  onAddChild,
}: DeptTreeTableProps) {
  const [depts, setDepts] = useState<Dept[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [isExpandAll, setIsExpandAll] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Dept | null>(null)

  // 加载部门列表
  const loadDepts = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await deptList({
        deptName: searchParams.deptName,
        status: searchParams.status,
      })
      if (res.code === 200) {
        setDepts(res.data)
        // 默认展开所有
        if (isExpandAll) {
          const allIds = getAllDeptIds(res.data)
          setExpandedIds(new Set(allIds))
        }
      }
    } finally {
      setLoading(false)
    }
  }, [searchParams, isExpandAll])

  React.useEffect(() => {
    void (async () => {
      loadDepts()
    })()
  }, [loadDepts])

  // 获取所有部门ID
  const getAllDeptIds = (depts: Dept[]): number[] => {
    const ids: number[] = []
    depts.forEach((dept) => {
      ids.push(dept.deptId)
      if (dept.children && dept.children.length > 0) {
        ids.push(...getAllDeptIds(dept.children))
      }
    })
    return ids
  }

  // 展开/折叠操作
  const handleToggleExpandAll = () => {
    const newExpandAll = !isExpandAll
    setIsExpandAll(newExpandAll)
    if (newExpandAll) {
      setExpandedIds(new Set(getAllDeptIds(depts)))
    } else {
      setExpandedIds(new Set())
    }
  }

  // 展开/折叠单个节点
  const handleToggle = (deptId: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(deptId)) {
        newSet.delete(deptId)
      } else {
        newSet.add(deptId)
      }
      return newSet
    })
  }

  // 删除操作
  const handleDeleteClick = (dept: Dept) => {
    setDeleteTarget(dept)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const res = await deleteDept(deleteTarget.deptId)
    if (res.code === 200) {
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      loadDepts()
    } else {
      // 显示错误信息
      alert(res.msg)
      setDeleteDialogOpen(false)
    }
  }

  // 渲染树形表格行
  const renderRows = (depts: Dept[], level: number = 0): React.ReactNode[] => {
    const rows: React.ReactNode[] = []
    depts.forEach((dept) => {
      const hasChildren = dept.children && dept.children.length > 0
      const isExpanded = expandedIds.has(dept.deptId)
      const indentStyle = { paddingLeft: `${level * 20}px` }

      rows.push(
        <TableRow key={dept.deptId}>
          <TableCell>
            <div className='flex items-center gap-2' style={indentStyle}>
              {hasChildren ? (
                <button
                  className='flex size-5 items-center justify-center rounded hover:bg-accent'
                  onClick={() => handleToggle(dept.deptId)}
                >
                  {isExpanded ? (
                    <ChevronDownIcon className='size-4 text-muted-foreground' />
                  ) : (
                    <ChevronRightIcon className='size-4 text-muted-foreground' />
                  )}
                </button>
              ) : (
                <span className='size-5' />
              )}
              <span>{dept.deptName}</span>
            </div>
          </TableCell>
          <TableCell>{dept.deptCategory}</TableCell>
          <TableCell>{dept.orderNum}</TableCell>
          <TableCell>
            <Switch
              checked={dept.status === '0'}
              onCheckedChange={async (checked) => {
                const newStatus = checked ? '0' : '1'
                await updateDept({
                  ...dept,
                  status: newStatus,
                } as DeptForm)
                loadDepts()
              }}
            />
          </TableCell>
          <TableCell>{dept.createTime}</TableCell>
          <TableCell>
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onEdit(dept)}
                className='h-7 px-2'
              >
                <PencilIcon className='size-3.5' />
                修改
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onAddChild(dept)}
                className='h-7 px-2'
              >
                <PlusIcon className='size-3.5' />
                新增
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleDeleteClick(dept)}
                className='h-7 px-2'
                disabled={dept.deptId === 100}
              >
                <Trash2Icon className='size-3.5' />
                删除
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )

      // 渲染子节点
      if (hasChildren && isExpanded) {
        rows.push(...renderRows(dept.children!, level + 1))
      }
    })
    return rows
  }

  return (
    <Card>
      <CardHeader className='border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Button onClick={onAdd}>
            <PlusIcon data-icon='inline-start' />
            新增
          </Button>
          <Button variant='outline' onClick={handleToggleExpandAll}>
            {isExpandAll ? '折叠' : '展开'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[260px]'>部门名称</TableHead>
              <TableHead className='w-[200px]'>类别编码</TableHead>
              <TableHead className='w-[200px]'>排序</TableHead>
              <TableHead className='w-[100px]'>状态</TableHead>
              <TableHead className='w-[200px]'>创建时间</TableHead>
              <TableHead className='w-[180px]'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='py-8 text-center text-muted-foreground'
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : depts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='py-8 text-center text-muted-foreground'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              renderRows(depts)
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              是否确认删除名称为 "{deleteTarget?.deptName}" 的部门数据项？
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
