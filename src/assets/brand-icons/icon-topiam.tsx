import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function IconTopiam({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role='img'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('[&>path]:stroke-current', className)}
      {...props}
    >
      <title>TopIam</title>
      <path d='M3 7h18' />
      <path d='M12 7v13' />
      <path d='M5 7c0 6 3 13 7 13s7-7 7-13' />
      <path d='M9 3h6' />
    </svg>
  )
}
