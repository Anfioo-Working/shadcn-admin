import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { sleep, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import {
  DEFAULT_TENANT_ID,
  getCodeImg,
  getTenantList,
  type TenantVO,
} from '../../shared/auth-api'
import { CaptchaImage } from '../../shared/captcha-image'
import { SocialLoginButtons } from '../../shared/social-login-buttons'
import { TenantSelect } from '../../shared/tenant-select'

const REMEMBER_KEYS = {
  tenantId: 'tenantId',
  username: 'username',
  password: 'password',
  rememberMe: 'rememberMe',
} as const

const formSchema = z.object({
  tenantId: z.string().min(1, '请输入您的租户编号'),
  username: z.string().min(1, '请输入您的账号'),
  password: z.string().min(1, '请输入您的密码'),
  code: z.string().optional(),
  rememberMe: z.boolean(),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

/**
 * 登录表单. 对应 plus-ui `src/views/login.vue` 的登录表单:
 * 租户选择 + 账号 + 密码 + 图形验证码 + 记住密码 + 第三方登录 + 注册入口.
 */
export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  // 租户开关 + 列表
  const [tenantEnabled, setTenantEnabled] = useState(true)
  const [tenantList, setTenantList] = useState<TenantVO[]>([])

  // 验证码开关 + 图片 + 期望答案
  const [captchaEnabled, setCaptchaEnabled] = useState(true)
  const [codeUrl, setCodeUrl] = useState('')
  const [expectedCode, setExpectedCode] = useState('')

  // 注册开关 (plus-ui 默认 false, 此处开放以提供注册入口)
  const register = true

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: DEFAULT_TENANT_ID,
      username: '',
      password: '',
      code: '',
      rememberMe: false,
    },
  })

  const loadCaptcha = async () => {
    const data = await getCodeImg()
    setCaptchaEnabled(
      data.captchaEnabled === undefined ? true : data.captchaEnabled
    )
    if (data.captchaEnabled) {
      // 刷新验证码时清空输入框 (uuid 由后端校验使用, 真实接入时随登录请求回传)
      form.setValue('code', '')
      setCodeUrl(data.img)
      setExpectedCode(data.code)
    }
  }

  const loadTenantList = async () => {
    const data = await getTenantList()
    setTenantEnabled(
      data.tenantEnabled === undefined ? true : data.tenantEnabled
    )
    if (data.tenantEnabled) {
      setTenantList(data.voList)
      if (data.voList.length > 0) {
        form.setValue('tenantId', data.voList[0].tenantId)
      }
    }
  }

  // 恢复记住的账号密码 (对应 plus-ui getLoginData)
  const restoreRemembered = () => {
    const tenantId = localStorage.getItem(REMEMBER_KEYS.tenantId)
    const username = localStorage.getItem(REMEMBER_KEYS.username)
    const password = localStorage.getItem(REMEMBER_KEYS.password)
    const rememberMe = localStorage.getItem(REMEMBER_KEYS.rememberMe)
    form.reset({
      tenantId: tenantId ?? form.getValues('tenantId'),
      username: username ?? '',
      password: password ?? '',
      code: '',
      rememberMe: rememberMe === null ? false : rememberMe === 'true',
    })
  }

  useEffect(() => {
    void (async () => {
      await loadCaptcha()
      await loadTenantList()
      restoreRemembered()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(data: z.infer<typeof formSchema>) {
    // 图形验证码校验 (mock: 与本地生成的期望答案比对)
    if (captchaEnabled) {
      if (!data.code) {
        form.setError('code', { message: '请输入验证码' })
        return
      }
      if (data.code.toUpperCase() !== expectedCode.toUpperCase()) {
        form.setError('code', { message: '验证码错误' })
        loadCaptcha()
        return
      }
    }

    setIsLoading(true)

    // 勾选记住密码时写入 localStorage (对应 plus-ui handleLogin)
    if (data.rememberMe) {
      localStorage.setItem(REMEMBER_KEYS.tenantId, String(data.tenantId))
      localStorage.setItem(REMEMBER_KEYS.username, String(data.username))
      localStorage.setItem(REMEMBER_KEYS.password, String(data.password))
      localStorage.setItem(REMEMBER_KEYS.rememberMe, String(data.rememberMe))
    } else {
      Object.values(REMEMBER_KEYS).forEach((key) =>
        localStorage.removeItem(key)
      )
    }

    // 真实接入后端时, 此处构造 LoginData (grantType: 'password') 调用
    // `POST /auth/login`, 成功后写入 token / 用户信息. 这里用 mock 演示.

    toast.promise(sleep(2000), {
      loading: 'Signing in...',
      success: () => {
        setIsLoading(false)

        // mock 认证成功 (真实接入时由后端返回 token / 用户信息)
        const mockUser = {
          accountNo: 'ACC001',
          email: data.username,
          role: ['user'],
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }
        auth.setUser(mockUser)
        auth.setAccessToken('mock-access-token')

        const targetPath = redirectTo || '/'
        navigate({ to: targetPath, replace: true })

        return `Welcome back, ${data.username}!`
      },
      error: () => {
        setIsLoading(false)
        // 登录失败重新获取验证码 (对应 plus-ui)
        if (captchaEnabled) loadCaptcha()
        return '登录失败, 请重试'
      },
    })
  }

  const tenantId = form.watch('tenantId')

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        {tenantEnabled && (
          <FormField
            control={form.control}
            name='tenantId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>租户</FormLabel>
                <FormControl>
                  <TenantSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={tenantList}
                    placeholder='请选择租户'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>账号</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入您的账号'
                  autoComplete='username'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='请输入您的密码'
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {captchaEnabled && (
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>验证码</FormLabel>
                <div className='flex gap-2'>
                  <FormControl>
                    <Input
                      placeholder='请输入验证码'
                      autoComplete='off'
                      className='flex-1'
                      {...field}
                    />
                  </FormControl>
                  <CaptchaImage src={codeUrl} onRefresh={loadCaptcha} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name='rememberMe'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center gap-2 space-y-0'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className='text-sm leading-none font-normal'>
                记住密码
              </FormLabel>
            </FormItem>
          )}
        />

        <Button className='mt-1' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          登录
        </Button>

        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>第三方登录</span>
          <SocialLoginButtons tenantId={tenantId} disabled={isLoading} />
        </div>

        {register && (
          <div className='flex items-center justify-center gap-1 text-sm'>
            <span className='text-muted-foreground'>还没有账号?</span>
            <Link
              to='/sign-up'
              className='font-medium text-primary underline underline-offset-4 hover:opacity-80'
            >
              立即注册
            </Link>
          </div>
        )}
      </form>
    </Form>
  )
}
