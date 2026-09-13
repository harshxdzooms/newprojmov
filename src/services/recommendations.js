const weights = { genres: 0.35, themes: 0.2, plot: 0.2, people: 0.15, period: 0.05, runtime: 0.05 }

const tokens = (value = '') => new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2))
const overlap = (left = [], right = []) => {
  const a = new Set(left.map((item) => String(item).toLowerCase()))
  const b = new Set(right.map((item) => String(item).toLowerCase()))
  if (!a.size || !b.size) return 0
  return [...a].filter((item) => b.has(item)).length / Math.max(a.size, b.size)
}
const plotSimilarity = (left, right) => overlap([...tokens(left), ...tokens(left)], [...tokens(right), ...tokens(right)])

export function getSimilarityScore(source, candidate, rating = 3) {
  const genreScore = overlap(source.genres, candidate.genres)
  const themeScore = (overlap(source.themes, candidate.themes) + overlap(source.keywords, candidate.keywords)) / 2
  const peopleScore = (overlap(source.cast, candidate.cast) + overlap(source.crew, candidate.crew)) / 2
  const yearScore = Math.max(0, 1 - Math.abs((source.year || 0) - (candidate.year || 0)) / 25)
  const runtimeScore = source.runtime && candidate.runtime ? Math.max(0, 1 - Math.abs(source.runtime - candidate.runtime) / 90) : 0.5
  const similarity = genreScore * weights.genres + themeScore * weights.themes + plotSimilarity(source.overview, candidate.overview) * weights.plot + peopleScore * weights.people + yearScore * weights.period + runtimeScore * weights.runtime
  const ratingAdjustment = rating >= 4 ? similarity * 0.08 : rating <= 2 ? (1 - genreScore) * 0.08 : 0
  return Math.round(Math.min(0.99, similarity + ratingAdjustment) * 100)
}

export function recommendMovies(source, catalogue, rating) {
  return catalogue
    .filter((movie) => movie.id !== source.id)
    .map((movie) => ({ ...movie, similarity: getSimilarityScore(source, movie, rating) }))
    .sort((a, b) => b.similarity - a.similarity)
}
