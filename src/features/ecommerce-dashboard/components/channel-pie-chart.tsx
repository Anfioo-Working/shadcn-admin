import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { channelData } from '../data/dashboard-data'

export function ChannelPieChart() {
  const total = channelData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>渠道销售额占比</CardTitle>
        <CardDescription>各平台营收分布，点击查看详情</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={260}>
          <PieChart>
            <Pie
              data={channelData}
              cx='50%'
              cy='50%'
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey='value'
            >
              {channelData.map((entry, index) => (
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
                `¥${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                '',
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className='mt-2 grid grid-cols-2 gap-2'>
          {channelData.map((channel) => (
            <div
              key={channel.name}
              className='flex items-center justify-between rounded-lg border px-3 py-1.5'
            >
              <div className='flex items-center gap-2'>
                <div
                  className='h-2.5 w-2.5 rounded-full'
                  style={{ backgroundColor: channel.color }}
                />
                <span className='text-xs font-medium'>{channel.name}</span>
              </div>
              <Badge variant='secondary' className='text-xs'>
                {((channel.value / total) * 100).toFixed(1)}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
