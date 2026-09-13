import { createClient } from '@supabase/supabase-js'

const client = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

export const supabaseCacheEnabled = Boolean(client)

export async function getSupabaseCachedMovie(tvdbId) {
  if (!client) return null
  const { data, error } = await client.from('movies').select('*').eq('tvdb_id', String(tvdbId)).maybeSingle()
  if (error) { console.error('[supabase-cache-read]', error.message); return null }
  return data?.metadata_json || null
}

export async function cacheMovie(movie) {
  if (!client || !movie?.id) return
  const { error } = await client.from('movies').upsert({
    tvdb_id: String(movie.id), title: movie.title, overview: movie.overview || null,
    release_date: movie.releaseDate || null, genres: movie.genres || [], themes: movie.themes || [],
    keywords: movie.keywords || [], cast_members: movie.cast || [], crew: movie.crew || [], runtime: movie.runtime || null,
    poster_url: movie.poster || null, backdrop_url: movie.backdrop || null, language: movie.language || null,
    metadata_json: movie, updated_at: new Date().toISOString(),
  }, { onConflict: 'tvdb_id' })
  if (error) console.error('[supabase-cache-write]', error.message)
}
