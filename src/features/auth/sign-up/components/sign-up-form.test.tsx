import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { SignUpForm } from './sign-up-form'

const CAPTCHA_CODE = 'ABCD'

const FORM_MESSAGES = {
  usernameEmpty: '请输入您的账号',
  passwordEmpty: '请输入您的密码',
  confirmPasswordEmpty: '请确认您的密码',
  passwordMismatch: '两次输入的密码不一致',
} as const

const navigate = vi.fn()
const registerMock = vi.fn(() => Promise.resolve())

const toastPromise = vi.hoisted(() =>
  vi.fn((p: Promise<unknown>, opts: { success?: () => unknown }) => {
    p.then(() => opts.success?.())
  })
)

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
  register: registerMock,
}))

vi.mock('sonner', () => ({ toast: { promise: toastPromise } }))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

/** 等待验证码图片加载完成 (loadCaptcha 异步设置 codeUrl / expectedCode) */
async function waitForCaptchaLoaded() {
  await vi.waitFor(() => {
    const img = document.querySelector('img[alt="验证码"]')
    expect(img).not.toBeNull()
  })
}

describe('SignUpForm', () => {
  let screen: RenderResult
  let usernameInput: Locator
  let passwordInput: Locator
  let confirmPasswordInput: Locator
  let codeInput: Locator
  let submitButton: Locator

  beforeEach(async () => {
    vi.clearAllMocks()

    screen = await render(<SignUpForm />)
    await waitForCaptchaLoaded()
    usernameInput = screen.getByPlaceholder('请输入您的账号')
    passwordInput = screen.getByPlaceholder('请输入您的密码')
    confirmPasswordInput = screen.getByPlaceholder('请再次输入密码')
    codeInput = screen.getByPlaceholder('请输入验证码')
    submitButton = screen.getByRole('button', { name: '注册' })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders fields and submit button', async () => {
    await expect.element(usernameInput).toBeInTheDocument()
    await expect.element(passwordInput).toBeInTheDocument()
    await expect.element(confirmPasswordInput).toBeInTheDocument()
    await expect.element(codeInput).toBeInTheDocument()
    await expect.element(submitButton).toBeInTheDocument()
  })

  it('shows validation messages when submitting empty form', async () => {
    await userEvent.click(submitButton)

    await expect
      .element(screen.getByText(FORM_MESSAGES.usernameEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.passwordEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.confirmPasswordEmpty))
      .toBeInTheDocument()
  })

  it('shows a mismatch error when passwords do not match', async () => {
    await userEvent.fill(usernameInput, 'alice')
    await userEvent.fill(passwordInput, '12345')
    await userEvent.fill(confirmPasswordInput, '54321')

    await userEvent.click(submitButton)
    await expect
      .element(screen.getByText(FORM_MESSAGES.passwordMismatch))
      .toBeInTheDocument()
  })

  it('registers and navigates to sign-in on success', async () => {
    await userEvent.fill(usernameInput, 'alice')
    await userEvent.fill(passwordInput, '12345')
    await userEvent.fill(confirmPasswordInput, '12345')
    await userEvent.fill(codeInput, CAPTCHA_CODE)

    await userEvent.click(submitButton)

    await vi.waitFor(() => expect(registerMock).toHaveBeenCalledOnce())
    expect(registerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'alice',
        password: '12345',
        confirmPassword: '12345',
        userType: 'sys_user',
      })
    )

    await vi.waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: '/sign-in' })
    )
  })
})
