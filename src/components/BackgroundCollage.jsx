import { motion } from 'framer-motion'
import { backgroundPosters } from '../data/mockMovies'

export function BackgroundCollage({ pointer }) {
  return <div className="backdrop" aria-hidden="true">
    <div className="backdrop-wash" />
    <motion.div className="poster-layer layer-one" animate={{ x: pointer.x * -0.35, y: pointer.y * -0.22 }} transition={{ type: 'spring', stiffness: 20, damping: 30 }}>
      {backgroundPosters.slice(0, 4).map((movie, index) => <img key={movie.id} src={movie.poster} onError={(event) => { event.currentTarget.src = '/fallback-poster.svg' }} alt="" className={`bg-poster bg-poster-${index}`} />)}
    </motion.div>
    <motion.div className="poster-layer layer-two" animate={{ x: pointer.x * 0.2, y: pointer.y * 0.14 }} transition={{ type: 'spring', stiffness: 16, damping: 32 }}>
      {backgroundPosters.slice(4).map((movie, index) => <img key={movie.id} src={movie.poster} onError={(event) => { event.currentTarget.src = '/fallback-poster.svg' }} alt="" className={`bg-poster bg-poster-${index + 4}`} />)}
    </motion.div>
  </div>
}
