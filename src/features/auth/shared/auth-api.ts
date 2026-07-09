import { sleep } from '@/lib/utils'

/**
 * 认证相关类型定义 (对齐 plus-ui 的 src/api/types.ts)
 */
export interface TenantVO {
  tenantId: string
  companyName: string
}

export interface VerifyCodeResult {
  /** 验证码开关 */
  captchaEnabled: boolean
  /** 验证码标识, 提交登录时回传 */
  uuid: string
  /** 验证码图片 (base64 data url) */
  img: string
  /**
   * 验证码答案 (仅前端 mock 校验使用).
   * 真实后端 (plus-ui `GET /auth/code`) 不会返回答案,
   * 这里为了无后端可独立运行才返回.
   */
  code: string
}

export interface TenantListResult {
  /** 租户开关 */
  tenantEnabled: boolean
  voList: TenantVO[]
}

export interface LoginData {
  tenantId: string
  username: string
  password: string
  rememberMe: boolean
  code: string
  uuid: string
  grantType: string
  clientId: string
  source?: string
  socialCode?: string
  socialState?: string
}

export interface RegisterForm {
  tenantId: string
  username: string
  password: string
  confirmPassword: string
  code: string
  uuid: string
  userType: string
}

/** plus-ui 客户端标识, 取自 VITE_APP_CLIENT_ID */
export const CLIENT_ID = 'e5cd7e4891bf95d1d19206ce24a7b32e'

/** 默认租户 (plus-ui 默认 000000) */
export const DEFAULT_TENANT_ID = '000000'

const MOCK_TENANTS: TenantVO[] = [
  { tenantId: '000000', companyName: 'RuoYi-Vue-Plus 科技有限公司' },
  { tenantId: '985321', companyName: 'Shadcn Admin Co., Ltd.' },
  { tenantId: '000001', companyName: '测试租户' },
]

const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomCode(length = 4): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]
  }
  return code
}

/** 将验证码渲染为 canvas data url, 模拟 plus-ui 后端返回的 base64 图片 */
function renderCaptchaImage(code: string): string {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  canvas.width = 120
  canvas.height = 40
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.fillStyle = '#eef2f7'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = 'bold 26px Arial'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const colors = ['#1d4ed8', '#0f766e', '#b45309', '#7c3aed', '#be123c']
  for (let i = 0; i < code.length; i++) {
    ctx.save()
    ctx.fillStyle = colors[i % colors.length]
    ctx.translate(20 + i * 26, 20 + (Math.random() * 6 - 3))
    ctx.rotate((Math.random() - 0.5) * 0.5)
    ctx.fillText(code[i], 0, 0)
    ctx.restore()
  }

  // 干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(100,116,139,${0.25 + Math.random() * 0.35})`
    ctx.beginPath()
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.stroke()
  }
  // 噪点
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = `rgba(71,85,105,${Math.random() * 0.4})`
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      1.5,
      1.5
    )
  }

  return canvas.toDataURL('image/png')
}

/**
 * 获取图形验证码 (对应 plus-ui `getCodeImg()` -> `GET /auth/code`).
 * 真实接入后端时, 替换为 axios 请求即可.
 */
export async function getCodeImg(): Promise<VerifyCodeResult> {
  await sleep(300)
  const code = randomCode()
  return {
    captchaEnabled: true,
    uuid:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `uuid-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    img: renderCaptchaImage(code),
    code,
  }
}

/**
 * 获取租户列表 (对应 plus-ui `getTenantList()` -> `GET /auth/tenant/list`).
 */
export async function getTenantList(): Promise<TenantListResult> {
  await sleep(200)
  return { tenantEnabled: true, voList: MOCK_TENANTS }
}

/**
 * 注册 (对应 plus-ui `register()` -> `POST /auth/register`).
 */
export async function register(_data: RegisterForm): Promise<void> {
  await sleep(1500)
  // mock: 永远成功; 真实接入后端时根据返回抛错即可.
}

/**
 * 第三方登录授权跳转地址
 * (对应 plus-ui `authRouterUrl()` -> `GET /auth/binding/{source}`).
 *
 * 真实环境返回第三方授权页地址后 `window.location.href = res.data`.
 * 这里 mock 成跳回 `/social-callback` 以演示完整 OAuth 回调流程.
 */
export async function authRouterUrl(
  source: string,
  tenantId: string
): Promise<string> {
  await sleep(200)
  const state = btoa(JSON.stringify({ tenantId, domain: window.location.host }))
  const params = new URLSearchParams({
    source,
    state,
    code: `mock-${source}-${Date.now()}`,
  })
  return `/social-callback?${params.toString()}`
}
