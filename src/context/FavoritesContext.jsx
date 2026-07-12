import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '@/api/favoritesApi'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [favoriteIds, setFavoriteIds] = useState(new Set())

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set())
      return
    }
    try {
      const data = await getFavorites()
      const ids = Array.isArray(data) ? data : data.movieIds || []
      setFavoriteIds(new Set(ids))
    } catch {
      setFavoriteIds(new Set())
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshFavorites()
  }, [refreshFavorites])

  const isFavorite = useCallback(
    (movieId) => favoriteIds.has(Number(movieId)),
    [favoriteIds]
  )

  const add = useCallback(
    async (movieId) => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: location.pathname } })
        return
      }
      try {
        await addFavorite(movieId)
        setFavoriteIds((prev) => new Set(prev).add(Number(movieId)))
        toast.success('Added to favorites.')
      } catch {
        toast.error('Failed to add favorite.')
      }
    },
    [isAuthenticated, navigate, location.pathname]
  )

  const remove = useCallback(
    async (movieId) => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: location.pathname } })
        return
      }
      try {
        await removeFavorite(movieId)
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          next.delete(Number(movieId))
          return next
        })
        toast.success('Removed from favorites.')
      } catch {
        toast.error('Failed to remove favorite.')
      }
    },
    [isAuthenticated, navigate, location.pathname]
  )

  const toggleFavorite = useCallback(
    (movieId) => {
      if (isFavorite(movieId)) {
        remove(movieId)
      } else {
        add(movieId)
      }
    },
    [isFavorite, add, remove]
  )

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds: [...favoriteIds],
        favoriteCount: favoriteIds.size,
        isFavorite,
        addFavorite: add,
        removeFavorite: remove,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
