import { Helmet } from 'react-helmet-async'
import { useMovies } from '@/hooks/useMovies'
import MovieGrid from '@/components/movies/MovieGrid'
import CategoryFilter from '@/components/movies/CategoryFilter'
import SortDropdown from '@/components/movies/SortDropdown'
import Pagination from '@/components/movies/Pagination'
import LoadingSkeleton from '@/components/movies/LoadingSkeleton'
import EmptyState from '@/components/movies/EmptyState'
import ErrorState from '@/components/movies/ErrorState'

export default function Home() {
  const {
    movies,
    categories,
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

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Movies</h1>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search movies..."
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              aria-label="Search movies"
              readOnly
            />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

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
