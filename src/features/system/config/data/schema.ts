import { z } from 'zod'

// 配置表单验证 Schema
export const configFormSchema = z.object({
  configId: z.number().optional(),
  configName: z.string().min(1, { message: '参数名称不能为空' }),
  configKey: z.string().min(1, { message: '参数键名不能为空' }),
  configValue: z.string().min(1, { message: '参数键值不能为空' }),
  configType: z.enum(['Y', 'N']),
  remark: z.string(),
})

export type ConfigFormValues = z.infer<typeof configFormSchema>

// 配置表单默认值
export const configFormDefaultValues: Partial<ConfigFormValues> = {
  configType: 'Y',
  remark: '',
}

// 配置查询参数 Schema
export const configQuerySchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  configName: z.string().optional(),
  configKey: z.string().optional(),
  configType: z.enum(['Y', 'N']).optional(),
  beginTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type ConfigQueryValues = z.infer<typeof configQuerySchema>
