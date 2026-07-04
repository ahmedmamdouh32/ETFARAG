import api from '@/api/axios'

export async function loginUser(email, password) {
  const response = await api.post('/api/auth/login', { email, password })
  return response.data
}

export async function registerUser(fullName, email, password, confirmPassword) {
  const response = await api.post('/api/auth/register', {
    fullName,
    email,
    password,
    confirmPassword
  })
  return response.data
}
