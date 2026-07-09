import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { hotProducts } from '../data/dashboard-data'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const top10 = hotProducts.slice(0, 10)

const rankColors = [
  '#f59e0b', '#a78bfa', '#60a5fa',
  '#34d399', '#f472b6', '#22d3ee',
  '#fb923c', '#a3e635', '#c084fc', '#94a3b8',
]

export function HotProductsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>热销商品 TOP10</CardTitle>
        <CardDescription>按销售额排名，升降标记</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={top10}
            layout='vertical'
            margin={{ left: 10, right: 30 }}
          >
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' horizontal={false} />
            <XAxis
              type='number'
              stroke='#888888'
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
            />
            <YAxis
              type='category'
              dataKey='name'
              stroke='#888888'
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
            <Bar dataKey='revenue' radius={[0, 4, 4, 0]}>
              {top10.map((_, index) => (
                <Cell key={`cell-${index}`} fill={rankColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5'>
          {top10.slice(0, 5).map((product) => (
            <div
              key={product.sku}
              className='flex items-center gap-1.5 rounded-lg border p-2'
            >
              <span className='text-xs font-bold text-muted-foreground'>
                #{product.rank}
              </span>
              <span className='truncate text-xs'>{product.name}</span>
              {product.trend === 'up' && (
                <TrendingUp className='h-3 w-3 shrink-0 text-emerald-500' />
              )}
              {product.trend === 'down' && (
                <TrendingDown className='h-3 w-3 shrink-0 text-red-500' />
              )}
              {product.trend === 'same' && (
                <Minus className='h-3 w-3 shrink-0 text-muted-foreground' />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
