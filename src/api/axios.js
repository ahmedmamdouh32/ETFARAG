import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  config.headers['x-api-key'] = import.meta.env.VITE_API_KEY

  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message || data?.error || 'An error occurred'

      switch (status) {
        case 401:
          throw new Error('Unauthorized. Please log in again.')
        case 403:
          throw new Error('Forbidden. You do not have permission.')
        case 404:
          throw new Error('Resource not found.')
        case 500:
          throw new Error('Server error. Please try again later.')
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

export default api
