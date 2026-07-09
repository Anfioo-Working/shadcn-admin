import { Logo } from '@/assets/logo'
import { ThemeSwitch } from '@/components/theme-switch'

type AuthLayoutProps = {
  children: React.ReactNode
}

/**
 * 认证页通用布局.
 *
 * 对齐 plus-ui 登录/注册页的整体外观:
 * - 全屏渐变背景
 * - 居中卡片
 * - 顶部应用 Logo + 标题
 * - 右上角主题切换 (对应 plus-ui 的语言切换 `lang-select`)
 * - 底部版权信息
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-background to-muted p-4'>
      {/* 装饰光斑 */}
      <div className='pointer-events-none absolute -start-40 -top-40 size-96 rounded-full bg-primary/20 blur-3xl' />
      <div className='pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full bg-primary/10 blur-3xl' />

      {/* 右上角主题切换 */}
      <div className='absolute end-4 top-4 z-20'>
        <ThemeSwitch />
      </div>

      <div className='relative z-10 mx-auto flex w-full flex-col items-center'>
        <div className='mb-6 flex items-center gap-2'>
          <Logo className='size-7' />
          <h1 className='text-xl font-medium'>Shadcn Admin</h1>
        </div>
        {children}
      </div>

      {/* 底部版权 */}
      <div className='absolute inset-x-0 bottom-0 py-4 text-center text-xs text-muted-foreground'>
        Copyright © 2018-2026 疯狂的狮子Li All Rights Reserved.
      </div>
    </div>
  )
}
