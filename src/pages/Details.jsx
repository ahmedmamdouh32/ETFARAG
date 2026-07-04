import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useMovieDetails } from '@/hooks/useMovieDetails'
import { useFavorites } from '@/context/FavoritesContext'
import { useAuth } from '@/context/AuthContext'
import MovieCard from '@/components/movies/MovieCard'
import LoadingSkeleton from '@/components/movies/LoadingSkeleton'

function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200 dark:bg-gray-800" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-48 h-72 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Details() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()
  const { movie, recommendations, trailer, loading, error, retry } =
    useMovieDetails(id)

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading...</title>
        </Helmet>
        <DetailsSkeleton />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg
            className="w-16 h-16 text-red-300 dark:text-red-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Something went wrong
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error}
          </p>
          <button
            onClick={retry}
            className="mt-4 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Retry loading movie details"
          >
            Try Again
          </button>
        </div>
      </>
    )
  }

  if (!movie) return null

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}`
    : null

  return (
    <>
      <Helmet>
        <title>{movie.title}</title>
      </Helmet>

      {backdropUrl ? (
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
          <img
            src={backdropUrl}
            alt={`${movie.title} backdrop`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
      ) : (
        <div className="h-[200px] bg-gray-200 dark:bg-gray-800" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 -mt-32 md:-mt-40 relative z-10">
          {posterUrl ? (
            <div className="w-48 shrink-0">
              <img
                src={posterUrl}
                alt={`${movie.title} poster`}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          ) : (
            <div className="w-48 h-72 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
              No Poster
            </div>
          )}

          <div className="flex-1 space-y-4 md:pt-0 pt-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-lg text-gray-500 dark:text-gray-400 italic mt-1">
                  {movie.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              {movie.release_date && <span>{movie.release_date}</span>}
              {movie.runtime > 0 && <span>{movie.runtime} min</span>}
              {movie.status && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
                  {movie.status}
                </span>
              )}
              {movie.vote_average != null && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-500">&#9733;</span>
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
              {movie.spoken_languages?.length > 0 && (
                <span>{movie.spoken_languages[0].english_name}</span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login')
                  return
                }
                toggleFavorite(movie.id)
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border transition-colors text-sm ${
                isFavorite(movie.id)
                  ? 'border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label={
                isFavorite(movie.id)
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              <span>{isFavorite(movie.id) ? '\u2665' : '\u2661'}</span>
              {isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>

            {movie.overview && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Vote Average</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {movie.vote_count?.toLocaleString() || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Vote Count</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {movie.popularity?.toFixed(1) || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Popularity</p>
          </div>
        </div>

        {trailerUrl ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Trailer
            </h2>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={trailerUrl}
                title={`${movie.title} official trailer`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No trailer available.</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recommendations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recommendations.slice(0, 10).map((rec) => (
                <MovieCard key={rec.id} movie={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
