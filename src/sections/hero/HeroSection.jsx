import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { invitationData } from '../../data/invitation.js'
import { invitationAssets } from '../../data/assets.js'
import './hero.css'

function formatReceptionDate(date) {
  const [year, month, day] = date.split('-').map(Number)
  const stableDate = new Date(Date.UTC(year, month - 1, day, 12))

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(stableDate)
}

function formatReceptionTime(reception) {
  const startTime = reception.startTime.replace(':', '.')
  const endTime = reception.endTime
    ? `– ${reception.endTime.replace(':', '.')}`
    : 'sampai selesai'

  return `${startTime} WIB · ${endTime}`
}

export default function HeroSection() {
  const headingRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { bride, groom } = invitationData.couple
  const { reception } = invitationData.wedding

  const entranceTransition = {
    duration: shouldReduceMotion ? 0.18 : 0.65,
    ease: [0.2, 0, 0, 1],
  }

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <motion.section
      className="hero-section relative isolate grid min-h-svh place-items-center overflow-x-hidden bg-ivory px-5 py-10 text-burgundy sm:px-8 md:px-12 md:py-14"
      aria-labelledby="hero-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0.18 : 0.45, ease: [0.2, 0, 0, 1] }}
    >
      <div className="hero-editorial-frame pointer-events-none absolute" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-content grid-cols-1 items-center gap-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-x-12 lg:gap-x-16">
        <motion.p
          className="order-1 text-center font-sans text-[0.65rem] font-semibold tracking-[0.28em] text-maroon md:col-start-1 md:row-start-1 md:text-left sm:text-xs"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...entranceTransition, delay: shouldReduceMotion ? 0 : 0.06 }}
        >
          THE WEDDING RECEPTION
        </motion.p>

        <motion.figure
          className="hero-photo-frame order-2 mx-auto w-full max-w-[28rem] md:col-start-2 md:row-span-2 md:row-start-1 md:justify-self-end"
          initial={{
            opacity: 0,
            scale: shouldReduceMotion ? 1 : 0.985,
            y: shouldReduceMotion ? 0 : 8,
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...entranceTransition, delay: shouldReduceMotion ? 0 : 0.08 }}
        >
          <img
            className="block aspect-[3/4] w-full object-cover object-center"
            src={invitationAssets.hero}
            alt={`${groom.preferredName} dan ${bride.preferredName}`}
            fetchPriority="high"
            decoding="async"
          />
        </motion.figure>

        <motion.div
          className="order-3 text-center md:col-start-1 md:row-start-2 md:text-left"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...entranceTransition, delay: shouldReduceMotion ? 0 : 0.18 }}
        >
          <h1
            id="hero-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-[clamp(3.25rem,13vw,5.4rem)] font-normal leading-[0.86] tracking-[-0.055em] md:text-[clamp(4rem,5.7vw,6.5rem)]"
          >
            <span className="block">{groom.preferredName}</span>
            <span className="hero-ampersand my-1 block font-normal italic text-maroon md:my-2">
              &amp;
            </span>
            <span className="block">{bride.preferredName}</span>
          </h1>

          <div className="hero-ornament mx-auto my-6 md:mx-0 md:my-7" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="space-y-2 font-sans text-sm text-ink-muted sm:text-base">
            <p className="font-medium text-burgundy">
              {formatReceptionDate(reception.date)}
            </p>
            <p>{formatReceptionTime(reception)}</p>
            <p className="mx-auto max-w-reading leading-6 md:mx-0">
              {invitationData.location.address}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
