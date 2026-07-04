import { useState, useEffect, useCallback } from 'react'
import { getResourceDetails, getRecommendations, getMedia } from '@/api/resourceApi'

export function useMovieDetails(id) {
  const [movie, setMovie] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [movieData, recsData, mediaData] = await Promise.all([
        getResourceDetails(id),
        getRecommendations(id),
        getMedia(id),
      ])
      setMovie(movieData)
      setRecommendations(recsData.results || [])
      const videos = mediaData.results || []
      const trailerVideo = videos.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      )
      setTrailer(trailerVideo || null)
    } catch (err) {
      setError(err.message || 'Failed to load movie details.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return { movie, recommendations, trailer, loading, error, retry: fetchAll }
}
