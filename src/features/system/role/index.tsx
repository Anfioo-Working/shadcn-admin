'use client'

import { useState, useCallback } from 'react'
import type { Role } from '@/features/system/shared/types'
import { RoleDataTable } from './components/role-data-table'
import {
  RoleFormDialog,
  PermissionAssignDialog,
} from './components/role-dialogs'
import {
  RoleSearchForm,
  type RoleSearchParams,
} from './components/role-search-form'

export default function RolePage() {
  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<RoleSearchParams>({})

  // 对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null)
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false)
  const [permissionRole, setPermissionRole] = useState<Role | null>(null)

  // 刷新表格的key，用于强制刷新
  const [refreshKey, setRefreshKey] = useState(0)

  // 处理搜索
  const handleSearch = useCallback((params: RoleSearchParams) => {
    setSearchParams(params)
  }, [])

  // 处理重置
  const handleReset = useCallback(() => {
    setSearchParams({})
  }, [])

  // 处理新增角色
  const handleAdd = useCallback(() => {
    setEditingRoleId(null)
    setFormDialogOpen(true)
  }, [])

  // 处理编辑角色
  const handleEdit = useCallback((role: Role) => {
    setEditingRoleId(role.roleId)
    setFormDialogOpen(true)
  }, [])

  // 处理权限分配
  const handlePermissionAssign = useCallback((role: Role) => {
    setPermissionRole(role)
    setPermissionDialogOpen(true)
  }, [])

  // 表单提交成功后刷新
  const handleFormSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className='p-4'>
      {/* 搜索表单 */}
      <RoleSearchForm
        onSearch={handleSearch}
        onReset={handleReset}
        defaultValues={searchParams}
      />

      {/* 角色数据表格 */}
      <RoleDataTable
        key={refreshKey}
        searchParams={searchParams}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onPermissionAssign={handlePermissionAssign}
      />

      {/* 角色表单对话框 */}
      <RoleFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        roleId={editingRoleId}
      />

      {/* 权限分配对话框 */}
      <PermissionAssignDialog
        open={permissionDialogOpen}
        onOpenChange={setPermissionDialogOpen}
        onSuccess={handleFormSuccess}
        role={permissionRole}
      />
    </div>
  )
}
