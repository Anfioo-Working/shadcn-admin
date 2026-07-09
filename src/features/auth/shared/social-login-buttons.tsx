import { toast } from 'sonner'
import {
  IconGitee,
  IconGithub,
  IconMaxkey,
  IconTopiam,
  IconWechat,
} from '@/assets/brand-icons'
import { Button } from '@/components/ui/button'
import { authRouterUrl } from './auth-api'

/** plus-ui 支持的第三方登录来源 (wechat / maxkey / topiam / gitee / github) */
const SOCIAL_PROVIDERS = [
  { source: 'wechat', label: '微信', Icon: IconWechat },
  { source: 'maxkey', label: 'MaxKey', Icon: IconMaxkey },
  { source: 'topiam', label: 'TopIam', Icon: IconTopiam },
  { source: 'gitee', label: 'Gitee', Icon: IconGitee },
  { source: 'github', label: 'GitHub', Icon: IconGithub },
] as const

interface SocialLoginButtonsProps {
  tenantId: string
  disabled?: boolean
}

/**
 * 第三方登录按钮组. 对应 plus-ui 登录页右侧的 5 个圆形 `el-button`,
 * 点击后通过 `authRouterUrl()` 获取授权地址并跳转.
 */
export function SocialLoginButtons({
  tenantId,
  disabled,
}: SocialLoginButtonsProps) {
  async function handleSocialLogin(source: string) {
    try {
      const url = await authRouterUrl(source, tenantId)
      // 对应 plus-ui: window.location.href = res.data
      window.location.assign(url)
    } catch {
      toast.error('第三方登录授权地址获取失败')
    }
  }

  return (
    <div className='flex items-center gap-2'>
      {SOCIAL_PROVIDERS.map(({ source, label, Icon }) => (
        <Button
          key={source}
          type='button'
          variant='outline'
          size='icon'
          className='rounded-full'
          title={label}
          disabled={disabled}
          onClick={() => handleSocialLogin(source)}
        >
          <Icon className='size-4' />
        </Button>
      ))}
    </div>
  )
}
