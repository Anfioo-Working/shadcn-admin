import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { salesTrendData } from '@/features/ecommerce-dashboard/data/dashboard-data'
import { ExportBar } from '@/features/ecommerce-dashboard/components/export-bar'
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from 'lucide-react'

// 计算日环比和周同比数据
function calculateTrendMetrics() {
  const data = salesTrendData
  const lastTwoDays = data.slice(-2)
  const today = lastTwoDays[1]?.gmv || 0
  const yesterday = lastTwoDays[0]?.gmv || 0
  const dayOverDayChange = yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 0

  // 计算周同比（最近7天 vs 上一个7天）
  const last7Days = data.slice(-7)
  const prev7Days = data.slice(-14, -7)
  const last7DaysTotal = last7Days.reduce((sum, item) => sum + item.gmv, 0)
  const prev7DaysTotal = prev7Days.reduce((sum, item) => sum + item.gmv, 0)
  const weekOverWeekChange = prev7DaysTotal > 0 ? ((last7DaysTotal - prev7DaysTotal) / prev7DaysTotal) * 100 : 0

  return {
    todayGmv: today,
    yesterdayGmv: yesterday,
    dayOverDayChange,
    last7DaysTotal,
    prev7DaysTotal,
    weekOverWeekChange,
  }
}

export function SalesTrendPage() {
  const metrics = calculateTrendMetrics()

  return (
    <>
      <Header>
        <h1 className='text-lg font-semibold'>销售趋势分析</h1>
      </Header>

      <Main>
        <div className='space-y-6'>
          {/* 数据卡片 */}
          <div className='grid gap-4 sm:grid-cols-2'>
            {/* GMV 日环比卡片 */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  GMV 日环比
                </CardTitle>
                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400'>
                  <Calendar className='h-5 w-5' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold tracking-tight'>
                  ¥{metrics.todayGmv.toLocaleString()}
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <span className='text-xs text-muted-foreground'>
                    较昨日 ¥{metrics.yesterdayGmv.toLocaleString()}
                  </span>
                  <Badge
                    variant='outline'
                    className={`gap-0.5 text-xs font-semibold ${
                      metrics.dayOverDayChange >= 0
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400'
                    }`}
                  >
                    {metrics.dayOverDayChange >= 0 ? (
                      <ArrowUpRight className='h-3 w-3' />
                    ) : (
                      <ArrowDownRight className='h-3 w-3' />
                    )}
                    {Math.abs(metrics.dayOverDayChange).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* GMV 周同比卡片 */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  GMV 周同比
                </CardTitle>
                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400'>
                  <TrendingUp className='h-5 w-5' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold tracking-tight'>
                  ¥{metrics.last7DaysTotal.toLocaleString()}
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <span className='text-xs text-muted-foreground'>
                    上周 ¥{metrics.prev7DaysTotal.toLocaleString()}
                  </span>
                  <Badge
                    variant='outline'
                    className={`gap-0.5 text-xs font-semibold ${
                      metrics.weekOverWeekChange >= 0
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400'
                    }`}
                  >
                    {metrics.weekOverWeekChange >= 0 ? (
                      <ArrowUpRight className='h-3 w-3' />
                    ) : (
                      <ArrowDownRight className='h-3 w-3' />
                    )}
                    {Math.abs(metrics.weekOverWeekChange).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 销售额趋势折线图（大尺寸） */}
          <Card>
            <CardHeader>
              <CardTitle>销售额趋势</CardTitle>
              <CardDescription>近30天 GMV 走势与同期对比</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={450}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                  <XAxis
                    dataKey='date'
                    stroke='#888888'
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='#888888'
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`¥${Number(value).toLocaleString()}`, '']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type='monotone'
                    dataKey='gmv'
                    name='本期 GMV'
                    stroke='#6366f1'
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='lastPeriod'
                    name='上期对比'
                    stroke='#94a3b8'
                    strokeWidth={1.5}
                    strokeDasharray='5 5'
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* GMV 面积图 */}
          <Card>
            <CardHeader>
              <CardTitle>GMV 趋势面积图</CardTitle>
              <CardDescription>本期与上期 GMV 对比</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={350}>
                <AreaChart data={salesTrendData}>
                  <defs>
                    <linearGradient id='colorGmv' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#6366f1' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#6366f1' stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id='colorLastPeriod' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#94a3b8' stopOpacity={0.2} />
                      <stop offset='95%' stopColor='#94a3b8' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                  <XAxis
                    dataKey='date'
                    stroke='#888888'
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='#888888'
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`¥${Number(value).toLocaleString()}`, '']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area
                    type='monotone'
                    dataKey='gmv'
                    name='本期 GMV'
                    stroke='#6366f1'
                    strokeWidth={2}
                    fillOpacity={1}
                    fill='url(#colorGmv)'
                  />
                  <Area
                    type='monotone'
                    dataKey='lastPeriod'
                    name='上期对比'
                    stroke='#94a3b8'
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill='url(#colorLastPeriod)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 导出按钮区域 */}
          <ExportBar />
        </div>
      </Main>
    </>
  )
}