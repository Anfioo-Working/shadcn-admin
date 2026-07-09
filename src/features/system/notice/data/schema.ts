import { z } from 'zod'

// 公告表单验证 Schema
export const noticeFormSchema = z.object({
  noticeId: z.number().optional(),
  noticeTitle: z.string().min(1, { message: '公告标题不能为空' }),
  noticeType: z.string().min(1, { message: '公告类型不能为空' }),
  noticeContent: z.string(),
  status: z.enum(['0', '1']),
  remark: z.string(),
})

export type NoticeFormValues = z.infer<typeof noticeFormSchema>

// 公告表单默认值
export const noticeFormDefaultValues: Partial<NoticeFormValues> = {
  noticeContent: '',
  status: '0',
  remark: '',
}

// 公告查询参数 Schema
export const noticeQuerySchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  noticeTitle: z.string().optional(),
  createByName: z.string().optional(),
  noticeType: z.enum(['1', '2']).optional(),
  status: z.enum(['0', '1']).optional(),
})

export type NoticeQueryValues = z.infer<typeof noticeQuerySchema>
