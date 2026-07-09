import { z } from 'zod'

// 角色表单验证 Schema
export const roleFormSchema = z.object({
  roleId: z.number().optional(),
  roleName: z.string().min(1, { message: '角色名称不能为空' }),
  roleKey: z.string().min(1, { message: '权限字符不能为空' }),
  roleSort: z
    .number({
      message: '显示顺序不能为空',
    })
    .min(0, { message: '显示顺序不能小于0' }),
  dataScope: z.string(),
  status: z.enum(['0', '1']),
  remark: z.string(),
  menuIds: z.array(z.number()),
  deptIds: z.array(z.number()),
  menuCheckStrictly: z.boolean(),
  deptCheckStrictly: z.boolean(),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>

// 角色表单默认值
export const roleFormDefaultValues: Partial<RoleFormValues> = {
  dataScope: '1',
  status: '0',
  remark: '',
  menuIds: [],
  deptIds: [],
  menuCheckStrictly: true,
  deptCheckStrictly: true,
}

// 角色查询参数 Schema
export const roleQuerySchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  roleName: z.string().optional(),
  roleKey: z.string().optional(),
  status: z.enum(['0', '1']).optional(),
})

export type RoleQueryValues = z.infer<typeof roleQuerySchema>
