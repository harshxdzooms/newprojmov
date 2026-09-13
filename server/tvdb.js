import { cacheMovie, getSupabaseCachedMovie } from './cache.js'

const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000
let bearerToken = process.env.TVDB_API_TOKEN || ''
let tokenExpiresAt = bearerToken ? Date.now() + 25 * 24 * 60 * 60 * 1000 : 0

const baseUrl = process.env.TVDB_API_BASE_URL || 'https://api4.thetvdb.com/v4'

export class TvdbError extends Error {
  constructor(message, status = 502) {
    super(message)
    this.name = 'TvdbError'
    this.status = status
  }
}

const cacheGet = (key) => {
  const entry = cache.get(key)
  if (!entry || entry.expiresAt < Date.now()) { cache.delete(key); return null }
  return entry.value
}
const cacheSet = (key, value) => cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL })

export const normalizeSearchText = (value = '') => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ')

const compactSearchText = (value = '') => normalizeSearchText(value).replace(/\s/g, '')
const editDistance = (left, right) => {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let index = 1; index <= left.length; index += 1) {
    let diagonal = row[0]
    row[0] = index
    for (let column = 1; column <= right.length; column += 1) {
      const previous = row[column]
      row[column] = left[index - 1] === right[column - 1]
        ? diagonal
        : Math.min(row[column] + 1, row[column - 1] + 1, diagonal + 1)
      diagonal = previous
    }
  }
  return row[right.length]
}

const titleScore = (query, movie) => {
  const normalizedQuery = normalizeSearchText(query)
  const compactQuery = compactSearchText(query)
  const titles = [movie.title, movie.originalTitle, ...(movie.aliases || [])].filter(Boolean)
  return titles.reduce((best, title) => {
    const normalizedTitle = normalizeSearchText(title)
    const compactTitle = compactSearchText(title)
    if (normalizedTitle === normalizedQuery || compactTitle === compactQuery) return 1
    return Math.max(best, 1 - editDistance(compactQuery, compactTitle) / Math.max(compactQuery.length, compactTitle.length, 1))
  }, 0)
}

const normalizeMovie = (movie) => ({
  id: String(movie.id || movie.tvdb_id || '').replace(/^movie-/, ''),
  title: movie.name || movie.title || 'Untitled movie',
  originalTitle: movie.originalName || movie.originalTitle || '',
  aliases: (movie.aliases || []).map((alias) => typeof alias === 'string' ? alias : alias.name).filter(Boolean),
  entityType: String(movie.type || movie.entityType || 'movie').toLowerCase(),
  year: Number.parseInt(movie.year || movie.releaseDate?.slice(0, 4), 10) || null,
  releaseDate: movie.releaseDate || movie.first_release?.date || null,
  runtime: movie.runtime || null,
  overview: movie.overview || movie.plot || '',
  genres: (movie.genres || movie.genreNames || []).map((genre) => typeof genre === 'string' ? genre : genre.name).filter(Boolean),
  genreIds: (movie.genres || []).map((genre) => typeof genre === 'object' ? genre.id : null).filter(Boolean),
  themes: movie.themes || [],
  keywords: movie.keywords || [],
  cast: movie.cast || movie.characters || [],
  crew: movie.crew || [],
  director: movie.director || '',
  language: movie.language || movie.originalLanguage || '',
  poster: movie.image_url || movie.image || movie.poster || '',
  backdrop: movie.backdrop || movie.thumbnail || '',
  tvdbScore: movie.score,
  remoteIds: movie.remoteIds || movie.remote_ids || [],
})

async function getToken() {
  if (bearerToken && tokenExpiresAt > Date.now()) return bearerToken
  if (!process.env.TVDB_API_KEY) throw new TvdbError('TVDB_API_KEY is not configured on the server.', 503)
  const response = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apikey: process.env.TVDB_API_KEY, ...(process.env.TVDB_SUBSCRIBER_PIN ? { pin: process.env.TVDB_SUBSCRIBER_PIN } : {}) }),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.data?.token) throw new TvdbError(`TVDB authentication failed (${response.status}): ${payload.message || 'No token returned'}`, response.status || 502)
  bearerToken = payload.data.token
  tokenExpiresAt = Date.now() + 25 * 24 * 60 * 60 * 1000
  return bearerToken
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { Authorization: `Bearer ${await getToken()}`, ...(options.headers || {}) } })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new TvdbError(`TVDB ${path} failed (${response.status}): ${payload.message || response.statusText}`, response.status || 502)
  return payload
}

const typoVariants = (query) => {
  const normalized = normalizeSearchText(query)
  const compact = normalized.replace(/\s/g, '')
  const variants = new Set([normalized, compact])
  for (let index = 0; index < normalized.length && variants.size < 8; index += 1) {
    variants.add(`${normalized.slice(0, index)}${normalized.slice(index + 1)}`)
  }
  const likelyOmittedLetters = ['r', 'e', 'a', 'i', 'o', 'u', 'l', 'n', 's', 't']
  for (let index = 1; index < compact.length && variants.size < 24; index += 1) {
    for (const letter of likelyOmittedLetters) {
      variants.add(`${compact.slice(0, index)}${letter}${compact.slice(index)}`)
      if (variants.size >= 24) break
    }
  }
  return [...variants].filter((variant) => variant.length > 2)
}

const rankMovies = (query, movies) => movies
  .filter((movie) => movie.entityType === 'movie' && movie.title)
  .map((movie) => ({ ...movie, titleMatch: titleScore(query, movie) }))
  .filter((movie) => movie.titleMatch >= 0.82)
  .sort((left, right) => (right.titleMatch + (right.tvdbScore || 0) / 1000) - (left.titleMatch + (left.tvdbScore || 0) / 1000))
  .slice(0, 8)

export async function searchMovies(query) {
  const normalized = normalizeSearchText(query)
  if (!normalized) return { data: [], source: 'tvdb', query: normalized }
  const cacheKey = `search:${normalized}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  let rawResults = []
  let matchedQuery = query.trim()
  for (const candidate of [query.trim(), ...typoVariants(query).filter((variant) => variant !== query.trim())]) {
    const payload = await request(`/search?query=${encodeURIComponent(candidate)}&type=movie&limit=25&offset=0`)
    rawResults = (payload.data || []).map(normalizeMovie)
    const ranked = rankMovies(normalized, rawResults)
    if (ranked.length) {
      const result = { data: ranked, source: 'tvdb', query: normalized, matchedQuery: candidate, didYouMean: candidate !== query.trim() }
      cacheSet(cacheKey, result)
      return result
    }
    matchedQuery = candidate
  }
  const result = { data: [], source: 'tvdb', query: normalized, matchedQuery }
  cacheSet(cacheKey, result)
  return result
}

export async function getMovieDetails(id) {
  const cacheKey = `movie:${id}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached
  const persisted = await getSupabaseCachedMovie(id)
  if (persisted) { cacheSet(cacheKey, persisted); return persisted }
  const payload = await request(`/movies/${encodeURIComponent(id)}/extended`)
  const result = normalizeMovie(payload.data || {})
  cacheSet(cacheKey, result)
  await cacheMovie(result)
  return result
}

export async function getMovieCandidates(source) {
  const candidates = new Map()
  const queries = [...(source.genres || []), ...(source.themes || [])].filter(Boolean).slice(0, 3)
  for (const query of queries) {
    const payload = await request(`/search?query=${encodeURIComponent(query)}&type=movie&limit=25&offset=0`)
    for (const item of (payload.data || []).map(normalizeMovie)) {
      if (item.entityType === 'movie' && item.id !== String(source.id)) candidates.set(item.id, item)
    }
  }
  return [...candidates.values()].slice(0, 40)
}

export const tvdbStatus = () => ({ configured: Boolean(process.env.TVDB_API_KEY), baseUrl, tokenSource: process.env.TVDB_API_TOKEN ? 'server environment token' : 'server login exchange' })
