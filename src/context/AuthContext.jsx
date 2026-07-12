import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '@/api/axios'
import i18n from '@/i18n'
import {
  loginUser,
  registerUser,
  updateProfile as updateProfileApi,
  changePassword as changePasswordApi,
  loginWithGoogle as loginWithGoogleApi,
} from '@/services/authService'

const AuthContext = createContext(null)

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

function saveSession(data, setToken, setUser) {
  const userData = { email: data.email, fullName: data.fullName }

  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(userData))

  setToken(data.token)
  setUser(userData)

  return userData
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
        toast.error(i18n.t('toasts.sessionExpired'))
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
      toast.error(message || i18n.t('toasts.sessionExpired'))
      navigate('/login', { replace: true })
    }

    return () => {
      api.onUnauthorized = null
    }
  }, [clearSession, navigate])

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password)
    saveSession(data, setToken, setUser)
    toast.success(i18n.t('toasts.loginSuccess'))
    return data
  }, [])

  const loginWithGoogle = useCallback(async (idToken) => {
    const data = await loginWithGoogleApi(idToken)
    saveSession(data, setToken, setUser)
    toast.success(i18n.t('toasts.loginSuccess'))
    return data
  }, [])

  const register = useCallback(async (fullName, email, password, confirmPassword) => {
    const data = await registerUser(fullName, email, password, confirmPassword)
    toast.success(i18n.t('toasts.registerSuccess'))
    return data
  }, [])

  const logout = useCallback(() => {
    clearSession()
    toast.success(i18n.t('toasts.logoutSuccess'))
  }, [clearSession])

  const updateProfile = useCallback(async (fullName) => {
    const data = await updateProfileApi(fullName)
    const userData = { email: data.email, fullName: data.fullName }

    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    toast.success(i18n.t('toasts.profileUpdated'))
    return data
  }, [])

  const changePassword = useCallback(async (currentPassword, newPassword, confirmNewPassword) => {
    const data = await changePasswordApi(currentPassword, newPassword, confirmNewPassword)
    toast.success(data.message || i18n.t('toasts.passwordChanged'))
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
        loginWithGoogle,
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
