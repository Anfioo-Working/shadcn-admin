'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  DownloadIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
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
import {
  dictTypeList,
  deleteDictType,
  refreshCache,
} from '@/features/system/shared/api'
import type { DictType } from '@/features/system/shared/types'
import type { DictTypeSearchParams } from '../data/schema'

interface DictTypeTableProps {
  searchParams: DictTypeSearchParams
  onEdit: (dictType: DictType) => void
  onAdd: () => void
  onRowClick: (dictType: DictType) => void
  selectedDictType: DictType | null
  refreshKey: number
}

export function DictTypeTable({
  searchParams,
  onEdit,
  onAdd,
  onRowClick,
  selectedDictType,
  refreshKey,
}: DictTypeTableProps) {
  const [dictTypes, setDictTypes] = useState<DictType[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null)

  // 内部搜索状态
  const [internalSearchParams, setInternalSearchParams] =
    useState<DictTypeSearchParams>(searchParams)

  // 加载字典类型列表
  const loadDictTypes = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await dictTypeList({
        pageNum,
        pageSize,
        dictName: internalSearchParams.dictName,
        dictType: internalSearchParams.dictType,
      })
      if (res.code === 200) {
        setDictTypes(res.data.rows)
        setTotal(res.data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [pageNum, pageSize, internalSearchParams, refreshKey])

  React.useEffect(() => {
    void (async () => {
      loadDictTypes()
    })()
  }, [loadDictTypes])

  // 选择相关
  const isAllSelected = useMemo(() => {
    return dictTypes.length > 0 && selectedIds.length === dictTypes.length
  }, [dictTypes, selectedIds])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(dictTypes.map((d) => d.dictId))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (dictId: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, dictId])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== dictId))
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
      await deleteDictType(id)
    }
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
    setSelectedIds([])
    loadDictTypes()
  }

  // 刷新缓存
  const handleRefreshCache = async () => {
    const res = await refreshCache()
    if (res.code === 200) {
      // 显示成功提示
    }
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

  // 搜索
  const handleSearch = () => {
    setPageNum(1)
    loadDictTypes()
  }

  const handleReset = () => {
    setInternalSearchParams({
      dictName: '',
      dictType: '',
    })
    setPageNum(1)
  }

  // 工具栏按钮禁用状态
  const canEdit = selectedIds.length === 1
  const canDelete = selectedIds.length > 0

  return (
    <Card className='h-full'>
      <CardHeader className='border-b px-4 py-3'>
        <CardTitle className='text-base font-semibold'>字典管理</CardTitle>
      </CardHeader>

      {/* 搜索表单 */}
      <div className='space-y-3 border-b px-4 py-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2'>
            <label className='text-sm whitespace-nowrap'>字典名称</label>
            <Input
              placeholder='请输入字典名称'
              value={internalSearchParams.dictName || ''}
              onChange={(e) =>
                setInternalSearchParams((prev) => ({
                  ...prev,
                  dictName: e.target.value,
                }))
              }
              className='w-[180px]'
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='text-sm whitespace-nowrap'>字典类型</label>
            <Input
              placeholder='请输入字典类型'
              value={internalSearchParams.dictType || ''}
              onChange={(e) =>
                setInternalSearchParams((prev) => ({
                  ...prev,
                  dictType: e.target.value,
                }))
              }
              className='w-[180px]'
            />
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={handleSearch}>
              <SearchIcon className='size-4' />
              搜索
            </Button>
            <Button variant='outline' size='sm' onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <CardContent className='p-0'>
        <div className='flex items-center gap-2 border-b px-4 py-3'>
          <Button variant='outline' size='sm' onClick={onAdd}>
            <PlusIcon className='size-4' />
            新增
          </Button>
          <Button
            variant='outline'
            size='sm'
            disabled={!canEdit}
            onClick={() => {
              const dictType = dictTypes.find(
                (d) => d.dictId === selectedIds[0]
              )
              if (dictType) onEdit(dictType)
            }}
          >
            <PencilIcon className='size-4' />
            修改
          </Button>
          <Button
            variant='outline'
            size='sm'
            disabled={!canDelete}
            onClick={() => handleDeleteClick(selectedIds)}
          >
            <Trash2Icon className='size-4' />
            删除
          </Button>
          <Button variant='outline' size='sm'>
            <DownloadIcon className='size-4' />
            导出
          </Button>
          <Button variant='outline' size='sm' onClick={handleRefreshCache}>
            <RefreshCwIcon className='size-4' />
            刷新缓存
          </Button>
        </div>

        {/* 表格 */}
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
              <TableHead>字典名称</TableHead>
              <TableHead>字典类型</TableHead>
              <TableHead>备注</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className='w-[120px]'>操作</TableHead>
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
            ) : dictTypes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='py-8 text-center text-muted-foreground'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              dictTypes.map((dictType) => (
                <TableRow
                  key={dictType.dictId}
                  data-selected={selectedDictType?.dictId === dictType.dictId}
                  className={cn(
                    'cursor-pointer',
                    selectedDictType?.dictId === dictType.dictId && 'bg-muted'
                  )}
                  onClick={() => onRowClick(dictType)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(dictType.dictId)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(dictType.dictId, checked as boolean)
                      }
                      aria-label='选择行'
                    />
                  </TableCell>
                  <TableCell>{dictType.dictName}</TableCell>
                  <TableCell>
                    <span className='cursor-pointer text-primary hover:underline'>
                      {dictType.dictType}
                    </span>
                  </TableCell>
                  <TableCell>{dictType.remark || '-'}</TableCell>
                  <TableCell>{dictType.createTime}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onEdit(dictType)}
                        className='h-7 px-2'
                      >
                        <PencilIcon className='size-3.5' />
                        修改
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteClick([dictType.dictId])}
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
              是否确认删除字典编号为 "{deleteTarget?.join(', ')}" 的数据项？
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
