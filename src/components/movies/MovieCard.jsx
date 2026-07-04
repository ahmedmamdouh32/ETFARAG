import { Link } from 'react-router-dom'
import { useFavorites } from '@/context/FavoritesContext'
import { useAuth } from '@/context/AuthContext'

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()
  const favorited = isFavorite(movie.id)

  const overview =
    movie.overview?.length > 120
      ? movie.overview.slice(0, 120) + '...'
      : movie.overview || ''

  function handleFavoriteClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toggleFavorite(movie.id)
      return
    }
    toggleFavorite(movie.id)
  }

  return (
    <div className="relative group">
      <Link
        to={`/details/${movie.id}`}
        className="block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-800">
          {movie.poster_path ? (
            <img
              src={"https://image.tmdb.org/t/p/original/" + movie.poster_path}
              alt={`${movie.title} poster`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
              No Image
            </div>
          )}
        </div>
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {movie.title}
          </h3>
          {movie.release_date && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {movie.release_date}
            </p>
          )}
          {movie.vote_average != null && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xs">&#9733;</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.id || genre}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                >
                  {genre.name || genre}
                </span>
              ))}
            </div>
          )}
          {overview && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {overview}
            </p>
          )}
        </div>
      </Link>
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-4 h-4 ${favorited ? 'text-red-500' : 'text-white'}`}
          fill={favorited ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  )
}
