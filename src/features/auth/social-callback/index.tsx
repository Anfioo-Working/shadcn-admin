import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { sleep } from '@/lib/utils'

interface SocialState {
  tenantId: string
  domain: string
}

function decodeState(state: string): SocialState {
  try {
    return JSON.parse(atob(state)) as SocialState
  } catch {
    return { tenantId: '000000', domain: window.location.host }
  }
}

/**
 * 第三方登录回调页. 对应 plus-ui `src/layout/components/SocialCallback/index.vue`.
 *
 * 第三方授权完成后平台重定向回此页面, 由本页用授权码换取 token 完成登录.
 * 页面本身无表单, 仅显示全屏 loading 遮罩.
 *
 * 真实接入时: 无 token 调 `POST /auth/login` (grantType: 'social'),
 * 已有 token 调 `POST /auth/social/callback` 绑定第三方账号.
 * 此处为 mock: 直接模拟登录成功并跳转首页.
 */
export function SocialCallback() {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { code, state, source } = useSearch({ from: '/(auth)/social-callback' })
  const [message, setMessage] = useState('正在处理第三方登录, 请稍候...')
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const run = async () => {
      const stateJson = decodeState(state ?? '')
      const tenantId = stateJson.tenantId || '000000'
      const domain = stateJson.domain

      // 域名不一致则重定向到原域名 (对应 plus-ui init 中的域名校验)
      if (domain && domain !== window.location.host) {
        const urlFull = new URL(window.location.href)
        urlFull.host = domain
        window.location.href = urlFull.toString()
        return
      }

      try {
        // mock: 用授权码换取 token (真实接入时调用 login / callback 接口)
        await sleep(1500)
        void code
        void source
        void tenantId

        const mockUser = {
          accountNo: 'SOC001',
          email: `${source || 'social'}-user`,
          role: ['user'],
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }
        auth.setUser(mockUser)
        auth.setAccessToken('mock-access-token')

        setMessage('登录成功, 即将跳转...')
        toast.success('第三方登录成功')
        setTimeout(() => navigate({ to: '/', replace: true }), 1500)
      } catch (err) {
        setMessage('登录失败, 即将跳转登录页...')
        toast.error(err instanceof Error ? err.message : '第三方登录失败')
        setTimeout(() => navigate({ to: '/sign-in', replace: true }), 1500)
      }
    }

    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-4 bg-background'>
      <Loader2 className='size-8 animate-spin text-primary' />
      <p className='text-sm text-muted-foreground'>{message}</p>
    </div>
  )
}
