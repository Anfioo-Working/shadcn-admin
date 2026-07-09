'use client'

import { useState, useCallback } from 'react'
import type { DictType, DictData } from '@/features/system/shared/types'
import { DictDataTable } from './components/dict-data-table'
import {
  DictTypeFormDialog,
  DictDataFormDialog,
} from './components/dict-dialogs'
import { DictTypeTable } from './components/dict-type-table'
import type { DictTypeSearchParams } from './data/schema'

export default function DictPage() {
  // 搜索参数状态
  const [searchParams] = useState<DictTypeSearchParams>({})

  // 当前选中的字典类型
  const [selectedDictType, setSelectedDictType] = useState<DictType | null>(
    null
  )

  // 对话框状态
  const [typeDialogOpen, setTypeDialogOpen] = useState(false)
  const [editingDictType, setEditingDictType] = useState<DictType | null>(null)
  const [dataDialogOpen, setDataDialogOpen] = useState(false)
  const [editingDictData, setEditingDictData] = useState<DictData | null>(null)

  // 刷新表格的key，用于强制刷新
  const [typeRefreshKey, setTypeRefreshKey] = useState(0)
  const [dataRefreshKey, setDataRefreshKey] = useState(0)

  // 处理字典类型行点击
  const handleDictTypeRowClick = useCallback((dictType: DictType) => {
    setSelectedDictType(dictType)
  }, [])

  // 处理新增字典类型
  const handleAddDictType = useCallback(() => {
    setEditingDictType(null)
    setTypeDialogOpen(true)
  }, [])

  // 处理编辑字典类型
  const handleEditDictType = useCallback((dictType: DictType) => {
    setEditingDictType(dictType)
    setTypeDialogOpen(true)
  }, [])

  // 处理新增字典数据
  const handleAddDictData = useCallback(() => {
    setEditingDictData(null)
    setDataDialogOpen(true)
  }, [])

  // 处理编辑字典数据
  const handleEditDictData = useCallback((dictData: DictData) => {
    setEditingDictData(dictData)
    setDataDialogOpen(true)
  }, [])

  // 字典类型表单提交成功后刷新
  const handleTypeFormSuccess = useCallback(() => {
    setTypeRefreshKey((k) => k + 1)
  }, [])

  // 字典数据表单提交成功后刷新
  const handleDataFormSuccess = useCallback(() => {
    setDataRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className='h-full p-4'>
      <div className='grid h-full grid-cols-1 gap-4 lg:grid-cols-2'>
        {/* 字典类型表格 */}
        <div className='min-h-[500px]'>
          <DictTypeTable
            searchParams={searchParams}
            onEdit={handleEditDictType}
            onAdd={handleAddDictType}
            onRowClick={handleDictTypeRowClick}
            selectedDictType={selectedDictType}
            refreshKey={typeRefreshKey}
          />
        </div>

        {/* 字典数据表格 */}
        <div className='min-h-[500px]'>
          <DictDataTable
            selectedDictType={selectedDictType}
            onEdit={handleEditDictData}
            onAdd={handleAddDictData}
            refreshKey={dataRefreshKey}
          />
        </div>
      </div>

      {/* 字典类型表单对话框 */}
      <DictTypeFormDialog
        open={typeDialogOpen}
        onOpenChange={setTypeDialogOpen}
        onSuccess={handleTypeFormSuccess}
        dictType={editingDictType}
      />

      {/* 字典数据表单对话框 */}
      <DictDataFormDialog
        open={dataDialogOpen}
        onOpenChange={setDataDialogOpen}
        onSuccess={handleDataFormSuccess}
        dictData={editingDictData}
        selectedDictType={selectedDictType}
      />
    </div>
  )
}
