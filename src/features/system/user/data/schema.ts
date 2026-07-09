import { z } from 'zod'

// 用户表单验证 Schema
export const userFormSchema = z.object({
  userId: z.number().optional(),
  deptId: z.number({
    message: '请选择归属部门',
  }),
  userName: z
    .string()
    .min(2, { message: '用户名称长度必须介于 2 和 20 之间' })
    .max(20, { message: '用户名称长度必须介于 2 和 20 之间' }),
  nickName: z.string().min(1, { message: '用户昵称不能为空' }),
  password: z
    .string()
    .min(5, { message: '用户密码长度必须介于 5 和 20 之间' })
    .max(20, { message: '用户密码长度必须介于 5 和 20 之间' })
    .regex(/^[^<>"'|\\]+$/, { message: '不能包含非法字符：< > " \' \\ |' })
    .optional(),
  email: z
    .string()
    .email({ message: '请输入正确的邮箱地址' })
    .optional()
    .or(z.literal('')),
  phonenumber: z
    .string()
    .regex(/^1[3456789][0-9]\d{8}$/, { message: '请输入正确的手机号码' })
    .optional()
    .or(z.literal('')),
  sex: z.enum(['0', '1', '2']),
  status: z.enum(['0', '1']),
  remark: z.string(),
  postIds: z.array(z.number()),
  roleIds: z.array(z.number()).min(1, { message: '用户角色不能为空' }),
})

export type UserFormValues = z.infer<typeof userFormSchema>

// 用户表单默认值
export const userFormDefaultValues: Partial<UserFormValues> = {
  sex: '0',
  status: '0',
  remark: '',
  postIds: [],
}

// 重置密码表单验证 Schema
export const resetPasswordSchema = z.object({
  userId: z.number(),
  newPassword: z
    .string()
    .min(5, { message: '用户密码长度必须介于 5 和 20 之间' })
    .max(20, { message: '用户密码长度必须介于 5 和 20 之间' })
    .regex(/^[^<>"'|\\]+$/, { message: '不能包含非法字符：< > " \' \\ |' }),
})

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

// 用户查询参数 Schema
export const userQuerySchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  userName: z.string().optional(),
  phonenumber: z.string().optional(),
  status: z.enum(['0', '1']).optional(),
  deptId: z.number().optional(),
})

export type UserQueryValues = z.infer<typeof userQuerySchema>
