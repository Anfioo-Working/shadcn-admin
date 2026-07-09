
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
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { faker } from '@faker-js/faker'
import {
  RotateCcw,
  DollarSign,
  TrendingDown,
  Clock,
  AlertTriangle,
} from 'lucide-react'

// 设置 faker 种子以确保数据一致性
faker.seed(88888)

// ==================== 类型定义 ====================
interface AftersalesStats {
  refundOrders: number
  refundAmount: number
  refundRate: number
  avgProcessTime: number
}

interface RefundTrendItem {
  date: string
  refundCount: number
  refundAmount: number
}

interface HighRefundProduct {
  id: string
  name: string
  sku: string
  sales: number
  refunds: number
  refundRate: number
}

interface AftersalesTicket {
  id: string
  orderNo: string
  type: '退款' | '退货退款' | '换货' | '维修'
  reason: string
  amount: number
  status: '待处理' | '处理中' | '已完成' | '已拒绝'
  processTime: string
  createdAt: string
}

// ==================== 模拟数据生成 ====================
const aftersalesStats: AftersalesStats = {
  refundOrders: 1847,
  refundAmount: 154371,
  refundRate: 10.02,
  avgProcessTime: 2.3,
}

const refundTrendData: RefundTrendItem[] = Array.from({ length: 14 }, (_, i) => ({
  date: `7/${i + 1}`,
  refundCount: faker.number.int({ min: 80, max: 200 }),
  refundAmount: faker.number.int({ min: 5000, max: 25000 }),
}))

const highRefundProducts: HighRefundProduct[] = [
  { id: '1', name: '便携充电宝 20000mAh', sku: 'SKU-23456', sales: 856, refunds: 157, refundRate: 18.3 },
  { id: '2', name: '蓝牙音箱 Mini', sku: 'SKU-45678', sales: 1243, refunds: 187, refundRate: 15.0 },
  { id: '3', name: 'LED智能台灯', sku: 'SKU-12345', sales: 672, refunds: 94, refundRate: 14.0 },
  { id: '4', name: '无线蓝牙耳机 Pro', sku: 'SKU-78901', sales: 1890, refunds: 227, refundRate: 12.0 },
  { id: '5', name: '不锈钢保温杯 500ml', sku: 'SKU-34567', sales: 2340, refunds: 257, refundRate: 11.0 },
  { id: '6', name: '透气运动跑鞋', sku: 'SKU-56789', sales: 1567, refunds: 172, refundRate: 11.0 },
  { id: '7', name: '速干运动T恤', sku: 'SKU-67890', sales: 3456, refunds: 311, refundRate: 9.0 },
  { id: '8', name: '智能手表 Series 8', sku: 'SKU-89012', sales: 2134, refunds: 192, refundRate: 9.0 },
]

const ticketTypes: AftersalesTicket['type'][] = ['退款', '退货退款', '换货', '维修']
const ticketStatuses: AftersalesTicket['status'][] = ['待处理', '处理中', '已完成', '已拒绝']
const refundReasons = [
  '商品质量问题',
  '商品与描述不符',
  '收到商品损坏',
  '商品缺件/漏发',
  '不喜欢/不想要',
  '尺寸不合适',
  '颜色/款式发错',
  '物流时间过长',
]

const aftersalesTickets: AftersalesTicket[] = Array.from({ length: 50 }, () => ({
  id: faker.string.uuid(),
  orderNo: `ORD-${faker.number.int({ min: 100000, max: 999999 })}`,
  type: faker.helpers.arrayElement(ticketTypes),
  reason: faker.helpers.arrayElement(refundReasons),
  amount: faker.number.int({ min: 50, max: 5000 }),
  status: faker.helpers.arrayElement(ticketStatuses),
  processTime: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }) + '天',
  createdAt: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
}))

// ==================== 统计卡片组件 ====================
function StatCard({
  title,
  value,
  subValue,
  icon,
  bgColor,
  iconColor,
  trend,
  trendType,
}: {
  title: string
  value: string | number
  subValue?: string
  icon: React.ReactNode
  bgColor: string
  iconColor: string
  trend?: number
  trendType?: 'up' | 'down'
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
          {trend !== undefined && (
            <p
              className={`text-xs mt-1 ${
                trendType === 'up' ? 'text-red-500' : 'text-emerald-500'
              }`}
            >
              {trendType === 'up' ? '↑' : '↓'} {Math.abs(trend)}% 较上期
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 退款趋势图表组件 ====================
function RefundTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>退款趋势</CardTitle>
        <CardDescription>近14天退款订单数与金额走势</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={refundTrendData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value, name) => {
                if (name === 'refundAmount') return [`¥${Number(value).toLocaleString()}`, '退款金额']
                return [value, '退款订单数']
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="refundCount"
              name="refundCount"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="refundAmount"
              name="refundAmount"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-muted-foreground">退款订单数</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-muted-foreground">退款金额</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 高退款率商品组件 ====================
function HighRefundProducts() {
  const getRefundRateColor = (rate: number) => {
    if (rate >= 15) return '#ef4444'
    if (rate >= 10) return '#f59e0b'
    return '#22c55e'
  }

  const chartData = highRefundProducts.map((p) => ({
    name: p.name.length > 10 ? p.name.slice(0, 10) + '...' : p.name,
    refundRate: p.refundRate,
    refunds: p.refunds,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          高退款率商品
        </CardTitle>
        <CardDescription>退款率超过10%的商品列表（点击查看详情）</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              domain={[0, 20]}
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, '退款率']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="refundRate" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRefundRateColor(entry.refundRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* 商品详情表格 */}
        <div className="mt-4 border-t pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品名称</TableHead>
                <TableHead className="text-right">销量</TableHead>
                <TableHead className="text-right">退款数</TableHead>
                <TableHead className="text-right">退款率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highRefundProducts.slice(0, 5).map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{product.sales.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{product.refunds.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        product.refundRate >= 15
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : product.refundRate >= 10
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }
                    >
                      {product.refundRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 售后工单表格组件 ====================
function AftersalesTable() {
  const statusConfig: Record<
    AftersalesTicket['status'],
    { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
  > = {
    待处理: { variant: 'secondary', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    处理中: { variant: 'default', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    已完成: { variant: 'outline', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    已拒绝: { variant: 'destructive', className: 'bg-red-50 text-red-700 border-red-200' },
  }

  const typeConfig: Record<AftersalesTicket['type'], string> = {
    退款: 'text-red-600',
    退货退款: 'text-orange-600',
    换货: 'text-blue-600',
    维修: 'text-purple-600',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>售后工单</CardTitle>
        <CardDescription>最近售后工单记录</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单号</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>原因</TableHead>
              <TableHead className="text-right">金额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>处理时长</TableHead>
              <TableHead>创建时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aftersalesTickets.slice(0, 15).map((ticket) => {
              const statusDisplay = statusConfig[ticket.status]
              return (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.orderNo}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${typeConfig[ticket.type]}`}>{ticket.type}</span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={ticket.reason}>
                    {ticket.reason}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ¥{ticket.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusDisplay.variant} className={statusDisplay.className}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.processTime}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.createdAt}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ==================== 主页面组件 ====================
export function AftersalesPage() {
  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">售后中心</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 售后统计卡片行 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="退款订单数"
              value={aftersalesStats.refundOrders.toLocaleString()}
              subValue="累计退款订单"
              icon={<RotateCcw className="h-6 w-6" />}
              bgColor="bg-rose-50 dark:bg-rose-950/30"
              iconColor="text-rose-600"
              trend={3.2}
              trendType="up"
            />
            <StatCard
              title="退款金额"
              value={`¥${aftersalesStats.refundAmount.toLocaleString()}`}
              subValue="累计退款总额"
              icon={<DollarSign className="h-6 w-6" />}
              bgColor="bg-amber-50 dark:bg-amber-950/30"
              iconColor="text-amber-600"
              trend={5.8}
              trendType="up"
            />
            <StatCard
              title="退款率"
              value={`${aftersalesStats.refundRate}%`}
              subValue="退款订单占比"
              icon={<TrendingDown className="h-6 w-6" />}
              bgColor="bg-indigo-50 dark:bg-indigo-950/30"
              iconColor="text-indigo-600"
              trend={1.5}
              trendType="down"
            />
            <StatCard
              title="平均处理时长"
              value={`${aftersalesStats.avgProcessTime}天`}
              subValue="工单平均处理时间"
              icon={<Clock className="h-6 w-6" />}
              bgColor="bg-emerald-50 dark:bg-emerald-950/30"
              iconColor="text-emerald-600"
              trend={8.3}
              trendType="down"
            />
          </div>

          {/* 退款趋势图 */}
          <RefundTrendChart />

          {/* 高退款率商品 */}
          <HighRefundProducts />

          {/* 售后工单表格 */}
          <AftersalesTable />
        </div>
      </Main>
    </>
  )
}