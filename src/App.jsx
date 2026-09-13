import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, CircleHelp, Film, Sparkles, X } from 'lucide-react'
import { BackgroundCollage } from './components/BackgroundCollage'
import { MovieCard } from './components/MovieCard'
import { RatingStars } from './components/RatingStars'
import { SearchBox } from './components/SearchBox'
import { recommendMovies } from './services/recommendations'
import { getMovieDetails, getMovieRecommendations, searchMovies, tvdbMode } from './services/tvdb'
import { getStreamingProviders } from './services/streaming'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [rating, setRating] = useState(0)
  const [recommendations, setRecommendations] = useState([])
  const [view, setView] = useState('home')
  const [detailMovie, setDetailMovie] = useState(null)
  const [streaming, setStreaming] = useState(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const searchRequestId = useRef(0)

  useEffect(() => {
    const requestId = searchRequestId.current + 1
    searchRequestId.current = requestId
    if (!query.trim()) { setResults([]); setSearchError(''); return undefined }
    setResults([])
    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setSearching(true); setSearchError('')
      try {
        const nextResults = await searchMovies(query, controller.signal)
        if (searchRequestId.current === requestId) { setResults(nextResults); setActiveIndex(0) }
      }
      catch (error) {
        if (error.name !== 'AbortError' && searchRequestId.current === requestId) {
          console.error('[movie-search]', error)
          setSearchError(import.meta.env.DEV ? error.message : 'Movie search is unavailable right now. Try again.')
        }
      }
      finally { if (searchRequestId.current === requestId) setSearching(false) }
    }, 300)
    return () => { window.clearTimeout(timeout); controller.abort() }
  }, [query])

  useEffect(() => {
    const onMove = (event) => setPointer({ x: (event.clientX / window.innerWidth - 0.5) * 20, y: (event.clientY / window.innerHeight - 0.5) * 20 })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const chooseMovie = async (movie) => {
    setSelectedMovie(movie); setQuery(''); setResults([]); setRating(0)
    try {
      const details = await getMovieDetails(movie)
      setSelectedMovie(details)
    } catch (error) {
      console.error('[movie-details]', error)
      setSearchError(import.meta.env.DEV ? error.message : 'Movie details are unavailable right now.')
    }
  }

  const findNextWatch = async () => {
    if (!selectedMovie || !rating) return
    try {
      const candidates = await getMovieRecommendations(selectedMovie)
      setRecommendations(recommendMovies(selectedMovie, candidates, rating)); setView('recommendations')
    } catch (error) {
      console.error('[movie-recommendations]', error)
      setSearchError(import.meta.env.DEV ? error.message : 'Recommendations are unavailable right now.')
    }
  }

  const openDetail = async (movie) => {
    setDetailMovie(movie); setStreaming(await getStreamingProviders(movie))
  }

  return (
    <main className="app-shell">
      <BackgroundCollage pointer={pointer} />
      <header className="topbar"><button className="brand" onClick={() => { setView('home'); setSelectedMovie(null) }}><span className="brand-mark"><Film size={15} /></span><span>HUH?</span></button><div className="header-note"><span className="status-dot" /> {tvdbMode}</div><button className="help-button" aria-label="About this project"><CircleHelp size={19} /></button></header>

      <AnimatePresence mode="wait">
        {view === 'home' && !selectedMovie && <motion.section key="home" className="hero-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="eyebrow"><span>01</span><span className="eyebrow-line" /><span>FIND YOUR NEXT FILM</span></div>
          <h1>HUH?<br /><em>FINISHED THAT?</em></h1>
          <p className="hero-subtitle">WELL, HERE'S YOUR NEXT WATCH.</p>
          <SearchBox {...{ query, setQuery, results, onSelect: chooseMovie, loading: searching, error: searchError, activeIndex, setActiveIndex }} />
          <div className="hero-foot"><span><Sparkles size={14} /> Curated by what you loved</span><span>Scroll less. Watch better.</span></div>
        </motion.section>}

        {selectedMovie && view === 'home' && <motion.section key="rate" className="rate-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <button className="back-link" onClick={() => setSelectedMovie(null)}><ArrowLeft size={16} /> Search again</button>
          <div className="selected-layout"><img className="selected-poster" src={selectedMovie.poster} onError={(event) => { event.currentTarget.src = '/fallback-poster.svg' }} alt={`${selectedMovie.title} poster`} /><div><span className="eyebrow-label">LAST WATCHED</span><h2>You just watched:<br /><strong>{selectedMovie.title}</strong></h2><p className="rate-question">HOW MUCH DID YOU LOVE IT?</p><RatingStars value={rating} onChange={setRating} /><p className="rating-hint">{rating ? `${rating} out of 5 — got it.` : 'Your taste is the brief.'}</p><button className="primary-button" disabled={!rating} onClick={findNextWatch}>FIND MY NEXT WATCH <ChevronRight size={18} /></button></div></div>
        </motion.section>}

        {view === 'recommendations' && <motion.section key="recommendations" className="results-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="results-head"><div><button className="back-link" onClick={() => setView('home')}><ArrowLeft size={16} /> Start over</button><span className="eyebrow-label">BASED ON {selectedMovie?.title.toUpperCase()}</span><h2>YOUR NEXT<br /><em>WATCHES.</em></h2></div><p className="results-explainer">A little of the same energy,<br />with somewhere new to go.</p></div><div className="movie-grid">{recommendations.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} onClick={openDetail} />)}</div></motion.section>}
      </AnimatePresence>

      <AnimatePresence>{detailMovie && <motion.div className="detail-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="detail-panel" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}><button className="modal-close" onClick={() => setDetailMovie(null)} aria-label="Close details"><X size={20} /></button><div className="detail-hero" style={{ backgroundImage: `linear-gradient(90deg, #111 5%, rgba(17,17,17,.72) 45%, rgba(17,17,17,.1)), url(${detailMovie.backdrop || detailMovie.poster})` }}><div className="detail-hero-copy"><span className="eyebrow-label">{detailMovie.similarity || detailMovie.score}% MATCH</span><h2>{detailMovie.title}</h2><p className="detail-meta">{detailMovie.year} <i>·</i> {detailMovie.runtime} min <i>·</i> {detailMovie.genres.join(' / ')}</p><p>{detailMovie.overview}</p></div></div><div className="detail-content"><section><span className="eyebrow-label">THE GOOD STUFF</span><div className="people-row"><div><small>CAST</small><p>{detailMovie.cast.join(' · ') || 'Not listed'}</p></div><div><small>DIRECTOR</small><p>{detailMovie.director || 'Not listed'}</p></div></div></section><section className="streaming-section"><span className="eyebrow-label">WHERE TO WATCH</span><p className="availability">{streaming?.available && streaming.providers.length ? streaming.providers.map((provider) => provider.name).join(' · ') : 'Streaming availability unavailable.'}</p><small className="muted">Official provider data is shown when an authorized integration is configured.</small></section></div></motion.div></motion.div>}</AnimatePresence>
      <footer><span>HUH? FINISHED THAT? <i>© 2026</i></span><span>DISCOVERY, NOT DECISION FATIGUE.</span></footer>
    </main>
  )
}

export default App
