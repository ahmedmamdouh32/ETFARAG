import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useSearch } from '@/hooks/useSearch'
import MovieGrid from '@/components/movies/MovieGrid'
import Pagination from '@/components/movies/Pagination'
import LoadingSkeleton from '@/components/movies/LoadingSkeleton'
import EmptyState from '@/components/movies/EmptyState'
import ErrorState from '@/components/movies/ErrorState'

export default function Search() {
  const { t } = useTranslation()
  const {
    movies,
    totalPages,
    currentPage,
    query,
    inputValue,
    setInputValue,
    loading,
    error,
    setPage,
    retry,
  } = useSearch()

  const pageTitle = query
    ? `${t('search.pageTitle', { query })} | ETFARAG`
    : `${t('search.title')} | ETFARAG`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('search.title')}</h1>
        <div className="max-w-xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('search.placeholder')}
          />
        </div>

        {loading && <LoadingSkeleton count={10} />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && query && movies.length === 0 && (
          <EmptyState message={t('search.empty')} />
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

        {!query && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('search.promptTitle')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('search.promptText')}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
