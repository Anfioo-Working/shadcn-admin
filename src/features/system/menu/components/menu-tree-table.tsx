'use client'

import * as React from 'react'
import { useState, useCallback, useMemo } from 'react'
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  FileTextIcon,
  SquareIcon,
  EyeIcon,
  EyeOffIcon,
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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { menuList, deleteMenu } from '@/features/system/shared/api'
import type { Menu } from '@/features/system/shared/types'

interface MenuTreeTableProps {
  onAdd: () => void
  onEdit: (menu: Menu) => void
  onAddChild: (parentMenu: Menu) => void
}

// 获取图标组件
function getIconComponent(iconName: string) {
  // 根据 icon 名称返回对应图标
  const iconMap: Record<string, React.ReactNode> = {
    system: <FolderIcon className='size-4' />,
    monitor: <FolderIcon className='size-4' />,
    user: <FileTextIcon className='size-4' />,
    peoples: <FileTextIcon className='size-4' />,
    'tree-table': <FileTextIcon className='size-4' />,
    tree: <FileTextIcon className='size-4' />,
    post: <FileTextIcon className='size-4' />,
    dict: <FileTextIcon className='size-4' />,
    edit: <FileTextIcon className='size-4' />,
    message: <FileTextIcon className='size-4' />,
  }
  return iconMap[iconName] || <FileTextIcon className='size-4' />
}

// 获取菜单类型图标
function getMenuTypeIcon(menuType: string) {
  switch (menuType) {
    case 'M':
      return <FolderIcon className='size-4 text-primary' />
    case 'C':
      return <FileTextIcon className='text-success size-4' />
    case 'F':
      return <SquareIcon className='text-warning size-4' />
    default:
      return null
  }
}

// 展平菜单树为列表（带层级信息）
function flattenMenuTree(
  menus: Menu[],
  level: number = 0,
  parentId: number = 0
): FlatMenu[] {
  const result: FlatMenu[] = []
  menus.forEach((menu) => {
    result.push({ ...menu, level, parentId })
    if (menu.children && menu.children.length > 0) {
      result.push(...flattenMenuTree(menu.children, level + 1, menu.menuId))
    }
  })
  return result
}

interface FlatMenu extends Menu {
  level: number
  parentId: number
}

export function MenuTreeTable({
  onAdd,
  onEdit,
  onAddChild,
}: MenuTreeTableProps) {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null)

  // 加载菜单列表
  const loadMenus = useCallback(async () => {
    setLoading(true)
    try {
      const res = await menuList({})
      if (res.code === 200) {
        setMenus(res.data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // 收集所有子菜单ID
  const collectChildIds = (children: Menu[], ids: Set<number>) => {
    children.forEach((child) => {
      if (child.children && child.children.length > 0) {
        ids.add(child.menuId)
        collectChildIds(child.children, ids)
      }
    })
  }

  React.useEffect(() => {
    void (async () => {
      loadMenus()
    })()
  }, [loadMenus])

  // 展开/折叠所有
  const [isAllExpanded, setIsAllExpanded] = useState(false)

  const handleToggleAll = useCallback(() => {
    if (isAllExpanded) {
      setExpandedIds(new Set())
      setIsAllExpanded(false)
    } else {
      const allIds = new Set<number>()
      menus.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          allIds.add(menu.menuId)
          collectChildIds(menu.children, allIds)
        }
      })
      setExpandedIds(allIds)
      setIsAllExpanded(true)
    }
  }, [isAllExpanded, menus, collectChildIds])

  // 展开/折叠单个节点
  const handleToggle = useCallback((menuId: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        newSet.add(menuId)
      }
      return newSet
    })
  }, [])

  // 删除操作
  const handleDeleteClick = (menu: Menu) => {
    setDeleteTarget(menu)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const res = await deleteMenu(deleteTarget.menuId)
    if (res.code === 200) {
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      loadMenus()
    }
  }

  // 过滤显示的菜单（根据展开状态）
  const visibleMenus = useMemo(() => {
    const flatMenus = flattenMenuTree(menus)
    const result: FlatMenu[] = []

    flatMenus.forEach((menu) => {
      // 如果是根节点（parentId === 0），总是显示
      if (menu.parentId === 0) {
        result.push(menu)
        return
      }

      // 检查父节点是否展开
      let currentParentId = menu.parentId
      let allParentsExpanded = true

      while (currentParentId !== 0 && allParentsExpanded) {
        if (!expandedIds.has(currentParentId)) {
          allParentsExpanded = false
        }
        // 找到父节点的 parentId
        const parent = flatMenus.find((m) => m.menuId === currentParentId)
        if (parent) {
          currentParentId = parent.parentId
        } else {
          break
        }
      }

      if (allParentsExpanded) {
        result.push(menu)
      }
    })

    return result
  }, [menus, expandedIds])

  return (
    <Card>
      <CardHeader className='border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={onAdd}>
            <PlusIcon className='size-4' />
            新增
          </Button>
          <Button variant='outline' onClick={handleToggleAll}>
            {isAllExpanded ? '折叠' : '展开'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[200px]'>菜单名称</TableHead>
              <TableHead className='w-[100px]'>图标</TableHead>
              <TableHead className='w-[80px]'>排序</TableHead>
              <TableHead>权限标识</TableHead>
              <TableHead>组件路径</TableHead>
              <TableHead className='w-[80px]'>状态</TableHead>
              <TableHead className='w-[160px]'>创建时间</TableHead>
              <TableHead className='w-[180px]'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='py-8 text-center text-muted-foreground'
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : visibleMenus.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='py-8 text-center text-muted-foreground'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              visibleMenus.map((menu) => {
                const hasChildren = menu.children && menu.children.length > 0
                const isExpanded = expandedIds.has(menu.menuId)

                return (
                  <TableRow key={menu.menuId}>
                    <TableCell>
                      <div
                        className='flex items-center gap-2'
                        style={{ paddingLeft: `${menu.level * 24}px` }}
                      >
                        {/* 展开/折叠按钮 */}
                        {hasChildren ? (
                          <button
                            className='flex size-4 items-center justify-center rounded hover:bg-accent'
                            onClick={() => handleToggle(menu.menuId)}
                          >
                            {isExpanded ? (
                              <ChevronDownIcon className='size-4 text-muted-foreground' />
                            ) : (
                              <ChevronRightIcon className='size-4 text-muted-foreground' />
                            )}
                          </button>
                        ) : (
                          <span className='size-4' />
                        )}
                        {/* 菜单类型图标 */}
                        {getMenuTypeIcon(menu.menuType)}
                        {/* 菜单名称 */}
                        <span>{menu.menuName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {menu.icon ? (
                        <div className='flex items-center justify-center'>
                          {getIconComponent(menu.icon)}
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>-</span>
                      )}
                    </TableCell>
                    <TableCell>{menu.orderNum}</TableCell>
                    <TableCell>
                      {menu.perms || (
                        <span className='text-muted-foreground'>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {menu.component || (
                        <span className='text-muted-foreground'>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={menu.visible === '0' ? 'default' : 'secondary'}
                      >
                        {menu.visible === '0' ? (
                          <EyeIcon className='mr-1 size-3' />
                        ) : (
                          <EyeOffIcon className='mr-1 size-3' />
                        )}
                        {menu.visible === '0' ? '显示' : '隐藏'}
                      </Badge>
                    </TableCell>
                    <TableCell>{menu.createTime}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onEdit(menu)}
                          className='h-7 px-2'
                        >
                          <PencilIcon className='size-3.5' />
                          修改
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onAddChild(menu)}
                          className='h-7 px-2'
                        >
                          <PlusIcon className='size-3.5' />
                          新增
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteClick(menu)}
                          className='h-7 px-2'
                        >
                          <Trash2Icon className='size-3.5' />
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              是否确认删除名称为 "{deleteTarget?.menuName}" 的菜单数据项？
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
