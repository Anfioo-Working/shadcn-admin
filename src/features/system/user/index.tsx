'use client'

import { useState, useCallback } from 'react'
import type { User } from '@/features/system/shared/types'
import { DeptTree } from './components/dept-tree'
import { UserDataTable } from './components/user-data-table'
import { UserFormDialog, ResetPasswordDialog } from './components/user-dialogs'
import {
  UserSearchForm,
  type UserSearchParams,
} from './components/user-search-form'

export default function UserPage() {
  // 部门选择状态
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(
    undefined
  )

  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<UserSearchParams>({})

  // 对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null)

  // 刷新表格的key，用于强制刷新
  const [refreshKey, setRefreshKey] = useState(0)

  // 处理部门选择
  const handleDeptSelect = useCallback((deptId: number | undefined) => {
    setSelectedDeptId(deptId)
  }, [])

  // 处理搜索
  const handleSearch = useCallback((params: UserSearchParams) => {
    setSearchParams(params)
  }, [])

  // 处理重置
  const handleReset = useCallback(() => {
    setSearchParams({})
  }, [])

  // 处理新增用户
  const handleAdd = useCallback(() => {
    setEditingUserId(null)
    setFormDialogOpen(true)
  }, [])

  // 处理编辑用户
  const handleEdit = useCallback((user: User) => {
    setEditingUserId(user.userId)
    setFormDialogOpen(true)
  }, [])

  // 处理重置密码
  const handleResetPassword = useCallback((user: User) => {
    setResetPasswordUser(user)
    setResetPasswordDialogOpen(true)
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

        {/* 右侧用户表格 - 80% 宽度 */}
        <div className='flex-1'>
          {/* 搜索表单 */}
          <UserSearchForm
            onSearch={handleSearch}
            onReset={handleReset}
            defaultValues={searchParams}
          />

          {/* 用户数据表格 */}
          <UserDataTable
            key={refreshKey}
            searchParams={searchParams}
            deptId={selectedDeptId}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onResetPassword={handleResetPassword}
          />
        </div>
      </div>

      {/* 用户表单对话框 */}
      <UserFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        userId={editingUserId}
      />

      {/* 重置密码对话框 */}
      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
        onSuccess={handleFormSuccess}
        user={resetPasswordUser}
      />
    </div>
  )
}
