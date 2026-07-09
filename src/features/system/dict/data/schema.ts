import { z } from 'zod'

// 字典类型表单 Schema
export const dictTypeFormSchema = z.object({
  dictId: z.number().optional(),
  dictName: z.string().min(1, { message: '字典名称不能为空' }),
  dictType: z.string().min(1, { message: '字典类型不能为空' }),
  remark: z.string().optional(),
})

export type DictTypeFormValues = z.infer<typeof dictTypeFormSchema>

// 字典数据表单 Schema
export const dictDataFormSchema = z.object({
  dictCode: z.number().optional(),
  dictType: z.string().min(1, { message: '字典类型不能为空' }),
  dictLabel: z.string().min(1, { message: '数据标签不能为空' }),
  dictValue: z.string().min(1, { message: '数据键值不能为空' }),
  cssClass: z.string().optional(),
  listClass: z.string(),
  dictSort: z.number().min(0, { message: '排序不能小于0' }),
  remark: z.string().optional(),
})

export type DictDataFormValues = z.infer<typeof dictDataFormSchema>

// 字典数据表单默认值
export const dictDataFormDefaultValues: Partial<DictDataFormValues> = {
  listClass: 'default',
  dictSort: 0,
}

// 字典类型搜索参数 Schema
export const dictTypeSearchSchema = z.object({
  dictName: z.string().optional(),
  dictType: z.string().optional(),
  createTimeStart: z.string().optional(),
  createTimeEnd: z.string().optional(),
})

export type DictTypeSearchParams = z.infer<typeof dictTypeSearchSchema>

// 字典数据搜索参数 Schema
export const dictDataSearchSchema = z.object({
  dictLabel: z.string().optional(),
})

export type DictDataSearchParams = z.infer<typeof dictDataSearchSchema>
