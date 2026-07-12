import { useState, useEffect } from 'react'
import { useNavigate, createSearchParams, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useMovies } from '@/hooks/useMovies'
import { getRecentlyViewed } from '@/lib/recentlyViewed'
import MovieGrid from '@/components/movies/MovieGrid'
import CategoryFilter from '@/components/movies/CategoryFilter'
import SortDropdown from '@/components/movies/SortDropdown'
import Pagination from '@/components/movies/Pagination'
import LoadingSkeleton from '@/components/movies/LoadingSkeleton'
import EmptyState from '@/components/movies/EmptyState'
import ErrorState from '@/components/movies/ErrorState'

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [recentMovies, setRecentMovies] = useState([])
  const {
    movies,
    categories,
    categoriesError,
    totalPages,
    currentPage,
    sortBy,
    category,
    loading,
    error,
    setPage,
    setSortBy,
    setCategory,
    retry,
  } = useMovies()

  useEffect(() => {
    setRecentMovies(getRecentlyViewed())
  }, [location.pathname])

  function handleSearch(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const q = formData.get('home-search')
    if (q?.trim()) {
      navigate({
        pathname: '/search',
        search: createSearchParams({ q: q.trim() }).toString(),
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('home.title')} | ETFARAG</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('home.movies')}</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form onSubmit={handleSearch}>
              <input
                name="home-search"
                type="text"
                placeholder={t('home.searchPlaceholder')}
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                aria-label={t('home.searchPlaceholder')}
              />
            </form>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {recentMovies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('home.recentlyViewed')}</h2>
            <MovieGrid movies={recentMovies} />
          </div>
        )}

        {categoriesError && (
          <p className="text-sm text-red-500" role="alert">
            {categoriesError}
          </p>
        )}

        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

        {loading && <LoadingSkeleton count={10} />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && movies.length === 0 && <EmptyState />}

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
      </div>
    </>
  )
}
