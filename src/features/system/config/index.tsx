'use client'

import { useState, useCallback } from 'react'
import type { Config } from '@/features/system/shared/types'
import { ConfigDataTable } from './components/config-data-table'
import { ConfigFormDialog } from './components/config-dialogs'
import {
  ConfigSearchForm,
  type ConfigSearchParams,
} from './components/config-search-form'

export default function ConfigPage() {
  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<ConfigSearchParams>({})

  // 对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<Config | null>(null)

  // 刷新表格的key，用于强制刷新
  const [refreshKey, setRefreshKey] = useState(0)

  // 处理搜索
  const handleSearch = useCallback((params: ConfigSearchParams) => {
    setSearchParams(params)
  }, [])

  // 处理重置
  const handleReset = useCallback(() => {
    setSearchParams({})
  }, [])

  // 处理新增配置
  const handleAdd = useCallback(() => {
    setEditingConfig(null)
    setFormDialogOpen(true)
  }, [])

  // 处理编辑配置
  const handleEdit = useCallback((config: Config) => {
    setEditingConfig(config)
    setFormDialogOpen(true)
  }, [])

  // 表单提交成功后刷新
  const handleFormSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className='p-4'>
      {/* 搜索表单 */}
      <ConfigSearchForm
        onSearch={handleSearch}
        onReset={handleReset}
        defaultValues={searchParams}
      />

      {/* 配置数据表格 */}
      <ConfigDataTable
        key={refreshKey}
        searchParams={searchParams}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />

      {/* 配置表单对话框 */}
      <ConfigFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        config={editingConfig}
      />
    </div>
  )
}
