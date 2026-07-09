import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { adRoiData, channelData } from '@/features/ecommerce-dashboard/data/dashboard-data'
import { ExportBar } from '@/features/ecommerce-dashboard/components/export-bar'
import { Badge } from '@/components/ui/badge'

// 渠道效果数据（基于 channelData 扩展）
const channelPerformanceData = channelData.map((channel) => ({
  name: channel.name,
  spend: Math.round(channel.value * 0.15), // 广告花费约为 GMV 的 15%
  gmv: channel.value,
  roi: (channel.value / (channel.value * 0.15)).toFixed(2),
  clickRate: (Math.random() * 5 + 2).toFixed(2), // 点击率 2%-7%
  conversionRate: (Math.random() * 3 + 1).toFixed(2), // 转化率 1%-4%
}))

// 格式化金额
const formatCurrency = (value: number) => `¥${value.toLocaleString()}`

// 自定义 Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-lg border bg-popover p-3 shadow-md'>
        <p className='mb-2 text-sm font-medium'>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className='text-xs' style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'ROI' ? entry.value : formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AdsPage() {
  return (
    <>
      <Header>
        <h1 className='text-lg font-semibold'>广告投放分析</h1>
      </Header>

      <Main>
        <div className='space-y-6'>
          {/* 广告ROI双轴图表 */}
          <Card>
            <CardHeader>
              <CardTitle>广告ROI分析</CardTitle>
              <CardDescription>广告花费、GMV与ROI趋势对比</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={400}>
                <ComposedChart data={adRoiData}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                  <XAxis
                    dataKey='date'
                    stroke='#888888'
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId='left'
                    stroke='#888888'
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
                  />
                  <YAxis
                    yAxisId='right'
                    orientation='right'
                    stroke='#888888'
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v.toFixed(1)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar
                    yAxisId='left'
                    dataKey='adSpend'
                    name='广告花费'
                    fill='#6366f1'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId='left'
                    dataKey='gmv'
                    name='GMV'
                    fill='#10b981'
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId='right'
                    type='monotone'
                    dataKey='roi'
                    name='ROI'
                    stroke='#f59e0b'
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 广告渠道效果表格 */}
          <Card>
            <CardHeader>
              <CardTitle>渠道效果分析</CardTitle>
              <CardDescription>各渠道广告投放效果对比</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[120px]'>渠道</TableHead>
                    <TableHead className='text-right'>花费</TableHead>
                    <TableHead className='text-right'>GMV</TableHead>
                    <TableHead className='text-right'>ROI</TableHead>
                    <TableHead className='text-right'>点击率</TableHead>
                    <TableHead className='text-right'>转化率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelPerformanceData.map((channel) => {
                    const roiValue = parseFloat(channel.roi)
                    const isGoodRoi = roiValue >= 5
                    const isMediumRoi = roiValue >= 3 && roiValue < 5
                    return (
                      <TableRow key={channel.name}>
                        <TableCell className='font-medium'>{channel.name}</TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(channel.spend)}
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(channel.gmv)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Badge
                            variant='outline'
                            className={
                              isGoodRoi
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400'
                                : isMediumRoi
                                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400'
                                  : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400'
                            }
                          >
                            {channel.roi}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>{channel.clickRate}%</TableCell>
                        <TableCell className='text-right'>{channel.conversionRate}%</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 导出按钮区域 */}
          <ExportBar />
        </div>
      </Main>
    </>
  )
}