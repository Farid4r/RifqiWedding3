import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { createGuestbookEntry, getGuestbook } from '../../services/guestbookService.js'
import { isSupabaseConfigured, supabaseConfigError } from '../../lib/supabase.js'
import RSVPForm from './RSVPForm.jsx'
import WishesList from './WishesList.jsx'
import './rsvp-section.css'

function sortByNewest(entries) {
  return [...entries].sort((first, second) => {
    const firstTime = typeof first.created_at === 'string'
      ? Date.parse(first.created_at)
      : Number.NaN
    const secondTime = typeof second.created_at === 'string'
      ? Date.parse(second.created_at)
      : Number.NaN
    return (Number.isFinite(secondTime) ? secondTime : 0) -
      (Number.isFinite(firstTime) ? firstTime : 0)
  })
}

export default function RSVPSection() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)
  const [loadError, setLoadError] = useState(() =>
    isSupabaseConfigured ? null : supabaseConfigError,
  )
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadError(supabaseConfigError)
      return undefined
    }

    let isCurrent = true
    getGuestbook()
      .then((data) => {
        if (isCurrent) setEntries(data)
      })
      .catch(() => {
        if (isCurrent) setLoadError('Ucapan belum dapat dimuat. Silakan coba lagi nanti.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const handleCreated = useCallback((entry) => {
    setEntries((currentEntries) =>
      sortByNewest([
        entry,
        ...currentEntries.filter(({ id }) => entry.id == null || id !== entry.id),
      ]).slice(0, 20),
    )
    setLoadError(null)
  }, [])

  return (
    <motion.section
      id="rsvp"
      className="rsvp-section"
      aria-labelledby="rsvp-title"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.2, 0, 0, 1] }}
    >
      <div className="rsvp-section__inner">
        <header className="rsvp-section__heading">
          <p className="rsvp-section__eyebrow">RSVP &amp; WISHES</p>
          <h2 id="rsvp-title">A Note for the Couple</h2>
        </header>

        {!isSupabaseConfigured && (
          <p className="rsvp-section__configuration" role="status">
            {supabaseConfigError} RSVP online akan aktif setelah konfigurasi diisi.
          </p>
        )}

        <div className="rsvp-section__content">
          <RSVPForm onCreated={handleCreated} isConfigured={isSupabaseConfigured} />
          <WishesList entries={entries} isLoading={isLoading} error={loadError} />
        </div>
      </div>
    </motion.section>
  )
}
