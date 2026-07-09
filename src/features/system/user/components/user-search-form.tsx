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

interface UserSearchFormProps {
  onSearch: (params: UserSearchParams) => void
  onReset: () => void
  defaultValues?: UserSearchParams
}

export interface UserSearchParams {
  userName?: string
  nickName?: string
  phonenumber?: string
  status?: string
  beginTime?: string
  endTime?: string
}

export function UserSearchForm({
  onSearch,
  onReset,
  defaultValues,
}: UserSearchFormProps) {
  const [userName, setUserName] = React.useState(defaultValues?.userName || '')
  const [nickName, setNickName] = React.useState(defaultValues?.nickName || '')
  const [phonenumber, setPhonenumber] = React.useState(
    defaultValues?.phonenumber || ''
  )
  const [status, setStatus] = React.useState(defaultValues?.status || '')
  const [beginTime, setBeginTime] = React.useState(
    defaultValues?.beginTime || ''
  )
  const [endTime, setEndTime] = React.useState(defaultValues?.endTime || '')

  React.useEffect(() => {
    void (async () => {
      if (defaultValues) {
        setUserName(defaultValues.userName || '')
        setNickName(defaultValues.nickName || '')
        setPhonenumber(defaultValues.phonenumber || '')
        setStatus(defaultValues.status || '')
        setBeginTime(defaultValues.beginTime || '')
        setEndTime(defaultValues.endTime || '')
      }
    })()
  }, [defaultValues])

  const handleSearch = () => {
    onSearch({
      userName: userName || undefined,
      nickName: nickName || undefined,
      phonenumber: phonenumber || undefined,
      status: status || undefined,
      beginTime: beginTime || undefined,
      endTime: endTime || undefined,
    })
  }

  const handleReset = () => {
    setUserName('')
    setNickName('')
    setPhonenumber('')
    setStatus('')
    setBeginTime('')
    setEndTime('')
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
          {/* 用户名称 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>用户名称</label>
            <Input
              placeholder='请输入用户名称'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 用户昵称 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>用户昵称</label>
            <Input
              placeholder='请输入用户昵称'
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 手机号码 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>手机号码</label>
            <Input
              placeholder='请输入手机号码'
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 状态 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>状态</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-[120px]'>
                <SelectValue placeholder='用户状态' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>正常</SelectItem>
                <SelectItem value='1'>停用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 创建时间 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>创建时间</label>
            <div className='flex items-center gap-2'>
              <Input
                type='date'
                value={beginTime}
                onChange={(e) => setBeginTime(e.target.value)}
                className='w-[150px]'
              />
              <span className='text-muted-foreground'>-</span>
              <Input
                type='date'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className='w-[150px]'
              />
            </div>
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
