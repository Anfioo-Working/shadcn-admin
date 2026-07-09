'use client'

import { useState, useCallback } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
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
              System Configuration
            </h2>
            <p className='text-muted-foreground'>
              Manage system configurations
            </p>
          </div>
        </div>

        <ConfigSearchForm
          onSearch={handleSearch}
          onReset={handleReset}
          defaultValues={searchParams}
        />

        <ConfigDataTable
          key={refreshKey}
          searchParams={searchParams}
          onAdd={handleAdd}
          onEdit={handleEdit}
        />
      </Main>

      <ConfigFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        config={editingConfig}
      />
    </>
  )
}
