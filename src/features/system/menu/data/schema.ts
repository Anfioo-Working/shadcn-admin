import { z } from 'zod'

// 菜单表单验证 Schema
export const menuFormSchema = z.object({
  menuId: z.number().optional(),
  parentId: z.number(),
  menuName: z.string().min(1, { message: '菜单名称不能为空' }),
  menuType: z.enum(['M', 'C', 'F']),
  icon: z.string(),
  orderNum: z
    .number({
      message: '显示排序不能为空',
    })
    .min(0, { message: '显示排序不能小于0' }),
  path: z.string(),
  component: z.string(),
  queryParam: z.string(),
  isFrame: z.enum(['0', '1']),
  isCache: z.enum(['0', '1']),
  visible: z.enum(['0', '1']),
  status: z.enum(['0', '1']),
  perms: z.string(),
  remark: z.string(),
})

export type MenuFormValues = z.infer<typeof menuFormSchema>

// 菜单表单默认值
export const menuFormDefaultValues: Partial<MenuFormValues> = {
  parentId: 0,
  menuType: 'M',
  icon: '',
  orderNum: 0,
  path: '',
  component: '',
  queryParam: '',
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0',
  perms: '',
  remark: '',
}

// 菜单查询参数 Schema
export const menuQuerySchema = z.object({
  menuName: z.string().optional(),
  status: z.enum(['0', '1']).optional(),
})

export type MenuQueryValues = z.infer<typeof menuQuerySchema>
