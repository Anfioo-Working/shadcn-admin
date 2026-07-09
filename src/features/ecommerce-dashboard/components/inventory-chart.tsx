import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { inventoryData } from '../data/dashboard-data'

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

export function InventoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>库存周转分析</CardTitle>
        <CardDescription>各品类库存剩余与周转天数</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={260}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='category'
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
            <Bar dataKey='stock' name='库存数量' radius={[4, 4, 0, 0]}>
              {inventoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4'>
          {inventoryData.slice(0, 4).map((item) => (
            <div
              key={item.category}
              className='flex items-center justify-between rounded-lg border p-2'
            >
              <div>
                <span className='text-xs font-medium'>{item.category}</span>
                <p className='text-xs text-muted-foreground'>
                  周转 {item.turnoverDays}天
                </p>
              </div>
              <Badge variant='outline' className={`text-xs ${statusBadgeClass[item.status]}`}>
                {statusLabels[item.status]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
