import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CaptchaImageProps {
  /** 验证码图片 (base64 data url) */
  src: string
  /** 点击图片刷新验证码 */
  onRefresh: () => void
  className?: string
}

/**
 * 图形验证码图片. 对应 plus-ui 登录/注册页右侧 `<img :src="codeUrl" @click="getCode" />`.
 * 点击可刷新.
 */
export function CaptchaImage({ src, onRefresh, className }: CaptchaImageProps) {
  return (
    <button
      type='button'
      onClick={onRefresh}
      title='点击刷新验证码'
      className={cn(
        'flex h-9 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-muted/40 transition-colors hover:border-primary/50',
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt='验证码'
          className='h-full w-full object-cover'
          draggable={false}
        />
      ) : (
        <Loader2 className='size-4 animate-spin text-muted-foreground' />
      )}
    </button>
  )
}
