import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getResources, getCategories } from '@/api/resourceApi'

function getSortParam(sortBy) {
  const map = {
    'popularity.desc': 'popularity.desc',
    'popularity.asc': 'popularity.asc',
    'vote_average.desc': 'vote_average.desc',
    'vote_average.asc': 'vote_average.asc',
    'primary_release_date.desc': 'primary_release_date.desc',
    'primary_release_date.asc': 'primary_release_date.asc',
  }
  return map[sortBy] || 'popularity.desc'
}

export function useMovies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [categories, setCategories] = useState([])
  const [categoriesError, setCategoriesError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentPage = parseInt(searchParams.get('page'), 10) || 1
  const sortBy = searchParams.get('sort_by') || 'popularity.desc'
  const category = searchParams.get('category') || ''

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data || [])
        setCategoriesError(null)
      })
      .catch((err) => {
        setCategoriesError(err.message || 'Failed to load categories.')
      })
  }, [])

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getResources(currentPage, getSortParam(sortBy), category)
      setMovies(data.results || [])
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      setError(err.message || 'Failed to load movies.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, category])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  function updateParams(updates) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      if (updates.page === undefined && !updates.page) {
        params.set('page', '1')
      }
      return params
    })
  }

  function setPage(page) {
    updateParams({ page: page > 1 ? String(page) : '' })
  }

  function setSortBy(value) {
    updateParams({ sort_by: value, page: '1' })
  }

  function setCategory(value) {
    updateParams({ category: value, page: '1' })
  }

  function retry() {
    fetchMovies()
  }

  return {
    movies,
    categories,
    categoriesError,
    totalPages,
    currentPage,
    sortBy,
    category,
    loading,
    error,
    setPage,
    setSortBy,
    setCategory,
    retry,
  }
}
