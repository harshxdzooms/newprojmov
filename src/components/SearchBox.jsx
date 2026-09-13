import { AnimatePresence, motion } from 'framer-motion'
import { LoaderCircle, Search, X } from 'lucide-react'

export function SearchBox({ query, setQuery, results, onSelect, loading, error, activeIndex, setActiveIndex }) {
  const hasUncertainMatch = results.some((movie) => movie.titleMatch < 0.99)
  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex(Math.min(activeIndex + 1, results.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex(Math.max(activeIndex - 1, 0)) }
    if (event.key === 'Enter' && results[activeIndex]) onSelect(results[activeIndex])
    if (event.key === 'Escape') setQuery('')
  }
  return <div className="search-wrap">
    <div className={`search-field ${query ? 'has-query' : ''}`}>
      <Search size={22} strokeWidth={1.8} aria-hidden="true" />
      <label htmlFor="movie-search" className="sr-only">Search for the last movie you watched</label>
      <input id="movie-search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={onKeyDown} placeholder="What was the last movie you watched?" autoComplete="off" />
      {loading && <LoaderCircle className="spin" size={20} aria-label="Searching" />}
      {query && !loading && <button className="clear-button" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>}
    </div>
    <AnimatePresence>
      {query && <motion.div className="suggestions" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        {error && <p className="search-message">{error}</p>}
        {!error && loading && <p className="search-message">Looking through the reels...</p>}
        {!error && !loading && results.length === 0 && <p className="search-message">No movie matches yet. Try another title.</p>}
        {!error && !loading && results.length > 0 && hasUncertainMatch && <p className="search-message">Did you mean?</p>}
        {!error && results.map((movie, index) => <button key={movie.id} className={`suggestion ${activeIndex === index ? 'active' : ''}`} onMouseEnter={() => setActiveIndex(index)} onClick={() => onSelect(movie)}>
          <img src={movie.poster} onError={(event) => { event.currentTarget.src = '/fallback-poster.svg' }} alt="" />
          <span><strong>{movie.title}</strong><small>{movie.year || 'Year unknown'} <i>·</i> {movie.genres?.slice(0, 2).join(' / ') || 'Feature film'} <i>·</i> ID {movie.id}</small></span>
        </button>)}
      </motion.div>}
    </AnimatePresence>
  </div>
}
