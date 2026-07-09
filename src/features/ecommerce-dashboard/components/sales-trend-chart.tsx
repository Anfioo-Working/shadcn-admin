import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { salesTrendData } from '../data/dashboard-data'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function SalesTrendChart() {
  const [showCompare, setShowCompare] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>销售额趋势</CardTitle>
        <CardDescription>近30天 GMV 走势与同期对比</CardDescription>
        <CardAction>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() => setShowCompare(!showCompare)}
          >
            {showCompare ? (
              <Eye className='h-4 w-4' />
            ) : (
              <EyeOff className='h-4 w-4' />
            )}
            同期对比
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
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
              activeDot={{ r: 5 }}
            />
            {showCompare && (
              <Line
                type='monotone'
                dataKey='lastPeriod'
                name='上期对比'
                stroke='#94a3b8'
                strokeWidth={1.5}
                strokeDasharray='5 5'
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
