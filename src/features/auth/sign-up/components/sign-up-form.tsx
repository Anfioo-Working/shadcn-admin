import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
  register as registerApi,
  type RegisterForm,
  type TenantVO,
} from '../../shared/auth-api'
import { CaptchaImage } from '../../shared/captcha-image'
import { TenantSelect } from '../../shared/tenant-select'

const formSchema = z
  .object({
    tenantId: z.string().min(1, '请输入您的租户编号'),
    username: z
      .string()
      .min(1, '请输入您的账号')
      .min(2, '账号长度在 2 到 20 个字符')
      .max(20, '账号长度在 2 到 20 个字符'),
    password: z
      .string()
      .min(1, '请输入您的密码')
      .min(5, '密码长度在 5 到 20 个字符')
      .max(20, '密码长度在 5 到 20 个字符')
      .regex(/^[^<>"'|\\]+$/, '密码不能包含 < > " \' \\ | 等特殊字符'),
    confirmPassword: z.string().min(1, '请确认您的密码'),
    code: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

type SignUpFormProps = React.HTMLAttributes<HTMLFormElement>

/**
 * 注册表单. 对应 plus-ui `src/views/register.vue` 的注册表单:
 * 租户选择 + 账号 + 密码 + 确认密码 + 图形验证码 + 登录入口.
 */
export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [tenantEnabled, setTenantEnabled] = useState(true)
  const [tenantList, setTenantList] = useState<TenantVO[]>([])

  const [captchaEnabled, setCaptchaEnabled] = useState(true)
  const [codeUrl, setCodeUrl] = useState('')
  const [expectedCode, setExpectedCode] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: DEFAULT_TENANT_ID,
      username: '',
      password: '',
      confirmPassword: '',
      code: '',
    },
  })

  const loadCaptcha = async () => {
    const data = await getCodeImg()
    setCaptchaEnabled(
      data.captchaEnabled === undefined ? true : data.captchaEnabled
    )
    if (data.captchaEnabled) {
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

  useEffect(() => {
    void (async () => {
      await loadCaptcha()
      await loadTenantList()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(data: z.infer<typeof formSchema>) {
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

    // 真实接入后端时调用 `POST /auth/register` (header isEncrypt, grantType: 'password')
    const payload: RegisterForm = {
      tenantId: data.tenantId,
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      code: data.code ?? '',
      uuid: '',
      userType: 'sys_user',
    }

    toast.promise(registerApi(payload), {
      loading: '注册中...',
      success: () => {
        setIsLoading(false)
        // 对应 plus-ui 注册成功提示后跳转登录页
        navigate({ to: '/sign-in' })
        return `恭喜你，您的账号 ${data.username} 注册成功！`
      },
      error: () => {
        setIsLoading(false)
        if (captchaEnabled) loadCaptcha()
        return '注册失败, 请重试'
      },
    })
  }

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
                <Input placeholder='请输入您的账号' {...field} />
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
                <PasswordInput placeholder='请输入您的密码' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <PasswordInput placeholder='请再次输入密码' {...field} />
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

        <Button className='mt-1' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <UserPlus />}
          注册
        </Button>

        <div className='flex items-center justify-center gap-1 text-sm'>
          <span className='text-muted-foreground'>已有账号?</span>
          <button
            type='button'
            onClick={() => navigate({ to: '/sign-in' })}
            className='font-medium text-primary underline underline-offset-4 hover:opacity-80'
          >
            使用已有账户登录
          </button>
        </div>
      </form>
    </Form>
  )
}
