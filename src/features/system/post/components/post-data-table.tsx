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
import { postList, deletePost, updatePost } from '@/features/system/shared/api'
import type { Post, PostForm } from '@/features/system/shared/types'
import type { PostSearchParams } from './post-search-form'

interface PostDataTableProps {
  searchParams: PostSearchParams
  deptId?: number
  onEdit: (post: Post) => void
  onAdd: () => void
}

export function PostDataTable({
  searchParams,
  deptId,
  onEdit,
  onAdd,
}: PostDataTableProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null)

  // 加载岗位列表
  const loadPosts = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await postList({
        pageNum,
        pageSize,
        postCode: searchParams.postCode,
        postCategory: searchParams.postCategory,
        postName: searchParams.postName,
        status: searchParams.status,
        deptId: deptId,
      })
      if (res.code === 200) {
        setPosts(res.data.rows)
        setTotal(res.data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [pageNum, pageSize, searchParams, deptId])

  React.useEffect(() => {
    void (async () => {
      loadPosts()
    })()
  }, [loadPosts])

  // 选择相关
  const isAllSelected = useMemo(() => {
    return posts.length > 0 && selectedIds.length === posts.length
  }, [posts, selectedIds])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(posts.map((p) => p.postId))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (postId: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, postId])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== postId))
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
      await deletePost(id)
    }
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
    setSelectedIds([])
    loadPosts()
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

  const handleStatusChange = async (post: Post, checked: boolean) => {
    const newStatus = checked ? '0' : '1'
    await updatePost({
      ...post,
      status: newStatus,
    } as PostForm)
    loadPosts()
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
              const post = posts.find((p) => p.postId === selectedIds[0])
              if (post) onEdit(post)
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
          <Button className='bg-amber-500 hover:bg-amber-600 text-white'>
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
              <TableHead>岗位编码</TableHead>
              <TableHead>类别编码</TableHead>
              <TableHead>岗位名称</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>排序</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className='w-[120px]'>操作</TableHead>
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
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='py-8 text-center text-muted-foreground'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow
                  key={post.postId}
                  data-selected={selectedIds.includes(post.postId)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(post.postId)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(post.postId, checked as boolean)
                      }
                      aria-label='选择行'
                    />
                  </TableCell>
                  <TableCell>{post.postCode}</TableCell>
                  <TableCell>{post.postCategory || '-'}</TableCell>
                  <TableCell>{post.postName}</TableCell>
                  <TableCell>{post.deptName || '-'}</TableCell>
                  <TableCell>{post.postSort}</TableCell>
                  <TableCell>
            <Switch
              checked={post.status === '0'}
              onCheckedChange={(checked) => handleStatusChange(post, checked)}
            />
          </TableCell>
                  <TableCell>{post.createTime}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onEdit(post)}
                        className='h-7 px-2'
                      >
                        <PencilIcon className='size-3.5' />
                        修改
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteClick([post.postId])}
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
              是否确认删除岗位编号为 "{deleteTarget?.join(', ')}" 的数据项？
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
