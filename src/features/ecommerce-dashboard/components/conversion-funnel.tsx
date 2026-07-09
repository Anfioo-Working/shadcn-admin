import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { funnelData } from '../data/dashboard-data'
import { cn } from '@/lib/utils'

const funnelColors = [
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
]

export function ConversionFunnel() {
  const maxValue = funnelData[0].value

  return (
    <Card>
      <CardHeader>
        <CardTitle>订单转化漏斗</CardTitle>
        <CardDescription>访客浏览 → 确认收货 全链路转化</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {funnelData.map((item, index) => {
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
            <div key={item.stage} className='space-y-1'>
              <div className='flex items-center justify-between text-sm'>
                <span className='font-medium'>{item.stage}</span>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground'>
                    {item.value.toLocaleString()}
                  </span>
                  <span className='font-semibold text-foreground'>
                    {item.rate}
                  </span>
                </div>
              </div>
              <div className='relative h-8 overflow-hidden rounded-lg bg-muted'>
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
                <p className='text-xs text-red-500'>
                  流失 {dropoff}% ↓
                </p>
              )}
            </div>
          )
        })}
        <div className='mt-2 rounded-lg bg-muted/50 p-2 text-center text-xs text-muted-foreground'>
          整体转化率:{' '}
          <span className='font-semibold text-foreground'>
            {funnelData[funnelData.length - 1].rate}
          </span>{' '}
          | 最大流失节点:{' '}
          <span className='font-semibold text-red-500'>加购 → 提交订单</span>
        </div>
      </CardContent>
    </Card>
  )
}
