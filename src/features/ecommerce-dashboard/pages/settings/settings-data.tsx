import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

export function SettingsDataPage() {
  const [currency, setCurrency] = useState('CNY')
  const [exchangeRateEnabled, setExchangeRateEnabled] = useState(true)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState('5')
  const [exportFormat, setExportFormat] = useState('xlsx')
  const [pushEmail, setPushEmail] = useState('')

  const handleSave = () => {
    console.log('保存设置:', {
      currency,
      exchangeRateEnabled,
      autoRefreshEnabled,
      refreshInterval,
      exportFormat,
      pushEmail,
    })
  }

  return (
    <>
      <Header>
        <h1 className='text-lg font-semibold'>数据设置</h1>
      </Header>
      <Main>
        <div className='space-y-6'>
          {/* 币种设置 */}
          <Card>
            <CardHeader>
              <CardTitle>币种设置</CardTitle>
              <CardDescription>配置系统默认币种和汇率换算规则</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <div className='text-sm font-medium'>默认币种</div>
                  <div className='text-sm text-muted-foreground'>
                    设置系统中显示的默认货币单位
                  </div>
                </div>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className='w-32'>
                    <SelectValue placeholder='选择币种' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='CNY'>人民币 (CNY)</SelectItem>
                    <SelectItem value='USD'>美元 (USD)</SelectItem>
                    <SelectItem value='EUR'>欧元 (EUR)</SelectItem>
                    <SelectItem value='GBP'>英镑 (GBP)</SelectItem>
                    <SelectItem value='JPY'>日元 (JPY)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <div className='text-sm font-medium'>汇率换算</div>
                  <div className='text-sm text-muted-foreground'>
                    启用后将自动根据实时汇率换算不同币种的金额
                  </div>
                </div>
                <Switch
                  checked={exchangeRateEnabled}
                  onCheckedChange={setExchangeRateEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* 数据刷新设置 */}
          <Card>
            <CardHeader>
              <CardTitle>数据刷新设置</CardTitle>
              <CardDescription>配置数据自动刷新行为</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <div className='text-sm font-medium'>自动刷新</div>
                  <div className='text-sm text-muted-foreground'>
                    启用后系统将按设定间隔自动刷新数据
                  </div>
                </div>
                <Switch
                  checked={autoRefreshEnabled}
                  onCheckedChange={setAutoRefreshEnabled}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <div className='text-sm font-medium'>刷新间隔</div>
                  <div className='text-sm text-muted-foreground'>
                    设置自动刷新的时间间隔（分钟）
                  </div>
                </div>
                <Select value={refreshInterval} onValueChange={setRefreshInterval} disabled={!autoRefreshEnabled}>
                  <SelectTrigger className='w-32'>
                    <SelectValue placeholder='选择间隔' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>1 分钟</SelectItem>
                    <SelectItem value='5'>5 分钟</SelectItem>
                    <SelectItem value='10'>10 分钟</SelectItem>
                    <SelectItem value='30'>30 分钟</SelectItem>
                    <SelectItem value='60'>1 小时</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 数据导出设置 */}
          <Card>
            <CardHeader>
              <CardTitle>数据导出设置</CardTitle>
              <CardDescription>配置数据导出格式和推送方式</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <div className='text-sm font-medium'>导出格式</div>
                  <div className='text-sm text-muted-foreground'>
                    选择默认的数据导出文件格式
                  </div>
                </div>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className='w-32'>
                    <SelectValue placeholder='选择格式' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='xlsx'>Excel (XLSX)</SelectItem>
                    <SelectItem value='csv'>CSV</SelectItem>
                    <SelectItem value='pdf'>PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <div className='text-sm font-medium'>推送邮箱</div>
                <div className='text-sm text-muted-foreground'>
                  设置数据报告推送的邮箱地址，多个邮箱用逗号分隔
                </div>
                <Input
                  type='email'
                  placeholder='example@company.com'
                  value={pushEmail}
                  onChange={(e) => setPushEmail(e.target.value)}
                  className='max-w-md'
                />
              </div>
            </CardContent>
          </Card>

          {/* 数据权限设置说明 */}
          <Card>
            <CardHeader>
              <CardTitle>数据权限设置</CardTitle>
              <CardDescription>关于数据权限配置的说明</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>
                  数据权限设置用于控制用户对不同数据模块的访问权限。目前权限管理包含以下维度：
                </p>
                <ul className='list-inside list-disc space-y-1 ml-2'>
                  <li>数据可见范围：可设置用户仅查看特定店铺、类目或区域的数据</li>
                  <li>操作权限：包括数据导出、数据编辑、数据删除等操作权限</li>
                  <li>时间范围：限制用户可查看的数据时间跨度</li>
                  <li>敏感数据脱敏：对敏感字段进行脱敏处理</li>
                </ul>
                <p className='pt-2'>
                  如需调整数据权限设置，请联系系统管理员在「用户管理」模块进行配置。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 保存按钮 */}
          <div className='flex justify-end'>
            <Button onClick={handleSave}>保存设置</Button>
          </div>
        </div>
      </Main>
    </>
  )
}