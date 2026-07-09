'use client'

import { useState, useCallback } from 'react'
import type { Post } from '@/features/system/shared/types'
import { DeptTree } from './components/dept-tree'
import { PostDataTable } from './components/post-data-table'
import { PostFormDialog } from './components/post-dialogs'
import {
  PostSearchForm,
  type PostSearchParams,
} from './components/post-search-form'

export default function PostPage() {
  // 部门选择状态
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(
    undefined
  )

  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<PostSearchParams>({})

  // 对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)

  // 刷新表格的key，用于强制刷新
  const [refreshKey, setRefreshKey] = useState(0)

  // 处理部门选择
  const handleDeptSelect = useCallback((deptId: number | undefined) => {
    setSelectedDeptId(deptId)
  }, [])

  // 处理搜索
  const handleSearch = useCallback((params: PostSearchParams) => {
    setSearchParams(params)
  }, [])

  // 处理重置
  const handleReset = useCallback(() => {
    setSearchParams({})
  }, [])

  // 处理新增岗位
  const handleAdd = useCallback(() => {
    setEditingPostId(null)
    setFormDialogOpen(true)
  }, [])

  // 处理编辑岗位
  const handleEdit = useCallback((post: Post) => {
    setEditingPostId(post.postId)
    setFormDialogOpen(true)
  }, [])

  // 表单提交成功后刷新
  const handleFormSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className='p-4'>
      <div className='flex gap-4'>
        {/* 左侧部门树 - 20% 宽度 */}
        <div className='w-[20%] min-w-[200px]'>
          <DeptTree
            onDeptSelect={handleDeptSelect}
            selectedDeptId={selectedDeptId}
          />
        </div>

        {/* 右侧岗位表格 - 80% 宽度 */}
        <div className='flex-1'>
          {/* 搜索表单 */}
          <PostSearchForm
            onSearch={handleSearch}
            onReset={handleReset}
            defaultValues={searchParams}
          />

          {/* 岗位数据表格 */}
          <PostDataTable
            key={refreshKey}
            searchParams={searchParams}
            deptId={selectedDeptId}
            onAdd={handleAdd}
            onEdit={handleEdit}
          />
        </div>
      </div>

      {/* 岗位表单对话框 */}
      <PostFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        postId={editingPostId}
      />
    </div>
  )
}
