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

interface ConfigSearchFormProps {
  onSearch: (params: ConfigSearchParams) => void
  onReset: () => void
  defaultValues?: ConfigSearchParams
}

export interface ConfigSearchParams {
  configName?: string
  configKey?: string
  configType?: string
  beginTime?: string
  endTime?: string
}

export function ConfigSearchForm({
  onSearch,
  onReset,
  defaultValues,
}: ConfigSearchFormProps) {
  const [configName, setConfigName] = React.useState(
    defaultValues?.configName || ''
  )
  const [configKey, setConfigKey] = React.useState(
    defaultValues?.configKey || ''
  )
  const [configType, setConfigType] = React.useState(
    defaultValues?.configType || ''
  )
  const [beginTime, setBeginTime] = React.useState(
    defaultValues?.beginTime || ''
  )
  const [endTime, setEndTime] = React.useState(defaultValues?.endTime || '')

  React.useEffect(() => {
    void (async () => {
      if (defaultValues) {
        setConfigName(defaultValues.configName || '')
        setConfigKey(defaultValues.configKey || '')
        setConfigType(defaultValues.configType || '')
        setBeginTime(defaultValues.beginTime || '')
        setEndTime(defaultValues.endTime || '')
      }
    })()
  }, [defaultValues])

  const handleSearch = () => {
    onSearch({
      configName: configName || undefined,
      configKey: configKey || undefined,
      configType: configType || undefined,
      beginTime: beginTime || undefined,
      endTime: endTime || undefined,
    })
  }

  const handleReset = () => {
    setConfigName('')
    setConfigKey('')
    setConfigType('')
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
          {/* 参数名称 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>参数名称</label>
            <Input
              placeholder='请输入参数名称'
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 参数键名 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>参数键名</label>
            <Input
              placeholder='请输入参数键名'
              value={configKey}
              onChange={(e) => setConfigKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-[200px]'
            />
          </div>

          {/* 系统内置 */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>系统内置</label>
            <Select value={configType} onValueChange={setConfigType}>
              <SelectTrigger className='w-[120px]'>
                <SelectValue placeholder='系统内置' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Y'>是</SelectItem>
                <SelectItem value='N'>否</SelectItem>
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
