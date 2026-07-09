import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Download,
  FileImage,
  FileSpreadsheet,
  Mail,
  Bookmark,
  Save,
} from 'lucide-react'

export function ExportBar() {
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium text-muted-foreground'>
          数据导出 & 报表
        </span>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        {/* 单图表导出 PNG */}
        <Button variant='outline' size='sm' className='gap-1.5'>
          <FileImage className='h-4 w-4' />
          导出图表 PNG
        </Button>

        {/* 全页面导出 Excel */}
        <Button variant='outline' size='sm' className='gap-1.5'>
          <FileSpreadsheet className='h-4 w-4' />
          导出 Excel
        </Button>

        {/* 定时报表推送 */}
        <Select defaultValue='manual'>
          <SelectTrigger className='h-8 w-[130px] text-xs'>
            <Mail className='mr-1 h-3.5 w-3.5' />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='manual'>手动推送</SelectItem>
            <SelectItem value='daily'>每日推送</SelectItem>
            <SelectItem value='weekly'>每周推送</SelectItem>
            <SelectItem value='monthly'>每月推送</SelectItem>
          </SelectContent>
        </Select>

        {/* 数据快照 */}
        <Button variant='outline' size='sm' className='gap-1.5'>
          <Bookmark className='h-4 w-4' />
          保存快照
        </Button>

        {/* 保存布局 */}
        <Button variant='outline' size='sm' className='gap-1.5'>
          <Save className='h-4 w-4' />
          保存布局
        </Button>

        {/* 一键导出全部 */}
        <Button size='sm' className='gap-1.5'>
          <Download className='h-4 w-4' />
          导出全部数据
        </Button>
      </div>
    </div>
  )
}
