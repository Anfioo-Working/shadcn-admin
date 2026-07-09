import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function IconGitee({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role='img'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='currentColor'
      className={cn(className)}
      {...props}
    >
      <title>Gitee</title>
      <path d='M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.594.594 0 0 0-.592-.593h-4.15a.594.594 0 0 1-.592-.592v-1.482a.594.594 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4.15 4.15 0 0 1-4.15 4.15H6.963a.594.594 0 0 1-.593-.593V9.333a4.15 4.15 0 0 1 4.15-4.15h7.554z' />
    </svg>
  )
}
