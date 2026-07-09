'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { Role } from '@/features/system/shared/types'
import { RoleDataTable } from './components/role-data-table'
import {
  RoleFormDialog,
  DataScopeDialog,
} from './components/role-dialogs'
import {
  RoleSearchForm,
  type RoleSearchParams,
} from './components/role-search-form'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'

export default function RolePage() {
  const [searchParams, setSearchParams] = useState<RoleSearchParams>({})

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null)
  const [dataScopeDialogOpen, setDataScopeDialogOpen] = useState(false)
  const [dataScopeRole, setDataScopeRole] = useState<Role | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)

  const handleSearch = useCallback((params: RoleSearchParams) => {
    setSearchParams(params)
  }, [])

  const handleReset = useCallback(() => {
    setSearchParams({})
  }, [])

  const handleAdd = useCallback(() => {
    setEditingRoleId(null)
    setFormDialogOpen(true)
  }, [])

  const handleEdit = useCallback((role: Role) => {
    setEditingRoleId(role.roleId)
    setFormDialogOpen(true)
  }, [])

  const handleDataScopeAssign = useCallback((role: Role) => {
    setDataScopeRole(role)
    setDataScopeDialogOpen(true)
  }, [])

  const handleAssignUser = useCallback((role: Role) => {
    toast.success(`分配用户功能开发中，角色：${role.roleName}`)
  }, [])

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
            <h2 className='text-2xl font-bold tracking-tight'>Role Management</h2>
            <p className='text-muted-foreground'>Manage system roles and permissions</p>
          </div>
        </div>

        <RoleSearchForm
          onSearch={handleSearch}
          onReset={handleReset}
          defaultValues={searchParams}
        />

        <RoleDataTable
          key={refreshKey}
          searchParams={searchParams}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDataScopeAssign={handleDataScopeAssign}
          onAssignUser={handleAssignUser}
        />
      </Main>

      <RoleFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        roleId={editingRoleId}
      />

      <DataScopeDialog
        open={dataScopeDialogOpen}
        onOpenChange={setDataScopeDialogOpen}
        onSuccess={handleFormSuccess}
        role={dataScopeRole}
      />
    </>
  )
}