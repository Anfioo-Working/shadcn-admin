'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  HelpCircleIcon,
  FolderIcon,
  FileTextIcon,
  SquareIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
  TreeDeciduousIcon,
  FileIcon,
  EditIcon,
  MailIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  ActivityIcon,
  ServerIcon,
  HardDriveIcon,
  GlobeIcon,
  KeyIcon,
  LinkIcon,
  AppWindowIcon,
  BuildingIcon,
  HomeIcon,
  SearchIcon,
  RefreshCwIcon,
  ClockIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  menuTreeselect,
  getMenu,
  addMenu,
  updateMenu,
} from '@/features/system/shared/api'
import type { MenuTreeSelect } from '@/features/system/shared/types'
import { menuFormSchema, type MenuFormValues } from '../data/schema'

interface MenuFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  menuId?: number | null
  parentId?: number
}

// 可用的图标列表
const availableIcons = [
  { name: 'system', icon: <SettingsIcon className='size-4' />, label: '系统' },
  { name: 'monitor', icon: <ActivityIcon className='size-4' />, label: '监控' },
  { name: 'user', icon: <UserIcon className='size-4' />, label: '用户' },
  { name: 'peoples', icon: <UsersIcon className='size-4' />, label: '人员' },
  { name: 'tree-table', icon: <FileIcon className='size-4' />, label: '树表' },
  { name: 'tree', icon: <TreeDeciduousIcon className='size-4' />, label: '树' },
  { name: 'post', icon: <BuildingIcon className='size-4' />, label: '岗位' },
  { name: 'dict', icon: <DatabaseIcon className='size-4' />, label: '字典' },
  { name: 'edit', icon: <EditIcon className='size-4' />, label: '编辑' },
  { name: 'message', icon: <MailIcon className='size-4' />, label: '消息' },
  {
    name: 'shield',
    icon: <ShieldCheckIcon className='size-4' />,
    label: '权限',
  },
  { name: 'server', icon: <ServerIcon className='size-4' />, label: '服务' },
  {
    name: 'hard-drive',
    icon: <HardDriveIcon className='size-4' />,
    label: '存储',
  },
  { name: 'globe', icon: <GlobeIcon className='size-4' />, label: '全球' },
  { name: 'key', icon: <KeyIcon className='size-4' />, label: '钥匙' },
  { name: 'link', icon: <LinkIcon className='size-4' />, label: '链接' },
  { name: 'window', icon: <AppWindowIcon className='size-4' />, label: '窗口' },
  { name: 'home', icon: <HomeIcon className='size-4' />, label: '首页' },
  { name: 'search', icon: <SearchIcon className='size-4' />, label: '搜索' },
  {
    name: 'refresh',
    icon: <RefreshCwIcon className='size-4' />,
    label: '刷新',
  },
  { name: 'clock', icon: <ClockIcon className='size-4' />, label: '时钟' },
]

// 图标选择器组件
function IconSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const selectedIcon = availableIcons.find((i) => i.name === value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-full justify-start gap-2'>
          {selectedIcon ? selectedIcon.icon : <SquareIcon className='size-4' />}
          {selectedIcon?.label || '请选择图标'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[280px] p-2' align='start'>
        <div className='grid grid-cols-4 gap-2'>
          {availableIcons.map((icon) => (
            <Button
              key={icon.name}
              variant={value === icon.name ? 'default' : 'outline'}
              size='sm'
              className='h-8 w-8 p-0'
              onClick={() => onChange(icon.name)}
              title={icon.label}
            >
              {icon.icon}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// 上级菜单树选择组件
function MenuTreeSelect({
  data,
  value,
  onChange,
}: {
  data: MenuTreeSelect[]
  value: number
  onChange: (value: number) => void
}) {
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set([0]))

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

  const findSelectedLabel = (
    nodes: MenuTreeSelect[],
    targetId: number
  ): string | null => {
    for (const node of nodes) {
      if (node.id === targetId) return node.label
      if (node.children && node.children.length > 0) {
        const result = findSelectedLabel(node.children, targetId)
        if (result) return result
      }
    }
    return null
  }

  const selectedLabel =
    value === 0 ? '主类目' : findSelectedLabel(data, value) || '请选择上级菜单'

  const renderNode = (node: MenuTreeSelect, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.has(node.id)
    const isSelected = value === node.id

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
            isSelected
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent',
            level > 0 && `pl-[${level * 16 + 8}px]`
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onChange(node.id)}
        >
          {hasChildren ? (
            <button
              className={cn(
                'flex size-4 items-center justify-center',
                isSelected && 'text-primary-foreground'
              )}
              onClick={(e) => {
                e.stopPropagation()
                handleToggle(node.id)
              }}
            >
              {isExpanded ? (
                <ChevronDownIcon className='size-4' />
              ) : (
                <ChevronRightIcon className='size-4' />
              )}
            </button>
          ) : (
            <span className='size-4' />
          )}
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-full justify-start'>
          {selectedLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-2' align='start'>
        <div className='max-h-[300px] overflow-auto'>
          {/* 添加主类目节点 */}
          <div
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
              value === 0
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            )}
            onClick={() => onChange(0)}
          >
            <span className='size-4' />
            <span className='text-sm font-medium'>主类目</span>
          </div>
          {data.map((node) => renderNode(node))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// 菜单表单对话框
export function MenuFormDialog({
  open,
  onOpenChange,
  onSuccess,
  menuId,
  parentId,
}: MenuFormDialogProps) {
  const [menuTreeData, setMenuTreeData] = React.useState<MenuTreeSelect[]>([])
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!menuId

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      menuId: undefined,
      parentId: 0,
      menuName: '',
      menuType: 'M',
      icon: '',
      orderNum: 0,
      path: '',
      component: '',
      queryParam: '',
      isFrame: '1',
      isCache: '0',
      visible: '0',
      status: '0',
      perms: '',
      remark: '',
    },
  })

  const menuType = form.watch('menuType')

  // 加载初始化数据
  React.useEffect(() => {
    if (open) {
      loadInitData()
    }
  }, [open, menuId, parentId])

  const loadInitData = async () => {
    setLoading(true)
    try {
      // 加载菜单树选择数据
      const treeRes = await menuTreeselect()
      if (treeRes.code === 200) {
        setMenuTreeData(treeRes.data)
      }

      // 如果是编辑模式，加载菜单详情
      if (menuId) {
        const menuRes = await getMenu(menuId)
        if (menuRes.code === 200 && menuRes.data) {
          form.reset({
            menuId: menuRes.data.menuId,
            parentId: menuRes.data.parentId,
            menuName: menuRes.data.menuName,
            menuType: menuRes.data.menuType as 'M' | 'C' | 'F',
            icon: menuRes.data.icon || '',
            orderNum: menuRes.data.orderNum,
            path: menuRes.data.path || '',
            component: menuRes.data.component || '',
            queryParam: menuRes.data.queryParam || '',
            isFrame: menuRes.data.isFrame as '0' | '1',
            isCache: menuRes.data.isCache as '0' | '1',
            visible: menuRes.data.visible as '0' | '1',
            status: menuRes.data.status as '0' | '1',
            perms: menuRes.data.perms || '',
            remark: menuRes.data.remark || '',
          })
        }
      } else {
        // 新增模式
        form.reset({
          menuId: undefined,
          parentId: parentId || 0,
          menuName: '',
          menuType: 'M',
          icon: '',
          orderNum: 0,
          path: '',
          component: '',
          queryParam: '',
          isFrame: '1',
          isCache: '0',
          visible: '0',
          status: '0',
          perms: '',
          remark: '',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: MenuFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updateMenu({
          menuId: values.menuId,
          menuName: values.menuName,
          parentId: values.parentId,
          menuType: values.menuType,
          icon: values.icon,
          orderNum: values.orderNum,
          path: values.path,
          component: values.component,
          queryParam: values.queryParam,
          isFrame: values.isFrame,
          isCache: values.isCache,
          visible: values.visible,
          status: values.status,
          perms: values.perms,
          remark: values.remark,
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addMenu({
          menuName: values.menuName,
          parentId: values.parentId,
          menuType: values.menuType,
          icon: values.icon,
          orderNum: values.orderNum,
          path: values.path,
          component: values.component,
          queryParam: values.queryParam,
          isFrame: values.isFrame,
          isCache: values.isCache,
          visible: values.visible,
          status: values.status,
          perms: values.perms,
          remark: values.remark,
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
      <DialogContent className='max-w-[750px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? '修改菜单' : '新增菜单'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4 py-4'>
            {/* 上级菜单 */}
            <FormItem>
              <FormLabel>上级菜单</FormLabel>
              <FormControl>
                <MenuTreeSelect
                  data={menuTreeData}
                  value={form.watch('parentId')}
                  onChange={(value) => form.setValue('parentId', value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 菜单类型 */}
            <FormItem>
              <FormLabel>菜单类型</FormLabel>
              <FormControl>
                <RadioGroup
                  value={form.watch('menuType')}
                  onValueChange={(v) =>
                    form.setValue('menuType', v as 'M' | 'C' | 'F')
                  }
                  className='flex items-center gap-6'
                >
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <RadioGroupItem value='M' />
                    </FormControl>
                    <FormLabel className='flex items-center gap-1 font-normal'>
                      <FolderIcon className='size-4' />
                      目录
                    </FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <RadioGroupItem value='C' />
                    </FormControl>
                    <FormLabel className='flex items-center gap-1 font-normal'>
                      <FileTextIcon className='size-4' />
                      菜单
                    </FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <RadioGroupItem value='F' />
                    </FormControl>
                    <FormLabel className='flex items-center gap-1 font-normal'>
                      <SquareIcon className='size-4' />
                      按钮
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 菜单图标 - 目录和菜单时显示 */}
            {menuType !== 'F' && (
              <FormItem>
                <FormLabel>菜单图标</FormLabel>
                <FormControl>
                  <IconSelector
                    value={form.watch('icon')}
                    onChange={(value) => form.setValue('icon', value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}

            {/* 菜单名称 */}
            <FormItem>
              <FormLabel>菜单名称</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入菜单名称'
                  {...form.register('menuName')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 显示排序 */}
            <FormItem>
              <FormLabel>显示排序</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='请输入显示排序'
                  value={form.watch('orderNum')}
                  onChange={(e) =>
                    form.setValue('orderNum', Number(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 是否外链 - 目录和菜单时显示 */}
            {menuType !== 'F' && (
              <FormItem>
                <FormLabel className='flex items-center gap-1'>
                  是否外链
                  <HelpCircleIcon className='size-4 text-muted-foreground' />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={form.watch('isFrame')}
                    onValueChange={(v) =>
                      form.setValue('isFrame', v as '0' | '1')
                    }
                    className='flex items-center gap-6'
                  >
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <RadioGroupItem value='0' />
                      </FormControl>
                      <FormLabel className='font-normal'>是</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <RadioGroupItem value='1' />
                      </FormControl>
                      <FormLabel className='font-normal'>否</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  选择是外链则路由地址需要以 http(s):// 开头
                </FormDescription>
              </FormItem>
            )}

            {/* 路由地址 - 目录和菜单时显示 */}
            {menuType !== 'F' && (
              <FormItem>
                <FormLabel className='flex items-center gap-1'>
                  路由地址
                  <HelpCircleIcon className='size-4 text-muted-foreground' />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='请输入路由地址'
                    {...form.register('path')}
                  />
                </FormControl>
                <FormDescription>
                  访问的路由地址，如：user，如外网地址需内链访问则以 http(s)://
                  开头
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}

            {/* 组件路径 - 仅菜单时显示 */}
            {menuType === 'C' && (
              <FormItem>
                <FormLabel className='flex items-center gap-1'>
                  组件路径
                  <HelpCircleIcon className='size-4 text-muted-foreground' />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='请输入组件路径'
                    {...form.register('component')}
                  />
                </FormControl>
                <FormDescription>
                  访问的组件路径，如：system/user/index，默认在 views 目录下
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}

            {/* 权限标识 - 菜单和按钮时显示 */}
            {menuType !== 'M' && (
              <FormItem>
                <FormLabel className='flex items-center gap-1'>
                  权限标识
                  <HelpCircleIcon className='size-4 text-muted-foreground' />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='请输入权限标识'
                    maxLength={100}
                    {...form.register('perms')}
                  />
                </FormControl>
                <FormDescription>
                  控制器中定义的权限字符，如：@SaCheckPermission('system:user:list')
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}

            {/* 是否缓存 - 仅菜单时显示 */}
            {menuType === 'C' && (
              <FormItem>
                <FormLabel className='flex items-center gap-1'>
                  是否缓存
                  <HelpCircleIcon className='size-4 text-muted-foreground' />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={form.watch('isCache')}
                    onValueChange={(v) =>
                      form.setValue('isCache', v as '0' | '1')
                    }
                    className='flex items-center gap-6'
                  >
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <RadioGroupItem value='0' />
                      </FormControl>
                      <FormLabel className='font-normal'>缓存</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <RadioGroupItem value='1' />
                      </FormControl>
                      <FormLabel className='font-normal'>不缓存</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  选择是则会被 keep-alive 缓存，需要匹配组件的 name
                  和地址保持一致
                </FormDescription>
              </FormItem>
            )}

            {/* 显示状态 - 目录和菜单时显示 */}
            {menuType !== 'F' && (
              <FormItem>
                <FormLabel className='flex items-center gap-1'>
                  显示状态
                  <HelpCircleIcon className='size-4 text-muted-foreground' />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={form.watch('visible')}
                    onValueChange={(v) =>
                      form.setValue('visible', v as '0' | '1')
                    }
                    className='flex items-center gap-6'
                  >
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <RadioGroupItem value='0' />
                      </FormControl>
                      <FormLabel className='font-normal'>显示</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <RadioGroupItem value='1' />
                      </FormControl>
                      <FormLabel className='font-normal'>隐藏</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  选择隐藏则路由将不会出现在侧边栏，但仍然可以访问
                </FormDescription>
              </FormItem>
            )}

            {/* 菜单状态 */}
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                菜单状态
                <HelpCircleIcon className='size-4 text-muted-foreground' />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={form.watch('status')}
                  onValueChange={(v) => form.setValue('status', v as '0' | '1')}
                  className='flex items-center gap-6'
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
              <FormDescription>
                选择停用则路由将不会出现在侧边栏，也不能被访问
              </FormDescription>
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
