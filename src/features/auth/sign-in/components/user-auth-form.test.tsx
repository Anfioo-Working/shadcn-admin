import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { UserAuthForm } from './user-auth-form'

const CAPTCHA_CODE = 'ABCD'

const FORM_MESSAGES = {
  usernameEmpty: '请输入您的账号',
  passwordEmpty: '请输入您的密码',
  codeWrong: '验证码错误',
} as const

const navigate = vi.fn()
const setUserMock = vi.fn()
const setAccessTokenMock = vi.fn()

vi.mock('@/features/auth/shared/auth-api', () => ({
  DEFAULT_TENANT_ID: '000000',
  getCodeImg: vi.fn(() =>
    Promise.resolve({
      captchaEnabled: true,
      uuid: 'test-uuid',
      img: 'data:image/png;base64,MOCK',
      code: CAPTCHA_CODE,
    })
  ),
  getTenantList: vi.fn(() =>
    Promise.resolve({
      tenantEnabled: true,
      voList: [{ tenantId: '000000', companyName: '测试租户' }],
    })
  ),
}))

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({
    auth: {
      setUser: setUserMock,
      setAccessToken: setAccessTokenMock,
    },
  }),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => navigate,
    Link: ({
      children,
      to,
      className,
      ...rest
    }: {
      children?: React.ReactNode
      to: string
      className?: string
    }) => (
      <a href={to} className={className} {...rest}>
        {children}
      </a>
    ),
  }
})

vi.mock('@/lib/utils', async (orig) => ({
  ...(await orig()),
  sleep: vi.fn(() => Promise.resolve()),
}))

/** 等待验证码图片加载完成 (loadCaptcha 异步设置 codeUrl / expectedCode) */
async function waitForCaptchaLoaded() {
  await vi.waitFor(() => {
    const img = document.querySelector('img[alt="验证码"]')
    expect(img).not.toBeNull()
  })
}

describe('UserAuthForm', () => {
  describe('Rendering without redirectTo', () => {
    let screen: RenderResult
    let usernameInput: Locator
    let passwordInput: Locator
    let codeInput: Locator
    let signInButton: Locator

    beforeEach(async () => {
      vi.clearAllMocks()
      screen = await render(<UserAuthForm />)
      await waitForCaptchaLoaded()
      usernameInput = screen.getByPlaceholder('请输入您的账号')
      passwordInput = screen.getByPlaceholder('请输入您的密码')
      codeInput = screen.getByPlaceholder('请输入验证码')
      signInButton = screen.getByRole('button', { name: '登录' })
    })

    it('renders fields and submit button', async () => {
      await expect.element(usernameInput).toBeInTheDocument()
      await expect.element(passwordInput).toBeInTheDocument()
      await expect.element(codeInput).toBeInTheDocument()
      await expect.element(signInButton).toBeInTheDocument()
    })

    it('shows validation messages when submitting empty form', async () => {
      await userEvent.click(signInButton)

      await expect
        .element(screen.getByText(FORM_MESSAGES.usernameEmpty))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText(FORM_MESSAGES.passwordEmpty))
        .toBeInTheDocument()
    })

    it('shows captcha error when captcha is wrong', async () => {
      await userEvent.fill(usernameInput, 'admin')
      await userEvent.fill(passwordInput, '123456')
      await userEvent.fill(codeInput, 'WRONG')

      await userEvent.click(signInButton)

      await expect
        .element(screen.getByText(FORM_MESSAGES.codeWrong))
        .toBeInTheDocument()
    })

    it('authenticates and navigates to default route on success', async () => {
      await userEvent.fill(usernameInput, 'admin')
      await userEvent.fill(passwordInput, '123456')
      await userEvent.fill(codeInput, CAPTCHA_CODE)

      await userEvent.click(signInButton)

      await vi.waitFor(() => expect(setUserMock).toHaveBeenCalledOnce())
      expect(setUserMock).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'admin',
          accountNo: expect.any(String),
          role: expect.any(Array),
          exp: expect.any(Number),
        })
      )
      expect(setAccessTokenMock).toHaveBeenCalledOnce()
      expect(setAccessTokenMock).toHaveBeenCalledWith('mock-access-token')

      await vi.waitFor(() =>
        expect(navigate).toHaveBeenCalledWith({ to: '/', replace: true })
      )
    })
  })

  it('navigates to redirectTo when provided', async () => {
    vi.clearAllMocks()

    const screen = await render(<UserAuthForm redirectTo='/settings' />)
    await waitForCaptchaLoaded()

    await userEvent.fill(screen.getByPlaceholder('请输入您的账号'), 'admin')
    await userEvent.fill(screen.getByPlaceholder('请输入您的密码'), '123456')
    await userEvent.fill(screen.getByPlaceholder('请输入验证码'), CAPTCHA_CODE)

    await userEvent.click(screen.getByRole('button', { name: '登录' }))

    await vi.waitFor(() => expect(setUserMock).toHaveBeenCalledOnce())
    expect(setAccessTokenMock).toHaveBeenCalledOnce()

    await vi.waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({
        to: '/settings',
        replace: true,
      })
    )
  })
})
