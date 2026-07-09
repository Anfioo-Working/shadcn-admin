'use client'

import * as React from 'react'
import { SearchIcon, RefreshCcwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NoticeSearchFormProps {
  onSearch: (params: NoticeSearchParams) => void
  onReset: () => void
  defaultValues?: NoticeSearchParams
}

export interface NoticeSearchParams {
  noticeTitle?: string
  createByName?: string
  noticeType?: string
}

export function NoticeSearchForm({
  onSearch,
  onReset,
  defaultValues,
}: NoticeSearchFormProps) {
  const [noticeTitle, setNoticeTitle] = React.useState(
    defaultValues?.noticeTitle || ''
  )
  const [createByName, setCreateByName] = React.useState(
    defaultValues?.createByName || ''
  )
  const [noticeType, setNoticeType] = React.useState(
    defaultValues?.noticeType || ''
  )

  React.useEffect(() => {
    void (async () => {
      if (defaultValues) {
        setNoticeTitle(defaultValues.noticeTitle || '')
        setCreateByName(defaultValues.createByName || '')
        setNoticeType(defaultValues.noticeType || '')
      }
    })()
  }, [defaultValues])

  const handleSearch = () => {
    onSearch({
      noticeTitle: noticeTitle || undefined,
      createByName: createByName || undefined,
      noticeType: noticeType || undefined,
    })
  }

  const handleReset = () => {
    setNoticeTitle('')
    setCreateByName('')
    setNoticeType('')
    onReset()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card className='mb-4'>
      <CardContent className='p-4'>
        <div className='flex flex-wrap items-end gap-4'>
          {/* 公告标题 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>公告标题</label>
            <Input
              placeholder='请输入公告标题'
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 操作人员 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>操作人员</label>
            <Input
              placeholder='请输入操作人员'
              value={createByName}
              onChange={(e) => setCreateByName(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 类型 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>类型</label>
            <Select value={noticeType} onValueChange={setNoticeType}>
              <SelectTrigger className='w-[120px]'>
                <SelectValue placeholder='公告类型' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>通知</SelectItem>
                <SelectItem value='2'>公告</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 搜索/重置按钮 */}
          <div className='flex items-center gap-2'>
            <Button variant='default' onClick={handleSearch}>
              <SearchIcon data-icon='inline-start' />
              搜索
            </Button>
            <Button variant='outline' onClick={handleReset}>
              <RefreshCcwIcon data-icon='inline-start' />
              重置
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
