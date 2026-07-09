import { Link, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

/**
 * 登录页. 对应 plus-ui `src/views/login.vue`.
 */
export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='w-full max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>登录</CardTitle>
          <CardDescription>
            输入您的账号和密码登录系统. 还没有账号?{' '}
            <Link
              to='/sign-up'
              className='underline underline-offset-4 hover:text-primary'
            >
              立即注册
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
