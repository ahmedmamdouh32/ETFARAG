import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { loginUser, registerUser } from '@/services/authService'

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

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toast.error('Session expired. Please log in again.')
      } else {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    }
    setLoading(false)
  }, [])

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
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully.')
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
