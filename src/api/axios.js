import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5127'

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function getErrorMessage(data) {
  if (!data) return 'An error occurred'

  if (typeof data.message === 'string') return data.message
  if (typeof data.error === 'string') return data.error

  if (typeof data === 'object' && !Array.isArray(data)) {
    const messages = []
    for (const key of Object.keys(data)) {
      const value = data[key]
      if (Array.isArray(value)) {
        messages.push(...value)
      } else if (typeof value === 'string') {
        messages.push(value)
      }
    }
    if (messages.length > 0) return messages.join(' ')
  }

  return 'An error occurred'
}

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
      const message = getErrorMessage(data)
      const requestUrl = error.config?.url || ''
      const isAuthRequest =
        requestUrl.includes('/api/auth/login') || requestUrl.includes('/api/auth/register')

      if (status === 401 && !isAuthRequest && localStorage.getItem('token') && api.onUnauthorized) {
        api.onUnauthorized(message)
      }

      switch (status) {
        case 401:
          throw new Error(message)
        case 403:
          throw new Error(message || 'Forbidden. You do not have permission.')
        case 404:
          throw new Error(message || 'Resource not found.')
        case 500:
          throw new Error(message || 'Server error. Please try again later.')
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
