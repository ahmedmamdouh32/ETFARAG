const STORAGE_KEY = 'recentlyViewed'
const MAX_ITEMS = 10

export function getRecentlyViewed() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addRecentlyViewed(movie) {
  if (!movie?.id) return

  const item = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    overview: movie.overview,
  }

  const list = getRecentlyViewed().filter((m) => m.id !== movie.id)
  list.unshift(item)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)))
}
