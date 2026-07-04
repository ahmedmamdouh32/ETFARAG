import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useFavorites } from '@/context/FavoritesContext'
import { getResourceDetails } from '@/api/resourceApi'
import MovieGrid from '@/components/movies/MovieGrid'
import LoadingSkeleton from '@/components/movies/LoadingSkeleton'
import EmptyState from '@/components/movies/EmptyState'
import ErrorState from '@/components/movies/ErrorState'

export default function Favorites() {
  const { favoriteIds, refreshFavorites } = useFavorites()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFavorites = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.all(
        favoriteIds.map((id) => getResourceDetails(id))
      )
      setMovies(results)
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
    }
  }, [favoriteIds, fetchFavorites])

  return (
    <>
      <Helmet>
        <title>Favorites</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Favorites
        </h1>

        {loading && <LoadingSkeleton count={6} />}

        {!loading && error && <ErrorState message={error} onRetry={fetchFavorites} />}

        {!loading && !error && movies.length === 0 && (
          <EmptyState message="You haven't added any favorite movies yet." />
        )}

        {!loading && !error && movies.length > 0 && <MovieGrid movies={movies} />}
      </div>
    </>
  )
}
