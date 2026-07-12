import { useTranslation } from 'react-i18next'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  function handlePageChange(page) {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      <button
        type="button"
        onClick={() => handlePageChange(1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('common.firstPage')}
      >
        {t('common.first')}
      </button>
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('common.previousPage')}
      >
        {t('common.previous')}
      </button>
      <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
        {t('common.pageOf', { current: currentPage, total: totalPages })}
      </span>
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('common.nextPage')}
      >
        {t('common.next')}
      </button>
      <button
        type="button"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('common.lastPage')}
      >
        {t('common.last')}
      </button>
    </div>
  )
}
