import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function IconMaxkey({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      <title>MaxKey</title>
      <circle cx='8' cy='15' r='4' />
      <path d='M10.85 12.15 19 4' />
      <path d='m18 5 3 3' />
      <path d='m15 8 3 3' />
    </svg>
  )
}
