'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon, ChevronRightIcon, FolderIcon } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  deptTreeselect,
  addPost,
  updatePost,
  getPost,
} from '@/features/system/shared/api'
import type { TreeSelect } from '@/features/system/shared/types'
import { postFormSchema, type PostFormValues } from '../data/schema'

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  postId?: number | null
}

// 部门树选择组件
interface DeptTreeSelectProps {
  value: number | undefined
  onChange: (value: number) => void
  treeData: TreeSelect[]
}

function DeptTreeSelect({ value, onChange, treeData }: DeptTreeSelectProps) {
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set())

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

  const renderNode = (node: TreeSelect, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.has(node.id)
    const isSelected = value === node.id
    const indentStyle = { paddingLeft: `${level * 16 + 8}px` }

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-1 rounded-md py-1.5 transition-colors',
            'hover:bg-accent',
            isSelected && 'bg-accent font-medium'
          )}
          style={indentStyle}
          onClick={() => onChange(node.id)}
        >
          {hasChildren && (
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
          )}
          {!hasChildren && (
            <FolderIcon className='size-4 text-muted-foreground' />
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
    <div className='max-h-[200px] overflow-auto rounded-md border p-2'>
      {treeData.map((node) => renderNode(node))}
    </div>
  )
}

export function PostFormDialog({
  open,
  onOpenChange,
  onSuccess,
  postId,
}: PostFormDialogProps) {
  const [deptTreeData, setDeptTreeData] = React.useState<TreeSelect[]>([])
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!postId

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      postId: undefined,
      deptId: 0,
      postName: '',
      postCode: '',
      postCategory: '',
      postSort: 0,
      status: '0',
      remark: '',
    },
  })

  // 加载初始化数据
  React.useEffect(() => {
    if (open) {
      loadInitData()
    }
  }, [open, postId])

  const loadInitData = async () => {
    setLoading(true)
    try {
      // 加载部门树
      const deptRes = await deptTreeselect()
      if (deptRes.code === 200) {
        setDeptTreeData(deptRes.data)
      }

      // 如果是编辑模式，加载岗位详情
      if (postId) {
        const postRes = await getPost(postId)
        if (postRes.code === 200 && postRes.data) {
          form.reset({
            postId: postRes.data.postId,
            deptId: postRes.data.deptId,
            postName: postRes.data.postName,
            postCode: postRes.data.postCode,
            postCategory: postRes.data.postCategory || '',
            postSort: postRes.data.postSort,
            status: postRes.data.status as '0' | '1',
            remark: postRes.data.remark || '',
          })
        }
      } else {
        form.reset({
          postId: undefined,
          deptId: 0,
          postName: '',
          postCode: '',
          postCategory: '',
          postSort: 0,
          status: '0',
          remark: '',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: PostFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updatePost({
          postId: values.postId,
          deptId: values.deptId,
          postCode: values.postCode,
          postCategory: values.postCategory || '',
          postName: values.postName,
          postSort: values.postSort,
          status: values.status,
          remark: values.remark || '',
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addPost({
          deptId: values.deptId,
          postCode: values.postCode,
          postCategory: values.postCategory || '',
          postName: values.postName,
          postSort: values.postSort,
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
      <DialogContent className='max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? '修改岗位' : '添加岗位'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid gap-4 py-4'>
            {/* 岗位名称 */}
            <FormItem>
              <FormLabel>岗位名称</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入岗位名称'
                  {...form.register('postName')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 部门 */}
            <FormItem>
              <FormLabel>部门</FormLabel>
              <FormControl>
                <DeptTreeSelect
                  value={form.watch('deptId')}
                  onChange={(value) => form.setValue('deptId', value)}
                  treeData={deptTreeData}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 岗位编码 */}
            <FormItem>
              <FormLabel>岗位编码</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入编码名称'
                  {...form.register('postCode')}
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
                  {...form.register('postCategory')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 岗位顺序 */}
            <FormItem>
              <FormLabel>岗位顺序</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='请输入岗位顺序'
                  {...form.register('postSort', { valueAsNumber: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 岗位状态 */}
            <FormItem>
              <FormLabel>岗位状态</FormLabel>
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

            {/* 备注 */}
            <FormItem>
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
