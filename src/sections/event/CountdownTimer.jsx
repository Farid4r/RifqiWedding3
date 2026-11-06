import { useEffect, useState } from 'react'
import { getReceptionCountdown, getReceptionTimestamp } from '../../utils/countdown.js'

const units = [
  ['days', 'Hari'],
  ['hours', 'Jam'],
  ['minutes', 'Menit'],
  ['seconds', 'Detik'],
]

export default function CountdownTimer() {
  const [now, setNow] = useState(() => Date.now())
  const target = getReceptionTimestamp()
  const reached = now >= target
  const countdown = getReceptionCountdown(now)

  useEffect(() => {
    if (reached) return undefined

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(intervalId)
  }, [reached])

  if (reached) {
    return <p className="event-countdown__arrived">Hari acara telah tiba.</p>
  }

  return (
    <div className="event-countdown" role="timer" aria-label="Hitung mundur menuju resepsi">
      {units.map(([key, label]) => (
        <div className="event-countdown__unit" key={key}>
          <span className="event-countdown__value" aria-hidden="true">
            {String(countdown[key]).padStart(2, '0')}
          </span>
          <span className="event-countdown__label">{label}</span>
        </div>
      ))}
    </div>
  )
}
