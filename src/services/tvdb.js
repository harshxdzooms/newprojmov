import { normalizeSearchText, rankMovieResults } from './search'

const searchCache = new Map()

async function apiRequest(path, options = {}) {
  const response = await fetch(path, options)
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || `Movie API request failed (${response.status})`)
  return payload
}

export async function searchMovies(query, signal) {
  const normalized = normalizeSearchText(query)
  if (!normalized) return []
  const cached = searchCache.get(normalized)
  if (cached) return cached
  const payload = await apiRequest(`/api/movies/search?q=${encodeURIComponent(query.trim())}`, { signal })
  const results = rankMovieResults(normalized, payload.data || [])
  searchCache.set(normalized, results)
  return results
}

export async function getMovieDetails(movie) {
  const payload = await apiRequest(`/api/movies/${encodeURIComponent(movie.id)}`)
  return payload
}

export async function getMovieRecommendations(movie) {
  const payload = await apiRequest(`/api/movies/${encodeURIComponent(movie.id)}/recommendations`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: movie }),
  })
  return payload.candidates || []
}

export const tvdbMode = 'LIVE TVDB VIA SERVER API'
