'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon, ChevronRightIcon, HelpCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  roleMenuTreeselect,
  roleDeptTreeselect,
  addRole,
  updateRole,
  getRole,
} from '@/features/system/shared/api'
import type {
  Role,
  TreeSelect,
  MenuTreeSelect,
} from '@/features/system/shared/types'
import { roleFormSchema, type RoleFormValues } from '../data/schema'

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  roleId?: number | null
}

// 树形选择器组件
interface TreeCheckboxProps {
  data: TreeSelect[] | MenuTreeSelect[]
  checkedIds: number[]
  onCheckedChange: (ids: number[]) => void
  expandAll?: boolean
  checkStrictly?: boolean
}

function TreeCheckbox({
  data,
  checkedIds,
  onCheckedChange,
  expandAll = false,
  checkStrictly = true,
}: TreeCheckboxProps) {
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set())

  // 获取所有节点ID
  const getAllNodeIds = (nodes: TreeSelect[] | MenuTreeSelect[]): number[] => {
    const ids: number[] = []
    nodes.forEach((node) => {
      ids.push(node.id)
      if (node.children && node.children.length > 0) {
        ids.push(...getAllNodeIds(node.children))
      }
    })
    return ids
  }

  // 获取所有父节点ID
  const getParentIds = (
    nodes: TreeSelect[] | MenuTreeSelect[],
    targetId: number,
    parentIds: number[] = []
  ): number[] => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return parentIds
      }
      if (node.children && node.children.length > 0) {
        const result = getParentIds(node.children, targetId, [
          ...parentIds,
          node.id,
        ])
        if (result.length > 0) {
          return result
        }
      }
    }
    return []
  }

  // 获取所有子节点ID
  const getChildIds = (
    nodes: TreeSelect[] | MenuTreeSelect[],
    targetId: number
  ): number[] => {
    const ids: number[] = []
    for (const node of nodes) {
      if (node.id === targetId) {
        if (node.children && node.children.length > 0) {
          ids.push(...getAllNodeIds(node.children))
        }
        return ids
      }
      if (node.children && node.children.length > 0) {
        const result = getChildIds(node.children, targetId)
        if (result.length > 0) {
          return result
        }
      }
    }
    return ids
  }

  // 查找节点
  const findNode = (
    nodes: TreeSelect[] | MenuTreeSelect[],
    id: number
  ): TreeSelect | MenuTreeSelect | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children && node.children.length > 0) {
        const result = findNode(node.children, id)
        if (result) return result
      }
    }
    return null
  }

  // 初始化展开状态
  React.useEffect(() => {
    void (async () => {
      if (expandAll && data.length > 0) {
        const allIds = getAllNodeIds(data)
        setExpanded(new Set(allIds))
      }
    })()
  }, [expandAll, data])

  const handleToggle = (id: number) => {
    setExpanded((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleCheck = (id: number, checked: boolean) => {
    let newCheckedIds: number[]

    if (checkStrictly) {
      // 父子不联动
      if (checked) {
        newCheckedIds = [...checkedIds, id]
      } else {
        newCheckedIds = checkedIds.filter((i) => i !== id)
      }
    } else {
      // 父子联动
      const childIds = getChildIds(data, id)
      const parentIds = getParentIds(data, id)

      if (checked) {
        // 选中：添加当前节点、所有子节点
        newCheckedIds = [...new Set([...checkedIds, id, ...childIds])]
        // 检查父节点是否需要选中（所有子节点都选中时自动选中父节点）
        for (const parentId of parentIds.reverse()) {
          const parentNode = findNode(data, parentId)
          if (parentNode && parentNode.children) {
            const allChildrenChecked = parentNode.children.every((child) =>
              newCheckedIds.includes(child.id)
            )
            if (allChildrenChecked) {
              newCheckedIds.push(parentId)
            }
          }
        }
      } else {
        // 取消选中：移除当前节点、所有子节点
        newCheckedIds = checkedIds.filter(
          (i) => i !== id && !childIds.includes(i)
        )
      }
    }

    onCheckedChange(newCheckedIds)
  }

  // 全选/全不选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onCheckedChange(getAllNodeIds(data))
    } else {
      onCheckedChange([])
    }
  }

  // 展开/折叠全部
  const handleExpandAll = (expand: boolean) => {
    if (expand) {
      setExpanded(new Set(getAllNodeIds(data)))
    } else {
      setExpanded(new Set())
    }
  }

  const renderNode = (node: TreeSelect | MenuTreeSelect, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.has(node.id)
    const isChecked = checkedIds.includes(node.id)
    const indentStyle = { paddingLeft: `${level * 20 + 8}px` }

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-md py-1.5 transition-colors hover:bg-accent'
          )}
          style={indentStyle}
        >
          {hasChildren ? (
            <button
              className='flex size-4 items-center justify-center'
              onClick={() => handleToggle(node.id)}
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
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) =>
              handleCheck(node.id, checked as boolean)
            }
          />
          <span className='text-sm'>{node.label}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* 工具栏 */}
      <div className='mb-2 flex items-center gap-4 text-sm'>
        <label className='flex cursor-pointer items-center gap-1.5'>
          <Checkbox
            checked={
              checkedIds.length === getAllNodeIds(data).length &&
              data.length > 0
            }
            onCheckedChange={handleSelectAll}
          />
          <span>全选/全不选</span>
        </label>
        <label className='flex cursor-pointer items-center gap-1.5'>
          <Checkbox
            checked={
              expanded.size === getAllNodeIds(data).length && data.length > 0
            }
            onCheckedChange={handleExpandAll}
          />
          <span>展开/折叠</span>
        </label>
      </div>
      {/* 树内容 */}
      <div className='max-h-[300px] overflow-auto rounded-md border p-2'>
        {data.length === 0 ? (
          <div className='py-4 text-center text-muted-foreground'>
            加载中，请稍候
          </div>
        ) : (
          data.map((node) => renderNode(node))
        )}
      </div>
    </div>
  )
}

// 角色表单对话框
export function RoleFormDialog({
  open,
  onOpenChange,
  onSuccess,
  roleId,
}: RoleDialogProps) {
  const [menuTreeData, setMenuTreeData] = React.useState<MenuTreeSelect[]>([])
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!roleId

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      roleId: undefined,
      roleName: '',
      roleKey: '',
      roleSort: 1,
      dataScope: '1',
      status: '0',
      remark: '',
      menuIds: [],
      deptIds: [],
      menuCheckStrictly: true,
      deptCheckStrictly: true,
    },
  })

  // 加载初始化数据
  React.useEffect(() => {
    if (open) {
      loadInitData()
    }
  }, [open, roleId])

  const loadInitData = async () => {
    setLoading(true)
    try {
      // 如果是编辑模式，加载角色详情和菜单树
      if (roleId) {
        const roleRes = await getRole(roleId)
        if (roleRes.code === 200 && roleRes.data) {
          // 加载角色菜单树
          const menuRes = await roleMenuTreeselect(roleId)
          if (menuRes.code === 200) {
            setMenuTreeData(menuRes.data)
          }

          form.reset({
            roleId: roleRes.data.roleId,
            roleName: roleRes.data.roleName,
            roleKey: roleRes.data.roleKey,
            roleSort: roleRes.data.roleSort,
            dataScope: roleRes.data.dataScope || '1',
            status: roleRes.data.status as '0' | '1',
            remark: roleRes.data.remark || '',
            menuIds: roleRes.data.menuIds || [],
            deptIds: roleRes.data.deptIds || [],
            menuCheckStrictly: roleRes.data.menuCheckStrictly ?? true,
            deptCheckStrictly: roleRes.data.deptCheckStrictly ?? true,
          })
        }
      } else {
        // 新增模式，加载菜单树
        const menuRes = await roleMenuTreeselect(0)
        if (menuRes.code === 200) {
          setMenuTreeData(menuRes.data)
        }

        form.reset({
          roleId: undefined,
          roleName: '',
          roleKey: '',
          roleSort: 1,
          dataScope: '1',
          status: '0',
          remark: '',
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: RoleFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updateRole({
          roleId: values.roleId,
          roleName: values.roleName,
          roleKey: values.roleKey,
          roleSort: values.roleSort,
          dataScope: values.dataScope,
          status: values.status,
          remark: values.remark || '',
          menuIds: values.menuIds,
          deptIds: values.deptIds,
          menuCheckStrictly: values.menuCheckStrictly,
          deptCheckStrictly: values.deptCheckStrictly,
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addRole({
          roleName: values.roleName,
          roleKey: values.roleKey,
          roleSort: values.roleSort,
          dataScope: values.dataScope,
          status: values.status,
          remark: values.remark || '',
          menuIds: values.menuIds,
          deptIds: values.deptIds,
          menuCheckStrictly: values.menuCheckStrictly,
          deptCheckStrictly: values.deptCheckStrictly,
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? '修改角色' : '新增角色'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4 py-4'>
            {/* 角色名称 */}
            <FormItem>
              <FormLabel>角色名称</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入角色名称'
                  {...form.register('roleName')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 权限字符 */}
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                权限字符
                <HelpCircleIcon className='size-4 text-muted-foreground' />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入权限字符'
                  {...form.register('roleKey')}
                />
              </FormControl>
              <FormDescription>
                控制器中定义的权限字符，如：@SaCheckRole('admin')
              </FormDescription>
              <FormMessage />
            </FormItem>

            {/* 显示顺序 */}
            <FormItem>
              <FormLabel>显示顺序</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='请输入显示顺序'
                  value={form.watch('roleSort')}
                  onChange={(e) =>
                    form.setValue('roleSort', Number(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 状态 */}
            <FormItem>
              <FormLabel>状态</FormLabel>
              <FormControl>
                <RadioGroup
                  value={form.watch('status')}
                  onValueChange={(v) => form.setValue('status', v as '0' | '1')}
                  className='flex items-center gap-4'
                >
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <RadioGroupItem value='0' />
                    </FormControl>
                    <FormLabel className='font-normal'>正常</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <RadioGroupItem value='1' />
                    </FormControl>
                    <FormLabel className='font-normal'>停用</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 菜单权限 */}
            <FormItem className='col-span-2'>
              <FormLabel>菜单权限</FormLabel>
              <FormControl>
                <TreeCheckbox
                  data={menuTreeData}
                  checkedIds={form.watch('menuIds')}
                  onCheckedChange={(ids) => form.setValue('menuIds', ids)}
                  checkStrictly={form.watch('menuCheckStrictly')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 备注 */}
            <FormItem className='col-span-2'>
              <FormLabel>备注</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='请输入内容'
                  {...form.register('remark')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type='submit' disabled={loading}>
              确定
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// 权限分配对话框
interface PermissionAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  role: Role | null
}

export function PermissionAssignDialog({
  open,
  onOpenChange,
  onSuccess,
  role,
}: PermissionAssignDialogProps) {
  const [menuTreeData, setMenuTreeData] = React.useState<MenuTreeSelect[]>([])
  const [deptTreeData, setDeptTreeData] = React.useState<TreeSelect[]>([])
  const [dataScope, setDataScope] = React.useState('1')
  const [menuIds, setMenuIds] = React.useState<number[]>([])
  const [deptIds, setDeptIds] = React.useState<number[]>([])
  const [loading, setLoading] = React.useState(false)

  // 数据范围选项
  const dataScopeOptions = [
    { value: '1', label: '全部数据权限' },
    { value: '2', label: '自定义数据权限' },
    { value: '3', label: '本部门数据权限' },
    { value: '4', label: '本部门及以下数据权限' },
    { value: '5', label: '仅本人数据权限' },
  ]

  // 加载初始化数据
  React.useEffect(() => {
    void (async () => {
      if (open && role) {
        setLoading(true)
        try {
          // 加载角色菜单树
          const menuRes = await roleMenuTreeselect(role.roleId)
          if (menuRes.code === 200) {
            setMenuTreeData(menuRes.data)
          }

          // 加载角色部门树
          const deptRes = await roleDeptTreeselect(role.roleId)
          if (deptRes.code === 200) {
            setDeptTreeData(deptRes.data)
          }

          // 设置初始值
          setDataScope(role.dataScope)
          setMenuIds(role.menuIds || [])
          setDeptIds(role.deptIds || [])
        } finally {
          setLoading(false)
        }
      }
    })()
  }, [open, role])

  const onSubmit = async () => {
    if (!role) return
    setLoading(true)
    try {
      const res = await updateRole({
        roleId: role.roleId,
        roleName: role.roleName,
        roleKey: role.roleKey,
        roleSort: role.roleSort,
        dataScope: dataScope,
        status: role.status,
        remark: role.remark,
        menuIds: menuIds,
        deptIds: deptIds,
        menuCheckStrictly: role.menuCheckStrictly,
        deptCheckStrictly: role.deptCheckStrictly,
      })
      if (res.code === 200) {
        onSuccess()
        onOpenChange(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>分配数据权限</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {/* 角色名称 */}
          <FormItem>
            <FormLabel>角色名称</FormLabel>
            <FormControl>
              <Input value={role?.roleName || ''} disabled />
            </FormControl>
          </FormItem>

          {/* 权限字符 */}
          <FormItem>
            <FormLabel>权限字符</FormLabel>
            <FormControl>
              <Input value={role?.roleKey || ''} disabled />
            </FormControl>
          </FormItem>

          {/* 权限范围 */}
          <FormItem>
            <FormLabel>权限范围</FormLabel>
            <FormControl>
              <Select value={dataScope} onValueChange={setDataScope}>
                <SelectTrigger>
                  <SelectValue placeholder='请选择权限范围' />
                </SelectTrigger>
                <SelectContent>
                  {dataScopeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>

          {/* 菜单权限 */}
          <FormItem>
            <FormLabel>菜单权限</FormLabel>
            <FormControl>
              <TreeCheckbox
                data={menuTreeData}
                checkedIds={menuIds}
                onCheckedChange={setMenuIds}
              />
            </FormControl>
          </FormItem>

          {/* 数据权限 - 仅自定义数据权限时显示 */}
          {dataScope === '2' && (
            <FormItem>
              <FormLabel>数据权限</FormLabel>
              <FormControl>
                <TreeCheckbox
                  data={deptTreeData}
                  checkedIds={deptIds}
                  onCheckedChange={setDeptIds}
                  expandAll={true}
                />
              </FormControl>
            </FormItem>
          )}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
