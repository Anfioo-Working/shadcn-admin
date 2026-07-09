'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon, ChevronRightIcon, FolderIcon } from 'lucide-react'
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
  deptTreeselect,
  roleOptions,
  postOptions,
  addUser,
  updateUser,
  resetUserPwd,
  getUser,
} from '@/features/system/shared/api'
import type {
  User,
  TreeSelect,
  RoleOption,
  PostOption,
} from '@/features/system/shared/types'
import {
  userFormSchema,
  resetPasswordSchema,
  type UserFormValues,
  type ResetPasswordFormValues,
} from '../data/schema'

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  userId?: number | null
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

// 用户表单对话框
export function UserFormDialog({
  open,
  onOpenChange,
  onSuccess,
  userId,
}: UserDialogProps) {
  const [deptTreeData, setDeptTreeData] = React.useState<TreeSelect[]>([])
  const [roleOptionData, setRoleOptionData] = React.useState<RoleOption[]>([])
  const [postOptionData, setPostOptionData] = React.useState<PostOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!userId

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userId: undefined,
      deptId: 0,
      userName: '',
      nickName: '',
      password: '',
      email: '',
      phonenumber: '',
      sex: '0',
      status: '0',
      remark: '',
      postIds: [],
      roleIds: [],
    },
  })

  // 加载初始化数据
  React.useEffect(() => {
    if (open) {
      loadInitData()
    }
  }, [open, userId])

  const loadInitData = async () => {
    setLoading(true)
    try {
      // 加载部门树
      const deptRes = await deptTreeselect()
      if (deptRes.code === 200) {
        setDeptTreeData(deptRes.data)
      }

      // 加载角色选项
      const roleRes = await roleOptions()
      if (roleRes.code === 200) {
        setRoleOptionData(roleRes.data)
      }

      // 加载岗位选项
      const postRes = await postOptions()
      if (postRes.code === 200) {
        setPostOptionData(postRes.data)
      }

      // 如果是编辑模式，加载用户详情
      if (userId) {
        const userRes = await getUser(userId)
        if (userRes.code === 200 && userRes.data) {
          form.reset({
            userId: userRes.data.userId,
            deptId: userRes.data.deptId,
            userName: userRes.data.userName,
            nickName: userRes.data.nickName,
            email: userRes.data.email || '',
            phonenumber: userRes.data.phonenumber || '',
            sex: userRes.data.sex as '0' | '1' | '2',
            status: userRes.data.status as '0' | '1',
            remark: userRes.data.remark || '',
            postIds: userRes.data.posts || [],
            roleIds: userRes.data.roles || [],
          })
        }
      } else {
        form.reset({
          userId: undefined,
          deptId: 0,
          userName: '',
          nickName: '',
          password: '',
          email: '',
          phonenumber: '',
          sex: '0',
          status: '0',
          remark: '',
          postIds: [],
          roleIds: [],
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: UserFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updateUser({
          userId: values.userId,
          deptId: values.deptId,
          userName: values.userName,
          nickName: values.nickName,
          email: values.email || '',
          phonenumber: values.phonenumber || '',
          sex: values.sex,
          status: values.status,
          remark: values.remark || '',
          postIds: values.postIds,
          roleIds: values.roleIds,
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addUser({
          deptId: values.deptId,
          userName: values.userName,
          nickName: values.nickName,
          password: values.password || '',
          email: values.email || '',
          phonenumber: values.phonenumber || '',
          sex: values.sex,
          status: values.status,
          remark: values.remark || '',
          postIds: values.postIds,
          roleIds: values.roleIds,
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
          <DialogTitle>{isEdit ? '修改用户' : '新增用户'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4 py-4'>
            {/* 用户昵称 */}
            <FormItem>
              <FormLabel>用户昵称</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入用户昵称'
                  {...form.register('nickName')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 归属部门 */}
            <FormItem>
              <FormLabel>归属部门</FormLabel>
              <FormControl>
                <DeptTreeSelect
                  value={form.watch('deptId')}
                  onChange={(value) => form.setValue('deptId', value)}
                  treeData={deptTreeData}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 手机号码 */}
            <FormItem>
              <FormLabel>手机号码</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入手机号码'
                  {...form.register('phonenumber')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 邮箱 */}
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder='请输入邮箱' {...form.register('email')} />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 用户名称 - 仅新增 */}
            {!isEdit && (
              <FormItem>
                <FormLabel>用户名称</FormLabel>
                <FormControl>
                  <Input
                    placeholder='请输入用户名称'
                    {...form.register('userName')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}

            {/* 用户密码 - 仅新增 */}
            {!isEdit && (
              <FormItem>
                <FormLabel>用户密码</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='请输入用户密码'
                    {...form.register('password')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}

            {/* 用户性别 */}
            <FormItem>
              <FormLabel>用户性别</FormLabel>
              <FormControl>
                <Select
                  value={form.watch('sex')}
                  onValueChange={(v) =>
                    form.setValue('sex', v as '0' | '1' | '2')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='请选择' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='0'>男</SelectItem>
                    <SelectItem value='1'>女</SelectItem>
                    <SelectItem value='2'>未知</SelectItem>
                  </SelectContent>
                </Select>
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

            {/* 岗位 */}
            <FormItem>
              <FormLabel>岗位</FormLabel>
              <FormControl>
                <div className='flex flex-wrap gap-2'>
                  {postOptionData.map((post) => (
                    <label
                      key={post.postId}
                      className='flex cursor-pointer items-center gap-1.5'
                    >
                      <Checkbox
                        checked={form.watch('postIds').includes(post.postId)}
                        onCheckedChange={(checked) => {
                          const current = form.getValues('postIds')
                          if (checked) {
                            form.setValue('postIds', [...current, post.postId])
                          } else {
                            form.setValue(
                              'postIds',
                              current.filter((id) => id !== post.postId)
                            )
                          }
                        }}
                      />
                      <span className='text-sm'>{post.postName}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 角色 */}
            <FormItem>
              <FormLabel>角色</FormLabel>
              <FormControl>
                <div className='flex flex-wrap gap-2'>
                  {roleOptionData.map((role) => (
                    <label
                      key={role.roleId}
                      className='flex cursor-pointer items-center gap-1.5'
                    >
                      <Checkbox
                        checked={form.watch('roleIds').includes(role.roleId)}
                        onCheckedChange={(checked) => {
                          const current = form.getValues('roleIds')
                          if (checked) {
                            form.setValue('roleIds', [...current, role.roleId])
                          } else {
                            form.setValue(
                              'roleIds',
                              current.filter((id) => id !== role.roleId)
                            )
                          }
                        }}
                      />
                      <span className='text-sm'>{role.roleName}</span>
                    </label>
                  ))}
                </div>
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

// 重置密码对话框
interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user: User | null
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  onSuccess,
  user,
}: ResetPasswordDialogProps) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      userId: user?.userId || 0,
      newPassword: '',
    },
  })

  React.useEffect(() => {
    if (user) {
      form.reset({
        userId: user.userId,
        newPassword: '',
      })
    }
  }, [user])

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setLoading(true)
    try {
      const res = await resetUserPwd(values.userId)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重置密码</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid gap-4 py-4'>
            {/* 用户名显示 */}
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input value={user?.userName || ''} disabled />
              </FormControl>
            </FormItem>

            {/* 新密码 */}
            <FormItem>
              <FormLabel>新密码</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='请输入新密码'
                  {...form.register('newPassword')}
                />
              </FormControl>
              <FormDescription>
                用户密码长度必须介于 5 和 20 之间
              </FormDescription>
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
