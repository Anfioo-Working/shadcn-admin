import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

/**
 * 注册页. 对应 plus-ui `src/views/register.vue`.
 */
export function SignUp() {
  return (
    <AuthLayout>
      <Card className='w-full max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>注册</CardTitle>
          <CardDescription>
            输入您的账号和密码创建新账户. 已有账号?{' '}
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              使用已有账户登录
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
