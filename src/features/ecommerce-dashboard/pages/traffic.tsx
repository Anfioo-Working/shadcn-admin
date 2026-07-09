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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { funnelData, salesTrendData } from '@/features/ecommerce-dashboard/data/dashboard-data'
import { cn } from '@/lib/utils'

// 流量指标数据
const trafficMetrics = [
  {
    label: '访客 UV',
    value: '342,108',
    change: '+15.2%',
    changeType: 'up' as const,
    icon: '👥',
  },
  {
    label: '浏览 PV',
    value: '1,287,433',
    change: '+12.8%',
    changeType: 'up' as const,
    icon: '📄',
  },
  {
    label: '加购人数',
    value: '48,732',
    change: '+8.5%',
    changeType: 'up' as const,
    icon: '🛒',
  },
  {
    label: '下单转化率',
    value: '5.39%',
    change: '-0.3%',
    changeType: 'down' as const,
    icon: '📈',
  },
]

// 流量来源数据
const trafficSourceData = [
  { name: '搜索引擎', value: 128500, color: '#6366f1' },
  { name: '社交媒体', value: 98500, color: '#ec4899' },
  { name: '直接访问', value: 62300, color: '#f59e0b' },
  { name: '广告投放', value: 38200, color: '#10b981' },
  { name: '外链引荐', value: 14608, color: '#06b6d4' },
]

// 漏斗颜色
const funnelColors = [
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
]

// 模拟流量趋势数据
const trafficTrendData = salesTrendData.map(item => ({
  date: item.date,
  uv: Math.round(item.gmv / 300),
  pv: Math.round(item.gmv / 80),
}))

export function TrafficPage() {
  const totalTrafficSource = trafficSourceData.reduce((sum, item) => sum + item.value, 0)

  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">流量分析</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 流量指标卡片 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trafficMetrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <span className="text-xl">{metric.icon}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div
                      className={cn(
                        'mt-1 text-xs',
                        metric.changeType === 'up' ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {metric.change} 较上期
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 两列图表：流量趋势 + 流量来源 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 流量趋势折线图 */}
            <Card>
              <CardHeader>
                <CardTitle>流量趋势</CardTitle>
                <CardDescription>近30天 UV/PV 走势</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [Number(value).toLocaleString(), '']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line
                      type="monotone"
                      dataKey="uv"
                      name="UV"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pv"
                      name="PV"
                      stroke="#ec4899"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 流量来源饼图 */}
            <Card>
              <CardHeader>
                <CardTitle>流量来源分布</CardTitle>
                <CardDescription>各渠道流量占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={trafficSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {trafficSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [
                        `${Number(value).toLocaleString()} (${((Number(value) / totalTrafficSource) * 100).toFixed(1)}%)`,
                        '',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {trafficSourceData.map((source) => (
                    <div
                      key={source.name}
                      className="flex items-center justify-between rounded-lg border px-3 py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="text-xs font-medium">{source.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {((source.value / totalTrafficSource) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 转化漏斗 */}
          <Card>
            <CardHeader>
              <CardTitle>转化漏斗</CardTitle>
              <CardDescription>访客浏览 → 确认收货 全链路转化</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {funnelData.map((item, index) => {
                const maxValue = funnelData[0].value
                const width = (item.value / maxValue) * 100
                const dropoff =
                  index > 0
                    ? (
                        ((funnelData[index - 1].value - item.value) /
                          funnelData[index - 1].value) *
                        100
                      ).toFixed(1)
                    : null

                return (
                  <div key={item.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {item.value.toLocaleString()}
                        </span>
                        <span className="font-semibold text-foreground">{item.rate}</span>
                      </div>
                    </div>
                    <div className="relative h-8 overflow-hidden rounded-lg bg-muted">
                      <div
                        className={cn(
                          'flex h-full items-center justify-end rounded-lg px-3 text-xs font-medium text-white transition-all',
                          funnelColors[index]
                        )}
                        style={{ width: `${width}%` }}
                      >
                        {item.value.toLocaleString()}
                      </div>
                    </div>
                    {dropoff && (
                      <p className="text-xs text-red-500">流失 {dropoff}% ↓</p>
                    )}
                  </div>
                )
              })}
              <div className="mt-2 rounded-lg bg-muted/50 p-2 text-center text-xs text-muted-foreground">
                整体转化率:{' '}
                <span className="font-semibold text-foreground">
                  {funnelData[funnelData.length - 1].rate}
                </span>{' '}
                | 最大流失节点:{' '}
                <span className="font-semibold text-red-500">加购 → 提交订单</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}