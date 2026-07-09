'use client'

import { useState, useCallback } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import type { Notice } from '@/features/system/shared/types'
import { NoticeDataTable } from './components/notice-data-table'
import { NoticeFormDialog } from './components/notice-dialogs'
import {
  NoticeSearchForm,
  type NoticeSearchParams,
} from './components/notice-search-form'

export default function NoticePage() {
  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<NoticeSearchParams>({})

  // 对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null)

  // 刷新表格的key，用于强制刷新
  const [refreshKey, setRefreshKey] = useState(0)

  // 处理搜索
  const handleSearch = useCallback((params: NoticeSearchParams) => {
    setSearchParams(params)
  }, [])

  // 处理重置
  const handleReset = useCallback(() => {
    setSearchParams({})
  }, [])

  // 处理新增公告
  const handleAdd = useCallback(() => {
    setEditingNoticeId(null)
    setFormDialogOpen(true)
  }, [])

  // 处理编辑公告
  const handleEdit = useCallback((notice: Notice) => {
    setEditingNoticeId(notice.noticeId)
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
              Notification Management
            </h2>
            <p className='text-muted-foreground'>
              Manage notifications and announcements
            </p>
          </div>
        </div>

        <NoticeSearchForm
          onSearch={handleSearch}
          onReset={handleReset}
          defaultValues={searchParams}
        />

        <NoticeDataTable
          key={refreshKey}
          searchParams={searchParams}
          onAdd={handleAdd}
          onEdit={handleEdit}
        />
      </Main>

      <NoticeFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        noticeId={editingNoticeId}
      />
    </>
  )
}
