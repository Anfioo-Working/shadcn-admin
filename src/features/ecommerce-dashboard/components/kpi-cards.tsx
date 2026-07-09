import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { kpiCards } from '../data/dashboard-data'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ReactNode> = {
  dollar: <DollarSign className='h-5 w-5' />,
  'shopping-bag': <ShoppingCart className='h-5 w-5' />,
  users: <Users className='h-5 w-5' />,
  'trending-up': <TrendingUp className='h-5 w-5' />,
  package: <Package className='h-5 w-5' />,
}

const colorMap: Record<string, string> = {
  dollar: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'shopping-bag': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  users: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'trending-up': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  package: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

export function KpiCards() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
      {kpiCards.map((kpi) => (
        <Card
          key={kpi.label}
          className='group cursor-pointer transition-all hover:shadow-lg hover:ring-1 hover:ring-primary/20'
        >
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              {kpi.label}
            </CardTitle>
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg',
                colorMap[kpi.icon]
              )}
            >
              {iconMap[kpi.icon]}
            </div>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='text-2xl font-bold tracking-tight'>
              {kpi.value}
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>
                {kpi.subValue}
              </span>
              <Badge
                variant='outline'
                className={cn(
                  'gap-0.5 text-xs font-semibold',
                  kpi.changeType === 'up'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400'
                )}
              >
                {kpi.changeType === 'up' ? (
                  <ArrowUpRight className='h-3 w-3' />
                ) : (
                  <ArrowDownRight className='h-3 w-3' />
                )}
                {Math.abs(kpi.change)}%
              </Badge>
            </div>
            {/* 展开详情（hover显示） */}
            <div className='space-y-1 border-t pt-2 opacity-0 transition-opacity group-hover:opacity-100'>
              {kpi.details.map((detail) => (
                <div
                  key={detail.label}
                  className='flex items-center justify-between text-xs'
                >
                  <span className='text-muted-foreground'>{detail.label}</span>
                  <span className='font-medium'>{detail.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
