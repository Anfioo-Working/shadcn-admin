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
  SearchIcon,
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
import { dictDataList, deleteDictData } from '@/features/system/shared/api'
import type { DictData, DictType } from '@/features/system/shared/types'

interface DictDataTableProps {
  selectedDictType: DictType | null
  onEdit: (dictData: DictData) => void
  onAdd: () => void
  refreshKey: number
}

// Badge 颜色样式
const badgeColorStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  info: 'bg-cyan-100 text-cyan-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
}

export function DictDataTable({
  selectedDictType,
  onEdit,
  onAdd,
  refreshKey,
}: DictDataTableProps) {
  const [dictDatas, setDictDatas] = useState<DictData[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null)

  // 内部搜索状态
  const [dictLabelSearch, setDictLabelSearch] = useState('')

  // 加载字典数据列表
  const loadDictDatas = React.useCallback(async () => {
    if (!selectedDictType) {
      setDictDatas([])
      setTotal(0)
      return
    }
    setLoading(true)
    try {
      const res = await dictDataList({
        pageNum,
        pageSize,
        dictType: selectedDictType.dictType,
        dictLabel: dictLabelSearch,
      })
      if (res.code === 200) {
        setDictDatas(res.data.rows)
        setTotal(res.data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [pageNum, pageSize, selectedDictType, dictLabelSearch, refreshKey])

  React.useEffect(() => {
    void (async () => {
      setPageNum(1)
      setDictLabelSearch('')
      loadDictDatas()
    })()
  }, [selectedDictType])

  React.useEffect(() => {
    void (async () => {
      loadDictDatas()
    })()
  }, [pageNum, pageSize, dictLabelSearch, refreshKey])

  // 选择相关
  const isAllSelected = useMemo(() => {
    return dictDatas.length > 0 && selectedIds.length === dictDatas.length
  }, [dictDatas, selectedIds])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(dictDatas.map((d) => d.dictCode))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (dictCode: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, dictCode])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== dictCode))
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
      await deleteDictData(id)
    }
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
    setSelectedIds([])
    loadDictDatas()
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
    loadDictDatas()
  }

  const handleReset = () => {
    setDictLabelSearch('')
    setPageNum(1)
  }

  // 工具栏按钮禁用状态
  const hasSelectedType = !!selectedDictType
  const canEdit = selectedIds.length === 1 && hasSelectedType
  const canDelete = selectedIds.length > 0 && hasSelectedType

  // 获取 Badge 样式
  const getBadgeStyle = (listClass: string) => {
    const style = badgeColorStyles[listClass] || badgeColorStyles.default
    return style
  }

  return (
    <Card className='h-full'>
      <CardHeader className='border-b px-4 py-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <CardTitle className='text-base font-semibold'>字典数据</CardTitle>
            {selectedDictType ? (
              <span className='text-xs text-muted-foreground'>
                {selectedDictType.dictName} / {selectedDictType.dictType}
              </span>
            ) : (
              <span className='text-xs text-muted-foreground'>
                请先选择字典
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      {/* 搜索表单 */}
      <div className='border-b px-4 py-3'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <label className='text-sm whitespace-nowrap'>字典标签</label>
            <Input
              placeholder='请输入字典标签'
              value={dictLabelSearch}
              onChange={(e) => setDictLabelSearch(e.target.value)}
              className='w-[180px]'
              disabled={!hasSelectedType}
            />
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={!hasSelectedType}
              onClick={handleSearch}
            >
              <SearchIcon className='size-4' />
              搜索
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={!hasSelectedType}
              onClick={handleReset}
            >
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <CardContent className='p-0'>
        <div className='flex items-center gap-2 border-b px-4 py-3'>
          <Button size='sm' disabled={!hasSelectedType} onClick={onAdd}>
            <PlusIcon className='size-4' />
            新增
          </Button>
          <Button
            className='bg-green-600 text-white hover:bg-green-700'
            size='sm'
            disabled={!canEdit}
            onClick={() => {
              const dictData = dictDatas.find(
                (d) => d.dictCode === selectedIds[0]
              )
              if (dictData) onEdit(dictData)
            }}
          >
            <PencilIcon className='size-4' />
            修改
          </Button>
          <Button
            variant='destructive'
            size='sm'
            disabled={!canDelete}
            onClick={() => handleDeleteClick(selectedIds)}
          >
            <Trash2Icon className='size-4' />
            删除
          </Button>
          <Button
            className='bg-amber-500 text-white hover:bg-amber-600'
            size='sm'
            disabled={!hasSelectedType}
          >
            <DownloadIcon className='size-4' />
            导出
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
              <TableHead>字典标签</TableHead>
              <TableHead>字典键值</TableHead>
              <TableHead>字典排序</TableHead>
              <TableHead>备注</TableHead>
              <TableHead>创建时间</TableHead>
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
            ) : !hasSelectedType ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='py-8 text-center text-muted-foreground'
                >
                  请先选择字典类型
                </TableCell>
              </TableRow>
            ) : dictDatas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='py-8 text-center text-muted-foreground'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              dictDatas.map((dictData) => (
                <TableRow
                  key={dictData.dictCode}
                  data-selected={selectedIds.includes(dictData.dictCode)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(dictData.dictCode)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(dictData.dictCode, checked as boolean)
                      }
                      aria-label='选择行'
                    />
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeStyle(dictData.listClass)}>
                      {dictData.dictLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>{dictData.dictValue}</TableCell>
                  <TableCell>{dictData.dictSort}</TableCell>
                  <TableCell>{dictData.remark || '-'}</TableCell>
                  <TableCell>{dictData.createTime}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onEdit(dictData)}
                        className='h-7 px-2'
                      >
                        <PencilIcon className='size-3.5' />
                        修改
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteClick([dictData.dictCode])}
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
              是否确认删除字典编码为 "{deleteTarget?.join(', ')}" 的数据项？
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
