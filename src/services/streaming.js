import { apiConfig } from './config'

// Keep provider data behind an authorized backend/provider integration.
export async function getStreamingProviders(movie, region = 'US') {
  if (!apiConfig.streamingBaseUrl || !apiConfig.streamingApiKey) return { available: false, providers: [], region }
  const response = await fetch(`${apiConfig.streamingBaseUrl}/movies/${encodeURIComponent(movie.id)}?region=${region}`, {
    headers: { Authorization: `Bearer ${apiConfig.streamingApiKey}` },
  })
  if (!response.ok) return { available: false, providers: [], region }
  const payload = await response.json()
  return { available: true, providers: payload.providers || [], region, updatedAt: payload.updatedAt || null }
}
