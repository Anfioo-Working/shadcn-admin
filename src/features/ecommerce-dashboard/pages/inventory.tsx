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
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { inventoryData, riskAlerts } from '@/features/ecommerce-dashboard/data/dashboard-data'
import { cn } from '@/lib/utils'

// 库存统计计算
const totalStock = inventoryData.reduce((sum, item) => sum + item.stock, 0)
const lowStockCount = inventoryData.filter((item) => item.status === 'warning').length
const outOfStockCount = 12 // 缺货SKU数量（从kpiCards数据中获取）
const overstockValue = 183200 // 积压金额（从kpiCards数据中获取）
const overstockCategories = inventoryData.filter((item) => item.status === 'danger')

// 库存预警统计卡片配置
const inventoryStats = [
  {
    label: '总库存',
    value: totalStock.toLocaleString(),
    subValue: '件商品',
    change: 5.2,
    changeType: 'up' as const,
    icon: Package,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    label: '低库存商品',
    value: lowStockCount.toString(),
    subValue: '需补货',
    change: -3,
    changeType: 'down' as const,
    icon: AlertTriangle,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    label: '缺货SKU',
    value: outOfStockCount.toString(),
    subValue: '已售罄',
    change: -2,
    changeType: 'down' as const,
    icon: XCircle,
    color: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  {
    label: '积压金额',
    value: `¥${(overstockValue / 10000).toFixed(1)}万`,
    subValue: `${overstockCategories.length}个品类`,
    change: 8.5,
    changeType: 'up' as const,
    icon: DollarSign,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
]

const statusColors: Record<string, string> = {
  normal: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
}

const statusLabels: Record<string, string> = {
  normal: '正常',
  warning: '预警',
  danger: '积压',
}

const statusBadgeClass: Record<string, string> = {
  normal: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400',
  danger: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400',
}

// 筛选库存类型的预警
const inventoryAlerts = riskAlerts.filter((alert) => alert.type === 'inventory')

export function InventoryPage() {
  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">库存概览</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 库存统计卡片 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {inventoryStats.map((stat) => (
              <Card
                key={stat.label}
                className="transition-all hover:shadow-lg hover:ring-1 hover:ring-primary/20"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{stat.subValue}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'gap-0.5 text-xs font-semibold',
                        stat.changeType === 'up'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400'
                      )}
                    >
                      {stat.changeType === 'up' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(stat.change)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 库存周转柱状图 */}
          <Card>
            <CardHeader>
              <CardTitle>库存周转分析</CardTitle>
              <CardDescription>各品类库存数量与周转状态</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="category"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value, name) => {
                      if (name === '周转天数') return [`${value}天`, name]
                      return [Number(value).toLocaleString(), name]
                    }}
                  />
                  <Bar dataKey="stock" name="库存数量" radius={[4, 4, 0, 0]}>
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {inventoryData.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between rounded-lg border p-2.5"
                  >
                    <div>
                      <span className="text-sm font-medium">{item.category}</span>
                      <p className="text-xs text-muted-foreground">
                        周转 {item.turnoverDays}天
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${statusBadgeClass[item.status]}`}>
                      {statusLabels[item.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 库存预警列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                库存预警
              </CardTitle>
              <CardDescription>
                实时监控库存异常，及时处理风险问题
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inventoryAlerts.length > 0 ? (
                inventoryAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50',
                      alert.level === 'high' && 'border-red-200 dark:border-red-900/50',
                      alert.level === 'medium' && 'border-amber-200 dark:border-amber-900/50',
                      alert.level === 'low' && 'border-blue-200 dark:border-blue-900/50'
                    )}
                  >
                    <div className={cn(
                      'mt-0.5 shrink-0',
                      alert.level === 'high' && 'text-red-500',
                      alert.level === 'medium' && 'text-amber-500',
                      alert.level === 'low' && 'text-blue-500'
                    )}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{alert.title}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            alert.level === 'high' && 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400',
                            alert.level === 'medium' && 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400',
                            alert.level === 'low' && 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400'
                          )}
                        >
                          {alert.level === 'high' ? '高' : alert.level === 'medium' ? '中' : '低'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 gap-1 text-xs">
                      {alert.action}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">暂无库存预警</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}