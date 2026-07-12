import tmdbApi from './tmdbAxios'

function buildQuery(params) {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  )
  if (filtered.length === 0) return ''
  const qs = filtered
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
  return `?${qs}`
}

export async function getResources(page = 1, sortBy = 'popularity.desc', category = '') {
  const params = { page, sort_by: sortBy }
  if (category) {
    params.with_genres = category
  }
  const query = buildQuery(params)
  const { data } = await tmdbApi.get(`/discover/movie${query}`)
  return data
}

export async function getResourceDetails(id) {
  const { data } = await tmdbApi.get(`/movie/${id}`)
  return data
}

export async function getRecommendations(id) {
  const { data } = await tmdbApi.get(`/movie/${id}/recommendations`)
  return data
}

export async function getCategories() {
  const { data } = await tmdbApi.get('/genre/movie/list')
  return data.genres || data
}

export async function discoverResources(params = {}) {
  const query = buildQuery(params)
  const { data } = await tmdbApi.get(`/discover/movie${query}`)
  return data
}

export async function searchResources(query, page = 1) {
  const qs = buildQuery({ query, page })
  const { data } = await tmdbApi.get(`/search/movie${qs}`)
  return data
}

export async function getMedia(id) {
  const { data } = await tmdbApi.get(`/movie/${id}/videos`)
  return data
}

export async function getCredits(id) {
  const { data } = await tmdbApi.get(`/movie/${id}/credits`)
  return data
}

export async function getSimilarMovies(id) {
  const { data } = await tmdbApi.get(`/movie/${id}/similar`)
  return data
}
