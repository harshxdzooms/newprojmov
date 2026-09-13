import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export function RatingStars({ value, onChange }) {
  return <div className="rating" role="radiogroup" aria-label="Rate the movie from one to five stars">
    {[1, 2, 3, 4, 5].map((star) => <motion.button key={star} type="button" role="radio" aria-checked={value === star} aria-label={`${star} star${star > 1 ? 's' : ''}`} className={value >= star ? 'selected' : ''} onClick={() => onChange(star)} whileHover={{ scale: 1.14, rotate: -4 }} whileTap={{ scale: 0.92 }}>
      <Star size={34} fill={value >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
    </motion.button>)}
  </div>
}
