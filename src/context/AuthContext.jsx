import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '@/api/axios'
import { loginUser, registerUser, updateProfile as updateProfileApi, changePassword as changePasswordApi } from '@/services/authService'

const AuthContext = createContext(null)

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const clearSession = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        clearSession()
        toast.error('Session expired. Please log in again.')
      } else {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    }
    setLoading(false)
  }, [clearSession])

  useEffect(() => {
    api.onUnauthorized = (message) => {
      clearSession()
      toast.error(message || 'Session expired. Please log in again.')
      navigate('/login', { replace: true })
    }

    return () => {
      api.onUnauthorized = null
    }
  }, [clearSession, navigate])

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password)
    const userData = { email: data.email, fullName: data.fullName }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(userData))

    setToken(data.token)
    setUser(userData)

    toast.success('Login successful!')
    return data
  }, [])

  const register = useCallback(async (fullName, email, password, confirmPassword) => {
    const data = await registerUser(fullName, email, password, confirmPassword)
    toast.success('Registration successful! Please log in.')
    return data
  }, [])

  const logout = useCallback(() => {
    clearSession()
    toast.success('Logged out successfully.')
  }, [clearSession])

  const updateProfile = useCallback(async (fullName) => {
    const data = await updateProfileApi(fullName)
    const userData = { email: data.email, fullName: data.fullName }

    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    toast.success('Profile updated successfully.')
    return data
  }, [])

  const changePassword = useCallback(async (currentPassword, newPassword, confirmNewPassword) => {
    const data = await changePasswordApi(currentPassword, newPassword, confirmNewPassword)
    toast.success(data.message || 'Password changed successfully.')
    return data
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
