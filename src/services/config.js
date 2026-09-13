// Add these values to .env.local for production integrations.
export const apiConfig = {
  streamingApiKey: import.meta.env.VITE_STREAMING_API_KEY || '',
  streamingBaseUrl: import.meta.env.VITE_STREAMING_API_BASE_URL || '',
}
