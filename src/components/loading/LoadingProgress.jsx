import { motion, useReducedMotion } from 'framer-motion'

export default function LoadingProgress({ progress }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="font-sans text-[0.625rem] font-medium tracking-[0.24em] text-ivory/75">
          PREPARING YOUR INVITATION
        </span>
        <span className="font-sans text-xs tabular-nums text-ivory">
          {progress}%
        </span>
      </div>
      <div
        className="h-px w-full overflow-hidden bg-ivory/30"
        role="progressbar"
        aria-label="Invitation assets"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <motion.div
          className="h-full bg-champagne"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.2, 0, 0, 1] }}
        />
      </div>
    </div>
  )
}
