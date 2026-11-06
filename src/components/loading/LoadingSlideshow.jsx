import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const SLIDE_INTERVAL_MS = 5_200
const CROSSFADE_MS = 1_000

export default function LoadingSlideshow({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion || slides.length < 2) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [shouldReduceMotion, slides.length])

  if (slides.length === 0) {
    return (
      <div className="editorial-loading-fallback" aria-hidden="true">
        <div className="editorial-loading-frame" />
        <div className="editorial-loading-monogram">
          <span>N</span>
          <span>R</span>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-burgundy" aria-hidden="true">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex

        return (
          <motion.img
            key={slide.src}
            src={slide.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: slide.objectPosition }}
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive && !shouldReduceMotion ? [1.015, 1.075] : 1.015,
            }}
            transition={{
              opacity: { duration: shouldReduceMotion ? 0 : CROSSFADE_MS / 1000 },
              scale: {
                duration: shouldReduceMotion ? 0 : SLIDE_INTERVAL_MS / 1000,
                ease: 'linear',
              },
            }}
            fetchPriority={index === 0 ? 'high' : 'low'}
            decoding="async"
          />
        )
      })}
      <div className="editorial-loading-image-overlay absolute inset-0" />
      <div className="editorial-loading-frame" />
    </div>
  )
}
