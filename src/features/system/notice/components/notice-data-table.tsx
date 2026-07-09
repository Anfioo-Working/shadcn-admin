'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
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
import { Badge } from '@/components/ui/badge'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { noticeList, deleteNotice } from '@/features/system/shared/api'
import type { Notice } from '@/features/system/shared/types'
import type { NoticeSearchParams } from './notice-search-form'

interface NoticeDataTableProps {
  searchParams: NoticeSearchParams
  onEdit: (notice: Notice) => void
  onAdd: () => void
}

// 格式化日期
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function NoticeDataTable({
  searchParams,
  onEdit,
  onAdd,
}: NoticeDataTableProps) {
  const [notices, setNotices] = useState<Notice[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null)

  // 加载公告列表
  const loadNotices = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await noticeList({
        pageNum,
        pageSize,
        noticeTitle: searchParams.noticeTitle,
        noticeType: searchParams.noticeType,
      })
      if (res.code === 200) {
        setNotices(res.data.rows)
        setTotal(res.data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [pageNum, pageSize, searchParams])

  React.useEffect(() => {
    void (async () => {
      loadNotices()
    })()
  }, [loadNotices])

  // 选择相关
  const isAllSelected = useMemo(() => {
    return notices.length > 0 && selectedIds.length === notices.length
  }, [notices, selectedIds])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(notices.map((n) => n.noticeId))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (noticeId: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, noticeId])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== noticeId))
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
      await deleteNotice(id)
    }
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
    setSelectedIds([])
    loadNotices()
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

  // 获取公告类型 Badge
  const getNoticeTypeBadge = (type: string) => {
    if (type === '1') {
      return <Badge variant='secondary'>通知</Badge>
    } else if (type === '2') {
      return <Badge variant='outline'>公告</Badge>
    }
    return <Badge variant='secondary'>{type}</Badge>
  }

  // 获取状态 Badge
  const getStatusBadge = (status: string) => {
    if (status === '0') {
      return <Badge variant='default'>正常</Badge>
    } else {
      return <Badge variant='secondary'>关闭</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className='border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={onAdd}>
            <PlusIcon data-icon='inline-start' />
            新增
          </Button>
          <Button
            variant='outline'
            disabled={!canEdit}
            onClick={() => {
              const notice = notices.find((n) => n.noticeId === selectedIds[0])
              if (notice) onEdit(notice)
            }}
          >
            <PencilIcon data-icon='inline-start' />
            修改
          </Button>
          <Button
            variant='outline'
            disabled={!canDelete}
            onClick={() => handleDeleteClick(selectedIds)}
          >
            <Trash2Icon data-icon='inline-start' />
            删除
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
              <TableHead>公告标题</TableHead>
              <TableHead className='w-[100px]'>公告类型</TableHead>
              <TableHead className='w-[100px]'>状态</TableHead>
              <TableHead className='w-[100px]'>创建者</TableHead>
              <TableHead className='w-[120px]'>创建时间</TableHead>
              <TableHead className='w-[120px]'>操作</TableHead>
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
            ) : notices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='py-8 text-center text-muted-foreground'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow
                  key={notice.noticeId}
                  data-selected={selectedIds.includes(notice.noticeId)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(notice.noticeId)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(notice.noticeId, checked as boolean)
                      }
                      aria-label='选择行'
                    />
                  </TableCell>
                  <TableCell className='max-w-[300px] truncate'>
                    {notice.noticeTitle}
                  </TableCell>
                  <TableCell>{getNoticeTypeBadge(notice.noticeType)}</TableCell>
                  <TableCell>{getStatusBadge(notice.status)}</TableCell>
                  <TableCell>{notice.createByName}</TableCell>
                  <TableCell>{formatDate(notice.createTime)}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onEdit(notice)}
                        className='h-7 px-2'
                      >
                        <PencilIcon className='size-3.5' />
                        修改
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteClick([notice.noticeId])}
                        className='h-7 px-2'
                      >
                        <Trash2Icon className='size-3.5' />
                        删除
                      </Button>
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
              是否确认删除公告编号为 "{deleteTarget?.join(', ')}" 的数据项？
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
