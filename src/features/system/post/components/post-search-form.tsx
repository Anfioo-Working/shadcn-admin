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

interface PostSearchFormProps {
  onSearch: (params: PostSearchParams) => void
  onReset: () => void
  defaultValues?: PostSearchParams
}

export interface PostSearchParams {
  postCode?: string
  postCategory?: string
  postName?: string
  status?: string
}

export function PostSearchForm({
  onSearch,
  onReset,
  defaultValues,
}: PostSearchFormProps) {
  const [postCode, setPostCode] = React.useState(defaultValues?.postCode || '')
  const [postCategory, setPostCategory] = React.useState(
    defaultValues?.postCategory || ''
  )
  const [postName, setPostName] = React.useState(defaultValues?.postName || '')
  const [status, setStatus] = React.useState(defaultValues?.status || '')

  React.useEffect(() => {
    void (async () => {
      if (defaultValues) {
        setPostCode(defaultValues.postCode || '')
        setPostCategory(defaultValues.postCategory || '')
        setPostName(defaultValues.postName || '')
        setStatus(defaultValues.status || '')
      }
    })()
  }, [defaultValues])

  const handleSearch = () => {
    onSearch({
      postCode: postCode || undefined,
      postCategory: postCategory || undefined,
      postName: postName || undefined,
      status: status || undefined,
    })
  }

  const handleReset = () => {
    setPostCode('')
    setPostCategory('')
    setPostName('')
    setStatus('')
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
          {/* 岗位编码 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>岗位编码</label>
            <Input
              placeholder='请输入岗位编码'
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 类别编码 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>类别编码</label>
            <Input
              placeholder='请输入类别编码'
              value={postCategory}
              onChange={(e) => setPostCategory(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 岗位名称 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>岗位名称</label>
            <Input
              placeholder='请输入岗位名称'
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 状态 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>状态</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-[120px]'>
                <SelectValue placeholder='岗位状态' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>正常</SelectItem>
                <SelectItem value='1'>停用</SelectItem>
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
