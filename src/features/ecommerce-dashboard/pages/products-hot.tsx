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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { hotProducts } from '@/features/ecommerce-dashboard/data/dashboard-data'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const rankColors = [
  '#f59e0b', '#a78bfa', '#60a5fa',
  '#34d399', '#f472b6', '#22d3ee',
  '#fb923c', '#a3e635', '#c084fc', '#94a3b8',
  '#f87171', '#38bdf8', '#a3e635', '#e879f9', '#fbbf24',
  '#2dd4bf', '#818cf8', '#fb7185', '#4ade80', '#facc15',
]

function getTrendIcon(trend: 'up' | 'down' | 'same') {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-emerald-500" />
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />
    case 'same':
      return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

function getRankChangeBadge(rankChange: number) {
  if (rankChange === 0) {
    return <span className="text-muted-foreground">-</span>
  }
  const isUp = rankChange > 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isUp ? 'text-emerald-500' : 'text-red-500'
      }`}
    >
      {isUp ? '↑' : '↓'}
      {Math.abs(rankChange)}
    </span>
  )
}

export function ProductsHotPage() {
  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">热销商品排行</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* TOP20 热销商品柱状图 */}
          <Card>
            <CardHeader>
              <CardTitle>TOP20 热销商品</CardTitle>
              <CardDescription>按销售额排名的热销商品横向柱状图</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={hotProducts}
                  layout="vertical"
                  margin={{ left: 10, right: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`¥${Number(value).toLocaleString()}`, '销售额']}
                  />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {hotProducts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={rankColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 商品排行表格 */}
          <Card>
            <CardHeader>
              <CardTitle>商品排行明细</CardTitle>
              <CardDescription>热销商品详细数据，包含排名、销量、销售额、趋势等信息</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">排名</TableHead>
                    <TableHead>商品名</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">销量</TableHead>
                    <TableHead className="text-right">销售额</TableHead>
                    <TableHead className="text-center">趋势</TableHead>
                    <TableHead className="text-center">排名变化</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotProducts.map((product) => (
                    <TableRow key={product.sku}>
                      <TableCell className="font-medium">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            product.rank <= 3
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {product.rank}
                        </span>
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                      <TableCell className="text-right">
                        {product.sales.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ¥{product.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {getTrendIcon(product.trend)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getRankChangeBadge(product.rankChange)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}