import { z } from 'zod'

// 部门表单验证 Schema
export const deptFormSchema = z.object({
  deptId: z.number().optional(),
  parentId: z
    .number({
      message: '上级部门不能为空',
    })
    .min(0, { message: '上级部门不能为空' }),
  deptName: z.string().min(1, { message: '部门名称不能为空' }),
  deptCategory: z.string().min(1, { message: '类别编码不能为空' }),
  orderNum: z
    .number({
      message: '显示排序不能为空',
    })
    .min(0, { message: '显示排序不能小于0' }),
  leader: z.string(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^1[3-9]\d{9}$/.test(val), {
      message: '请输入正确的手机号码',
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: '请输入正确的邮箱地址',
    }),
  status: z.enum(['0', '1']),
  remark: z.string(),
})

export type DeptFormValues = z.infer<typeof deptFormSchema>

// 部门表单默认值
export const deptFormDefaultValues: Partial<DeptFormValues> = {
  leader: '',
  status: '0',
  remark: '',
}

// 部门查询参数 Schema
export const deptQuerySchema = z.object({
  deptName: z.string().optional(),
  deptCategory: z.string().optional(),
  status: z.enum(['0', '1']).optional(),
})

export type DeptQueryValues = z.infer<typeof deptQuerySchema>
