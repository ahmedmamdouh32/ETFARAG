import { GoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

export default function GoogleLoginButton({ onSuccess, onError, disabled }) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) return null

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {t('auth.orContinueWith')}
          </span>
        </div>
      </div>
      <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          text="signin_with"
          shape="rectangular"
          theme={theme === 'dark' ? 'filled_black' : 'outline'}
          width="100%"
        />
      </div>
    </div>
  )
}
