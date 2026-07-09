'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
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
import {
  deptTreeselect,
  addDept,
  updateDept,
  getDept,
} from '@/features/system/shared/api'
import type { TreeSelect } from '@/features/system/shared/types'
import { deptFormSchema, type DeptFormValues } from '../data/schema'

interface DeptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  deptId?: number | null
  parentId?: number // 用于新增子部门时设置默认父部门
}

// Mock 用户列表数据
const mockUsers = [
  { userId: 1, userName: '若依' },
  { userId: 2, userName: '张三' },
  { userId: 3, userName: '李四' },
  { userId: 4, userName: '王五' },
  { userId: 5, userName: '赵六' },
  { userId: 6, userName: '孙七' },
  { userId: 7, userName: '周八' },
  { userId: 8, userName: '吴九' },
  { userId: 9, userName: '郑十' },
  { userId: 10, userName: '访客用户' },
]

// 树形选择组件
interface TreeSelectComponentProps {
  data: TreeSelect[]
  value: number
  onChange: (value: number) => void
  placeholder?: string
}

function TreeSelectComponent({
  data,
  value,
  onChange,
  placeholder,
}: TreeSelectComponentProps) {
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set())
  const [selectedValue, setSelectedValue] = React.useState<number>(value)
  const [open, setOpen] = React.useState(false)

  // 获取所有节点ID
  const getAllNodeIds = (nodes: TreeSelect[]): number[] => {
    const ids: number[] = []
    nodes.forEach((node) => {
      ids.push(node.id)
      if (node.children && node.children.length > 0) {
        ids.push(...getAllNodeIds(node.children))
      }
    })
    return ids
  }

  // 初始化展开状态
  React.useEffect(() => {
    void (async () => {
      const allIds = getAllNodeIds(data)
      setExpanded(new Set(allIds))
    })()
  }, [data])

  // 查找节点名称
  const findNodeLabel = (nodes: TreeSelect[], id: number): string => {
    for (const node of nodes) {
      if (node.id === id) return node.label
      if (node.children && node.children.length > 0) {
        const result = findNodeLabel(node.children, id)
        if (result) return result
      }
    }
    return ''
  }

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

  const handleSelect = (id: number) => {
    setSelectedValue(id)
    onChange(id)
    setOpen(false)
  }

  const renderNode = (node: TreeSelect, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.has(node.id)
    const isSelected = selectedValue === node.id
    const indentStyle = { paddingLeft: `${level * 20 + 8}px` }

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-md py-1.5 transition-colors',
            isSelected ? 'bg-accent' : 'hover:bg-accent'
          )}
          style={indentStyle}
          onClick={() => handleSelect(node.id)}
        >
          {hasChildren ? (
            <button
              className='flex size-4 items-center justify-center'
              onClick={(e) => {
                e.stopPropagation()
                handleToggle(node.id)
              }}
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

  const selectedLabel = selectedValue ? findNodeLabel(data, selectedValue) : ''

  return (
    <div className='relative'>
      <button
        className='flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
        onClick={() => setOpen(!open)}
      >
        <span className={selectedLabel ? '' : 'text-muted-foreground'}>
          {selectedLabel || placeholder || '请选择'}
        </span>
        <ChevronDownIcon className='size-4 opacity-50' />
      </button>
      {open && (
        <div className='absolute top-full left-0 z-50 mt-1 max-h-[300px] w-full overflow-auto rounded-md border bg-popover p-1 shadow-md'>
          {data.length === 0 ? (
            <div className='py-4 text-center text-sm text-muted-foreground'>
              暂无数据
            </div>
          ) : (
            data.map((node) => renderNode(node))
          )}
        </div>
      )}
    </div>
  )
}

// 部门表单对话框
export function DeptFormDialog({
  open,
  onOpenChange,
  onSuccess,
  deptId,
  parentId,
}: DeptDialogProps) {
  const [deptTreeData, setDeptTreeData] = React.useState<TreeSelect[]>([])
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!deptId

  const form = useForm<DeptFormValues>({
    resolver: zodResolver(deptFormSchema),
    defaultValues: {
      deptId: undefined,
      parentId: 100,
      deptName: '',
      deptCategory: '',
      orderNum: 0,
      leader: '',
      phone: '',
      email: '',
      status: '0',
      remark: '',
    },
  })

  // 加载初始化数据
  React.useEffect(() => {
    if (open) {
      loadInitData()
    }
  }, [open, deptId, parentId])

  const loadInitData = async () => {
    setLoading(true)
    try {
      // 加载部门树选择数据
      const treeRes = await deptTreeselect()
      if (treeRes.code === 200) {
        setDeptTreeData(treeRes.data)
      }

      // 如果是编辑模式，加载部门详情
      if (deptId) {
        const deptRes = await getDept(deptId)
        if (deptRes.code === 200 && deptRes.data) {
          form.reset({
            deptId: deptRes.data.deptId,
            parentId: deptRes.data.parentId,
            deptName: deptRes.data.deptName,
            deptCategory: deptRes.data.deptCategory,
            orderNum: deptRes.data.orderNum,
            leader: deptRes.data.leader || '',
            phone: deptRes.data.phone || '',
            email: deptRes.data.email || '',
            status: deptRes.data.status as '0' | '1',
            remark: deptRes.data.remark || '',
          })
        }
      } else {
        // 新增模式
        form.reset({
          deptId: undefined,
          parentId: parentId || 100,
          deptName: '',
          deptCategory: '',
          orderNum: 0,
          leader: '',
          phone: '',
          email: '',
          status: '0',
          remark: '',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: DeptFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updateDept({
          deptId: values.deptId,
          parentId: values.parentId,
          deptName: values.deptName,
          deptCategory: values.deptCategory,
          orderNum: values.orderNum,
          leader: values.leader || '',
          phone: values.phone || '',
          email: values.email || '',
          status: values.status,
          remark: values.remark || '',
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addDept({
          parentId: values.parentId,
          deptName: values.deptName,
          deptCategory: values.deptCategory,
          orderNum: values.orderNum,
          leader: values.leader || '',
          phone: values.phone || '',
          email: values.email || '',
          status: values.status,
          remark: values.remark || '',
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
          <DialogTitle>{isEdit ? '修改部门' : '添加部门'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4 py-4'>
            {/* 上级部门 */}
            {form.watch('parentId') !== 0 && (
              <FormItem className='col-span-2'>
                <FormLabel>上级部门</FormLabel>
                <FormControl>
                  <TreeSelectComponent
                    data={deptTreeData}
                    value={form.watch('parentId')}
                    onChange={(value) => form.setValue('parentId', value)}
                    placeholder='选择上级部门'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}

            {/* 部门名称 */}
            <FormItem>
              <FormLabel>部门名称</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入部门名称'
                  {...form.register('deptName')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 类别编码 */}
            <FormItem>
              <FormLabel>类别编码</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入类别编码'
                  {...form.register('deptCategory')}
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
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 负责人 */}
            <FormItem>
              <FormLabel>负责人</FormLabel>
              <FormControl>
                <Select
                  value={form.watch('leader') || ''}
                  onValueChange={(v) => form.setValue('leader', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='请选择负责人' />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.userId} value={user.userName}>
                        {user.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 联系电话 */}
            <FormItem>
              <FormLabel>联系电话</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入联系电话'
                  maxLength={11}
                  {...form.register('phone')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 邮箱 */}
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入邮箱'
                  maxLength={50}
                  {...form.register('email')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 部门状态 */}
            <FormItem>
              <FormLabel>部门状态</FormLabel>
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
