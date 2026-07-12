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

export async function updateProfile(fullName) {
  const response = await api.put('/api/auth/profile', { fullName })
  return response.data
}

export async function changePassword(currentPassword, newPassword, confirmNewPassword) {
  const response = await api.post('/api/auth/change-password', {
    currentPassword,
    newPassword,
    confirmNewPassword,
  })
  return response.data
}

export async function loginWithGoogle(idToken) {
  const response = await api.post('/api/auth/google', { idToken })
  return response.data
}
