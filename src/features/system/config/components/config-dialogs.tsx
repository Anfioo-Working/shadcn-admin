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
import { Textarea } from '@/components/ui/textarea'
import {
  getConfig,
  addConfig,
  updateConfig,
} from '@/features/system/shared/api'
import type { Config } from '@/features/system/shared/types'
import { configFormSchema, type ConfigFormValues } from '../data/schema'

interface ConfigFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  config?: Config | null
}

export function ConfigFormDialog({
  open,
  onOpenChange,
  onSuccess,
  config,
}: ConfigFormDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!config?.configId

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      configId: undefined,
      configName: '',
      configKey: '',
      configValue: '',
      configType: 'Y',
      remark: '',
    },
  })

  // 加载配置详情
  React.useEffect(() => {
    if (open) {
      if (config?.configId) {
        loadConfigDetail(config.configId)
      } else {
        form.reset({
          configId: undefined,
          configName: '',
          configKey: '',
          configValue: '',
          configType: 'Y',
          remark: '',
        })
      }
    }
  }, [open, config])

  const loadConfigDetail = async (configId: number) => {
    setLoading(true)
    try {
      const res = await getConfig(configId)
      if (res.code === 200 && res.data) {
        form.reset({
          configId: res.data.configId,
          configName: res.data.configName,
          configKey: res.data.configKey,
          configValue: res.data.configValue,
          configType: res.data.configType as 'Y' | 'N',
          remark: res.data.remark || '',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: ConfigFormValues) => {
    setLoading(true)
    try {
      if (isEdit) {
        const res = await updateConfig({
          configId: values.configId,
          configName: values.configName,
          configKey: values.configKey,
          configValue: values.configValue,
          configType: values.configType,
          remark: values.remark,
        })
        if (res.code === 200) {
          onSuccess()
          onOpenChange(false)
        }
      } else {
        const res = await addConfig({
          configName: values.configName,
          configKey: values.configKey,
          configValue: values.configValue,
          configType: values.configType,
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
      <DialogContent className='max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? '修改参数' : '添加参数'}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className='grid gap-4 py-4'>
            {/* 参数名称 */}
            <FormItem>
              <FormLabel>参数名称</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入参数名称'
                  {...form.register('configName')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 参数键名 */}
            <FormItem>
              <FormLabel>参数键名</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入参数键名'
                  {...form.register('configKey')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 参数键值 */}
            <FormItem>
              <FormLabel>参数键值</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='请输入参数键值'
                  {...form.register('configValue')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* 系统内置 */}
            <FormItem>
              <FormLabel>系统内置</FormLabel>
              <FormControl>
                <RadioGroup
                  value={form.watch('configType')}
                  onValueChange={(v) =>
                    form.setValue('configType', v as 'Y' | 'N')
                  }
                  className='flex items-center gap-4'
                >
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <RadioGroupItem value='Y' />
                    </FormControl>
                    <FormLabel className='font-normal'>是</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <RadioGroupItem value='N' />
                    </FormControl>
                    <FormLabel className='font-normal'>否</FormLabel>
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
