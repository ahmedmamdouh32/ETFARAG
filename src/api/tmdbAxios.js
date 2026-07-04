import axios from 'axios'

const tmdbApi = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  timeout: 10000,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
})

tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.status_message || 'An error occurred'

      switch (status) {
        case 401:
          throw new Error('Invalid TMDB API key.')
        case 404:
          throw new Error('Resource not found.')
        case 422:
          throw new Error('Invalid parameters.')
        default:
          throw new Error(message)
      }
    }

    if (error.request) {
      throw new Error('Network error. Please check your connection.')
    }

    throw error
  }
)

export default tmdbApi
