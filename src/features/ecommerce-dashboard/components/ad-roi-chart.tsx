import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { adRoiData } from '../data/dashboard-data'

export function AdRoiChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>广告投入 & ROI</CardTitle>
        <CardDescription>广告花费、产出 GMV、投产比同步查看</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
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
              tickFormatter={(v) => `¥${(v / 10000).toFixed(1)}万`}
            />
            <YAxis
              yAxisId='right'
              orientation='right'
              stroke='#888888'
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}x`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value, name) => {
                if (name === 'ROI') return [`${value}x`, name]
                return [`¥${Number(value).toLocaleString()}`, name]
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar
              yAxisId='left'
              dataKey='adSpend'
              name='广告花费'
              fill='#f59e0b'
              radius={[3, 3, 0, 0]}
              barSize={12}
            />
            <Bar
              yAxisId='left'
              dataKey='gmv'
              name='产出 GMV'
              fill='#6366f1'
              radius={[3, 3, 0, 0]}
              barSize={12}
            />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='roi'
              name='ROI'
              stroke='#ec4899'
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
