'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HelpCircleIcon } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  addDictType,
  updateDictType,
  getDictType,
  addDictData,
  updateDictData,
  getDictData,
} from '@/features/system/shared/api'
import type { DictType, DictData } from '@/features/system/shared/types'
import {
  dictTypeFormSchema,
  dictDataFormSchema,
  type DictTypeFormValues,
  type DictDataFormValues,
} from '../data/schema'

// ==================== 字典类型表单对话框 ====================

interface DictTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  dictType?: DictType | null
}

export function DictTypeFormDialog({
  open,
  onOpenChange,
  onSuccess,
  dictType,
}: DictTypeDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!dictType?.dictId

  const form = useForm<DictTypeFormValues>({
    resolver: zodResolver(dictTypeFormSchema),
    defaultValues: {
      dictId: undefined,
      dictName: '',
      dictType: '',
      remark: '',
    },
  })

  const loadDictTypeDetail = async (dictId: number) => {
    setLoading(true)
    try {
      const res = await getDictType(dictId)
      if (res.code === 200 && res.data) {
        form.reset({
          dictId: res.data.dictId,
          dictName: res.data.dictName,
          dictType: res.data.dictType,
          remark: res.data.remark,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // 加载编辑数据
  React.useEffect(() => {
    void (async () => {
      if (open) {
        if (dictType?.dictId) {
          // 编辑模式，加载详情
          loadDictTypeDetail(dictType.dictId)
        } else {
          // 新增模式，重置表单
          form.reset({
            dictId: undefined,
            dictName: '',
            dictType: '',
            remark: '',
          })
        }
      }
    })()
  }, [open, dictType])

  const onSubmit = async (values: DictTypeFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updateDictType({
          dictId: values.dictId,
          dictName: values.dictName,
          dictType: values.dictType,
          remark: values.remark || '',
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addDictType({
          dictName: values.dictName,
          dictType: values.dictType,
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
          <DialogTitle>{isEdit ? '修改字典类型' : '添加字典类型'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid gap-4 py-4'>
            {/* 字典名称 */}
            <FormItem>
              <FormLabel>字典名称</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入字典名称'
                  {...form.register('dictName')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 字典类型 */}
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                字典类型
                <HelpCircleIcon className='size-4 text-muted-foreground' />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入字典类型'
                  {...form.register('dictType')}
                  maxLength={100}
                />
              </FormControl>
              <FormDescription>
                数据存储中的Key值，如：sys_user_sex
              </FormDescription>
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

// ==================== 字典数据表单对话框 ====================

interface DictDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  dictData?: DictData | null
  selectedDictType: DictType | null
}

// 回显样式选项
const listClassOptions = [
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
]

export function DictDataFormDialog({
  open,
  onOpenChange,
  onSuccess,
  dictData,
  selectedDictType,
}: DictDataDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!dictData?.dictCode

  const form = useForm<DictDataFormValues>({
    resolver: zodResolver(dictDataFormSchema),
    defaultValues: {
      dictCode: undefined,
      dictType: '',
      dictLabel: '',
      dictValue: '',
      cssClass: '',
      listClass: 'default',
      dictSort: 0,
      remark: '',
    },
  })

  // 加载编辑数据
  React.useEffect(() => {
    if (open) {
      if (dictData?.dictCode) {
        // 编辑模式，加载详情
        loadDictDataDetail(dictData.dictCode)
      } else {
        // 新增模式，重置表单
        form.reset({
          dictCode: undefined,
          dictType: selectedDictType?.dictType || '',
          dictLabel: '',
          dictValue: '',
          cssClass: '',
          listClass: 'default',
          dictSort: 0,
          remark: '',
        })
      }
    }
  }, [open, dictData, selectedDictType])

  const loadDictDataDetail = async (dictCode: number) => {
    setLoading(true)
    try {
      const res = await getDictData(dictCode)
      if (res.code === 200 && res.data) {
        form.reset({
          dictCode: res.data.dictCode,
          dictType: res.data.dictType,
          dictLabel: res.data.dictLabel,
          dictValue: res.data.dictValue,
          cssClass: res.data.cssClass,
          listClass: res.data.listClass,
          dictSort: res.data.dictSort,
          remark: res.data.remark,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: DictDataFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updateDictData({
          dictCode: values.dictCode,
          dictType: values.dictType,
          dictLabel: values.dictLabel,
          dictValue: values.dictValue,
          cssClass: values.cssClass || '',
          listClass: values.listClass,
          dictSort: values.dictSort,
          remark: values.remark || '',
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addDictData({
          dictType: values.dictType,
          dictLabel: values.dictLabel,
          dictValue: values.dictValue,
          cssClass: values.cssClass || '',
          listClass: values.listClass,
          dictSort: values.dictSort,
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
          <DialogTitle>{isEdit ? '修改字典数据' : '添加字典数据'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid gap-4 py-4'>
            {/* 字典类型 - 只读 */}
            <FormItem>
              <FormLabel>字典类型</FormLabel>
              <FormControl>
                <Input
                  value={
                    form.watch('dictType') || selectedDictType?.dictType || ''
                  }
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 数据标签 */}
            <FormItem>
              <FormLabel>数据标签</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入数据标签'
                  {...form.register('dictLabel')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 数据键值 */}
            <FormItem>
              <FormLabel>数据键值</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入数据键值'
                  {...form.register('dictValue')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 样式属性 */}
            <FormItem>
              <FormLabel>样式属性</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入样式属性'
                  {...form.register('cssClass')}
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
                  value={form.watch('dictSort')}
                  onChange={(e) =>
                    form.setValue('dictSort', Number(e.target.value))
                  }
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 回显样式 */}
            <FormItem>
              <FormLabel>回显样式</FormLabel>
              <FormControl>
                <Select
                  value={form.watch('listClass')}
                  onValueChange={(v) => form.setValue('listClass', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='请选择回显样式' />
                  </SelectTrigger>
                  <SelectContent>
                    {listClassOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}（{option.value}）
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
