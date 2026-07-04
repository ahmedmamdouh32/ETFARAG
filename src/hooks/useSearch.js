import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchResources } from '@/api/resourceApi'
import { useDebounce } from './useDebounce'

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const queryFromUrl = searchParams.get('q') || ''
  const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1

  const [inputValue, setInputValue] = useState(queryFromUrl)
  const debouncedQuery = useDebounce(inputValue, 500)

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams({ q: debouncedQuery }, { replace: true })
  }, [debouncedQuery, setSearchParams])

  useEffect(() => {
    setInputValue(queryFromUrl)
  }, [queryFromUrl])

  const fetchResults = useCallback(async () => {
    if (!queryFromUrl) {
      setMovies([])
      setTotalPages(1)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await searchResources(queryFromUrl, pageFromUrl)
      setMovies(data.results || [])
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      setError(err.message || 'Search failed.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [queryFromUrl, pageFromUrl])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  function setPage(page) {
    if (!queryFromUrl) return
    setSearchParams(
      { q: queryFromUrl, page: page > 1 ? String(page) : undefined },
      { replace: true }
    )
  }

  function retry() {
    fetchResults()
  }

  return {
    movies,
    totalPages,
    currentPage: pageFromUrl,
    query: queryFromUrl,
    inputValue,
    setInputValue,
    loading,
    error,
    setPage,
    retry,
  }
}
