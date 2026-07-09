import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TenantVO } from './auth-api'

interface TenantSelectProps {
  value: string
  onChange: (value: string) => void
  options: TenantVO[]
  placeholder?: string
  className?: string
}

/**
 * 租户选择器. 对应 plus-ui 登录/注册页顶部的可过滤 `el-select` 租户项.
 */
export function TenantSelect({
  value,
  onChange,
  options,
  placeholder = '请选择租户',
  className,
}: TenantSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn('w-full', className)}>
        <span className='flex items-center gap-2'>
          <Building2 className='size-4 text-muted-foreground' />
          <SelectValue placeholder={placeholder} />
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.tenantId} value={item.tenantId}>
            {item.companyName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
