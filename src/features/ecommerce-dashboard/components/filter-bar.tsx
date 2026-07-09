import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  RefreshCw,
  Calendar,
  Store,
  Tags,
  Globe,
  Coins,
  Zap,
} from 'lucide-react'
import {
  timeRanges,
  channels_filter,
  categoryOptions,
  stores,
  currencies,
  refreshIntervals,
} from '../data/dashboard-data'

export function FilterBar() {
  return (
    <div className='flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4 shadow-sm'>
      {/* 时间筛选 */}
      <div className='flex items-center gap-2'>
        <Calendar className='h-4 w-4 text-muted-foreground' />
        <Select defaultValue='近7天'>
          <SelectTrigger className='w-[130px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 渠道筛选 */}
      <div className='flex items-center gap-2'>
        <Globe className='h-4 w-4 text-muted-foreground' />
        <Select defaultValue='全渠道'>
          <SelectTrigger className='w-[120px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {channels_filter.map((ch) => (
              <SelectItem key={ch} value={ch}>
                {ch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 商品分类 */}
      <div className='flex items-center gap-2'>
        <Tags className='h-4 w-4 text-muted-foreground' />
        <Select defaultValue='全品类'>
          <SelectTrigger className='w-[110px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 店铺切换 */}
      <div className='flex items-center gap-2'>
        <Store className='h-4 w-4 text-muted-foreground' />
        <Select defaultValue='全部店铺'>
          <SelectTrigger className='w-[140px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stores.map((store) => (
              <SelectItem key={store} value={store}>
                {store}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 币种切换 */}
      <div className='flex items-center gap-2'>
        <Coins className='h-4 w-4 text-muted-foreground' />
        <Select defaultValue='CNY ¥'>
          <SelectTrigger className='w-[90px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((cur) => (
              <SelectItem key={cur} value={cur}>
                {cur}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='ms-auto flex items-center gap-3'>
        {/* 自动刷新 */}
        <div className='flex items-center gap-2'>
          <Zap className='h-4 w-4 text-muted-foreground' />
          <Select defaultValue='关闭'>
            <SelectTrigger className='w-[100px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {refreshIntervals.map((interval) => (
                <SelectItem key={interval} value={interval}>
                  {interval}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 刷新按钮 */}
        <Button variant='outline' size='icon' className='h-9 w-9'>
          <RefreshCw className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
