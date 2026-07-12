import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useFavorites } from '@/context/FavoritesContext'
import { getResourceDetails } from '@/api/resourceApi'
import MovieGrid from '@/components/movies/MovieGrid'
import LoadingSkeleton from '@/components/movies/LoadingSkeleton'
import ErrorState from '@/components/movies/ErrorState'

export default function Favorites() {
  const { favoriteIds } = useFavorites()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [partialError, setPartialError] = useState(null)

  const fetchFavorites = useCallback(async () => {
    setLoading(true)
    setError(null)
    setPartialError(null)
    try {
      const results = await Promise.allSettled(
        favoriteIds.map((id) => getResourceDetails(id))
      )

      const successful = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)

      const failedCount = results.filter((result) => result.status === 'rejected').length

      setMovies(successful)

      if (failedCount > 0 && successful.length === 0) {
        setError('Failed to load favorites.')
      } else if (failedCount > 0) {
        setPartialError(`Could not load ${failedCount} movie(s). Showing the rest.`)
      }
    } catch (err) {
      setError(err.message || 'Failed to load favorites.')
    } finally {
      setLoading(false)
    }
  }, [favoriteIds])

  useEffect(() => {
    if (favoriteIds.length > 0) {
      fetchFavorites()
    } else {
      setMovies([])
      setLoading(false)
      setError(null)
      setPartialError(null)
    }
  }, [favoriteIds, fetchFavorites])

  return (
    <>
      <Helmet>
        <title>Favorites | ETFARAG</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Favorites
        </h1>

        {loading && <LoadingSkeleton count={6} />}

        {!loading && error && <ErrorState message={error} onRetry={fetchFavorites} />}

        {!loading && !error && partialError && (
          <p className="text-sm text-amber-600 dark:text-amber-400" role="status">
            {partialError}
          </p>
        )}

        {!loading && !error && movies.length === 0 && (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No favorites yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Browse movies and click the heart icon to save them here.
            </p>
            <Link
              to="/"
              className="mt-4 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        )}

        {!loading && !error && movies.length > 0 && <MovieGrid movies={movies} />}
      </div>
    </>
  )
}
