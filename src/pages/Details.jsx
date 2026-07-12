import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMovieDetails } from '@/hooks/useMovieDetails'
import { useFavorites } from '@/context/FavoritesContext'
import { useAuth } from '@/context/AuthContext'
import MovieCard from '@/components/movies/MovieCard'
import ErrorState from '@/components/movies/ErrorState'
import { addRecentlyViewed } from '@/lib/recentlyViewed'

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
  const location = useLocation()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()
  const { movie, recommendations, similarMovies, credits, trailer, loading, error, retry } =
    useMovieDetails(id)

  useEffect(() => {
    if (movie) {
      addRecentlyViewed(movie)
    }
  }, [movie])

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... | ETFARAG</title>
        </Helmet>
        <DetailsSkeleton />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error | ETFARAG</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState message={error} onRetry={retry} />
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    )
  }

  if (!movie) return null

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}`
    : null

  const directors = credits?.crew?.filter((person) => person.job === 'Director') || []
  const cast = credits?.cast?.slice(0, 10) || []

  return (
    <>
      <Helmet>
        <title>{movie.title} | ETFARAG</title>
        <meta name="description" content={movie.overview?.slice(0, 160) || `Details for ${movie.title}`} />
      </Helmet>

      {backdropUrl ? (
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
          <img
            src={backdropUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
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
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: location.pathname } })
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

        {cast.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((person) => (
                <div
                  key={person.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-center"
                >
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                      alt={person.name}
                      className="w-full aspect-[2/3] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs">
                      No Photo
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {person.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {person.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {directors.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Crew
            </h2>
            <div className="flex flex-wrap gap-3">
              {directors.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">
                      ?
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {person.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{person.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {similarMovies.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Similar Movies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {similarMovies.slice(0, 10).map((item) => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </div>
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
