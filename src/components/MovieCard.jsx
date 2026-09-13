import { motion } from 'framer-motion'
import { ArrowUpRight, Clock3 } from 'lucide-react'

export function MovieCard({ movie, index, onClick }) {
  return <motion.button className="movie-card" onClick={() => onClick(movie)} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.45 }} whileHover={{ y: -5 }}>
    <div className="card-poster"><img src={movie.poster} onError={(event) => { event.currentTarget.src = '/fallback-poster.svg' }} alt={`${movie.title} poster`} loading="lazy" /><span className="similarity">{movie.similarity || movie.score}% match</span><span className="card-arrow"><ArrowUpRight size={18} /></span></div>
    <div className="card-copy"><div className="card-title"><h3>{movie.title}</h3><span>{movie.year}</span></div><p>{movie.genres.slice(0, 2).join(' / ')} {movie.runtime && <><i>·</i> <Clock3 size={12} /> {movie.runtime}m</>}</p><small>{movie.overview}</small></div>
  </motion.button>
}
