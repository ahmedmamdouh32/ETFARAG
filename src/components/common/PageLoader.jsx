import { useTranslation } from 'react-i18next'

export default function PageLoader() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center py-20" role="status" aria-label={t('common.loading')}>
      <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )
}
