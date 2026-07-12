import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuth } from '@/context/AuthContext'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function Register() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20" role="status" aria-label={t('common.loading')}>
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function validate() {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = t('auth.fullNameRequired')
    if (!form.email) errs.email = t('auth.emailRequired')
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t('auth.invalidEmail')
    if (!form.password) errs.password = t('auth.passwordRequired')
    else if (form.password.length < 6) errs.password = t('auth.passwordMinLength')
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('auth.passwordMismatch')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await register(form.fullName.trim(), form.email, form.password, form.confirmPassword)
      navigate('/login')
    } catch (err) {
      toast.error(err?.message || t('auth.registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSuccess(response) {
    if (!response.credential) return

    setLoading(true)
    try {
      await loginWithGoogle(response.credential)
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err?.message || t('auth.googleFailed'))
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <>
      <Helmet>
        <title>{t('auth.registerTitle')} | ETFARAG</title>
      </Helmet>
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
            <CardDescription>{t('auth.registerSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="fullName"
                  placeholder={t('auth.fullName')}
                  value={form.fullName}
                  onChange={handleChange}
                  aria-label={t('auth.fullName')}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'register-name-error' : undefined}
                />
                {errors.fullName && (
                  <p id="register-name-error" role="alert" className="text-sm text-red-500 mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder={t('auth.email')}
                  value={form.email}
                  onChange={handleChange}
                  aria-label={t('auth.email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'register-email-error' : undefined}
                />
                {errors.email && (
                  <p id="register-email-error" role="alert" className="text-sm text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <Input
                  name="password"
                  type="password"
                  placeholder={t('auth.password')}
                  value={form.password}
                  onChange={handleChange}
                  aria-label={t('auth.password')}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'register-password-error' : undefined}
                />
                {errors.password && (
                  <p id="register-password-error" role="alert" className="text-sm text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder={t('auth.confirmPassword')}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  aria-label={t('auth.confirmPassword')}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined}
                />
                {errors.confirmPassword && (
                  <p id="register-confirm-error" role="alert" className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
              </Button>
            </form>

            <GoogleLoginButton
              disabled={loading}
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error(t('auth.googleFailed'))}
            />

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                {t('auth.signIn')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
