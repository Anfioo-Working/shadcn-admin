'use client'

import { useState, useCallback } from 'react'
import type { Menu } from '@/features/system/shared/types'
import { MenuFormDialog } from './components/menu-dialogs'
import { MenuTreeTable } from './components/menu-tree-table'

export default function MenuPage() {
  // 对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null)
  const [addingParentId, setAddingParentId] = useState<number | undefined>(
    undefined
  )

  // 刷新表格的key，用于强制刷新
  const [refreshKey, setRefreshKey] = useState(0)

  // 处理新增菜单
  const handleAdd = useCallback(() => {
    setEditingMenuId(null)
    setAddingParentId(undefined)
    setFormDialogOpen(true)
  }, [])

  // 处理编辑菜单
  const handleEdit = useCallback((menu: Menu) => {
    setEditingMenuId(menu.menuId)
    setAddingParentId(undefined)
    setFormDialogOpen(true)
  }, [])

  // 处理新增子菜单
  const handleAddChild = useCallback((parentMenu: Menu) => {
    setEditingMenuId(null)
    setAddingParentId(parentMenu.menuId)
    setFormDialogOpen(true)
  }, [])

  // 表单提交成功后刷新
  const handleFormSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className='p-4'>
      {/* 菜单树形表格 */}
      <MenuTreeTable
        key={refreshKey}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onAddChild={handleAddChild}
      />

      {/* 菜单表单对话框 */}
      <MenuFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
        menuId={editingMenuId}
        parentId={addingParentId}
      />
    </div>
  )
}
