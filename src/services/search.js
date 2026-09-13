import Fuse from 'fuse.js'

export const normalizeSearchText = (value = '') => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ')

export const compactSearchText = (value = '') => normalizeSearchText(value).replace(/\s/g, '')

const editDistance = (left, right) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0]
    previous[0] = row
    for (let column = 1; column <= right.length; column += 1) {
      const saved = previous[column]
      previous[column] = left[row - 1] === right[column - 1]
        ? diagonal
        : Math.min(previous[column] + 1, previous[column - 1] + 1, diagonal + 1)
      diagonal = saved
    }
  }
  return previous[right.length]
}

export const titleMatchScore = (query, movie) => {
  const normalizedQuery = normalizeSearchText(query)
  const compactQuery = compactSearchText(query)
  const titles = [movie.title, movie.originalTitle, ...(movie.aliases || [])].filter(Boolean)
  let best = 0
  titles.forEach((title) => {
    const normalizedTitle = normalizeSearchText(title)
    const compactTitle = compactSearchText(title)
    if (normalizedTitle === normalizedQuery || compactTitle === compactQuery) best = Math.max(best, 1)
    else {
      const distance = editDistance(compactQuery, compactTitle)
      const length = Math.max(compactQuery.length, compactTitle.length, 1)
      best = Math.max(best, 1 - distance / length)
    }
  })
  return best
}

export function rankMovieResults(query, movies) {
  const fuse = new Fuse(movies, {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'originalTitle', weight: 0.2 },
      { name: 'aliases', weight: 0.1 },
    ],
    threshold: 0.48,
    ignoreLocation: true,
    includeScore: true,
  })
  const fuzzyMatches = fuse.search(query).map(({ item, score = 1 }) => ({ ...item, searchScore: 1 - score }))
  const candidates = fuzzyMatches.length ? fuzzyMatches : movies.map((movie) => ({ ...movie, searchScore: titleMatchScore(query, movie) }))
  return candidates
    .map((movie) => ({ ...movie, titleMatch: titleMatchScore(query, movie) }))
    .filter((movie) => movie.titleMatch >= 0.48)
    .sort((left, right) => (right.titleMatch * 0.8 + (right.searchScore || 0) * 0.2) - (left.titleMatch * 0.8 + (left.searchScore || 0) * 0.2))
    .slice(0, 6)
}
