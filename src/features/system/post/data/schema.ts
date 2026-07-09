import { z } from 'zod'

// 岗位表单验证 Schema
export const postFormSchema = z.object({
  postId: z.number().optional(),
  postName: z.string().min(1, { message: '岗位名称不能为空' }),
  deptId: z
    .number({
      message: '请选择部门',
    })
    .min(1, { message: '请选择部门' }),
  postCode: z.string().min(1, { message: '岗位编码不能为空' }),
  postCategory: z.string(),
  postSort: z
    .number({
      message: '岗位顺序不能为空',
    })
    .min(0, { message: '岗位顺序不能小于0' }),
  status: z.enum(['0', '1']),
  remark: z.string(),
})

export type PostFormValues = z.infer<typeof postFormSchema>

// 岗位表单默认值
export const postFormDefaultValues: Partial<PostFormValues> = {
  postCategory: '',
  status: '0',
  remark: '',
}

// 岗位查询参数 Schema
export const postQuerySchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  postCode: z.string().optional(),
  postCategory: z.string().optional(),
  postName: z.string().optional(),
  status: z.enum(['0', '1']).optional(),
  deptId: z.number().optional(),
})

export type PostQueryValues = z.infer<typeof postQuerySchema>
