'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'
import {
  addNotice,
  updateNotice,
  getNotice,
} from '@/features/system/shared/api'
import { noticeFormSchema, type NoticeFormValues } from '../data/schema'

interface NoticeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  noticeId?: number | null
}

// 公告表单对话框
export function NoticeFormDialog({
  open,
  onOpenChange,
  onSuccess,
  noticeId,
}: NoticeDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!noticeId

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      noticeId: undefined,
      noticeTitle: '',
      noticeType: '',
      noticeContent: '',
      status: '0',
      remark: '',
    },
  })

  // 加载初始化数据
  React.useEffect(() => {
    if (open) {
      loadInitData()
    }
  }, [open, noticeId])

  const loadInitData = async () => {
    setLoading(true)
    try {
      // 如果是编辑模式，加载公告详情
      if (noticeId) {
        const res = await getNotice(noticeId)
        if (res.code === 200 && res.data) {
          form.reset({
            noticeId: res.data.noticeId,
            noticeTitle: res.data.noticeTitle,
            noticeType: res.data.noticeType,
            noticeContent: res.data.noticeContent || '',
            status: res.data.status as '0' | '1',
            remark: res.data.remark || '',
          })
        }
      } else {
        // 新增模式
        form.reset({
          noticeId: undefined,
          noticeTitle: '',
          noticeType: '',
          noticeContent: '',
          status: '0',
          remark: '',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: NoticeFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updateNotice({
          noticeId: values.noticeId,
          noticeTitle: values.noticeTitle,
          noticeType: values.noticeType,
          noticeContent: values.noticeContent || '',
          status: values.status,
          remark: values.remark || '',
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addNotice({
          noticeTitle: values.noticeTitle,
          noticeType: values.noticeType,
          noticeContent: values.noticeContent || '',
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
      <DialogContent className='max-w-[780px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? '修改公告' : '添加公告'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4 py-4'>
            {/* 公告标题 */}
            <FormItem>
              <FormLabel>公告标题</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入公告标题'
                  {...form.register('noticeTitle')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 公告类型 */}
            <FormItem>
              <FormLabel>公告类型</FormLabel>
              <FormControl>
                <Select
                  value={form.watch('noticeType')}
                  onValueChange={(v) => form.setValue('noticeType', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='请选择' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>通知</SelectItem>
                    <SelectItem value='2'>公告</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 状态 */}
            <FormItem className='col-span-2'>
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
                    <FormLabel className='font-normal'>关闭</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 内容 */}
            <FormItem className='col-span-2'>
              <FormLabel>内容</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='请输入内容'
                  className='min-h-[192px]'
                  {...form.register('noticeContent')}
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
