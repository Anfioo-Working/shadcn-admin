import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react'
import { riskAlerts, type RiskAlert } from '../data/dashboard-data'
import { cn } from '@/lib/utils'

const levelConfig: Record<
  RiskAlert['level'],
  { icon: React.ReactNode; color: string; badgeClass: string }
> = {
  high: {
    icon: <AlertCircle className='h-5 w-5' />,
    color: 'text-red-500',
    badgeClass:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400',
  },
  medium: {
    icon: <AlertTriangle className='h-5 w-5' />,
    color: 'text-amber-500',
    badgeClass:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400',
  },
  low: {
    icon: <Info className='h-5 w-5' />,
    color: 'text-blue-500',
    badgeClass:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400',
  },
}

const typeLabels: Record<RiskAlert['type'], string> = {
  refund: '退款预警',
  inventory: '库存预警',
  order: '订单异常',
  channel: '渠道亏损',
}

export function RiskAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <AlertTriangle className='h-5 w-5 text-amber-500' />
          售后 & 风险预警
        </CardTitle>
        <CardDescription>
          系统自动监控异常数据，实时推送预警通知
        </CardDescription>
        <CardAction>
          <Badge variant='secondary'>{riskAlerts.length} 条预警</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className='space-y-3'>
        {riskAlerts.map((alert, index) => {
          const config = levelConfig[alert.level]
          return (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50',
                alert.level === 'high' && 'border-red-200 dark:border-red-900/50',
                alert.level === 'medium' && 'border-amber-200 dark:border-amber-900/50',
                alert.level === 'low' && 'border-blue-200 dark:border-blue-900/50'
              )}
            >
              <div className={cn('mt-0.5 shrink-0', config.color)}>
                {config.icon}
              </div>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>{alert.title}</span>
                  <Badge variant='outline' className={cn('text-xs', config.badgeClass)}>
                    {typeLabels[alert.type]}
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  {alert.description}
                </p>
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='shrink-0 gap-1 text-xs'
              >
                {alert.action}
                <ChevronRight className='h-3 w-3' />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
