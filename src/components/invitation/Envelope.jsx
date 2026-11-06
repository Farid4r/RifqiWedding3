import { useRef } from 'react'
import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

export default function Envelope({ isOpen, onOpenComplete, monogram }) {
  const shouldReduceMotion = useReducedMotion()
  const completionReported = useRef(false)
  const flapDuration = shouldReduceMotion ? 0 : 0.82
  const letterDuration = shouldReduceMotion ? 0.2 : 0.78

  const handleLetterAnimationComplete = () => {
    if (!isOpen || completionReported.current) return
    completionReported.current = true
    onOpenComplete()
  }

  return (
    <div className="envelope-scene relative mx-auto aspect-[1.58/1] w-[min(88vw,34rem)] md:w-full" aria-hidden="true">
      <div className="envelope-body absolute inset-0 overflow-visible rounded-md">
        <motion.div
          className="envelope-letter absolute z-[1] flex items-center justify-center rounded-sm"
          initial={false}
          animate={{
            y: isOpen ? (shouldReduceMotion ? -18 : -118) : 0,
            scale: isOpen && !shouldReduceMotion ? 1.025 : 1,
            opacity: 1,
          }}
          transition={{ duration: letterDuration, ease: [0.2, 0, 0, 1] }}
          onAnimationComplete={handleLetterAnimationComplete}
        >
          <div className="envelope-letter-border flex h-full w-full items-center justify-center">
            <span className="font-display text-[clamp(1rem,4vw,1.5rem)] italic tracking-[0.06em] text-burgundy">
              {monogram}
            </span>
          </div>
        </motion.div>

        <div className="envelope-side-fold envelope-side-fold--left absolute inset-0 z-[2]" />
        <div className="envelope-side-fold envelope-side-fold--right absolute inset-0 z-[2]" />
        <div className="envelope-bottom-fold absolute inset-0 z-[3]" />

        <svg
          className="envelope-seams pointer-events-none absolute inset-0 z-[4] h-full w-full"
          viewBox="0 0 100 63"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M1 1 50 32 99 1M1 62 50 32 99 62" />
        </svg>

        <motion.div
          className="envelope-top-flap absolute inset-x-0 top-0 z-[6]"
          style={{
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateX: isOpen && !shouldReduceMotion ? -180 : 0 }}
          transition={{ duration: flapDuration, ease: [0.2, 0, 0, 1] }}
        >
          <div className="envelope-top-flap-face envelope-top-flap-face--front absolute inset-0" />
          <div className="envelope-top-flap-face envelope-top-flap-face--back absolute inset-0" />
        </motion.div>

        <motion.div
          className="wax-seal absolute left-1/2 top-[51%] z-[7] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? (shouldReduceMotion ? 0.95 : 0.72) : 1,
          }}
          transition={{ duration: shouldReduceMotion ? 0.16 : 0.32, ease: [0.2, 0, 0, 1] }}
        >
          <div className="wax-seal-inner flex items-center justify-center rounded-full">
            <Heart size={17} strokeWidth={1.2} aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
