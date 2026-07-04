import api from './axios'

export async function getFavorites() {
  const { data } = await api.get('/api/favorites')
  return data
}

export async function addFavorite(movieId) {
  const { data } = await api.post('/api/favorites', { movieId })
  return data
}

export async function removeFavorite(movieId) {
  const { data } = await api.delete(`/api/favorites/${movieId}`)
  return data
}

export async function checkFavorite(movieId) {
  const { data } = await api.get(`/api/favorites/check/${movieId}`)
  return data
}
